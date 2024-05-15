const Order = require('../../models/Orders/model');
const Customer = require('../../models/Customers/model');
const Product = require('../../models/Products/model');
const { PDFDocument, rgb } = require('pdf-lib');


exports.validateOrder = async (req, res, next) => {
    try {
        var { customer_id, orderNumber, totalPrice, status, orderedProducts, userData, deliveryAddress, comment, isPayed } = req.body;

        if (!customer_id || !deliveryAddress) {
            return res.status(400).json({ "message": "Hiányzó kötelező mező(k)." });
        }

        const customer = await Customer.findById(customer_id);
        if (!customer) {
            return res.status(400).json({ "message": "A megadott vásárló nem található." });
        }

        if (!orderedProducts || !Array.isArray(orderedProducts)) {
            return res.status(400).json({ "message": "Az orderedProducts nem definiált vagy nem tömb." });
        }

        const productsExist = await Product.find({ _id: { $in: orderedProducts.map(product => product.product_id) } });
        if (productsExist.length !== orderedProducts.length) {
            return res.status(400).json({ "message": "Az egyik vagy több megadott termék nem található." });
        }

        next();
    } catch (error) {
        console.error("Error validating order:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
};

exports.createOrder = async (req, res) => {
    try {
        await exports.validateOrder(req, res, async () => {
            var { customer_id, orderNumber, status, userData, deliveryAddress, comment, isPayed, orderedProducts } = req.body;

            let totalPrice = 0; 

            for (const item of orderedProducts) {
                const { product_id, quantity } = item;

                const product = await Product.findById(product_id);

                if (!product) {
                    return res.status(400).json({ message: `Product with ID ${product_id} not found` });
                }

                const { salePrice } = product;

                totalPrice += parseFloat(salePrice) * parseInt(quantity);
            }

            var orderNumber = await generateOrderNumber();

            const newOrder = new Order({
                customer_id,
                orderNumber,
                totalPrice,
                status,
                order: orderedProducts, 
                userData,
                deliveryAddress,
                comment,
                isPayed
            });

            await Customer.findByIdAndUpdate(customer_id, { $inc: { number_of_orders: 1 } });

            const savedOrder = await newOrder.save();

            return res.status(201).json(savedOrder);
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Function to generate a random string
const generateRandomString = async (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Function to generate a unique order number
const  generateOrderNumber = async() => {
    const timestamp = Date.now().toString(); 
    const randomString =  await generateRandomString(6); 
    return timestamp + '-' + randomString;
}

exports.updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status, isPayed } = req.body;

        if (!status) {
            return res.status(400).json({ "message": "A státusz mező kötelező." });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status, isPayed }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ "message": "Rendelés nem található" });
        }

        return res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}



exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer_id orderedProducts.product_id').populate({
            path: 'order.product_id',
            model: 'Product'
        });

        return res.status(200).json(orders);
    } catch (error) {
        // Handle errors
        console.error("Error retrieving orders:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}



exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Retrieve the order by its ID and populate foreign fields
        const order = await Order.findById(orderId).populate('customer_id orderedProducts.product_id');

        // If order not found
        if (!order) {
            return res.status(404).json({ "message": "Nem található a megrdenelés" });
        }

        // Respond with the order data
        return res.status(200).json(order);
    } catch (error) {
        // Handle errors
        console.error("Error retrieving order:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}


exports.deleteOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Find the order by ID and delete it
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        // If order not found
        if (!deletedOrder) {
            return res.status(404).json({ "message": "Nem található a megrendelés" });
        }

        // Respond with a success message
        return res.status(200).json({ "message": "Sikeresen törölted a rendelést." });
    } catch (error) {
        // Handle errors
        console.error("Error deleting order:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}


exports.makeInvoiceRoute = async (req, res) => {
    try {

        const order = await Order.findById(req.params.orderId).populate('customer_id orderedProducts.product_id').populate({
            path: 'order.product_id',
            model: 'Product'
        });
        var base  = await generateInvoice(order);

        // Respond with a success message
        return res.status(200).json({ "message": base });
    } catch (error) {
        // Handle errors
        console.error("Error deleting order:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}


async function generateInvoice(order) {

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    const fontSize = 12;
    const lineHeight = fontSize * 1.2;
    const textOptions = { size: fontSize, lineHeight: lineHeight };

    let y = page.getHeight() - 50;
    page.drawText('Számla', { x: 50, y: y, ...textOptions });
    y -= lineHeight;

    page.drawText(`Megrendelés szám: ${order.orderNumber}`, { x: 50, y: y, ...textOptions });
    y -= lineHeight;

    page.drawText(`Vásárló: ${order.customer_id.fullname}`, { x: 50, y: y, ...textOptions });
    y -= lineHeight;

    page.drawText(`Kézbesités: ${order.deliveryAddress[0].street}, ${order.deliveryAddress[0].zipcode}, ${order.deliveryAddress[0].city}`, { x: 50, y: y, ...textOptions });
    y -= lineHeight;

    page.drawText('Termékek:', { x: 50, y: y, ...textOptions });
    y -= lineHeight;
    order.order.forEach((item) => {
        const product = item.product_id;
        page.drawText(`${product.title} - Darabszám : ${item.quantity} - Ár: ${product.salePrice}`, { x: 70, y: y, ...textOptions });
        y -= lineHeight;
    });

    page.drawText(`Teljes ár: ${order.totalPrice}`, { x: 50, y: y, ...textOptions });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

    return pdfBase64;
}

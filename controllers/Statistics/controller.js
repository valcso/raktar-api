const Customer = require('../../models/Customers/model');
const Order = require('../../models/Orders/model');

exports.getAllCustomerNumber = async (req, res) => {
    try {
        const customers = await Customer.find();
        const numberOfCustomers = customers.length;

        return res.json({ numberOfCustomers });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


exports.getOrderInfoThisMonth = async (req, res) => {
    try {
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0, 0, 0, 0);

        const lastDayOfMonth = new Date();
        lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
        lastDayOfMonth.setDate(0);
        lastDayOfMonth.setHours(23, 59, 59, 999);

        const ordersThisMonth = await Order.find({
            createdAt: {
                $gte: firstDayOfMonth,
                $lte: lastDayOfMonth
            }
        });

        const totalPriceThisMonth = ordersThisMonth.reduce((total, order) => total + (order.totalPrice || 0), 0);

        const numberOfOrdersThisMonth = ordersThisMonth.length;
        const priceFormatted = parseFloat(totalPriceThisMonth).toLocaleString('en-US', {
            style: 'currency',
            currency: 'HUF',
            minimumFractionDigits: 2
        });
        return res.json({ numberOfOrdersThisMonth, priceFormatted });
    } catch (error) {
        console.error("Error fetching orders for the current month:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


exports.getOrderInfoLastMonth = async (req, res) => {
    try {
        // Get the first day of the last month
        const firstDayOfLastMonth = new Date();
        firstDayOfLastMonth.setDate(1);
        firstDayOfLastMonth.setMonth(firstDayOfLastMonth.getMonth() - 1);
        firstDayOfLastMonth.setHours(0, 0, 0, 0);

        // Get the last day of the last month
        const lastDayOfLastMonth = new Date();
        lastDayOfLastMonth.setDate(0);
        lastDayOfLastMonth.setHours(23, 59, 59, 999);

        // Fetch orders created within the last month
        const ordersLastMonth = await Order.find({
            createdAt: {
                $gte: firstDayOfLastMonth,
                $lte: lastDayOfLastMonth
            }
        });

        // Calculate the sum of the order worth
        const totalPriceLastMonth = ordersLastMonth.reduce((total, order) => total + (order.totalPrice || 0), 0);

        // Count the number of orders
        const numberOfOrdersLastMonth = ordersLastMonth.length;

        const priceFormatted = parseFloat(totalPriceLastMonth).toLocaleString('en-US', {
            style: 'currency',
            currency: 'HUF',
            minimumFractionDigits: 2
        });

        // Return the count and total price
        return res.json({ numberOfOrdersLastMonth, priceFormatted });
    } catch (error) {
        // Handle errors
        console.error("Error fetching orders for last month:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


exports.getOrderInfoAllTime = async (req, res) => {
    try {
        // Fetch all orders
        const allOrders = await Order.find();

        // Calculate the sum of the order worth
        const totalPriceAllTime = allOrders.reduce((total, order) => total + (order.totalPrice || 0), 0);

        // Count the number of orders
        const numberOfOrdersAllTime = allOrders.length;

        // Return the count and total price
        const priceFormatted = parseFloat(totalPriceAllTime).toLocaleString('en-US', {
            style: 'currency',
            currency: 'HUF',
            minimumFractionDigits: 2
        });
        return res.json({ numberOfOrdersAllTime, priceFormatted });
    } catch (error) {
        // Handle errors
        console.error("Error fetching all orders:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



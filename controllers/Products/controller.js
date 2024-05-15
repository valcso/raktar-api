const Product = require('../../models/Products/model');
const Category = require('../../models/Categories/model');

exports.validateProduct = async (req, res, next) => {
    try {
        const { title, content, category, SKU, quantity, boughtPrice, salePrice, featureImage, purchasedCount, manageStock, weight } = req.body;

        if (!title) {
            return res.status(400).json({ "message": "A cím kötelező mező." });
        }

        if (!SKU) {
            return res.status(400).json({ "message": "Az SKU kötelező" });
        }

        if (!salePrice || isNaN(salePrice)) {
            return res.status(400).json({ "message": "Helytelen termék ár." });
        }

        if (weight && isNaN(weight)) {
            return res.status(400).json({ "message": "Helytelen termék ár." });
        }

        if (manageStock) {
            if(!quantity || isNaN(quantity)) {
                return res.status(400).json({ "message": "Helytelen darabszám" });
            }
        }

        if (category) {
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(400).json({ "message": "A megadott kategória nem található." });
            }
        }

        if (featureImage) {
            // Validate base64 format for image
            const base64Regex = /^data:image\/(jpeg|jpg|png);base64,/;
            if (!base64Regex.test(featureImage)) {
                return res.status(400).json({ "message": "Hiba a kép feldolgozása során." });
            }

            // Calculate image size in bytes
            const imageSize = (featureImage.length * 3) / 4 - 2; 

            // Check image size
            const maxSizeBytes = 5 * 1024 * 1024; // 5MB
            if (imageSize > maxSizeBytes) {
                return res.status(400).json({ "message": "A maximális megengedett méret 5MB." });
            }
        }

        next();
    } catch (error) {
        console.error("Error validating product:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}

exports.createProduct = async (req, res) => {
    try {
        await this.validateProduct(req, res, async () => {
            const { title, content, category, SKU, quantity, boughtPrice, salePrice, featureImage, purchasedCount, manageStock, weight } = req.body;

            const newProduct = new Product({    
                title,
                content,
                category,
                SKU,
                quantity,
                boughtPrice,
                salePrice,
                featureImage,
                purchasedCount,
                manageStock,
                weight
            });

            const savedProduct = await newProduct.save();
            return res.status(201).json(savedProduct);
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}


exports.updateProduct = async (req, res) => {
    try {
        await exports.validateProduct(req, res, async () => {
            const productId = req.params.id;
            const updates = req.body;

            const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });

            if (!updatedProduct) {
                return res.status(404).json({ "message": "Termék nem található" });
            }

            return res.status(200).json(updatedProduct);
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}


exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findById(productId).populate('category');

        if (!product) {
            return res.status(404).json({ "message": "Termék nem található" });
        }

        return res.status(200).json(product);
    } catch (error) {
        console.error("Error retrieving product:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}



exports.removeProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const removedProduct = await Product.findOneAndDelete({ _id: productId });

        if (!removedProduct) {
            return res.status(404).json({ "message": "Termék nem található" });
        }

        return res.status(200).json({ "message": "Termék sikeresen eltávolítva" });
    } catch (error) {
        console.error("Error removing product:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}


exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error retrieving products:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}
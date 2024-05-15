const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Category = require('../../models/Categories/model');

const multer = require('multer');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


exports.getAll = async (req,res) => {
    try {
        // Assuming you have a User model
        const categories = await Category.find({});

        // If user not found
        if (!categories) {
            return res.status(404).json({ "message": "Nem található kategória" });
        }

        res.status(200).json(categories);
    } catch (error) {
        // Handle errors
        console.error("Error retrieving categories:", error);
        res.status(500).json({ "message": "Internal server error" });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const name = req.body.name;
        const imageBase64 = req.body.imageBase64;
        const description = req.body.description ?? '';

        if (!name) {
            return res.status(400).json({ "message": "A kategória neve kötelező mező." });
        }

        // Validate imageBase64 if provided
        if (imageBase64) {
            // Validate base64 format for image
            const base64Regex = /^data:image\/(jpeg|jpg|png);base64,/;
            if (!base64Regex.test(imageBase64)) {
                return res.status(400).json({ "message": "Hiba a kép feldolgozása során." });
            }

            // Calculate image size in bytes
            const imageSize = (imageBase64.length * 3) / 4 - 2;

            // Check image size
            const maxSizeBytes = 5 * 1024 * 1024; // 5MB
            if (imageSize > maxSizeBytes) {
                return res.status(400).json({ "message": "A maximális megengedett méret 5MB." });
            }
        }

        // Find the category by ID
        const category = await Category.findById(categoryId);

        // If category not found
        if (!category) {
            return res.status(404).json({ "message": "Kategória nem található" });
        }

        // Check if the updated name conflicts with an existing category
        if (name !== category.name) {
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({ "message": "A megadott kategória név már létezik." });
            }
        }

        // Update category fields
        category.name = name;
        category.description = description;
        if(imageBase64) {
            category.imageBase64 = imageBase64;
        }

        // Save the updated category in the database
        const updatedCategory = await category.save();

        // Respond with the updated category data
        return res.status(200).json(updatedCategory);
    } catch (error) {
        // Handle errors
        console.error("Error updating category:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}


exports.createCategory = async (req, res) => {
    try {
        const name = req.body.name;
        const imageBase64 = req.body.imageBase64;
        const description = req.body.description;

        // Check if name is provided
        if (!name) {
            return res.status(400).json({ "message": "A kategória neve kötelező mező." });
        }

        // Check if a category with the same name already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ "message": "A kategória név már létezik." });
        }

        // Validate imageBase64 if provided
        if (imageBase64) {
            // Validate base64 format for image
            const base64Regex = /^data:image\/(jpeg|jpg|png);base64,/;
            if (!base64Regex.test(imageBase64)) {
                return res.status(400).json({ "message": "Hiba a kép feldolgozása során." });
            }

            // Calculate image size in bytes
            const imageSize = (imageBase64.length * 3) / 4 - 2; // Base64 encoding increases size by 33.3%

            // Check image size
            const maxSizeBytes = 5 * 1024 * 1024; // 5MB
            if (imageSize > maxSizeBytes) {
                return res.status(400).json({ "message": "A maximális megengedett méret 5MB." });
            }
        }

        // Create a new category object
        const newCategory = new Category({
            name,
            imageBase64,
            description
        });

        // Save the new category in the database
        const savedCategory = await newCategory.save();

        // Respond with the saved category data
        return res.status(201).json(savedCategory);
    } catch (error) {
        // Handle errors
        console.error("Error creating category:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findByIdAndDelete(categoryId);

        // If user not found
        if (!category) {
            return res.status(404).json({ "message": "A kategória nem található" });
        }

        res.status(200).json({ "message": "Sikeresen törölted a kategóriát." });
    } catch (error) {
        // Handle errors
        console.error("Error deleting categorz by ID:", error);
        res.status(500).json({ "message": "Internal server error" });
    }
}


exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        // If user not found
        if (!category) {
            return res.status(404).json({ "message": "A kategória nem található" });
        }

        // Respond with the user data
        res.status(200).json(category);
    } catch (error) {
        // Handle errors
        console.error("Error retrieving category:", error);
        res.status(500).json({ "message": "Internal server error" });
    }
}


const User = require('../../models/Users/model');
const bcrypt = require('bcryptjs');

exports.getAll = async (req,res) => {
    try {
        const user = await User.find({});

        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {

        console.error("Error retrieving user:", error);
        res.status(500).json({ "message": "Internal server error" });
    }
}

exports.createUser = async (req, res) => {
    try {
        if (!req.body.username || !req.body.password || !req.body.fullname) {
            return res.status(400).json({ "message": "username, password, and fullname are required fields." });
        }

        const existsUsername = await User.findOne({ username: req.body.username });
        if (existsUsername) {
            return res.status(400).json({ "message": "A megadott felhasználónév már szerepel a rendszerünkben. Kérjük válassz újat és próbáld újra ." });
        }

        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            fullname: req.body.fullname,
            role: 'user'
        });

        const savedUser = await newUser.save();
        return res.status(201).json(savedUser);
    } catch (error) {

        console.error("Error creating user:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}


exports.getUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ "message": "Internal server error" });
    }
}


exports.editUser = async (req, res) => {
    try {

        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }

        if (req.body.fullname) {
            user.fullname = req.body.fullname;
        }
        if (req.body.username) {
            user.username = req.body.username;
        }

        if (req.body.password) {

            if (req.body.password.length > 0) {
                const SALT_WORK_FACTOR = 10;
                const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } else {

                delete req.body.password;
            }
        }

       const updatedUser =  await User.updateOne(
			{ _id: userId },
			{
				...req.body
			});

        res.status(200).json(updatedUser);
    } catch (error) {

        console.error("Error editing user:", error);
        res.status(500).json({ "message": "Internal server error" });
    }
}


exports.deleteUserById = async (req, res) => {
    try {

        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }

        res.status(200).json({ "message": "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user by ID:", error);
        res.status(500).json({ "message": "Internal server error" });
    }
}



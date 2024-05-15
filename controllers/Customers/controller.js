const Customer = require('../../models/Customers/model');

// Validation function
const validateCustomerData = (data) => {

    if (data.fullname) {
        const fullnameRegex = /^[a-zA-Z\s]+$/;
        if (!fullnameRegex.test(data.fullname)) {
            return { success: false, message: "A név csak betűket tartalmazhat!" };
        }
    }

    if (data.phone_number) {
        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(data.phone_number)) {
            return { success: false, message: "A telefonszám csak számokat tartalmazhat!" };
        }
    }

    if (data.address) {
        if (typeof data.address !== 'object' || !data.address.country || !data.address.street || !data.address.zipcode) {
            return { success: false, message: "Az cím csak ország, utca és irányítószám mezőket tartalmazhat!" };
        }
    }

    if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return { success: false, message: "Az email formátuma érvénytelen!" };
        }
    }

    return { success: true };
};


exports.getAll = async (req,res) => {
    try {

        const customer = await Customer.find({});

        if (!customer) {
            return res.status(404).json({ "message": "Nem találhatóak ügyfelek a rendszerben." });
        }

        res.status(200).json(customer);
    } catch (error) {

        console.error("Error retrieving customer:", error);
        res.status(500).json({ "message": "Internal server error" });
    }
}

exports.getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.customerId);

        if (!customer) {
            return res.status(404).json({ "message": "Nem található a rendszerben." });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error("Error retrieving customer:", error);
        res.status(500).json({ "message": "Internal server error" });
    }
}

exports.deleteCustomerById = async (req, res) => {
    try {

        const customerId = req.params.customerId;
        const customer = await Customer.findByIdAndDelete(customerId);

        if (!customer) {
            return res.status(404).json({ "message": "Nem található a vásárló a rendszerünkben." });
        }

        res.status(200).json({ "message": "Sikeresen töröltük a vásárlót." });
    } catch (error) {

        console.error("Error deleting customer by ID:", error);
        res.status(500).json({ "message": "Internal server error" });
    }
}

exports.createCustomer = async (req, res) => {
    try {

        if (!req.body.fullname || !req.body.address || !req.body.phone_number) {
            return res.status(400).json({ "message": "A teljes név, lakcim és telefonszám kötelező mezők!" });
        }

        const validation = validateCustomerData(req.body);
        if (!validation.success) {
            return res.status(400).json({ "message": validation.message });
        }
        const newCustomer = new Customer({
            fullname: req.body.fullname,
            address: req.body.address,
            phone_number: req.body.phone_number,
            email: req.body.email ?? null,
            vat_number : req.body.vat_number ?? null
        });

        const savedCustomer = await newCustomer.save();

        return res.status(201).json(savedCustomer);
    } catch (error) {
        console.error("Error creating customer:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
};

exports.updateCustomerById = async (req, res) => {
    try {
        const customerId = req.params.customerId;

        if (!customerId) {
            return res.status(400).json({ "message": "A vásárló azonosítója hiányzik!" });
        }

        const existingCustomer = await Customer.findById(customerId);
        if (!existingCustomer) {
            return res.status(404).json({ "message": "A megadott azonosítóval nem található vásárló!" });
        }

        const validation = validateCustomerData(req.body);
        if (!validation.success) {
            return res.status(400).json({ "message": validation.message });
        }

        if (req.body.fullname) {
            existingCustomer.fullname = req.body.fullname;
        }
        if (req.body.address) {
            existingCustomer.address = req.body.address;
        }
        if (req.body.phone_number) {
            existingCustomer.phone_number = req.body.phone_number;
        }
        if (req.body.email) {
            existingCustomer.email = req.body.email;
        }

        const updatedCustomer = await existingCustomer.save();

        return res.status(200).json(updatedCustomer);
    } catch (error) {
        console.error("Error updating customer:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
};

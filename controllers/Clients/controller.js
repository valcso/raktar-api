const Client = require('../../models/Clients/model');

exports.createClientRoute = async (req,res) => {
    try {
        if(!req.body.name) {
            return res.status(400).json({"error:":"name is a required field!"});
        }
    } catch (error) {

    }
}

const User = require('../../models/Users/model.js');
const jwt = require('jsonwebtoken');
/**
 * Sign in a user to our system.
 * @param {Request} req 
 * @param {Response} res 
 * @returns {Promise<void>} A promise that resolves once the user is logged in.
 */
exports.login = async (req, res) => {

    if(!req.body.username || !req.body.password) {
        return res.status(401).json({
            message: 'Username and password is required field!',
          });
    }

    var user = await User.findOne({username : req.body.username});

    if(!user) {
     return res.status(401).json({
         message: 'A felhasználónév vagy a jelszó helytelen!',
       });
    }
    if(user.validPassword(req.body.password)){
     const t = jwt.sign({
          email : user.email,
          role: user.role == 'admin' ? 'admin' :  'client',
          fullname : user.fullname,
          username : user.username
       },
       user.role == 'admin' ? process.env.JWT_ADMIN_SECRET :  process.env.JWT_CLIENT_SECRET, {
         expiresIn: '8h',
       },
       );

       return res.status(200).json({
         token: t,
       });
    } else {
     return res.status(401).json({
         message: 'Helytelen felhasználónév vagy jelszó.',
       });
    }
     
  };
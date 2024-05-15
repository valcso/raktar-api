const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

const checkToken = (req, res, next) => {
  if(!req.headers.authorization && !req.body.authorization) {
    return res.status(403).json({ message: "Auth token is required!" });
  }
  let token = req.headers.authorization || req.body.authorization ;
  let decoded_token = jwt_decode(token);
  let role = decoded_token.role;

  if(req.query.isAdmin && role !== 'admin') {
    return res.status(403).json({ message: "Not admin!" });
  }

  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }
  if (token) {
    jwt.verify(token, role == 'admin' ? process.env.JWT_ADMIN_SECRET : process.env.JWT_CLIENT_SECRET , async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Not valid token.",
        });
      }
      return res.status(200).json({
        message: "Token is valid.",
      });
    });
  } else {
    return res.status(403).json({ message: "Auth token is required!" });
  }

};

module.exports = { checkToken };
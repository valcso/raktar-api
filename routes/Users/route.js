const controller = require('../../controllers/Users/controller.js');
const validateAdmin = require('../../middleware/validateAdmin.js');
const validateToken = require('../../middleware/checkToken.js');

module.exports = (app) => {

   /**
   * Create User
   * @name POST /user
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
  app.route('/users').get(validateAdmin.checkToken,controller.getAll);

  /**
   * Create User
   * @name POST /user
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
  app.route('/user').post(validateAdmin.checkToken,controller.createUser);

  /**
   * GET User
   * @name GET /user
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/user/:id').get(validateAdmin.checkToken,controller.getUser);

    /**
   * PUT User
   * @name PUT /user
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
      app.route('/user/:id').put(validateAdmin.checkToken,controller.editUser);

   /**
   * Delete User
   * @name DELETE /user
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
   app.route('/user/:id').delete(validateAdmin.checkToken,controller.deleteUserById );


   /**
   * Check token validity.
   * @name POST /users/check-token
   * @function
   * @memberof module.exports
   * @param {function} validateToken.checkToken - Middleware to check token validity
   */
  app.route('/check-token').post(validateToken.checkToken);

}
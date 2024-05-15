const controller = require('../../controllers/Auth/controller');

/**
 * Defines the routes for user authentication.
 *
 * @param {Express.Application} app - The Express application instance.
 */
module.exports = (app) => {
  /**
   * User login route.
   * @name POST /login
   * @function
   * @memberof module.exports
   * @param {function} checkLogin.handle - Middleware to handle login validation
   * @param {function} controller.login - Controller function to handle user login
   */
  app.route('/login').post(controller.login);

};
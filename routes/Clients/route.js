const controller = require('../../controllers/Clients/controller.js');
const validateAdmin = require('../../middleware/validateAdmin.js');

module.exports = (app) => {
  /**
   * Create an order.
   * @name POST /orders/create-order/
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
  app.route('/clients').post(validateAdmin.checkToken,controller.createClientRoute);

}
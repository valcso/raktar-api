const controller = require('../../controllers/Orders/controller.js');
const validateUser = require('../../middleware/validateAdmin.js');

module.exports = (app) => {
  /**
   * Create order
   * @name POST /product
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
  app.route('/order').post(validateUser.checkToken,controller.createOrder);

    /**
   * Get all orders
   * @name GET /orders
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/orders').get(validateUser.checkToken,controller.getAllOrders);

    /**
   * Update Order
   * @name PUT /order
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/order/:id').put(validateUser.checkToken,controller.updateOrder);

    /**
   * Delete order
   * @name DELETE /order
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/order/:id').delete(validateUser.checkToken,controller.deleteOrderById);


   /**
   * GET Order
   * @name GET /order
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/order/:id').get(validateUser.checkToken,controller.getOrderById);


    /**
   * Generate invoice for order
   * @name GET /invoice
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/invoice/:orderId').get(controller.makeInvoiceRoute);

}
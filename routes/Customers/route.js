const controller = require('../../controllers/Customers/controller.js');
const validateToken = require('../../middleware/checkToken.js');
const validateAdmin = require('../../middleware/validateAdmin.js');

module.exports = (app) => {

   /**
   * Get all customers
   * @name POST /customers
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
   app.route('/customers').get(validateAdmin.checkToken,controller.getAll);

  /**
   * Create Customer
   * @name POST /customer
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
   app.route('/customer').post(validateAdmin.checkToken,controller.createCustomer);

  /**
   * GET customer
   * @name GET /user
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/customer/:customerId').get(validateAdmin.checkToken,controller.getCustomer);

    /**
   * Update customer
   * @name PUT /customer
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
      app.route('/customer/:customerId').put(validateAdmin.checkToken,controller.updateCustomerById);

   /**
   * Delete Customer
   * @name DELETE /customer/:customerId
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
   app.route('/customer/:customerId').delete(validateAdmin.checkToken,controller.deleteCustomerById );

}
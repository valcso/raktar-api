const controller = require('../../controllers/Statistics/controller.js');
const validateUser = require('../../middleware/validateAdmin.js');

module.exports = (app) => {
  /**
   * Get the sum of customers
   * @name GET /get-all-customer-sum
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
  app.route('/get-all-customer-sum').get(controller.getAllCustomerNumber);

   /**
   * Get the sum of customers
   * @name GET /get-all-customer-sum
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/this-month-orders').get(controller.getOrderInfoThisMonth);


    /**
   * Get the sum of customers
   * @name GET /get-all-customer-sum
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
     app.route('/this-lastmonth-orders').get(controller.getOrderInfoLastMonth);

    /**
   * Get the sum of customers
   * @name GET /get-all-customer-sum
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/all-time-orders').get(controller.getOrderInfoAllTime );
  
}


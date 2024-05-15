const controller = require('../../controllers/Products/controller.js');
const validateUser = require('../../middleware/validateAdmin.js');

module.exports = (app) => {
  /**
   * Create product
   * @name POST /product
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
  app.route('/product').post(validateUser.checkToken,controller.createProduct);

    /**
   * Get all products
   * @name GET /products
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/products').get(validateUser.checkToken,controller.getAllProducts);

    /**
   * Update product
   * @name PUT /product
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/product/:id').put(validateUser.checkToken,controller.updateProduct);

    /**
   * Delete product
   * @name DELETE /category
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/product/:id').delete(validateUser.checkToken,controller.removeProductById);


   /**
   * GET product
   * @name GET /product
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/product/:id').get(validateUser.checkToken,controller.getProductById);

}
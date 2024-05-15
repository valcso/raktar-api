const controller = require('../../controllers/Categories/controller.js');
const validateUser = require('../../middleware/validateAdmin.js');

module.exports = (app) => {
  /**
   * Create category
   * @name POST /admin
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
  app.route('/category').post(validateUser.checkToken,controller.createCategory);

    /**
   * Get categories
   * @name GET /categories
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
   app.route('/categories').get(validateUser.checkToken,controller.getAll);

    /**
   * Update category
   * @name PUT /category
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/category/:id').put(validateUser.checkToken,controller.updateCategory);

    /**
   * Delete category
   * @name DELETE /category
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/category/:categoryId').delete(validateUser.checkToken,controller.deleteCategory);


   /**
   * GET Category
   * @name GET /category
   * @function
   * @memberof module.exports
   * @param {function} controller.create - Controller function to create an order
   */
    app.route('/category/:id').get(validateUser.checkToken,controller.getCategory);

}
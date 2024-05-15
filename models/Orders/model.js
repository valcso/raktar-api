const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ordersSchema = new Schema(
  {
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    orderNumber: { type: String , required : true },
    totalPrice: { type: Number , required : true},
    status: {
      type: String,
      enum: ['Megrendelve', 'Csomagolva', 'Teljesitett','Elküldve', 'Lemondva'],
      default: 'Ordered',
    },
    order: [{ type: Object, required: true }],
    orderedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    userData: [{type: Object , required : true}],
    deliveryAddress: [{ type: Object , required : true }],
    comment: { type: String , required : false},
    isPayed: { type: Boolean, default : 0 },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

module.exports = mongoose.model('Orders', ordersSchema);

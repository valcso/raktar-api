const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dataSchema = new Schema(
  {
    title: { type: String, intl: true, required: true, trim: true },
    content: { type: String, intl: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required:false, default:null},
    SKU: { type: String, intl: true, },
    quantity: { type: Number, intl: true, },
    boughtPrice: { type: Number, intl: true},
    salePrice: { type: Number, intl: true },
    featureImage: { type: String },
    purchasedCount : {type : Number, default : 0},
    manageStock : {type : Boolean, default : 1},
    weight: { type: Number, required: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Product', dataSchema);

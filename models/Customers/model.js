const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    fullname : {type : String, required : true},
    address : {type : Object},
    phone_number : {type : String},
    email : {type : String},
    number_of_orders : {type : Number, required : false, default : 0},
    vat_number : {type : Number, required : false}
  },
  { timestamps: true, toJSON: { virtuals: true } },
);


module.exports = mongoose.model('Customer', customerSchema);

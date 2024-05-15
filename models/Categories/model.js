const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String, intl: true, trim: true, required : true, unique : true},
    imageBase64: { type: String, required: false },
    description: { type: String, required: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Category', categorySchema);

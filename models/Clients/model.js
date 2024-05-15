const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    name: { type: String },
    activated: { type: Boolean, default : true },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

module.exports = mongoose.model('Client', clientSchema);

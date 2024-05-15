const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required:true, unique:true },
    fullname : {type : String, required : true},
    password: { type: String, required : true },
    role: { type: String, required: true, enum: ['admin', 'user'] }
  },
  { timestamps: true, toJSON: { virtuals: true } },
);


/* eslint-disable func-names */
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  
  userSchema.pre('save', async function save(next) {
  
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (err) {
      return next(err);
    }
   
  });
module.exports = mongoose.model('User', userSchema);

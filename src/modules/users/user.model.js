const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { userRegisterValidation } = require('./user.validations');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullname: {
    type: String,
    trim: true,
    required: true
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    minlength: 6,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  birthdate: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'memale'],
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  photo: {
    type: String,
    trim: true
  },
  notifications: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: ['ADMIN_ROLE', 'USER_ROLE']
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.methods.joiValidate = function(obj) {
  return Joi.validate(obj, userRegisterValidation);
};

UserSchema.methods.createToken = function() {
  const payload = {
    _id: this._id,
    username: this.username,
    role: this.role,
    fullname: this.fullname,
    avatar: this.avatar
  };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7days' });
};

UserSchema.methods.authJSON = function() {
  return {
    token: `Bearer ${this.createToken()}`
  };
};

module.exports = mongoose.model('users', UserSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  favorite: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('messages', messageSchema);
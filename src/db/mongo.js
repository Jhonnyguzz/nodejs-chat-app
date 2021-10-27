const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');
const Message = mongoose.model('Message', { text: {type: String}, from: {type: String}, to: {type: String}, createdAt: {type: Number} });

module.exports = Message;
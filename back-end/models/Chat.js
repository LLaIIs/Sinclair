const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  chatSessionId: {
    type: String,
    required: true,
    unique: true,
  },
  name:{
    type:String,
    required:false
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      id: {
        type: String,
        required: true,
      },
      sender: {
        type: String,
        enum: ['User', 'ChatGPT'],
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});


const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

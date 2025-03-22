const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Get all conversations for the current user
router.get('/conversations', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name profilePicture')
    .populate('recipient', 'name profilePicture');

    // Group messages by conversation
    const conversations = messages.reduce((acc, message) => {
      const otherUser = message.sender._id.equals(req.user._id) 
        ? message.recipient 
        : message.sender;
      
      if (!acc[otherUser._id]) {
        acc[otherUser._id] = {
          user: otherUser,
          lastMessage: message,
          unreadCount: !message.read && message.recipient._id.equals(req.user._id) ? 1 : 0
        };
      } else if (!message.read && message.recipient._id.equals(req.user._id)) {
        acc[otherUser._id].unreadCount++;
      }
      return acc;
    }, {});

    res.json(Object.values(conversations));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages between current user and another user
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name profilePicture')
    .populate('recipient', 'name profilePicture');

    // Mark messages as read
    await Message.updateMany(
      {
        recipient: req.user._id,
        sender: req.params.userId,
        read: false
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a new message
router.post('/', auth, async (req, res) => {
  try {
    const message = new Message({
      sender: req.user._id,
      recipient: req.body.recipientId,
      content: req.body.content
    });

    const savedMessage = await message.save();
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender', 'name profilePicture')
      .populate('recipient', 'name profilePicture');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 
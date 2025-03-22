const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get all conversations for the current user
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { recipient: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', req.user._id] },
              then: '$recipient',
              else: '$sender'
            }
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          user: {
            _id: 1,
            name: 1,
            profilePicture: 1,
            role: 1
          },
          lastMessage: 1,
          unreadCount: 1
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages between current user and another user for a specific job
router.get('/:userId/:jobId', auth, async (req, res) => {
  try {
    const query = {
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    };

    // Only add jobId to query if it's not 'general'
    if (req.params.jobId !== 'general') {
      query.jobId = req.params.jobId;
    } else {
      query.jobId = { $exists: false };
    }

    const messages = await Message.find(query)
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

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received message request:', {
      body: req.body,
      user: req.user._id,
      headers: req.headers
    });

    const { recipientId, content, jobId } = req.body;

    // Validate required fields
    if (!recipientId) {
      return res.status(400).json({ 
        message: 'Recipient ID is required',
        received: { recipientId, content, jobId }
      });
    }

    if (!content) {
      return res.status(400).json({ 
        message: 'Message content is required',
        received: { recipientId, content, jobId }
      });
    }

    // Validate recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ 
        message: 'Recipient not found',
        recipientId
      });
    }

    // Validate sender is not sending to themselves
    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ 
        message: 'Cannot send message to yourself'
      });
    }

    const messageData = {
      sender: req.user._id,
      recipient: recipientId,
      content: content.trim(),
      jobId: jobId === 'general' ? undefined : jobId
    };

    console.log('Creating message with data:', messageData);

    const message = new Message(messageData);
    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profilePicture')
      .populate('recipient', 'name profilePicture');

    // Create notification for the recipient
    const notificationData = {
      recipient: recipientId,
      type: 'message',
      message: `New message from ${req.user.name}`,
      link: `/messages/${req.user._id}/${jobId || 'general'}`,
      read: false,
      sender: req.user._id
    };

    // Only add job field if it's not a general message
    if (jobId && jobId !== 'general') {
      notificationData.job = jobId;
    }

    await new Notification(notificationData).save();

    console.log('Message created successfully:', populatedMessage);
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error in send message route:', {
      error: error.message,
      stack: error.stack,
      errors: error.errors
    });
    
    res.status(400).json({ 
      message: error.message,
      details: error.errors || 'No additional details available'
    });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user._id,
      read: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Get all conversations for a user
router.get('/', auth, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user.id
        }).populate('participants', 'name email role');
        res.json(conversations);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Create new conversation
router.post('/', auth, async (req, res) => {
    const { participants } = req.body;

    try {
        // Add current user to participants
        participants.push(req.user.id);

        const conversation = new Conversation({
            participants,
            isGroup: participants.length > 2
        });

        await conversation.save();
        res.json(conversation);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get messages in a conversation
router.get('/:conversationId/messages', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            conversation: req.params.conversationId
        }).populate('sender', 'name email');

        res.json(messages);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
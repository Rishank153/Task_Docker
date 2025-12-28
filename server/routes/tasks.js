const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Task = require('../models/Task');

// Get all tasks
router.get('/', protect, async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'employee') {
            query = {
                $or: [
                    { assignedTo: req.user.id },
                    { status: 'available' }
                ]
            };
        }

        const tasks = await Task.find(query)
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username')
            .populate('completedBy', 'username');

        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a task (admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const { title, description, deadline } = req.body;

        const task = new Task({
            title,
            description,
            deadline,
            createdBy: req.user.id
        });

        await task.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Assign/claim a task
router.put('/:id/assign', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        if (task.status !== 'available') {
            return res.status(400).json({ msg: 'Task already assigned' });
        }

        task.assignedTo = req.user.id;
        task.status = 'assigned';
        await task.save();

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Mark task as complete
router.put('/:id/complete', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        if (task.assignedTo.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        task.status = 'completed';
        task.completedBy = req.user.id;
        task.completedAt = Date.now();
        await task.save();

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
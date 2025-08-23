import express from 'express';
import jwt from 'jsonwebtoken';
import Task from '../models/Task.js';

const router = express.Router();

// Middleware to verify token and get user id
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Create a new task
router.post('/', authMiddleware, async (req, res) => {
  const { text, date, startHour, endHour } = req.body;
  try {
    const task = new Task({
      user: req.userId,
      text,
      date,
      startHour,
      endHour
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
});

// Get all tasks for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
});

// Update a task (edit text, date, hours, or mark finished)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const update = {};
    if (req.body.text !== undefined) update.text = req.body.text;
    if (req.body.date !== undefined) update.date = req.body.date;
    if (req.body.startHour !== undefined) update.startHour = req.body.startHour;
    if (req.body.endHour !== undefined) update.endHour = req.body.endHour;
    if (req.body.finished !== undefined) update.finished = req.body.finished;
    const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.userId }, update, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
});

// Delete a task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
});

export default router;

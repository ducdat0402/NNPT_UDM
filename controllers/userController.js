const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { username, password, email, fullName, avatarUrl, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, email, fullName, avatarUrl, role });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.getAllUsers = async (req, res) => {
    try {
      const { username, fullName } = req.query;
      let query = { isDelete: false };
      if (username) query.username = { $regex: username, $options: 'i' }; // Chứa chuỗi, không phân biệt hoa thường
      if (fullName) query.fullName = { $regex: fullName, $options: 'i' };
      const users = await User.find(query).populate('role'); // Populate role info
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  exports.getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).where({ isDelete: false }).populate('role');
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  exports.getUserByUsername = async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username, isDelete: false }).populate('role');
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  exports.updateUser = async (req, res) => {
    try {
      const updates = req.body;
      if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
      const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).where({ isDelete: false });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { isDelete: true }, { new: true });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'User soft deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  exports.activateUser = async (req, res) => {
    try {
      const { email, username } = req.body;
      const user = await User.findOne({ email, username, isDelete: false });
      if (!user) return res.status(404).json({ error: 'Invalid credentials' });
      user.status = true;
      await user.save();
      res.json({ message: 'User activated' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
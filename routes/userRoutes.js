const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/username/:username', userController.getUserByUsername);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/activate', userController.activateUser); // Phần 2

module.exports = router;
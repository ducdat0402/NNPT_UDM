const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController'); // Giả sử bạn đã tạo roleController.js

// Create Role (POST /roles)
router.post('/', roleController.createRole);

// Get all Roles (GET /roles?search=...) - Thêm tìm kiếm theo name hoặc description nếu cần, nhưng yêu cầu gốc không bắt buộc
router.get('/', roleController.getAllRoles);

// Get Role by ID (GET /roles/:id)
router.get('/:id', roleController.getRoleById);

// Update Role (PATCH /roles/:id)
router.patch('/:id', roleController.updateRole);

// Soft Delete Role (DELETE /roles/:id)
router.delete('/:id', roleController.deleteRole);

module.exports = router;
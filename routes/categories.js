var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category')

// GET /categories - Lấy tất cả categories chưa bị xóa
router.get('/', async function(req, res, next) {
  try {
    let categories = await categoryModel.find({ isDelete: false })
    res.send({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// GET /categories/:id - Lấy category theo ID
router.get('/:id', async function(req, res, next) {
  try {
    let item = await categoryModel.findOne({ _id: req.params.id, isDelete: false });
    if (!item) {
      return res.status(404).send({
        success: false,
        message: 'Category not found or has been deleted'
      });
    }
    res.send({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
});

// POST /categories - Tạo category mới
router.post('/', async function(req, res, next) {
  try {
    let newItem = new categoryModel({
      name: req.body.name
    });
    
    await newItem.save();
    res.status(201).send({
      success: true,
      message: 'Category created successfully',
      data: newItem
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({
        success: false,
        message: 'Category name already exists'
      });
    }
    res.status(400).send({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
});

// PUT /categories/:id - Cập nhật category
router.put('/:id', async function(req, res, next) {
  try {
    let updatedItem = await categoryModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name
      },
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!updatedItem) {
      return res.status(404).send({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.send({
      success: true,
      message: 'Category updated successfully',
      data: updatedItem
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({
        success: false,
        message: 'Category name already exists'
      });
    }
    res.status(400).send({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
});

// DELETE /categories/:id - Soft delete category
router.delete('/:id', async function(req, res, next) {
  try {
    let deletedItem = await categoryModel.findByIdAndUpdate(
      req.params.id,
      {
        isDelete: true
      },
      {
        new: true
      }
    );
    
    if (!deletedItem) {
      return res.status(404).send({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.send({
      success: true,
      message: 'Category deleted successfully',
      data: deletedItem
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
});

module.exports = router;

var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');
let auth = require('./auth');

// view: USER,MOD,ADMIN
router.get('/', auth.authorize(['USER','MOD','ADMIN']), async function(req, response, next){
  let items = await categoryModel.find({isDeleted:false});
  response.send({ success:true, data: items });
})

router.get('/:id', auth.authorize(['USER','MOD','ADMIN']), async function(req, response, next){
  try{
    let item = await categoryModel.findById(req.params.id);
    response.send({ success:true, data: item });
  } catch(err){
    response.status(404).send({ success:false, data: err });
  }
})

// create: MOD,ADMIN
router.post('/', auth.authorize(['MOD','ADMIN']), async function(req, response, next){
  let newItem = new categoryModel({
    name: req.body.name,
    description: req.body.description
  })
  await newItem.save();
  response.send({ success:true, data: newItem });
})

// update: MOD,ADMIN
router.put('/:id', auth.authorize(['MOD','ADMIN']), async function(req, response, next){
  let item = await categoryModel.findById(req.params.id);
  if(!item) return response.status(404).send({ success:false, data: 'not found' });
  item.name = req.body.name?req.body.name:item.name;
  item.description = req.body.description?req.body.description:item.description;
  await item.save();
  response.send({ success:true, data: item });
})

// delete: ADMIN
router.delete('/:id', auth.authorize(['ADMIN']), async function(req, response, next){
  let item = await categoryModel.findById(req.params.id);
  if(!item) return response.status(404).send({ success:false, data: 'not found' });
  item.isDeleted = true;
  await item.save();
  response.send({ success:true, data: item });
})

module.exports = router;

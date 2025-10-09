var express = require('express');
var router = express.Router();
let productModel = require('../schemas/product');
let auth = require('./auth');

// view: USER,MOD,ADMIN
router.get('/', auth.authorize(['USER','MOD','ADMIN']), async function(req, response, next){
  let items = await productModel.find({isDeleted:false}).populate('category');
  response.send({ success:true, data: items });
})

router.get('/:id', auth.authorize(['USER','MOD','ADMIN']), async function(req, response, next){
  try{
    let item = await productModel.findById(req.params.id).populate('category');
    response.send({ success:true, data: item });
  } catch(err){
    response.status(404).send({ success:false, data: err });
  }
})

// create: MOD,ADMIN
router.post('/', auth.authorize(['MOD','ADMIN']), async function(req, response, next){
  let newItem = new productModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category
  })
  await newItem.save();
  response.send({ success:true, data: newItem });
})

// update: MOD,ADMIN
router.put('/:id', auth.authorize(['MOD','ADMIN']), async function(req, response, next){
  let item = await productModel.findById(req.params.id);
  if(!item) return response.status(404).send({ success:false, data: 'not found' });
  item.name = req.body.name?req.body.name:item.name;
  item.description = req.body.description?req.body.description:item.description;
  item.price = req.body.price?req.body.price:item.price;
  item.category = req.body.category?req.body.category:item.category;
  await item.save();
  response.send({ success:true, data: item });
})

// delete: ADMIN
router.delete('/:id', auth.authorize(['ADMIN']), async function(req, response, next){
  let item = await productModel.findById(req.params.id);
  if(!item) return response.status(404).send({ success:false, data: 'not found' });
  item.isDeleted = true;
  await item.save();
  response.send({ success:true, data: item });
})

module.exports = router;

var express = require('express');
var router = express.Router();
let roleSchema = require('../schemas/roles')

/* GET users listing. */
router.get('/', async function(req, response, next) {
  let roles = await roleSchema.find({isDeleted:false});
  response.send({
    success:true,
    data:roles
  });
});
router.get('/:id', async function(req, response, next) {
  try {
    let role = await roleSchema.findById(req.params.id);
    response.send({
    success:true,
    data:role
  });
  } catch (error) {
    response.status(404).send({
      success:false,
      data:error
    })
  }
 
});

router.post('/', async function(req, response, next) {
  let newRole = new roleSchema({
    name:req.body.name
  })
  await newRole.save();
  response.send({
      success:true,
      data:newRole
    })
});

module.exports = router;

var express = require('express');
var router = express.Router();
let users = require('../schemas/users');
let roles = require('../schemas/roles');

/* GET users listing. */
router.get('/', async function(req, response, next) {
  let allUsers = await users.find({isDeleted:false}).populate({
    path: 'role',
    select:'name'
  });
  response.send({
    success:true,
    data:allUsers
  });
});
router.get('/:id', async function(req, response, next) {
  try {
    let getUser = await users.findById(req.params.id);
    getUser = getUser.isDeleted ? new Error("ID not found") : getUser;
    response.send({
      success:true,
      data:getUser
    });
  } catch (error) {
     response.send({
      success:true,
      data:error
    });
  }
});

router.post('/', async function(req, response, next) {
  let role = req.body.role?req.body.role:"USER";
  let roleId;
  role = await roles.findOne({name:role});
  roleId = role._id;
  let newUser = new users({
    username:req.body.username,
    email:req.body.email,
    password:req.body.password,
    role:roleId
  })
  await newUser.save();
  response.send({
      success:true,
      data:newUser
    })
});
router.put('/:id', async function(req, response, next) {
  let user = await users.findById(req.params.id);
  user.email = req.body.email?req.body.email:user.email;
  user.fullName = req.body.fullName?req.body.fullName:user.fullName;
  user.password = req.body.password?req.body.password:user.password;
  await user.save()
  response.send({
      success:true,
      data:user
    })
});

module.exports = router;

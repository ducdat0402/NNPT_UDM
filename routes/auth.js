var express = require('express');
var router = express.Router();
let users = require('../schemas/users');
let roles = require('../schemas/roles');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken')



router.post('/register', async function (req, response, next) {
  let role = await roles.findOne({ name: "user" });
  role = role._id;
  let newUser = new users({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: role
  })
  await newUser.save();
  response.send({
    success: true,
    data: "dang ki thanh cong"
  })
});
router.post('/login', async function (req, response, next) {
  let username = req.body.username;
  let password = req.body.password;
  let user = await users.findOne({
    username: username
  })
  if (!user) {
    response.status(404).send({
      success: true,
      data: "user khong ton tai"
    })
    return;
  } else {
    let result = bcrypt.compareSync(password, user.password);
    if (result) {
      let token = jwt.sign({
        _id: user._id,
        exp: Date.now() + 15 * 60 * 1000
      }, "NNPTUD");
      response.cookie("token", "Bearer " + token, {
        httpOnly: true,
        maxAge: 60 * 1000 * 60 * 24 * 7
      })
      response.send({
        success: true,
        data: token
      })
    } else {
      response.send({
        success: true,
        data: "user sai password"
      })
    }
  }
});
router.post("/logout", function (req, response, next) {
  try {
    response.cookie("token", "");
    response.send({
      success: true,
      data: "Logout thanh cong"
    })
  } catch (error) {
    response.send({
      success: true,
      data: error
    })
  }
})
router.get('/me', async function (req, response, next) {
  let token = req.headers.authorization ? req.headers.authorization : req.cookies.token;
  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
        if (jwt.verify(token, "NNPTUD")) {
      if (jwt.decode(token).exp < Date.now()) {
        response.status(403).send({
          success: false,
          data: "user chua dang nhap"
        })
      } else {
        let userId = jwt.decode(token)._id;
        let user = await users.findById(userId).select(
          "username avatarURL email fullname role"
        ).populate({
          path: 'role',
          select: 'name'
        });
        if (user) {
          response.status(200).send({
            success: true,
            data: user
          })
        }
      }
    } else {
      response.status(403).send({
        success: false,
        data: "user chua dang nhap"
      })
    }
  } else {
    response.status(403).send({
      success: false,
      data: "user chua dang nhap"
    })
  }
})

// Authentication & Authorization middleware helpers
async function getUserFromToken(req) {
  let token = req.headers.authorization ? req.headers.authorization : req.cookies.token;
  if (!token) return null;
  if (token.startsWith('Bearer')) token = token.split(' ')[1];
  try {
    if (!jwt.verify(token, 'NNPTUD')) return null;
    if (jwt.decode(token).exp < Date.now()) return null;
    let userId = jwt.decode(token)._id;
    let user = await users.findById(userId).populate({ path: 'role', select: 'name' });
    return user;
  } catch (err) {
    return null;
  }
}

function authorize(allowedRoles) {
  return async function (req, response, next) {
    let user = await getUserFromToken(req);
    if (!user) {
      return response.status(403).send({ success: false, data: 'user chua dang nhap' });
    }
    const roleName = (user.role && user.role.name) ? user.role.name.toUpperCase() : 'USER';
    if (allowedRoles.map(r=>r.toUpperCase()).includes(roleName)) {
      req.currentUser = user;
      return next();
    }
    return response.status(403).send({ success: false, data: 'khong du quyen' });
  }
}
// attach helpers to router so other route files can require this module and use authorize
router.authorize = authorize;
router.getUserFromToken = getUserFromToken;

module.exports = router;

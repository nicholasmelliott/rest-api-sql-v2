const express = require('express');
const router = express.Router();
const User = require('../models').User;
const authenticateUser = require('../auth/authCreds');
const bcryptjs = require('bcryptjs');
const { check, validationResult } = require('express-validator');

//user validation
const validate = [
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Please provide a value for 'firstName'."),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Please provide a value for 'lastName'."),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Please provide a value for 'emailAddress'.")
    .isEmail()
    .withMessage("Please provide a valid email (ex. name@example.com)")
    //validates if email is already in use
    .custom(value => {
      console.log(value);
      return User.findOne({
        where:{
          emailAddress: value
        }
      }).then(user => {
        if(user){
          return Promise.reject(); 
        }
      });
    })
    .withMessage("Email already in use. Please provide a different email."),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Please provide a value for 'password'.")
];

// Get authenticated user
router.get('/', authenticateUser, (req, res) => {
  res.json(req.currentUser[0].dataValues);
});

// Create new user
router.post('/', validate , (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.status(400).json({ errors: errorMessages });
  } else {
    const user = req.body;
    //encrypt user's password then create user
    user.password = bcryptjs.hashSync(user.password);
    User.create(user).then(() => {
      res.status(201).end();
    });
  }
});

module.exports = router;
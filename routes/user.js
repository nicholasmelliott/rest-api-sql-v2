const express = require('express');
const router = express.Router();
const User = require('../models').User;
const authenticateUser = require('../authenticate');
const { check, validationResult } = require('express-validator');

// Get authenticated user
router.get('/', authenticateUser, (req, res) => {
  res.json(req.currentUser[0].dataValues);
});

// Create new user
router.post('/', [
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Please provide a value for 'firstName'."),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Please provide a value for 'lastName'."),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Please provide a value for 'emailAddress'."),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage("Please provide a value for 'password'.")
],(req, res) => {

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
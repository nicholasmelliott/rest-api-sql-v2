const express = require('express');
const router = express.Router();
const User = require('../models').User;
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const authenticateUser = async (req, res, next) => {
  let message = null;
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  // If the user's credentials are available, attempt to verify username and password. If user is verified with correct creds, pass user info to req.currentUser.
  if(credentials && credentials.name != ""){
    await User.findAll({
      where: {
        emailAddress: credentials.name,
      }
    }).then( user => {
      
      if(user){
        //Checking if passwords match.
        const authenticated = bcryptjs.compareSync(credentials.pass, user[0].dataValues.password);
        if(authenticated){
          req.currentUser = user;
        }else{
          message = `Authentication failure for username: ${user[0].dataValues.emailAddress}`;
        }
      }else{
        message = `User not found for username: ${credentials.name}`;
      }
    });
  }else{
    message = 'Auth header not found';
  }

  // If authentication failed, unauthorized status is returned. 
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    //Authentication succeeded...
    console.log('User Successfully Authenticated.')
    next();
  }
};

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
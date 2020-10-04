const express = require('express');
const router = express.Router();
const User = require('../models').User;

// Get users
router.get('/', (req, res) => {
    User.findAll().then( users =>{
      res.json(users);
    });
  });

module.exports = router;
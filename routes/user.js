const express = require('express');
const router = express.Router();
const User = require('../models').User;

// Get users
router.get('/users', function(req, res, next) {
    User.findAll().then(function(users){
      res.json(users);
    });
  });

  module.exports = router;
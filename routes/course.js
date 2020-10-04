const express = require('express');
const router = express.Router();
const Course = require('../models').Course;

// Get courses
router.get('/', function(req, res, next) {
    Course.findAll().then(function(courses){
      res.json(courses);
    });
  });

  module.exports = router;
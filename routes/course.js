const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const authenticateUser = require('../auth/authCreds');
const authCourseOwner = require('../auth/authOwner');
const { check, validationResult } = require('express-validator');

const courseAttr =  ['id', 'userId', 'title', 'description', 'estimatedTime', 'materialsNeeded'];
const userAttr = ['firstName', 'lastName', 'emailAddress'];


//validator
const validate = [
    check('title')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide a value for 'title'."),
    check('description')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide a value for 'description'.")
  ];

// Get all courses
router.get('/', (req, res, next) => {
    Course.findAll({attributes: courseAttr}).then((courses) => {
      res.json(courses);
    });
  });

  // Get specific course and associated user 
router.get('/:id', (req, res, next) => {
  Course.findByPk(req.params.id, {
    attributes: courseAttr,
    include: [
      {
        model: User,
        as: 'user',
        attributes: userAttr
      }
    ]
  }).then((courses) => {
    res.json(courses);
  });
});

// Create new course
router.post('/', authenticateUser, validate ,(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.status(400).json({ errors: errorMessages });
  } else {
    //Sets userId to person creating course
    req.body.userId = req.currentUser[0].dataValues.id;
    Course.create(req.body).then(() => {
      res.status(201).end();
    });
  }
});

// Update course
router.put('/:id', authenticateUser, authCourseOwner, validate, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.status(400).json({ errors: errorMessages });
  } else {
    Course.update(req.body, {where: {id: req.params.id}}).then(() => {
    res.status(204).end();
  });
  }
});

// Delete course
router.delete('/:id', authenticateUser, authCourseOwner, (req, res) => {
  Course.destroy({where: {id: req.params.id}}).then(() => {
  res.status(204).end();
  });
});

  module.exports = router;
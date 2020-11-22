const express = require('express');
const router = express.Router();
const Course = require('../models').Course;
const User = require('../models').User;
const { check, validationResult } = require('express-validator');

//validator
const validate = [
    check('userId')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide a value for 'userId'."),
    check('title')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide a value for 'title'."),
    check('description')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide a value for 'description'."),
    check('estimatedTime')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide a value for 'estimatedTime'."),
    check('materialsNeeded')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide a value for 'materialsNeeded'.")
  ]

// Get all courses
router.get('/', (req, res, next) => {
    Course.findAll().then((courses) => {
      res.json(courses);
    });
  });

  // Get specific course and associated user 
router.get('/:id', (req, res, next) => {
  Course.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'user',
      }
    ]
  }).then((courses) => {
    res.json(courses);
  });
});

// Create new course
router.post('/', validate ,(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.status(400).json({ errors: errorMessages });
  } else {
    Course.create(req.body).then(() => {
      res.status(201).end();
    });
  }
});

// Update course
router.put('/:id', validate, (req, res) => {
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
router.delete('/:id', (req, res) => {
  Course.destroy({where: {id: req.params.id}}).then(() => {
  res.status(204).end();
  });
});

  module.exports = router;
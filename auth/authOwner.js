const Course = require('../models').Course;


const authCourseOwner = async (req, res, next) => {
    let message = null;
    await Course.findByPk(req.params.id).then(course => {
      if(course){
        if(course.userId !== req.currentUser[0].dataValues.id){
          message = 'User does not own course and cannot make changes.';
        }
      }else{
        message = 'Course does not exist.'
      }
    });
  
    // If authentication failed, forbidden status is returned. 
    if (message) {
      console.warn(message);
      res.status(403).json({ message: "Requested Changes Denied."});
    } else {
      //Authentication succeeded...
      console.log("Authenticated: User Owns Course.");
      next();
    }
  };

  module.exports = authCourseOwner;
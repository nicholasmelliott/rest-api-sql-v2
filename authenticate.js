const User = require('./models').User;
const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');


const authenticateUser = async (req, res, next) => {
    let message = null;
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);
    console.log(req.body);
    // If the user's credentials are available, attempt to verify username and password. If user is verified with correct creds, pass user info to req.currentUser.
    if(credentials && credentials.name != ""){
      await User.findAll({
        where: {
          emailAddress: credentials.name,
        }
      }).then( user => {
        console.log(user);
        if(user[0]){
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

  module.exports = authenticateUser;
  
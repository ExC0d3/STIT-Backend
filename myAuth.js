const auth = require('basic-auth');
const db = require('./myDb');

/*
  Authorization middleware - 
  checks whether user is providing correct login credentials and
  sets the isAuthorized property on request object.
*/

module.exports = function (request, response, next) {
  // parse the Authorization header
  const user = auth(request);

  // check if username exists in db
  const userInDb = db.get('users')
  	.find({username:user.name})
  	.value()

  // if user provided correct credentials
  if(userInDb && userInDb.password === user.pass){
    // authenticate the request
		request.isAuthenticated = true;
    // attach username to request object
		request.username = userInDb.username;  	
    // forward the request to next middleware
		  return next();
  }
  else{
      // incoorect credentials
  	    response.set('WWW-Authenticate', 'Basic user="username"');
	    return response.status(401).send();
  }

};
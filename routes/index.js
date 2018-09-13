const express = require('express');
const router = express.Router();
const db = require('../myDb');
const eventDetails = require('../eventDetails');
const rp = require('request-promise');


router.get('/', function(req, res, next) {
  res.send('Blocked route');
});

router.post('/register', (req,res) => {
	
	// parse the body to pick information
	const pref = req.body.pref;
	const username = req.body.username;
	const password = req.body.password;
	
	// check if the username already exists in the database
	const user = db.get('users')
	.find({username})
	.value();

	// if exists deny the registration request
	if(user){
		res.status(400);
		res.send('Username already exists');
	}
	else{
		// else create a new user
		db.get('users')
		.push({pref, username, password, events:[]})
		.write()
		res.status(200);
	}
})

router.post('/login', (req,res) => {

	// parse the body to pick the information
	const username = req.body.username;
	const password = req.body.password;

	// check if the user exists in the db
	const user = db.get('users')
	find({username})
	.value()


	if(user){
		// if the user exists then match the passwords
		if(user.password === password){
			// if passwords match, allow login
			res.status(200);
			res.send('OK');
		}
		else{
			// else deny login
			res.status(400);
			res.send('password is incorrect');
		}	
	}
	else{
		// else deny login
		res.stats(400);
		res.send('The username does not exist');
	}
})

router.get('/getEvents', (req,res) => {

	const baseUrl = 'https://yv1x0ke9cl.execute-api.us-east-1.amazonaws.com/prod/events';
	const apiUser = db.get('apiUser').value();
	const apiPass = db.get('apiPass').value();

	// build the string for Authorization header
	const auth = "Basic " + new Buffer(apiUser + ":" + apiPass).toString("base64");

	// the request from the middleware checks if the user is authenticated/logged in
	if(req.isAuthenticated){
		// if authenticated

		const username = req.username;
		// find the user in db
		const user = db.get('users')
		.find({username})
		.value()

		/*
			A user can have multiple preferences.
			The following 2 lines work as follows - 
			Line 1 -> Randomly picks a genreId based on user's preferences
			Line 2 -> Randomly picks a className from the available classes
		*/
		const genreId = eventDetails.genreIds[ user.pref[ Math.floor(Math.random()* user.pref.length)]];
		const classificationName = eventDetails.classNames[ Math.floor(Math.random()*eventDetails.classNames.length)];

		// make the request to the external api
		rp({
			method: 'GET',
			uri: baseUrl,
			headers: {
				'Authorization':auth
			},
			qs:{
				classificationName,
				genreId
			}
		})
		.then((data) => {
			// send the received data forward
			res.status(200);
			
			res.json(data)
		})
		.catch((err) =>{
			res.status(400)
			res.send(err)
		})
	}
	else{
		// user is not authenticated
		res.status(400);
		res.send('Please authenticate first');
	}
})

router.post('/setPreferences', (req,res) => {
	// if user is authenticated
	if(req.isAuthenticated){
		const username = req.username;
		// find the user in the db and update the preferences
		db.get('users')
		.find({username})
		.assign({pref: req.body.prefs})
		.write();

		res.status(200);
		res.send('Updated');
	}
	else{
		res.status(400);
		res.send('Please authenticate first');
	}
})

module.exports = router;

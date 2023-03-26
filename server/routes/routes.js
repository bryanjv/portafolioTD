import {response, Router } from "express";
import  connection  from "../index.js";

const myRouter = Router();

myRouter.get("/", (req,res) => {
    res.render("index");
})

myRouter.get("/login", (req,res) => {
    res.render("login");
})

myRouter.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/admin');
				console.log("hola");
			} else {
				console.log("chao");
				response.render("login",{mensaje:'Incorrect Username and/or Password!'});
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

myRouter.get('/admin', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.render("admin",{saludo:'Welcome back, ' + request.session.username + '!'});
	} else {
		// Not logged in
		response.send('Please login to view this page!');
		response.end();
	}
});

export default myRouter;
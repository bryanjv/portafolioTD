import {response, Router } from "express";
import connection from "../utils/conexion.js";
import bcrypt from "bcrypt";
import mysql from "mysql";

const myRouter = Router();

myRouter.get("/", (req,res) => {
	if(typeof req.session.loggedin === 'undefined'){
		res.render("index", {loggedin: false});
	}else{
		res.render("index", {loggedin: true});
	}  
})

myRouter.get("/login", (req,res) => {
    res.render("login");
})

myRouter.get('/register', (req,res) => {
	res.render("register");
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
			console.log(fields);
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/admin');
			} else {
				response.render("login",{mensaje:'Incorrect Username and/or Password!'});
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

myRouter.post('/create', async (req,res) => {
	let username = req.body.username;
	let hashedPass = await bcrypt.hash(req.body.password,10);
	let email = req.body.email;
	connection.getConnection(async (err, connection) => {
		if (err) throw (err);

		const sqlSearch = "SELECT * FROM accounts WHERE username = ?";
		const search_query = mysql.format(sqlSearch, [username]);
		
		const sqlInsert = "INSERT INTO accounts VALUES (0,?,?,?)";
		const insert_query = mysql.format(sqlInsert,[username, hashedPass, email]);

		await connection.query (search_query, async (err, result) => {
			if (err) throw (err);
			console.log("----> Search Results");
			console.log(result);

			if (result.length != 0) {
				connection.release();
				console.log("----> User ealready exists");
				res.render("login", {alerta: "Usuario Ya registrado"});
			}
			else {
				await connection.query(insert_query, (err, result) => {

					connection.release();

					if (err) throw (err);
					console.log("----> Created new user");
					console.log(result.insertId);
					res.render("profile");
				})
			}
		})
	})
})

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
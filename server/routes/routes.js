import { Router } from "express";
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
	console.log(req.body);
	res.render("register");
})

myRouter.post('/auth', function(req, res) {
	// Capture the input fields
	let username = req.body.username;
	let password = req.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to home page
				res.redirect('/admin');
			} else {
				res.render("login",{mensaje:'Incorrect Username and/or Password!'});
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
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

myRouter.get('/admin', function(req, res) {
	// If the user is loggedin
	if (req.session.loggedin) {
		// Output username
		res.render("admin",{loggedin: true});
	} else {
		// Not logged in
		res.send('Please login to view this page!');
		res.end();
	}
});

myRouter.get('/logout', function(req, res) {

	req.session.destroy();
	res.redirect('/');
})

export default myRouter;
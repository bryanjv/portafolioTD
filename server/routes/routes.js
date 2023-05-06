import { Router } from "express";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/functions.js";

const myRouter = Router();

myRouter.get("/", (req, res) => { //Trae el index
	console.log(req.session.user);
	res.render("index", {loggedin: req.session.loggedin, username: req.session.user.username})
});

myRouter.get("/restaurants", async (req, res) => { //Trae todos los restaurants
	const resultado = await fetch("http://localhost:4000/api/v1/restaurants");
	const data = await resultado.json();
	res.render("restaurants", { "restaurants": data });
});

myRouter.get("/restaurant/:restaurantid/menu", async (req, res) => { //Trae el menu de un restaurant por id
	const resultado = await fetch(`http://localhost:4000/api/v1/restaurant/${req.params.restaurantid}/menu`);
	const data = await resultado.json();
	res.render("menu", { "menu": data });
});

myRouter.get("/employee", async (req,res) => {
	const resultado = await fetch("http://localhost:4000/api/v1/restaurants");
	const data = await resultado.json();
	res.render("employee", { "restaurants": data })
})

myRouter.get("/login", (req, res) => {//Pagina de Login
	res.render("login");
});

myRouter.get('/profile', (req,res) => {
	res.render("profile", {user: req.session.user, restaurant: req.session.restaurant})
})

myRouter.get('/register', (req, res) => {//Pagina de registro
	res.render("register");
});

myRouter.post('/auth', async (req, res) => { //Verificacion de usuario
	let username = req.body.username;
	const resultado = await fetch(`http://localhost:4000/api/v1/user/${username}`)

	const data = await resultado.json();

	if (data.length == 0) {
		console.log("No hay coincidencias");
	} else if (data.length > 1) {
		console.log("Error de duplicado de Usuario");
	} else if (data.length == 1) {
		bcrypt.compare(req.body.userpassword, data[0].userpassword, async function (err, result) {
			if (err) {
				console.log(err);
			} else if (result) {
				if (data[0].isemployee == true){
					// req.session.loggedin = true;
					// req.session.isemployee = data[0].isemployee;
					// req.session.username = data[0].username;
					// req.session.userid = data[0].userid;
					// req.session.restaurant_id = data[0].restaurant_id;
					// req.session.user_restaurant_name = data[0].user_restaurant_name;

					req.session.user = data[0];
					
					const resultado2 = await fetch(`http://localhost:4000/api/v1/restaurant/${data[0].restaurant_id}`)					
					const data2 = await resultado2.json();

					req.session.restaurant = data2[0];

					res.redirect("profile")
				} else {
				// La contraseña es correcta
					req.session.loggedin = true;
					req.session.user = data[0];
					console.log("contraseña correcta");
					res.redirect("/")
				}
			} else {
				// La contraseña es incorrecta
				console.log('Contraseña incorrecta');
			}
		});
	}
});

myRouter.get("/profile", (req,res) => {
	res.render("profile")
})

myRouter.post('/create', async (req, res) => { //Crea un usuario y un cliente

	let data = {
		username: req.body.username,
		userpassword: await hashPassword(req.body.password),
		clientname: req.body.name,
		clientphone: req.body.phone,
		clientemail: req.body.email
	}

	const resultado = await fetch("http://localhost:4000/api/v1/client", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" }
	})
});

myRouter.post('/newRestaurant', async (req, res) => { //Crea un restaurant
	const resultado = await fetch("http://localhost:4000/api/v1/restaurant", {
		method: "POST",
		body: JSON.stringify(req.body),
		headers: { "Content-Type": "application/json" }
	})
})

myRouter.post('/newEmployee', async (req, res) => {

	const data = {
		username: req.body.username,
		user_restaurantname:req.body.name,
		user_restaurantid: req.body.restaurant,
		userpassword: await hashPassword(req.body.password)
	}
	
	const resultado = await fetch("http://localhost:4000/api/v1/user/restaurant", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" }
	})
})

myRouter.get('/new', (req, res) => { //Pagina de registro de restaurant
	res.render("new")
})

myRouter.get('/logout', function (req, res) {

	req.session.destroy();
	res.redirect('/');
});

export default myRouter;
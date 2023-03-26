import express from "express";
import bodyParser from "body-parser";
import hbs from "hbs";
import routes from "./routes/routes.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import session from "express-session";
import mysql from "mysql";

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '1234',
	database : 'nodelogin'
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine","hbs");
hbs.registerPartials(join(dirname(fileURLToPath(import.meta.url)), "./views/partials"));
app.use(routes);
app.use(express.static(join(__dirname,"../client/public")));
app.use("/bootstrap/css", express.static(join(__dirname,"./node_modules/bootstrap/dist/css")));
app.use("/bootstrap/js", express.static(join(__dirname,"./node_modules/bootstrap/dist/js")));

app.listen(3000, () => console.log('server ON'));

export default connection;



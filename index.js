import express from "express";
import bodyParser from "body-parser";
import hbs from "hbs";
import routes from "./routes/routes.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const app = express();

app.set("view engine","hbs");
hbs.registerPartials(join(dirname(fileURLToPath(import.meta.url)), "/views/partials"));
app.use(express.static("public"));

app.listen(3000, () => console.log('server ON'));

app.use(routes);



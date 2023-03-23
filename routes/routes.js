import {response, Router } from "express";

const myRouter = Router();

myRouter.get("/", (req,res) => {
    res.render("index");
})

export default myRouter;
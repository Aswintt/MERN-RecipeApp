import express from "express";
import cors from 'cors';
import mongoose from 'mongoose';

import { userRouter } from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth" , userRouter);
app.use("/recipes" , recipesRouter);

mongoose.connect(
    "mongodb+srv://azinty:aziApp001@recipez.ia3us.mongodb.net/recipez?retryWrites=true&w=majority&appName=recipez"
);

app.listen(3001, ()=>{
    console.log("Server STARTED!!!")
});
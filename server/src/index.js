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

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

app.listen(3001, ()=>{
    console.log("Server STARTED...!!!")
});

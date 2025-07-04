import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { userRouter } from "./routes/users.router.js";
import { recipesRouter } from "./routes/recipes.router.js";
import { adminRouter } from "./routes/admin.router.js";

const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/admin", adminRouter);
app.use("/recipes", recipesRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.listen(port, () => {
  console.log("Server STARTED... on !!! Port : ", port);
});

import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await RecipesModel.find({});
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipesModel(req.body);
  try {
    const response = await recipe.save();
    res.json({ response, message: "Recipe Created successfully!" });
  } catch (err) {
    res.json(err);
  }
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipesModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    user.savedRecipes.push(recipe);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

router.put("/unsave-recipe", verifyToken, async (req, res) => {
  const userId = req.body.userID;
  const recipeId = req.body.recipeId;

  if (!recipeId && !userId) {
    return res
      .status(400)
      .json({ message: "Recipe ID and User ID is required." });
  }

  try {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { savedRecipes: recipeId },
    });
    res.status(200).json({ message: "Recipe unsaved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error while unsaving recipe." });
  }
});

router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

// Get a recipe by slug
router.get("/:slug", async (req, res) => {
  try {
    const recipe = await RecipesModel.findOne({
      slug: req.params.slug,
    }).populate({
      path: "userOwner",
      select: "-password",
    });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search API: Get recipes that match the query
router.get("/search/:query", async (req, res) => {
  try {
    const searchTerm = req.params.query;
    const recipes = await RecipesModel.find({
      name: { $regex: searchTerm, $options: "i" }, // Case-insensitive search
    });
    res.json(recipes);
  } catch (error) {
    console.error("Error searching recipes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export { router as recipesRouter };

import { UserModel } from "../models/users.model.js";
import { RecipesModel } from "../models/recipes.model.js";

export const getAllRecipes = async (req, res) => {
  try {
    const response = await RecipesModel.find({});
    res.json(response);
  } catch (err) {
    res.json(err);
  }
};

export const createRecipe = async (req, res) => {
  const recipe = new RecipesModel(req.body);
  try {
    const response = await recipe.save();
    res.json({ response, message: "Recipe Created successfully!" });
  } catch (err) {
    res.json(err);
  }
};

export const saveRecipe = async (req, res) => {
  try {
    const recipe = await RecipesModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    user.savedRecipes.push(recipe);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.json(err);
  }
};

export const getSavedRecipes = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes });
  } catch (err) {
    res.json(err);
  }
};

export const unsaveRecipe = async (req, res) => {
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
};

export const checkIfSaved = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    res.json(err);
  }
};

export const getRecipeBySlug = async (req, res) => {
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
};

export const searchRecipes = async (req, res) => {
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
};

export const reportRecipe = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  // console.log(message);
  if (!message)
    return res.status(400).json({ error: "Report message is required" });

  try {
    const recipe = await RecipesModel.findById(id);
    recipe.reports.push({ message });
    await recipe.save();
    res.json({ success: true, message: "Report submitted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to report post" });
  }
};

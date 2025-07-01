import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeBySlug,
  searchRecipes,
  unsaveRecipe,
  reportRecipe,
  toggleSaveRecipe,
  getSavedRecipeIDs,
  getSavedRecipes,
} from "../controllers/recipes.controller.js";
import { verifyToken } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", getAllRecipes); // get All recipies
router.post("/", verifyToken, createRecipe); // to create a new recipe

router.put("/unsave-recipe", verifyToken, unsaveRecipe); // to unSave the already saved recipe
router.get("/savedRecipes/ids/:userID", getSavedRecipeIDs);
router.get("/savedRecipes/:userID", getSavedRecipes); /// Get all saved recipies
router.get("/:slug", getRecipeBySlug); // Get a recipe by slug
router.get("/search/:query", searchRecipes); // Get recipes that match the search query

router.post("/:id/report", reportRecipe);

router.put("/toggle-save", verifyToken, toggleSaveRecipe);
export { router as recipesRouter };

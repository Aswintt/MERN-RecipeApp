import "./create-recipe.css";
import { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreateRecipe = () => {
  const userID = useGetUserID();
  const [cookies] = useCookies(["access_token"]);

  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID,
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientsChange = (event, idx) => {
    const { value } = event.target;
    const ingredients = recipe.ingredients;
    ingredients[idx] = value;
    // ingredients : ingredients is down single ingredientss
    setRecipe({ ...recipe, ingredients });
  };

  const addIngredients = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  // console.log(recipe);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/recipes", recipe, {
        headers: { authorization: cookies.access_token },
      });
      alert("Recipe Created!");
      navigate("/");
    } catch (err) {
      alert("Please Login to create Recipes!");
      // console.error(err);
    }
  };
  return (
    <div className="crf-container">
      <h2 className="crf-title">Create Recipe</h2>
      <form onSubmit={onSubmit} className="crf-form">
        <label htmlFor="name">Recipe Name</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={handleChange}
          required
        />

        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          onChange={handleChange}
          required
        ></textarea>

        <label htmlFor="ingredients">Ingredients</label>
        <button onClick={addIngredients} type="button" className="crf-add-btn">
          Add Ingredient
        </button>
        <div className="crf-ingredients">
          {recipe.ingredients.map((ingredient, idx) => (
            <input
              key={idx}
              type="text"
              name="ingredients"
              value={ingredient}
              onChange={(event) => handleIngredientsChange(event, idx)}
              required
            />
          ))}
        </div>

        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          onChange={handleChange}
          required
        />

        <label htmlFor="cookingTime">Cooking Time (mins)</label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          onChange={handleChange}
          required
        />

        <button type="submit" className="crf-submit-btn">
          Create Recipe
        </button>
      </form>
    </div>
  );
};

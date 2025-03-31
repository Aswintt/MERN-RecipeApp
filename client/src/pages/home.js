import "./home.css";
import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies] = useCookies(["access_token"]);

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/recipes`);
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    if (cookies.access_token) fetchSavedRecipes();
  }, [userID, cookies]);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/recipes`,
        {
          recipeID,
          userID,
        },
        { headers: { authorization: cookies.access_token } }
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      alert("Please Login to save Recipes!");
      // console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div className="recipes-container">
      <h1 className="recipes-heading">Recipes</h1>
      <ul className="recipes-list">
        {recipes.map((recipe) => (
          <li key={recipe._id} id={recipe._id} className="recipe-card">
            <Link to={`/recipe/${recipe.slug}`} className="recipe-link">
              <div className="recipe-card-header">
                <h2>{recipe.name}</h2>
                <button
                  onClick={() => saveRecipe(recipe._id)}
                  disabled={isRecipeSaved(recipe._id)}
                  className="save-btn"
                >
                  {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                </button>
              </div>
              <div className="recipe-instructions">
                <p>{recipe.instructions}</p>
              </div>
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="recipe-image"
              />
              <p className="cooking-time">
                Cooking Time: {recipe.cookingTime} minutes
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

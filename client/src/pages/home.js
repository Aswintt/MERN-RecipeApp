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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/recipes`
        );
        setRecipes(response.data);
      } catch (err) {
        // console.error("Error fetching recipes:", err);
        setError("Failed to fetch recipes. Please try again later.");
      } finally {
        setLoading(false);
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
    <div className="homefeed-container">
      <h1 className="homefeed-heading">Recipes</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : recipes.length === 0 ? (
        <h2>Recipes not found!</h2>
      ) : (
        <div className="homefeed-grid">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="homefeed-card">
              <Link
                to={`/recipe/${recipe.slug}`}
                className="homefeed-title-link"
              >
                <h2>{recipe.name}</h2>
              </Link>

              <button
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
                className="homefeed-save-btn"
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>

              <Link
                to={`/recipe/${recipe.slug}`}
                className="homefeed-image-link"
              >
                <div className="homefeed-image-wrapper">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="homefeed-image"
                  />
                </div>
              </Link>

              <p className="homefeed-cooking-time">
                Cooking Time: {recipe.cookingTime} minutes
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

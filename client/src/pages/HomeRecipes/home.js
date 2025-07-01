// Home.js
import "./home.css";
import React, { useEffect, useState } from "react";
import { useGetUserID } from "../../hooks/useGetUserID.js";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { SaveButton } from "../../components/SaveButton/SaveButton.js";

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
        setSavedRecipes(response.data.savedRecipes || []);
      } catch (err) {
        console.error("Error fetching saved recipes:", err);
      }
    };

    fetchRecipes();

    if (cookies.access_token && userID) {
      fetchSavedRecipes();
    }
  }, [cookies, userID]);

  return (
    <div className="homefeed-container">
      <h1 className="homefeed-heading">Recipes</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : recipes.length === 0 ? (
        <h2>No recipes found.</h2>
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

              <SaveButton
                key={recipe._id}
                recipeID={recipe._id}
                savedRecipes={savedRecipes}
                setSavedRecipes={setSavedRecipes}
              />

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

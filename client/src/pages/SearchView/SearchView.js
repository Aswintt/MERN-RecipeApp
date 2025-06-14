import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useCookies } from "react-cookie";

import "./SearchView.css";
import { Link } from "react-router-dom";

const SearchView = () => {
  const { query } = useParams();
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
          `${process.env.REACT_APP_SERVER_URL}/recipes/search/${query}`
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
  }, [query, userID, cookies]);

  const saveRecipe = async (recipeID, userID) => {
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
    <div className="search-results-container">
      <h1 className="search-heading">Search Results for "{query}"</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : recipes.length === 0 ? (
        <h2>Recipes not found!</h2>
      ) : (
        <div className="search-results-container">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="search-recipe-card">
              <Link to={`/recipe/${recipe.slug}`} className="recipe-link">
                <h2>{recipe.name}</h2>
              </Link>
              <button
                onClick={() => saveRecipe(recipe._id, userID)}
                disabled={isRecipeSaved(recipe._id)}
                className="save-btn"
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
              <Link to={`/recipe/${recipe.slug}`} className="recipe-link">
                <div className="recipe-image-wrapper">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="search-recipe-image"
                  />
                </div>
              </Link>
              <p>Cooking Time: {recipe.cookingTime} minutes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchView;

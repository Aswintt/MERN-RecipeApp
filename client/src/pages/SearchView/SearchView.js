import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useCookies } from "react-cookie";

import { SaveButton } from "../../components/SaveButton/SaveButton.js"; // ✅ Reuse SaveButton
import "./SearchView.css";

const SearchView = () => {
  const { query } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies] = useCookies(["access_token"]);
  const userID = useGetUserID();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/recipes/search/${query}`
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
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    if (cookies.access_token) fetchSavedRecipes();
  }, [query, userID, cookies]);

  return (
    <div className="search-page-wrapper">
      <h1 className="search-page-heading">Search Results for "{query}"</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : recipes.length === 0 ? (
        <h2>Recipes not found!</h2>
      ) : (
        <div className="search-grid">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <Link to={`/recipe/${recipe.slug}`} className="recipe-name-link">
                <h2>{recipe.name}</h2>
              </Link>

              <SaveButton
                recipeID={recipe._id}
                savedRecipes={savedRecipes}
                setSavedRecipes={setSavedRecipes}
              />

              <Link to={`/recipe/${recipe.slug}`} className="recipe-image-link">
                <div className="recipe-image-wrapper">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="recipe-image"
                  />
                </div>
              </Link>

              <p className="cooking-time">
                Cooking Time: {recipe.cookingTime} minutes
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchView;

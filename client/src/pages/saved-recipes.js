import "./saved-recipes.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);

  const hasFetched = useRef(false); // Ref to track fetch status -smr
  const [cookies] = useCookies(["access_token"]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/recipes/savedRecipes/${userID}`
        );

        setSavedRecipes(response.data.savedRecipes);
        // console.log(response.data);
      } catch (err) {
        // console.error("Error fetching recipes:", err);
        setError("Failed to fetch recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (buttonClicked) {
      fetchSavedRecipes();
    }
    setButtonClicked(false);
    //smr start this is to avoid strict mode for this page and the twice api call problem
    if (!hasFetched.current) {
      hasFetched.current = true; // Mark as fetched
      fetchSavedRecipes();
    }
    // smr end
  }, [userID, buttonClicked]);

  const unSaveRecipe = async (recipeId, userID) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/recipes/unsave-recipe`,
        { recipeId, userID },
        {
          headers: {
            authorization: cookies.access_token,
          },
        }
      );

      // console.log("Recipe unsaved:", res.data.message);
    } catch (err) {
      console.error(
        "Error unsaving recipe:",
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <div className="saved-recipes-wrapper">
      <h1 className="saved-recipes-heading">Saved Recipes</h1>
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>{error}</h2>
      ) : savedRecipes.length === 0 ? (
        <h2>No recipes found!</h2>
      ) : (
        <div className="saved-recipes-grid">
          {savedRecipes.map((recipe) => (
            <div key={recipe._id} className="recipe-card">
              <Link to={`/recipe/${recipe.slug}`} className="recipe-name-link">
                <h2>{recipe.name}</h2>
              </Link>

              <button
                onClick={() => {
                  unSaveRecipe(recipe._id, userID);
                  setButtonClicked(true);
                }}
                className="unsave-button"
              >
                Unsave
              </button>

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

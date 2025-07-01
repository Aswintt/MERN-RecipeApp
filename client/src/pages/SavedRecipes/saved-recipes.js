import "./saved-recipes.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { Link } from "react-router-dom";
// import { useCookies } from "react-cookie";
import { SaveButton } from "../../components/SaveButton/SaveButton";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  // const [cookies] = useCookies(["access_token"]);
  const userID = useGetUserID();
  const hasFetched = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes || []);
      } catch (err) {
        setError("Failed to fetch recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (buttonClicked) {
      fetchSavedRecipes();
      setButtonClicked(false);
    }

    if (!hasFetched.current && userID) {
      hasFetched.current = true;
      fetchSavedRecipes();
    }
  }, [userID, buttonClicked]);

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
          {savedRecipes.map(
            (recipe) =>
              recipe && (
                <div key={recipe._id} className="recipe-card">
                  <Link
                    to={`/recipe/${recipe.slug}`}
                    className="recipe-name-link"
                  >
                    <h2>{recipe.name}</h2>
                  </Link>

                  <SaveButton
                    key={recipe._id}
                    recipeID={recipe._id}
                    savedRecipes={savedRecipes.map((r) => r._id)}
                    setSavedRecipes={() => setButtonClicked(true)}
                  />

                  <Link
                    to={`/recipe/${recipe.slug}`}
                    className="recipe-image-link"
                  >
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
              )
          )}
        </div>
      )}
    </div>
  );
};

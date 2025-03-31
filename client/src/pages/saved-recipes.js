import "./saved-recipes.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { Link } from "react-router-dom";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const hasFetched = useRef(false); // Ref to track fetch status -smr

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
        console.error(err);
      }
    };

    //smr start this is to avoid strict mode for this page and the twice api call prblm
    if (!hasFetched.current) {
      hasFetched.current = true; // Mark as fetched
      fetchSavedRecipes();
    }
    // smr end
  }, [userID]);

  return (
    <div className="saved-recipes-container">
      <h1 className="saved-recipes-heading">Saved Recipes</h1>
      <ul className="saved-recipes-list">
        {savedRecipes.map((recipe) => (
          <li key={recipe._id} className="saved-recipe-card">
            <Link to={`/recipe/${recipe.slug}`} className="recipe-link">
              <div className="saved-recipe-title">
                <h2>{recipe.name}</h2>
              </div>
              <div className="saved-recipe-instructions">
                <p>{recipe.instructions}</p>
              </div>
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="saved-recipe-image"
              />
              <p className="saved-recipe-time">
                Cooking Time: {recipe.cookingTime} minutes
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

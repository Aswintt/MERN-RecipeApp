import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./SearchView.css";
import { Link } from "react-router-dom";

const SearchView = () => {
  const { query } = useParams();
  const [recipes, setRecipes] = useState([]);

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
        // console.error("Error fetching recipes:", err);
        setError("Failed to fetch recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [query]);

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
        <ul className="search-results-list">
          {recipes.map((recipe) => (
            <li key={recipe._id} className="search-recipe-card">
              <Link to={`/recipe/${recipe.slug}`} className="recipe-link">
                <h2>{recipe.name}</h2>
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="search-recipe-image"
                />
                <p>Cooking Time: {recipe.cookingTime} minutes</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchView;

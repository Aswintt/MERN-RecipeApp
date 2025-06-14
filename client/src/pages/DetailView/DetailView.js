import "./DetailView.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../../hooks/useGetUserID";

const DetailView = () => {
  const { slug } = useParams();
  const [cookies] = useCookies(["access_token"]);
  const [recipe, setRecipe] = useState(null);
  // const [me, setMe] = useState([]);

  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const userID = useGetUserID();
  // console.log(userID);
  // Fetch recipe by slug
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/recipes/${slug}`
        );
        setRecipe(res.data);
      } catch (err) {
        console.error("Failed to fetch recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [slug]);

  const saveRecipe = async (recipeID, userID) => {
    if (!cookies.access_token) {
      alert("Please login to save recipes.");
      return;
    }
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
      alert("something wrong");
      // console.log(err);
    }
  };
  // console.log(savedRecipes);

  if (loading) return <h2>Loading...</h2>;
  if (!recipe) return <h2>Recipe not found!</h2>;

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>{recipe.name}</h1>
        {!savedRecipes.includes(recipe._id) && (
          <button
            onClick={() => saveRecipe(recipe._id, userID)}
            className="save-btn"
          >
            Save
          </button>
        )}

        <span>
          Created by{" "}
          <i>
            {recipe.userOwner?.username ? recipe.userOwner.username : "Guest"}
          </i>
        </span>
      </div>

      <img src={recipe.imageUrl} alt={recipe.name} className="detail-image" />
      <p>{recipe.instructions}</p>
      <p>Cooking Time: {recipe.cookingTime} minutes</p>

      <h4>Ingredients</h4>
      <div className="tag-container">
        {recipe.ingredients.map((item, index) => (
          <span key={index} className="tag-badge">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DetailView;

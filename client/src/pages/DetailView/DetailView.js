import "./DetailView.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const DetailView = () => {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/recipes/${slug}`)
      .then((response) => {
        setRecipe(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <h2>Loading...</h2>;
  if (!recipe) return <h2>Recipe not found!</h2>;

  return (
    <div className="detail-container">
      <h1>{recipe.name}</h1>
      <img src={recipe.imageUrl} alt={recipe.name} className="detail-image" />
      <p>{recipe.instructions}</p>
      <p>Cooking Time: {recipe.cookingTime} minutes</p>
    </div>
  );
};

export default DetailView;

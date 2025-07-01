import "./DetailView.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../../hooks/useGetUserID";
import { SaveButton } from "../../components/SaveButton/SaveButton";

const DetailView = () => {
  const { slug } = useParams();
  const [cookies] = useCookies(["access_token"]);
  const [recipe, setRecipe] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [showReportInput, setShowReportInput] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const userID = useGetUserID();

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

    fetchRecipe();
    if (cookies.access_token) fetchSavedRecipes();
  }, [slug, cookies.access_token, userID]);

  const handleReport = async () => {
    if (!reportMessage.trim()) return;
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/recipes/${recipe._id}/report`,
        { message: reportMessage }
      );
      alert("Report submitted");
      setShowReportInput(false);
      setReportMessage("");
    } catch (error) {
      console.error("Report error:", error);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (!recipe) return <h2>Recipe not found!</h2>;

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h1>{recipe.name}</h1>

        <SaveButton
          key={recipe._id}
          recipeID={recipe._id}
          savedRecipes={savedRecipes}
          setSavedRecipes={setSavedRecipes}
        />

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

      <div className="report-container">
        {showReportInput && (
          <input
            className="report-input"
            type="text"
            value={reportMessage}
            onChange={(e) => setReportMessage(e.target.value)}
            placeholder="What's wrong with this recipe?"
          />
        )}
        <div className="report-buttons">
          {showReportInput && (
            <button className="submit-report" onClick={handleReport}>
              Report
            </button>
          )}
          <button
            className="toggle-report"
            onClick={() => setShowReportInput((prev) => !prev)}
          >
            ⚠
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailView;

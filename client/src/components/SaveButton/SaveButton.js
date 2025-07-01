// SaveButton.js
import React from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../../hooks/useGetUserID.js";

export const SaveButton = ({ recipeID, savedRecipes, setSavedRecipes }) => {
  const [cookies] = useCookies(["access_token"]);
  const userID = useGetUserID();

  const isSaved = savedRecipes?.includes(recipeID);

  const toggleSave = async () => {
    if (!cookies.access_token || !userID) {
      alert("Please log in to save recipes.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/recipes/toggle-save`,
        { recipeID, userID },
        { headers: { authorization: cookies.access_token } }
      );

      // Update saved recipes array in parent component
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.error("Error saving/unsaving recipe:", err);
    }
  };

  return (
    <button
      onClick={toggleSave}
      key={recipeID}
      className={`homefeed-save-btn ${isSaved ? "saved" : "unsaved"}`}
      style={{
        backgroundColor: isSaved ? "#dc3545" : "#28a745", // red or green
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "0.3s ease",
      }}
    >
      {isSaved ? "Unsave" : "Save"}
    </button>
  );
};

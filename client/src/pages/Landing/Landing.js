import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-hero">
      <div className="landing-overlay" />
      <div className="landing-content">
        <h1 className="landing-title">Welcome to Recipe Finder</h1>
        <p className="landing-quote">
          "Cooking is an art, but all art requires knowing something about the
          techniques and materials." – Nathan Myhrvold
        </p>
        <p className="landing-description">
          Discover and share amazing recipes from around the world. Whether
          you're a home chef or a food lover, start exploring or saving your
          favorites now.
        </p>
        <div className="landing-buttons">
          <Link to="/recipes" className="landing-btn explore-btn">
            Explore Recipes
          </Link>
          <Link to="/auth" className="landing-btn create-btn">
            Sign In to Save
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;

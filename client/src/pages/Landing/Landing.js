import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to Recipe Finder</h1>
        <p className="landing-quote">
          "Cooking is an art, but all art requires knowing something about the
          techniques and materials." – Nathan Myhrvold
        </p>
        <p className="landing-description">
          Discover and share amazing recipes from around the world. Whether
          you're a home chef or a food enthusiast, our platform lets you
          explore, create, and save delicious recipes.
        </p>
        <div className="landing-buttons">
          <Link to="/recipes" className="landing-btn explore-btn">
            Explore Recipes
          </Link>
          <span> | </span>
          <Link to="/auth" className="landing-btn create-btn">
            SignIn To Save
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;

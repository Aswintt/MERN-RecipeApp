import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./navbar.css";
import { useHasJwtCookie, useGetUserName } from "../../hooks/useGetUserID.js";

const Navbar = () => {
  const [cookies, setCookies, removeCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    setCookies("access_token", "");
    localStorage.removeItem("userID");
    removeCookie("access_token", { path: "/" });
    navigate("/auth");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu on window resize (fix for large screen issue)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const currentUser = useGetUserName();
  const hasJwt = useHasJwtCookie();
  return (
    <nav className="navx-navbar">
      <Link to="/" className="recipe-link">
        <div className="navx-logo">
          <img src="/rp-logo.png" alt="Logo" />
          <h1>Recipe Finder</h1>
        </div>
      </Link>

      {/* Hamburger Menu Icon */}
      <div className="navx-burger" onClick={toggleMenu}>
        <div className={`burger-line ${isMenuOpen ? "open" : ""}`} />
        <div className={`burger-line ${isMenuOpen ? "open" : ""}`} />
        <div className={`burger-line ${isMenuOpen ? "open" : ""}`} />
      </div>

      {/* Nav Links (Original Menu & Mobile Dropdown) */}
      <div className={`navx-links ${isMenuOpen ? "mobile-active" : ""}`}>
        <Link
          to="/recipes"
          className="navx-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Recipes
        </Link>

        {hasJwt && (
          <Link
            to="/create-recipe"
            className="navx-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Create Recipe
          </Link>
        )}

        <form onSubmit={handleSearch} className="navx-search">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="navx-search-input"
          />
          <button type="submit" className="navx-search-btn">
            Search
          </button>
        </form>

        {!cookies.access_token ? (
          <Link
            to="/auth"
            className="navx-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Signin/Signup
          </Link>
        ) : (
          <>
            <Link
              to="/saved-recipes"
              className="navx-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Saved Recipes
            </Link>

            <button onClick={handleLogout} className="navx-logout-btn">
              Logout {currentUser}
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Auth } from "./pages/auth";
import { CreateRecipe } from "./pages/create-recipe";
import { SavedRecipes } from "./pages/saved-recipes";
// import { Home,Auth,CreateRecipe,SavedRecipes } from './pages/all';
import Navbar from "./components/Navbar/navbar.js";
import DetailView from "./pages/DetailView/DetailView.js";
import SearchView from "./pages/SearchView/SearchView.js";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/recipe/:slug" element={<DetailView />} />
          <Route path="/search/:query" element={<SearchView />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

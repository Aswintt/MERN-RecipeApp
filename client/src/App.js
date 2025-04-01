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
import Landing from "./pages/Landing/Landing.js";
import AdminLogin from "./pages/admin/AdminLogin.js";
import ErrorPage from "./pages/Error/ErrorPage.js";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute.js";
import AdminDashboard from "./pages/admin/AdminDashboard.js";
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/recipes" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminLogin />} />
          {/* ✅ Protected Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/recipe/:slug" element={<DetailView />} />
          <Route path="/search/:query" element={<SearchView />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

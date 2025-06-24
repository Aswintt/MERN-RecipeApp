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
import ForgotPassword from "./components/ForgotandVerify/ForgotPassword.jsx";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute.js";
import AdminDashboard from "./pages/admin/AdminDashboard.js";
import { useHasJwtCookie } from "./hooks/useGetUserID.js";
import { Navigate } from "react-router-dom";
import ResetPassword from "./components/ForgotandVerify/ResetPassword.jsx";
// import ScreenSizeIndicator from "screen-size-indicator";

function App() {
  const hasJwt = useHasJwtCookie();
  // console.log(hasJwt);
  return (
    <div className="App">
      {/* <ScreenSizeIndicator
        position="top-right"
        bgColor="bg-black"
        textColor="text-green-300"
        textSize="text-2xl"
      /> */}
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={!hasJwt ? <Landing /> : <Navigate to={"/recipes"} />}
          />
          <Route path="/recipes" element={<Home />} />
          <Route
            path="/auth"
            element={!hasJwt ? <Auth /> : <Navigate to={"/recipes"} />}
          />
          <Route
            path="/forgot-password"
            element={
              !hasJwt ? <ForgotPassword /> : <Navigate to={"/recipes"} />
            }
          />
          <Route
            path="/forgot-verify/:token"
            element={!hasJwt ? <ResetPassword /> : <Navigate to={"/recipes"} />}
          />
          <Route path="/admin" element={<AdminLogin />} />
          {/*  Protected Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
          <Route
            path="/create-recipe"
            element={hasJwt ? <CreateRecipe /> : <Navigate to={"/recipes"} />}
          />
          <Route path="/recipe/:slug" element={<DetailView />} />
          <Route path="/search/:query" element={<SearchView />} />
          <Route
            path="/saved-recipes"
            element={hasJwt ? <SavedRecipes /> : <Navigate to={"/recipes"} />}
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

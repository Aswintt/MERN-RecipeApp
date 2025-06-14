import "./auth.css";
import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Register

  const toggleForm = (formType) => {
    if (
      (formType === "login" && isLogin) ||
      (formType === "register" && !isLogin)
    ) {
      return; // Prevent toggle if the selected form is already active
    }
    setIsLogin(formType === "login");
  };
  return (
    <div className="auth-container">
      <div className="auth-toggle-btns">
        <button
          onClick={() => toggleForm("login")}
          className={`auth-toggle-btn ${isLogin ? "active" : ""}`}
        >
          Sign In
        </button>
        <button
          onClick={() => toggleForm("register")}
          className={`auth-toggle-btn ${!isLogin ? "active" : ""}`}
        >
          Sign Up
        </button>
      </div>

      <div className="auth-form-container">
        {isLogin ? <Login /> : <Register />}
      </div>
      <div className="adminstyl">
        <Link className="adminstyl" to={"/admin"}>
          Admin?
        </Link>
      </div>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setCookies] = useCookies(["access_token"]);
  console.log(setCookies);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Please fill out all fields!");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/login`,
        {
          username,
          password,
        }
      );

      if (response.data.message) {
        setError(response.data.message); // ✅ Show error message from backend
        return;
      }

      if (response.data.verify === "verify") {
        console.log("User logged");
        setCookies("access_token", response.data.token);
        window.localStorage.setItem("userID", response.data.userID);
        navigate("/");
      } else {
        console.log("invalid credentials");
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Login"
      onSubmit={onSubmit}
      error={error}
    />
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // getting api for register
  const onSubmit = async (event) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Please fill out all fields!");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/register`, {
        username,
        password,
      });
      alert("Registration Completed! Now Login.");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Register"
      onSubmit={onSubmit}
    />
  );
};

const Form = ({
  username,
  setUsername,
  password,
  setPassword,
  label,
  onSubmit,
  error,
}) => {
  return (
    <div className="auth2-container">
      <form onSubmit={onSubmit} className="auth2-form">
        <h2 className="auth2-heading"> {label} </h2>
        <div className="auth2-form-group">
          <label htmlFor="username" className="auth2-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="auth2-input"
            required
          />
        </div>
        <div className="auth2-form-group">
          <label htmlFor="password" className="auth2-label">
            Password:
          </label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="auth2-input"
            required
          />
        </div>

        <button type="submit" className="auth2-btn">
          {" "}
          {label}{" "}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

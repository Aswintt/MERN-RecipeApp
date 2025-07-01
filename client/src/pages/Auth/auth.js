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
  const [showPassword, setShowPassword] = useState(false);

  const [, setCookies] = useCookies(["access_token"]);
  // console.log(setCookies);
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
        setError(response.data.message); //  Show error message from backend
        return;
      }

      if (response.data.verify === "verify") {
        console.log("User logged");
        setCookies("access_token", response.data.token);
        window.localStorage.setItem("userID", response.data.userID);
        window.localStorage.setItem("userName", response.data.userName);
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
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      hide="hideMail"
      userLabel="Email or Username"
    />
  );
};

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  // getting api for register
  const onSubmit = async (event) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedUsername || !trimmedPassword) {
      setError("Please fill out all fields!");
      return;
    }
    // Validation checks
    if (trimmedUsername.length < 5) {
      setError("Username must be at least 5 characters long.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // If all validations pass

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/register`,
        {
          email,
          username,
          password,
        }
      );
      if (response.data.message) {
        setError(response.data.message); // Show error message from backend
        return;
      }
      setError("");
      if (response.data.fMessage) {
        setTimeout(() => {
          alert("User Registered successfully! Now Login.");
        }, 1000);
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
      label="Register"
      onSubmit={onSubmit}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      error={error}
      email={email}
      setEmail={setEmail}
      userLabel="Username"
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
  showPassword,
  setShowPassword,
  email,
  setEmail,
  hide,
  userLabel,
}) => {
  return (
    <div className="auth2-container">
      <form onSubmit={onSubmit} className="auth2-form">
        <h2 className="auth2-heading"> {label} </h2>
        <div className={`auth2-form-group ${hide}`}>
          <label htmlFor="email" className="auth2-label">
            Email:
          </label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="auth2-input"
            placeholder="Enter your email"
          />
        </div>
        <div className="auth2-form-group">
          <label htmlFor="username" className="auth2-label">
            {userLabel}:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="auth2-input"
            placeholder={`Enter your ${userLabel.toLowerCase()}`}
            required
          />
        </div>
        <div className="auth2-form-group">
          <label htmlFor="password" className="auth2-label">
            Password:
          </label>
          <div className="auth2-password-wrapper">
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="auth2-input"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <button type="submit" className="auth2-btn">
          {" "}
          {label}{" "}
        </button>
      </form>
      <Link to={"/forgot-password"}>Forgot Password?</Link>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../Navbar";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

 const handleSubmit = async e => {
  e.preventDefault();
  setError("");
  try {
    await login(email, password);
    navigate("/dashboard");
  } catch (err) {
    setError(
      err?.response?.data?.message ||
      err?.message ||
      "Invalid email or password."
    );
  }
};

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 className="title">Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="button" type="submit">Login</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1em" }}>
          New user? <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => navigate("/signup")}>Create Account</span>
        </p>
      </div>
    </>
  );
};
export default Login;

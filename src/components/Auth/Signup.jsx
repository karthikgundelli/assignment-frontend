import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { AuthContext } from "../../context/AuthContext";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const response = await signup(username, email, password);

      // If response is undefined here, handle error
      // If your backend gives a success, response exists
      // If backend returns 400, it throws, and goes to catch

      // Redirect only if no error and status is 201:
      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Could not create account."
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 className="title">Create Account</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            required
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
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
          <button className="button" type="submit">Create Account</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1em" }}>
          Already have an account?{" "}
          <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </>
  );
};

export default Signup;

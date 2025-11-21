import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={user ? "/dashboard" : "/login"} className="navbar-title">
          TaskApp
        </Link>
      </div>
      <div className="navbar-links">
        {!user && (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </>
        )}
        {user && (
          <>
            <span className="navbar-user">Hi, {user.username}</span>
            {/* Profile link is grouped with user options */}
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <button onClick={logout} className="nav-logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

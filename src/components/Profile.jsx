import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar"; // Import your navbar

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: "", email: "" });
  const [message, setMessage] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (showProfile) {
      fetchProfile();
    }
    // eslint-disable-next-line
  }, [token, showProfile]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setForm({
        username: res.data.username || "",
        email: res.data.email || ""
      });
      setError("");
    } catch (err) {
      setError("Could not load profile");
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setMessage("");
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(res.data);
      setEditMode(false);
      setMessage("Profile updated successfully!");
    } catch {
      setMessage("Error updating profile.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        {/* Toggle button */}
        {!showProfile && (
          <button className="button" onClick={() => setShowProfile(true)}>
            Show Profile
          </button>
        )}

        {/* Profile section */}
        {showProfile && (
          <div className="profile-section">
            <button className="button" style={{ float: "right" }} onClick={() => setShowProfile(false)}>
              Hide Profile
            </button>
            <h2 className="title">User Profile</h2>
            {error && <div className="error">{error}</div>}
            {!editMode ? (
              <>
                <p><b>Username:</b> {profile?.username}</p>
                <p><b>Email:</b> {profile?.email}</p>
                <button className="button" onClick={handleEdit}>
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleUpdate}>
                <input
                  className="input"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
                <input
                  className="input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <button className="button" type="submit">Save</button>
                <button className="button" type="button" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </form>
            )}
            {message && <div className="message">{message}</div>}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;

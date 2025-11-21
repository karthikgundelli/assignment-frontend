import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchTasks, createTask, deleteTask } from "../services/taskService";
import Navbar from "./Navbar";

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);

  // Profile states
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: "", email: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  // Tasks states
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchProfile();
    loadTasks();
  }, []);

  // Profile handlers
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
      setForm({ username: data.username || "", email: data.email || "" });
    } catch {
      setProfile(null);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setProfileMsg("");
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const updated = await res.json();
      setProfile(updated);
      setEditMode(false);
      setProfileMsg("Profile updated successfully!");
    } catch {
      setProfileMsg("Error updating profile.");
    }
  };

  // Task CRUD handlers
  const loadTasks = async () => {
    setTasks(await fetchTasks(token));
  };

  const handleAddTask = async e => {
    e.preventDefault();
    if (!newTask.title) return;
    setTasks([await createTask(newTask, token), ...tasks]);
    setNewTask({ title: "", description: "" });
  };

  const handleDelete = async id => {
    await deleteTask(id, token);
    setTasks(tasks.filter(task => task._id !== id));
  };

  return (
    <>
      <Navbar />
      <div className="container">
        {/* Button to Show Profile */}
        {!showProfile && (
          <button className="button" onClick={() => setShowProfile(true)}>
            Profile
          </button>
        )}

        {/* Profile Section, only if showProfile is true */}
        {showProfile && profile && (
          <div className="profile-section">
            <button className="button" style={{ float: "right" }} onClick={() => setShowProfile(false)}>
              Hide Profile
            </button>
            <h2>User Profile</h2>
            {!editMode ? (
              <>
                <p><b>Username:</b> {profile.username}</p>
                <p><b>Email:</b> {profile.email}</p>
                <button className="button" onClick={handleEdit}>
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleUpdate} className="profile-form">
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
                <button className="button" type="submit">
                  Save
                </button>
                <button className="button" type="button" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </form>
            )}
            {profileMsg && <div className="message">{profileMsg}</div>}
          </div>
        )}

        {/* Tasks CRUD */}
        <h2>Tasks</h2>
        <form onSubmit={handleAddTask}>
          <input
            className="input"
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <input
            className="input"
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          />
          <button className="button" type="submit">Add Task</button>
        </form>
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task._id} className="task-item">
              <span>{task.title} – {task.description}</span>
              <button className="delete-btn" onClick={() => handleDelete(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Dashboard;

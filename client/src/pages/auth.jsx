import React, { useState } from "react";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      try {
        const response = await fetch("http://localhost:5000/users");
        const users = await response.json();

        const found = users.find(
          (u) => u.username === username && u.password === password
        );

        if (!found) {
          setError("Invalid username or password");
          return;
        }
        localStorage.setItem("user", JSON.stringify(found));

        if (role === "admin") {
          const adminsRes = await fetch("http://localhost:5000/admin");
          const admins = await adminsRes.json();
          const isAdmin = admins.find((a) => a.user_id === found.id);

          if (!isAdmin) {
            setError("This user is not an admin.");
            return;
          }

          window.location.href = "/admin-dashboard";
        } else {
          window.location.href = "/user-dashboard";
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      }
    } 
    else {
      try {
        const response = await fetch("http://localhost:5000/users");
        const users = await response.json();

        const exists = users.find((u) => u.username === username);
        if (exists) {
          setError("Username already taken");
          return;
        }

        const createdRes = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            name: username,
            email: `${username}@example.com`,
            password,
            profile_picture: "",
          }),
        });

        const createdUser = await createdRes.json();
        localStorage.setItem("user", JSON.stringify(createdUser));

        if (role === "admin") {
          await fetch("http://localhost:5000/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: createdUser.id,
              role: "moderator",
              granted_by: null
            })
          });

          window.location.href = "/admin-dashboard";
        } else {
          window.location.href = "/user-dashboard";
        }

      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="p-4 shadow rounded" style={{ width: "350px" }}>
        
        {}
        <div className="d-flex mb-3">
          <button
            className={`btn flex-fill ${
              mode === "login" ? "btn-primary" : "btn-light"
            }`}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Login
          </button>

          <button
            className={`btn flex-fill ${
              mode === "signup" ? "btn-primary" : "btn-light"
            }`}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        {}
        {error && <p className="text-danger text-center">{error}</p>}

        {}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {}
          <div className="mb-3">
            <label>Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Normal User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="btn btn-success w-100" type="submit">
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
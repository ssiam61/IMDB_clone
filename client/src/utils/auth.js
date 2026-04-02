const API_BASE_URL = "http://localhost:5000/api";

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getIsAdmin = () => {
  const isAdmin = localStorage.getItem("isAdmin");
  return isAdmin ? JSON.parse(isAdmin) : false;
};

export const getInAdminMode = () => {
  const inAdminMode = localStorage.getItem("inAdminMode");
  return inAdminMode ? JSON.parse(inAdminMode) : false;
};

export const toggleAdminMode = () => {
  if (!getIsAdmin()) return false;
  const currentMode = getInAdminMode();
  const newMode = !currentMode;
  localStorage.setItem("inAdminMode", JSON.stringify(newMode));
  
  // Dispatch custom event to notify all components
  window.dispatchEvent(new CustomEvent("adminModeChanged", { detail: { inAdminMode: newMode } }));
  
  return newMode;
};

export const isAuthenticated = () => {
  return getToken() !== null && getUser() !== null;
};

export const authenticatedFetch = async (url, options = {}) => {
  const token = getToken();
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    logout();
    throw new Error("Authentication failed. Please login again.");
  }

  return response;
};

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Login failed");
    }
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("isAdmin", JSON.stringify(data.isAdmin || false));

    return data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};

export const signup = async (username, name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, email, password }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Signup failed");
    }

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (err) {
    console.error("Signup error:", err);
    throw err;
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("inAdminMode");
  window.location.href = "/";
};

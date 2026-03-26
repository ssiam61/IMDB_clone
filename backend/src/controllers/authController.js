import { signup, login } from "../services/authService.js";

export const signupController = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    if (!username || !name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await signup({ username, name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    const result = await login({ username, password });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

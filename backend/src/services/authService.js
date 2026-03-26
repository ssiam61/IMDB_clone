import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

export const signup = async ({ username, name, email, password }) => {
  try {
    // Check if username or email already exists
    const checkQuery = `SELECT id FROM users WHERE username = $1 OR email = $2`;
    const checkResult = await pool.query(checkQuery, [username, email]);
    if (checkResult.rows.length > 0) {
      throw new Error("Username or email already exists");
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    // Insert user
    const insertQuery = `
      INSERT INTO users (username, name, email, password, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, username, name, email, created_at
    `;
    const values = [username, name, email, hashedPassword];
    const { rows } = await pool.query(insertQuery, values);
    return rows[0];
  } catch (error) {
    throw new Error("Signup failed: " + error.message);
  }
};

export const login = async ({ username, password }) => {
  try {
    // Find user by username
    const userQuery = `SELECT * FROM users WHERE username = $1`;
    const { rows } = await pool.query(userQuery, [username]);
    if (rows.length === 0) {
      throw new Error("Invalid username or password");
    }
    const user = rows[0];
    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Invalid username or password");
    }
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    // Return user (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
};

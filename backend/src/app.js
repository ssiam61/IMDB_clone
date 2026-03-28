import express from 'express';
import cors from 'cors';

import mediaRoutes from "./routes/mediaRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import userRoutes from "./routes/userRoutes.js";


// import {authMiddleware} from "./middleware/authMiddleware.js";


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

app.use("/api/media", mediaRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/users", userRoutes);

// middleware testing.
// app.get("/api/protected", authMiddleware, (req, res) => {
//   res.json({
//     message: "You are authenticated",
//     user: req.user
//   });
// });

export default app;

import express from 'express';
import cors from 'cors';
import mediaRoutes from "./routes/mediaRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

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


export default app;

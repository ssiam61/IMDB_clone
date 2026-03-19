import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

export default app;

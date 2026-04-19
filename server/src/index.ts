import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the parent directory's .env.local if needed
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Car Expo Backend API is running!' });
});

// Car routes placeholder
app.get('/api/cars', (req, res) => {
  res.json({ 
    message: 'Cars endpoint',
    cars: [] // Placeholder for car data
  });
});

// Recommendations routes placeholder
app.get('/api/recommendations', (req, res) => {
  res.json({ 
    message: 'Recommendations endpoint',
    recommendations: [] // Placeholder for recommendations
  });
});

app.listen(PORT, () => {
  console.log(`🚗 Car Expo Backend running on port ${PORT}`);
});
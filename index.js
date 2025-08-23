require('dotenv').config();
const express = require('express');
const { Client } = require('pg');

const app = express();
app.use(express.json());

// PostgreSQL client setup
const db = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

// Connect to PostgreSQL
db.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => {
    console.error('DB connection failed:', err);
    process.exit(1);
  });

// Haversine Distance Function (unchanged)
function getDistance(lat1, lon1, lat2, lon2){
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Default route
app.get('/', (req, res) => {
  res.send('School API is running');
});

// addSchool API
app.post('/addSchool', async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Invalid input. Please provide correct details.' });
  }

  const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING id';
  const values = [name, address, latitude, longitude];

  try {
    const result = await db.query(sql, values);
    res.status(201).json({
      message: 'School added successfully to database',
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error('Error inserting school:', err);
    res.status(500).json({ error: 'Failed to add school to database' });
  }
});

// listSchools API
app.get('/listSchools', async (req, res) => {
  const userLati = parseFloat(req.query.latitude);
  const userLongi = parseFloat(req.query.longitude);

  if (isNaN(userLati) || isNaN(userLongi)) {
    return res.status(400).json({ error: 'Please provide valid latitude and longitude details' });
  }

  try {
    const sql = 'SELECT * FROM schools';
    const result = await db.query(sql);
    const schoolsWithDistance = result.rows.map((school) => {
      const distance = getDistance(userLati, userLongi, school.latitude, school.longitude);
      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);
    res.json(schoolsWithDistance);
  } catch (err) {
    console.error('Error fetching schools:', err);
    res.status(500).json({ error: 'Failed to retrieve schools data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

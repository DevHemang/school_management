require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json()); 


// MySQL connection setup
/*const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});*/

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,  // Add this line!
});


// DB connection
db.connect((err) => {
  if (err) {
    console.error('DB connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


//Haversine Distance Function
function getDistance(lat1, lon1, lat2, lon2){
    const toRad = (value) => (value*Math.PI)/180;

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


//addSchool API
app.post('/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;


  if (!name || !address ||  typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'Invalid input. Please provide correct details.' });
  }

  
  const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  const values = [name, address, latitude, longitude];


  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting school:', err);
      return res.status(500).json({ error: 'Failed to add school to database' });
    }

  
    res.status(201).json({
      message: 'School added successfully to database',
      id: result.insertId,
    });
  });
});


//listschool API
app.get('/listSchools', (req, res) => {
    const userLati = parseFloat(req.query.latitude);
    const userLongi = parseFloat(req.query.longitude);

    if(isNaN(userLati) || isNaN(userLongi)){
        return res.status(400).json({error:'Please provide valid latitude and longitude  details'});
    }

    const sql = 'SELECT * FROM schools';

    db.query(sql, (err, results) =>{
        if(err){
            console.log('Error fetching schools: ', err);
            return res.status(500).json({error: 'faile to retrieve schools data'});
        }

        const schoolsWithDistance = results.map((school)=> {
            const distance = getDistance(userLati, userLongi, school.latitude, school.longitude);
            return { ...school, distance};
        });

        schoolsWithDistance.sort((a,b)=> a.distance - b.distance);
        res.json(schoolsWithDistance);
    });
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

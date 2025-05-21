const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken'); // add this to top
// const JWT_SECRET = process.env.JWT_SECRET || 'devsecret'; // put in .env in prod

app.use(bodyParser.json());

// Connect to Supabase Postgres
const pool = new Pool({
    connectionString: process.env.REACT_APP_SUPABASE_URL, // or use individual env vars for host/user/pass/db
    ssl: { rejectUnauthorized: false } // Required for Supabase
});

// ROUTES //

// CREATE PROFILE (POST /api/register)
app.post('/api/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    try {
      // Check if user exists
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: 'User already exists' });
      }
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Insert user
      const result = await pool.query(
        `INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at`,
        [email, hashedPassword, name]
      );
      res.status(201).json({ message: 'User registered', user: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
});

// LOG INTO PROFILE (POST /api/login)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userQuery.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Get user's itineraries
    const itinerariesQuery = await pool.query(
      `SELECT * FROM itineraries WHERE user_id = $1`, [user.id]
    );
    const itineraries = itinerariesQuery.rows;

    // Get all places for these itineraries
    // const itineraryIds = itineraries.map(i => i.id);
    // let places = [];
    // if (itineraryIds.length > 0) {
    //   const placesQuery = await pool.query(
    //     `SELECT * FROM places WHERE itinerary_id = ANY($1) ORDER BY order_index ASC`,
    //     [itineraryIds]
    //   );
    //   places = placesQuery.rows;
    // }

    // JWT token (optional)
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Response
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      itineraries
      // places
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET PLACES FOR SPECIFIC ITINERARY (GET /api/itinerary/:id)
app.get('/api/itineraries/:itineraryId/places', async (req, res) => {
  const itineraryId = parseInt(req.params.itineraryId, 10);

  if (!itineraryId) {
    return res.status(400).json({ error: 'Invalid itinerary ID' });
  }

  try {
    const placesQuery = await pool.query(
      `
      SELECT 
        id, itinerary_id, place_id, name, address, lat, lng,
        order_index, visit_date, start_time, end_time, added_at
      FROM places
      WHERE itinerary_id = $1
      ORDER BY order_index ASC
      `,
      [itineraryId]
    );

    res.json({ places: placesQuery.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET ITINERARIES FOR EXPLORE PAGE/TAB (POST /api/itineraries/popular
app.get('/api/itineraries/popular', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Optional query param ?limit=5

  try {
    const query = await pool.query(
      `
      SELECT 
        itineraries.*, users.name AS user_name
      FROM itineraries
      JOIN users ON itineraries.user_id = users.id
      ORDER BY view_count DESC NULLS LAST
      LIMIT $1
      `,
      [limit]
    );

    res.json({ itineraries: query.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// LOG ITINERARY TO USER'S ACCOUNT
app.post('/api/itineraries', async (req, res) => {
  const {
    user_id,
    title,
    description,
    destinations,
    places // array of place objects with time slot info
  } = req.body;

  if (!user_id || !title || !Array.isArray(places)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insert itinerary
    const itineraryResult = await client.query(
      `
      INSERT INTO itineraries (user_id, title, description, destinations, view_count)
      VALUES ($1, $2, $3, $4, 0)
      RETURNING id
      `,
      [user_id, title, description, destinations]
    );
    const itineraryId = itineraryResult.rows[0].id;

    // 2. Insert places
    for (const [index, place] of places.entries()) {
      await client.query(
        `
        INSERT INTO places (
          itinerary_id, place_id, name, address, lat, lng,
          order_index, visit_date, start_time, end_time
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [
          itineraryId,
          place.place_id,
          place.name,
          place.address,
          place.lat,
          place.lng,
          index,
          place.visit_date,
          place.start_time,
          place.end_time
        ]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Itinerary saved', itinerary_id: itineraryId });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});



app.listen(5000, () => console.log('Server on localhost 5000'));
// // THIS IS FOR DEPLOYMENT, IT MIGHT FAIL SINCE HARDCODING PORT WHICH IS NOT ALLOWED IN DEPLOYMENT SERVICES
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors'); // Add this import

const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from React app
  credentials: true
})); // Enable CORS for React app

// Connect to Supabase Postgres
let pool;

console.log('Using connection string method');
pool = new Pool({
  connectionString: process.env.SUPABASE_DATABASE_URL
});

// Test database connection with better error handling
pool.connect()
  .then((client) => {
    console.log('Connected to Supabase database successfully');
    client.release();
    
    // Test a simple query
    return pool.query('SELECT NOW()');
  })
  .then((result) => {
    console.log('Database query test successful:', result.rows[0]);
  })
  .catch(err => {
    console.error('Database connection error:', err.message);
    
    if (err.message.includes('ENOTFOUND')) {
      console.log('\nHostname issue - trying alternative connection...');
      
      // Try with individual parameters as backup
      const poolBackup = new Pool({
        host: 'db.tocxgxnkfxkgxkuygsvy.supabase.co',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: '5BXyQQLR2fUcM1qQ',
        ssl: { rejectUnauthorized: false }
      });
      
      poolBackup.connect()
        .then(() => console.log('Backup connection successful'))
        .catch(backupErr => console.error('Backup connection failed:', backupErr.message));
    }
  });

// ROUTES //

// CREATE PROFILE (POST /api/register)
app.post('/api/register', async (req, res) => {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
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
        
        res.status(201).json({ 
            message: 'User registered successfully', 
            user: result.rows[0] 
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();

// CORS middleware - MUST be first
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// JSON parser
app.use(express.json());

// Supabase client setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST') {
    console.log('Request body:', req.body);
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// Register route
app.post('/api/register', async (req, res) => {
  console.log('=== REGISTRATION REQUEST STARTED ===');
  console.log('Request body:', req.body);
  
  const { email, password, name } = req.body;

  // Validation
  if (!email || !password || !name) {
    console.log('❌ Validation failed: missing fields');
    return res.status(400).json({ 
      error: 'Name, email and password are required' 
    });
  }

  if (password.length < 6) {
    console.log('❌ Validation failed: password too short');
    return res.status(400).json({ 
      error: 'Password must be at least 6 characters long' 
    });
  }

  try {
    console.log('✅ Validation passed, checking if user exists...');
    
    // Check if user exists
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('❌ Error checking existing user:', selectError);
      throw selectError;
    }

    if (existingUser) {
      console.log('❌ User already exists');
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    console.log('✅ User does not exist, hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('✅ Password hashed, inserting user...');
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ 
        email: email.toLowerCase(), 
        password: hashedPassword, 
        name: name.trim()
      }])
      .select('id, email, name, created_at')
      .single();

    if (insertError) {
      console.error('❌ Insert error:', insertError);
      throw insertError;
    }

    console.log('✅ SUCCESS! New user registered:', newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        created_at: newUser.created_at
      }
    });
  } catch (err) {
    console.error('❌ Registration error:', err);
    
    if (err.code === '23505') {
      return res.status(409).json({ error: 'User already exists with this email' });
    }
    
    res.status(500).json({ 
      error: 'Server error occurred during registration',
      details: err.message
    });
  }
  
  console.log('=== REGISTRATION REQUEST ENDED ===');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Server starting...');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log('✅ CORS enabled for http://localhost:3000');
});

// import express from 'express';

// const app = express();
// const port = process.env.PORT || 4000;

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// app.listen(port, (error) => {
//   if (error) {
//     console.error("Error starting server:", error);
//   }
//   return console.log(`Server is running on http://localhost:${port}`);
// });

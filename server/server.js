import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();

// // CORS middleware - MUST be first
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
  
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });
// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://main.d2pulh1w6d2zy1.amplifyapp.com' 
];

// CORS config
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., curl or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Use CORS middleware
app.use(cors(corsOptions));

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
  
  const { email, password, username } = req.body;

  // Validation
  if (!email || !password || !username) {
    console.log('Validation failed: missing fields');
    return res.status(400).json({ 
      error: 'Username, email and password are required' 
    });
  }

  if (password.length < 6) {
    console.log('Validation failed: password too short');
    return res.status(400).json({ 
      error: 'Password must be at least 6 characters long' 
    });
  }

  try {
    console.log('Validation passed, checking if user exists...');
    
    // Check if user exists
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking existing user:', selectError);
      throw selectError;
    }

    if (existingUser) {
      console.log('User already exists');
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    console.log('User does not exist, hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Password hashed, inserting user...');
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ 
        email: email.toLowerCase(), 
        password: hashedPassword, 
        username: username.trim()
      }])
      .select('id, email, username, created_at')
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    console.log('SUCCESS! New user registered:', newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        created_at: newUser.created_at
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    
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

// Log in route
app.post('/api/login', async (req, res) => {
  console.log('=== LOGIN REQUEST STARTED ===');
  console.log('Request body:', req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, email, username, password')
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError || !user) {
      console.error('User fetch error or user not found:', fetchError);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Strip out the password before sending
    const { password: _, ...userWithoutPassword } = user;

    console.log('Login successful for:', userWithoutPassword);
    res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login', details: err.message });
  }

  console.log('=== LOGIN REQUEST ENDED ===');
});

// Get all itineraries in the database from all users route
app.get('/api/itineraries/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Error fetching itineraries:', err.message);
    res.status(500).json({ error: 'Failed to fetch itineraries' });
  }
});

// Create itineary route
app.post('/api/itineraries', async (req, res) => {
  const { user_id, title, description, location_lat, location_long } = req.body; 

  if (!user_id || !title) {
    return res.status(400).json({ error: 'User ID and title are required' });
  }

  try {
    const { data, error } = await supabase
      .from('itineraries')
      .insert([{ user_id, title, description, location_lat, location_long }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Error creating itinerary:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Save calendar events(place) to an itinerary route
app.post('/api/itineraries/:itineraryId/places', async (req, res) => {
  const { itineraryId } = req.params;
  const { events } = req.body;

  if (!Array.isArray(events)) {
    return res.status(400).json({ error: 'Events must be an array' });
  }

  try {
    const formattedPlaces = events.map(event => ({
      itinerary_id: parseInt(itineraryId),
      place_id: event.placeId,
      name: event.place?.name,
      address: event.place?.address,
      lat: event.place?.lat,
      lng: event.place?.lng,
      order_index: event.timeIndex,
      visit_date: new Date(event.date).toISOString().split('T')[0],
      start_time: `${event.startHour}:00:00`,
      end_time: `${event.endHour}:00:00`,
      category: event.place?.category || 'other'
    }));

    const { data, error } = await supabase
      .from('places')
      .insert(formattedPlaces)
      .select();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error('Error saving events:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get all itineraries for a user route
app.get('/api/users/:userId/itineraries', async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Error fetching itineraries:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get a specific itinerary with places route
app.get('/api/itineraries/:itineraryId', async (req, res) => {
  const { itineraryId } = req.params;

  try {
    const { data, error } = await supabase
      .from('itineraries')
      .select('*, places(*)')
      .eq('id', itineraryId)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching itinerary:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Server starting...');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log('✅ CORS enabled for http://localhost:3000');
});

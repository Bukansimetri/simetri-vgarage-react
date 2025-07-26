const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

require('dotenv').config();

const app = express();

// =============================================
// ENHANCED CORS CONFIGURATION
// =============================================
const allowedOrigins = [
  'https://simetri-vgarage-react.onrender.com',
  'http://localhost:3000' // For local development
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Middleware for JSON parsing
app.use(express.json());


// =============================================
// KONEKSI DATABASE POSTGRESQL
// =============================================
const poolConfig = {
  connectionString: 'postgresql://root:8Hn9rAqtyTQS6edKlffgFLp2VkzF1HzK@dpg-d215quemcj7s73efs7ug-a/db_vgarage',
  ssl: {
    rejectUnauthorized: false,
  },
  // Connection pool settings
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000 // how long to try to connect before timing out
};

const pool = new Pool(poolConfig);

// Test database connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.stack);
  } else {
    console.log('✅ Connected to database successfully');
    release();
  }
});

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ Fatal Error: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.EMAIL_PASS,
  },
});

// =============================================
// ENHANCED ROUTES WITH COMPREHENSIVE ERROR HANDLING
// =============================================
// Health check endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({ 
      status: 'DB OK',
      current_time: result.rows[0].current_time,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    console.error('Database health check failed:', err);
    res.status(500).json({ 
      status: 'DB Connection Failed',
      error: err.message 
    });
  }
});

// Deep database check endpoint
app.get('/api/deep-db-check', async (req, res) => {
  try {
    // Test 1: Basic connection
    const timeQuery = await pool.query('SELECT NOW() as current_time');
    
    // Test 2: Users table access
    const userQuery = await pool.query('SELECT COUNT(*) FROM users');
    
    // Test 3: Test write operation (with rollback)
    await pool.query('BEGIN');
    const testEmail = `test_${Date.now()}@test.com`;
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      ['Test User', testEmail, 'dummy']
    );
    await pool.query('ROLLBACK');
    
    res.json({
      status: 'DB Fully Operational',
      currentTime: timeQuery.rows[0].current_time,
      userCount: userQuery.rows[0].count,
      database: poolConfig.connectionString.split('@')[1]?.split('/')[0] || 'unknown'
    });
  } catch (err) {
    console.error('Deep DB Check failed:', err);
    res.status(500).json({
      status: 'DB Check Failed',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Simple test endpoint for CORS debugging
app.post('/api/simple-test', (req, res) => {
  console.log('Simple test headers:', req.headers);
  console.log('Simple test body:', req.body);
  res.json({ 
    status: 'OK',
    headers: req.headers,
    body: req.body
  });
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Please fill out all fields.' });

  // Check if user exists
  const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userCheck.rows.length > 0)
    return res.status(409).json({ message: 'User already exists.' });

  // Hash password and insert
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
    [name, email, hashedPassword]
  );
  res.status(201).json({ message: 'User registered successfully!' });
});

// LOGIN endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Please enter both email and password.' });

  // Find user by email
  const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userResult.rows.length === 0)
    return res.status(401).json({ message: 'Invalid email or password.' });

  const user = userResult.rows[0];

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: 'Invalid email or password.' });

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Success: return token
  res.json({ message: 'Login successful!', token });
});

// Middleware to authenticate and extract user
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Use the middleware in your route
app.post('/api/vehicles', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const {
    name,
    current_mileage,
    last_service_km,
    service_interval_km,
    pajak_due
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO vehicles 
        (user_id, name, current_mileage, last_service_km, service_interval_km, pajak_due)
       VALUES 
        ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        name,
        current_mileage,
        last_service_km,
        service_interval_km,
        pajak_due // This should be a string in 'YYYY-MM-DD' format
      ]
    );
    res.status(201).json({ message: 'Vehicle registered successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering vehicle', error: err.message });
  }
});

app.get('/api/vehicles', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      'SELECT * FROM vehicles WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vehicles', error: err.message });
  }
});

app.get('/api/vehicles/:id', authenticateToken, async (req, res) => {
  const id = Number(req.params.id); // Ensure id is a number
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      'SELECT * FROM vehicles WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vehicle', error: err.message });
  }
});

app.put('/api/vehicles/:id', authenticateToken, async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.user.userId;
  const {
    name,
    current_mileage,
    last_service_km,
    service_interval_km,
    pajak_due
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE vehicles SET
        name = $1,
        current_mileage = $2,
        last_service_km = $3,
        service_interval_km = $4,
        pajak_due = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *`,
      [
        name,
        current_mileage,
        last_service_km,
        service_interval_km,
        pajak_due,
        id,
        userId
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found or not authorized' });
    }
    res.json({ message: 'Vehicle updated successfully', vehicle: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error updating vehicle', error: err.message });
  }
});

app.delete('/api/vehicles/:id', authenticateToken, async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.user.userId;
  console.log('Attempting to delete vehicle', { id, userId });
  try {
    const result = await pool.query(
      'DELETE FROM vehicles WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting vehicle', error: err.message });
  }
});

app.post('/api/logout', authenticateToken, (req, res) => {
  // For stateless JWT, just respond OK. You can add logging or blacklisting here if needed.
  res.json({ message: 'Logged out successfully!' });
});

app.post('/api/ai-chat', async (req, res) => {
  const { messages } = req.body;
  try {
    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ reply: openaiRes.data.choices[0].message.content.trim() });
  } catch (err) {
    console.error('AI error:', err.response?.data || err.message);
    res.status(500).json({ error: 'AI backend error', detail: err.message });
  }
});

// Function to send notification email
async function sendNotificationEmail(to, subject, text) {
  await transporter.sendMail({
    from: process.env.EMAIL_ADMIN,
    to,
    subject,
    text,
  });
}

// Example endpoint to trigger notification and email
app.post('/api/notify', authenticateToken, async (req, res) => {
  const { notificationText } = req.body;
  try {
    // Get user ID from JWT (set by authenticateToken middleware)
    const userId = req.user.userId; 

    // Fetch user email from PostgreSQL
    const result = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    if (!user || !user.email) {
      return res.status(404).json({ message: 'User or email not found' });
    }

    await sendNotificationEmail(
      user.email,
      'You have a new notification',
      notificationText
    );

    res.json({ message: 'Notification sent and email delivered!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send notification/email', error: err.message });
  }
});

// Endpoint to request password reset
app.post('/api/request-password-reset', async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'Email not found.' });

    // Generate token and expiry (1 hour)
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000);

    // Store token and expiry in DB
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
      [token, expires, user.id]
    );

    // Send email with reset link
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_ADMIN,
      to: email,
      subject: 'Password Reset',
      text: `Click this link to reset your password: ${resetLink}`,
    });

    res.json({ message: 'Password reset email sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending reset email.', error: err.message });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // Find user by token and check expiry
    const result = await pool.query(
      'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [hashed, user.id]
    );

    res.json({ message: 'Password has been reset.' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password.', error: err.message });
  }
});

// PATCH /api/vehicles/:id
app.patch('/api/vehicles/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { last_service_km, pajak_due } = req.body;
  try {
    // Build dynamic query based on provided fields
    const fields = [];
    const values = [];
    let idx = 1;

    if (last_service_km !== undefined) {
      fields.push(`last_service_km = $${idx++}`);
      values.push(last_service_km);
    }
    if (pajak_due !== undefined) {
      fields.push(`pajak_due = $${idx++}`);
      values.push(pajak_due);
    }
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }
    values.push(id, userId);

    const query = `
      UPDATE vehicles SET ${fields.join(', ')}
      WHERE id = $${idx++} AND user_id = $${idx}
      RETURNING *
    `;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found or not authorized' });
    }
    res.json({ message: 'Vehicle updated after notification.', vehicle: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update vehicle.', error: err.message });
  }
});

// =============================================
// ERROR HANDLING MIDDLEWARE
// =============================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// =============================================
// SERVER STARTUP
// =============================================
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔭 Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`🔑 JWT secret: ${JWT_SECRET ? 'exists' : 'missing'}`);
  console.log(`📧 Email configured: ${transporter.options.auth.user ? 'yes' : 'no'}`);
});

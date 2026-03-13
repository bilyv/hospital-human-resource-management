require('dotenv').config();
const express = require('express');
const session = require('express-session');

const db = require('./db');
const authRoutes = require('./routes/auth');
const staffRoutes = require('./routes/staff');
const metaRoutes = require('./routes/meta');

const { initializeDatabase } = require('./utils/dbInit');

const app = express();

app.use(express.json());

app.use(
  session({
    name: 'hrms.sid',
    secret: process.env.SESSION_SECRET || 'change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

app.get('/', (req, res) => {
  res.json({ status: 'HRMS backend running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/meta', metaRoutes);

const startServer = async () => {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log('');
      console.log('╔════════════════════════════════════════╗');
      console.log('║   HRMS Backend Server Started          ║');
      console.log('╠════════════════════════════════════════╣');
      console.log(`║ ✓ Server running on port ${port}`.padEnd(42) + '║');
      console.log(`║ ✓ Database connected & initialized     `.padEnd(42) + '║');
      console.log('╚════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

startServer();
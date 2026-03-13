const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT UserID, EmployeeID, Username, Password FROM users WHERE Username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.Password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    req.session.user = {
      userId: user.UserID,
      employeeId: user.EmployeeID,
      username: user.Username
    };

    return res.json({
      userId: user.UserID,
      employeeId: user.EmployeeID,
      username: user.Username
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('hrms.sid');
    return res.json({ message: 'Logged out.' });
  });
});

router.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json(req.session.user);
  }
  return res.status(401).json({ message: 'Unauthorized' });
});

module.exports = router;
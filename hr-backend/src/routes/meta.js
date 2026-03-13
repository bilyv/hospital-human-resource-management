const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/departments', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DepId, DepName FROM department ORDER BY DepName');
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/posts', requireAuth, async (req, res) => {
  const { departmentId } = req.query || {};
  const params = [];
  let sql = 'SELECT PostID, PostTitle, DepId FROM post';

  if (departmentId) {
    sql += ' WHERE DepId = ?';
    params.push(departmentId);
  }

  sql += ' ORDER BY PostTitle';

  try {
    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
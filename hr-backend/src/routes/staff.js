const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const { departmentId, postId, hireStart, hireEnd, q } = req.query || {};
  const filters = [];
  const params = [];

  if (departmentId) {
    filters.push('d.DepId = ?');
    params.push(departmentId);
  }

  if (postId) {
    filters.push('p.PostID = ?');
    params.push(postId);
  }

  if (hireStart) {
    filters.push('r.HireDate >= ?');
    params.push(hireStart);
  }

  if (hireEnd) {
    filters.push('r.HireDate <= ?');
    params.push(hireEnd);
  }

  if (q) {
    filters.push('(s.FirstName LIKE ? OR s.LastName LIKE ? OR s.Email LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  try {
    const [rows] = await pool.query(
      `SELECT
        s.EmployeeID,
        s.FirstName,
        s.LastName,
        s.Gender,
        s.DOB,
        s.Email,
        s.Phone,
        s.Address,
        p.PostID,
        p.PostTitle,
        d.DepId,
        d.DepName,
        r.RecId,
        r.HireDate,
        r.Salary,
        r.Status
      FROM staff s
      LEFT JOIN post p ON s.PostID = p.PostID
      LEFT JOIN department d ON p.DepId = d.DepId
      LEFT JOIN recruitment r ON r.EmployeeID = s.EmployeeID
      ${where}
      ORDER BY s.EmployeeID DESC`,
      params
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    dob,
    email,
    phone,
    address,
    postId,
    hireDate,
    salary,
    status
  } = req.body || {};

  if (!firstName || !lastName || !postId) {
    return res.status(400).json({ message: 'First name, last name, and post are required.' });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [staffResult] = await conn.query(
      `INSERT INTO staff
        (PostID, FirstName, LastName, Gender, DOB, Email, Phone, Address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [postId, firstName, lastName, gender || null, dob || null, email || null, phone || null, address || null]
    );

    const employeeId = staffResult.insertId;

    if (hireDate || salary || status) {
      await conn.query(
        `INSERT INTO recruitment
          (EmployeeID, HireDate, Salary, Status)
         VALUES (?, ?, ?, ?)`,
        [employeeId, hireDate || null, salary || null, status || null]
      );
    }

    await conn.commit();
    return res.status(201).json({ EmployeeID: employeeId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  } finally {
    conn.release();
  }
});

router.put('/:employeeId', requireAuth, async (req, res) => {
  const { employeeId } = req.params;
  const {
    firstName,
    lastName,
    gender,
    dob,
    email,
    phone,
    address,
    postId,
    hireDate,
    salary,
    status
  } = req.body || {};

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE staff
       SET PostID = ?, FirstName = ?, LastName = ?, Gender = ?, DOB = ?, Email = ?, Phone = ?, Address = ?
       WHERE EmployeeID = ?`,
      [postId, firstName, lastName, gender || null, dob || null, email || null, phone || null, address || null, employeeId]
    );

    const [recRows] = await conn.query(
      'SELECT RecId FROM recruitment WHERE EmployeeID = ?',
      [employeeId]
    );

    if (recRows.length === 0) {
      if (hireDate || salary || status) {
        await conn.query(
          `INSERT INTO recruitment
            (EmployeeID, HireDate, Salary, Status)
           VALUES (?, ?, ?, ?)`,
          [employeeId, hireDate || null, salary || null, status || null]
        );
      }
    } else {
      await conn.query(
        `UPDATE recruitment
         SET HireDate = ?, Salary = ?, Status = ?
         WHERE EmployeeID = ?`,
        [hireDate || null, salary || null, status || null, employeeId]
      );
    }

    await conn.commit();
    return res.json({ message: 'Updated.' });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  } finally {
    conn.release();
  }
});

router.delete('/:employeeId', requireAuth, async (req, res) => {
  const { employeeId } = req.params;

  try {
    await pool.query('DELETE FROM staff WHERE EmployeeID = ?', [employeeId]);
    return res.json({ message: 'Deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
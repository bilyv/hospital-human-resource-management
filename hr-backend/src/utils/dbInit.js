const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const DEFAULTS = {
  username: process.env.SETUP_ADMIN_USERNAME || 'admin',
  password: process.env.SETUP_ADMIN_PASSWORD || 'admin123',
  firstName: process.env.SETUP_ADMIN_FIRSTNAME || 'System',
  lastName: process.env.SETUP_ADMIN_LASTNAME || 'Admin',
  email: process.env.SETUP_ADMIN_EMAIL || 'admin@stluke.local',
  postId: process.env.SETUP_ADMIN_POSTID || 1
};

async function ensureDatabase() {
  const rootConn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });

  await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  await rootConn.end();
}

async function runSchema() {
  const schemaPath = path.join(__dirname, '..', '..', 'db', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  await conn.query(sql);
  await conn.end();
}

async function ensureDefaultUser() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Skip if admin user already exists
  const [existingUsers] = await conn.query(
    'SELECT UserID FROM users WHERE Username = ? LIMIT 1',
    [DEFAULTS.username]
  );
  if (existingUsers.length > 0) {
    await conn.end();
    return;
  }

  // Ensure there is at least one post to link the admin staff record to
  let postId = DEFAULTS.postId;
  const [postRows] = await conn.query('SELECT PostID FROM post WHERE PostID = ? LIMIT 1', [postId]);

  if (postRows.length === 0) {
    // Create a bootstrap department and post for the initial admin
    const [depResult] = await conn.query(
      'INSERT INTO department (DepName) VALUES (?)',
      ['Administration']
    );
    const depId = depResult.insertId;

    const [postResult] = await conn.query(
      'INSERT INTO post (DepId, PostTitle) VALUES (?, ?)',
      [depId, 'System Admin']
    );
    postId = postResult.insertId;
  }

  // Create staff record for admin
  const [staffRows] = await conn.query(
    'SELECT EmployeeID FROM staff WHERE Email = ? LIMIT 1',
    [DEFAULTS.email]
  );

  let employeeId = staffRows[0]?.EmployeeID;
  if (!employeeId) {
    const [staffResult] = await conn.query(
      `INSERT INTO staff
        (PostID, FirstName, LastName, Gender, DOB, Email, Phone, Address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [postId, DEFAULTS.firstName, DEFAULTS.lastName, 'Other', null, DEFAULTS.email, null, 'HQ']
    );
    employeeId = staffResult.insertId;

    await conn.query(
      `INSERT INTO recruitment (EmployeeID, HireDate, Salary, Status) VALUES (?, CURDATE(), ?, ?)`,
      [employeeId, 0, 'Active']
    );
  }

  // Create the admin user login
  const hashed = await bcrypt.hash(DEFAULTS.password, 10);
  await conn.query(
    'INSERT INTO users (EmployeeID, Username, Password) VALUES (?, ?, ?)',
    [employeeId, DEFAULTS.username, hashed]
  );

  await conn.end();
}

async function initializeDatabase() {
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    throw new Error('Missing DB configuration in .env');
  }

  await ensureDatabase();
  await runSchema();
  await ensureDefaultUser();
}

module.exports = { initializeDatabase };

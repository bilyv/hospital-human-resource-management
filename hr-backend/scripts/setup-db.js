const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

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
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
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

  const [existingUsers] = await conn.query(
    'SELECT UserID FROM users WHERE Username = ? LIMIT 1',
    [DEFAULTS.username]
  );

  if (existingUsers.length > 0) {
    await conn.end();
    console.log('Default user already exists.');
    return;
  }

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
      [
        DEFAULTS.postId,
        DEFAULTS.firstName,
        DEFAULTS.lastName,
        'Other',
        null,
        DEFAULTS.email,
        null,
        'HQ'
      ]
    );
    employeeId = staffResult.insertId;

    await conn.query(
      `INSERT INTO recruitment
        (EmployeeID, HireDate, Salary, Status)
       VALUES (?, CURDATE(), ?, ?)`,
      [employeeId, 0, 'Active']
    );
  }

  const hashed = await bcrypt.hash(DEFAULTS.password, 10);
  await conn.query(
    'INSERT INTO users (EmployeeID, Username, Password) VALUES (?, ?, ?)',
    [employeeId, DEFAULTS.username, hashed]
  );

  await conn.end();
  console.log('Default user created.');
}

async function main() {
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    console.error('Missing DB configuration in .env');
    process.exit(1);
  }

  await ensureDatabase();
  await runSchema();
  await ensureDefaultUser();
  console.log('Setup complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
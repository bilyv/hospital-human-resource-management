require('dotenv').config({ path: 'c:/Users/K  BRIAN/Documents/Playground/hrms-codebase/hr-backend/.env' });
const mysql = require('mysql2/promise');

async function check() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Database connected.');
    
    const [users] = await conn.query('SELECT UserID, EmployeeID, Username FROM users');
    console.log('Users in DB:', users);

    const [staff] = await conn.query('SELECT * FROM staff');
    console.log('Staff in DB Count:', staff.length);

    await conn.end();
  } catch (err) {
    console.error('Check failed:', err);
  }
}

check();

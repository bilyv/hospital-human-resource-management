# HRMS Backend (Node.js + Express)

## Setup
1. Install dependencies:
   - `npm.cmd install`
2. Create `.env` from `.env.example`.
3. Run database setup:
   - `npm.cmd run setup`
4. Start server:
   - `npm.cmd run dev`

Backend runs on `http://localhost:5001`.

## Default User
The setup script creates a default admin user using `.env` values:
- `SETUP_ADMIN_USERNAME` (default `admin`)
- `SETUP_ADMIN_PASSWORD` (default `admin123`)

## API
Auth:
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Staff:
- `GET /api/staff`
- `POST /api/staff`
- `PUT /api/staff/:employeeId`
- `DELETE /api/staff/:employeeId`

Meta:
- `GET /api/meta/departments`
- `GET /api/meta/posts?departmentId=`

## Notes
The schema adds `DepId` to `post` and `EmployeeID` to `recruitment` to enable department filtering and hire-date filtering.
The setup script creates the database if missing, runs the schema, and inserts a default admin user.
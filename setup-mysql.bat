@echo off
REM XAMPP MySQL Database Setup Script
REM This script imports the HRMS database schema into MySQL

setlocal enabledelayedexpansion

REM Set XAMPP MySQL path (adjust if XAMPP is installed in a different location)
set XAMPP_PATH=C:\xampp
set MYSQL_BIN=%XAMPP_PATH%\mysql\bin
set SCHEMA_FILE=%cd%\hr-backend\db\schema.sql

echo.
echo ========================================
echo   XAMPP MySQL Database Setup
echo ========================================
echo.

REM Check if XAMPP MySQL directory exists
if not exist "%MYSQL_BIN%" (
    echo [ERROR] XAMPP MySQL not found at %MYSQL_BIN%
    echo Please verify XAMPP is installed at C:\xampp
    echo Or edit this script to set the correct XAMPP_PATH
    pause
    exit /b 1
)

REM Check if schema file exists
if not exist "%SCHEMA_FILE%" (
    echo [ERROR] Schema file not found at %SCHEMA_FILE%
    pause
    exit /b 1
)

echo [INFO] XAMPP Path: %XAMPP_PATH%
echo [INFO] MySQL Binary: %MYSQL_BIN%
echo [INFO] Schema File: %SCHEMA_FILE%
echo.

REM Import the database
echo [PROCESS] Importing database schema...
echo.

"%MYSQL_BIN%\mysql.exe" -u root < "%SCHEMA_FILE%"

if errorlevel 1 (
    echo.
    echo [ERROR] Database import failed!
    echo.
    echo Possible issues:
    echo - MySQL service is not running (start it from XAMPP Control Panel)
    echo - File permissions issue
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo [SUCCESS] Database imported successfully!
echo ========================================
echo.
echo The HRMS database has been created with:
echo   - department table
echo   - post table
echo   - staff table
echo   - recruitment table
echo   - users table
echo.
echo You can now access it via:
echo   - phpMyAdmin: http://localhost/phpmyadmin
echo   - MySQL command: mysql -u root
echo.
pause

@echo off
title Football Dashboard - Install Dependencies

echo Football Dashboard - Installing Dependencies
echo ===============================================

echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION%

echo.
echo Installing dependencies with faster mirror...
npm config set registry https://registry.npmmirror.com
npm install

if %errorlevel% neq 0 (
    echo.
    echo Installation failed. Trying to fix...
    npm cache clean --force
    npm install
    
    if %errorlevel% neq 0 (
        echo Installation still failed. Please check your network connection.
        pause
        exit /b 1
    )
)

echo.
echo SUCCESS: Dependencies installed!
echo.
echo Next steps:
echo 1. Double-click start.bat to run the server
echo 2. Open browser and go to: http://localhost:12000
echo.

pause
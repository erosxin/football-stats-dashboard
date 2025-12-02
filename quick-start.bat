@echo off
chcp 65001 >nul
title 足球数据展示平台 - 快速启动

echo ⚽ 足球数据展示平台 - 快速部署
echo ==================================

REM 检查Node.js
echo 🔍 检查系统环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未找到 Node.js，请先安装 Node.js
    echo 📥 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%

REM 检查npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未找到 npm
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm 版本: %NPM_VERSION%

REM 安装依赖
echo.
echo 📦 安装项目依赖...
npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✅ 依赖安装成功

REM 启动服务器
echo.
echo 🚀 启动服务器...
echo 📍 访问地址: http://localhost:12000
echo ⏹️  停止服务: 按 Ctrl+C
echo.

npm start
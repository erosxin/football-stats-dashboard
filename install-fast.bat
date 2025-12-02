@echo off
chcp 65001 >nul
title 足球数据展示平台 - 快速安装

echo ⚽ 足球数据展示平台 - 快速安装依赖
echo =====================================

REM 检查Node.js
echo 🔍 检查Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未找到 Node.js，请先安装 Node.js
    echo 📥 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%

REM 使用淘宝镜像加速安装
echo.
echo 📦 使用淘宝镜像快速安装依赖...
echo 🚀 这将大大加快安装速度...

REM 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

REM 安装依赖
npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ 安装失败，尝试清除缓存后重新安装...
    npm cache clean --force
    npm install
    
    if %errorlevel% neq 0 (
        echo ❌ 安装仍然失败，请检查网络连接
        pause
        exit /b 1
    )
)

echo.
echo ✅ 依赖安装成功！
echo.
echo 🚀 现在可以启动服务器了：
echo    方法1: 双击 quick-start.bat
echo    方法2: 在命令行运行 npm start
echo.
echo 📍 启动后访问: http://localhost:12000
echo.

pause
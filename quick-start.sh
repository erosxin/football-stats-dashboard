#!/bin/bash

# 🚀 足球数据展示平台 - 快速启动脚本
# 适用于 macOS 和 Linux

echo "⚽ 足球数据展示平台 - 快速部署"
echo "=================================="

# 检查Node.js
echo "🔍 检查系统环境..."
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js"
    echo "📥 下载地址: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js 版本: $NODE_VERSION"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未找到 npm"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm 版本: $NPM_VERSION"

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
if npm install; then
    echo "✅ 依赖安装成功"
else
    echo "❌ 依赖安装失败"
    exit 1
fi

# 启动服务器
echo ""
echo "🚀 启动服务器..."
echo "📍 访问地址: http://localhost:12000"
echo "⏹️  停止服务: 按 Ctrl+C"
echo ""

npm start
# 🏠 本地部署完整版本指南

## 📋 系统要求

### 必需软件
- **Node.js** 14.0+ (推荐 18.0+)
- **npm** 6.0+ (随Node.js安装)
- **Git** (用于克隆代码)

### 检查安装状态
```bash
# 检查Node.js版本
node --version

# 检查npm版本
npm --version

# 检查Git版本
git --version
```

## 🔽 步骤1: 下载项目代码

### 方法1: 使用Git克隆 (推荐)
```bash
# 克隆仓库到本地
git clone https://github.com/erosxin/football-stats-dashboard.git

# 进入项目目录
cd football-stats-dashboard
```

### 方法2: 直接下载ZIP
1. 访问 https://github.com/erosxin/football-stats-dashboard
2. 点击绿色的 "Code" 按钮
3. 选择 "Download ZIP"
4. 解压到您想要的目录
5. 在终端中进入解压后的目录

## 📦 步骤2: 安装项目依赖

```bash
# 安装所有必需的依赖包
npm install
```

这将安装以下依赖：
- `express` - Web服务器框架
- `cors` - 跨域资源共享
- `axios` - HTTP客户端
- `vite` - 开发工具

## 🔑 步骤3: 配置API密钥 (可选)

项目已经预配置了API密钥，但您也可以使用自己的：

### 方法1: 修改配置文件
编辑 `server.js` 文件，找到这一行：
```javascript
API_KEY: '6c109863f19aa00ae6259be0d1b60d715410f55d6335d5401916fcc5120911ed'
```
替换为您自己的API密钥。

### 方法2: 使用环境变量
创建 `.env` 文件：
```bash
# 创建环境变量文件
echo "FOOTYSTATS_API_KEY=您的API密钥" > .env
```

## 🚀 步骤4: 启动服务器

```bash
# 启动开发服务器
npm start
```

您应该看到类似的输出：
```
🚀 足球数据展示平台启动成功!
📍 本地访问: http://localhost:12000
📍 网络访问: http://192.168.x.x:12000
🔗 API状态: 已连接 Footystats
⚽ 支持联赛: 1700+
📊 今日比赛: 实时更新
```

## 🌐 步骤5: 访问应用

打开浏览器，访问：
- **本地地址**: http://localhost:12000
- **网络地址**: http://您的IP:12000 (局域网内其他设备可访问)

## 🎯 功能验证

访问以下URL验证功能：

### 主要页面
- **首页**: http://localhost:12000
- **健康检查**: http://localhost:12000/health

### API端点
- **联赛列表**: http://localhost:12000/api/leagues
- **今日比赛**: http://localhost:12000/api/matches/today
- **指定联赛比赛**: http://localhost:12000/api/matches/today?league=英超

## 🔧 常见问题解决

### 问题1: 端口被占用
```bash
# 错误信息: Error: listen EADDRINUSE :::12000
# 解决方案: 修改端口
PORT=3000 npm start
```

### 问题2: API连接失败
```bash
# 检查网络连接
curl https://api.footystats.org/league-list?key=您的API密钥

# 或在浏览器中访问
http://localhost:12000/health
```

### 问题3: 依赖安装失败
```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题4: Node.js版本过低
```bash
# 使用nvm管理Node.js版本 (推荐)
# 安装nvm: https://github.com/nvm-sh/nvm

# 安装并使用最新LTS版本
nvm install --lts
nvm use --lts
```

## 🎨 开发模式

如果您想修改代码并实时查看效果：

```bash
# 启动开发模式 (自动重启)
npm run dev
```

## 📱 移动端访问

要在手机上访问：

1. **确保手机和电脑在同一WiFi网络**
2. **查找电脑IP地址**:
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```
3. **在手机浏览器访问**: http://您的电脑IP:12000

## 🔒 生产环境部署

如果要部署到生产环境：

```bash
# 设置生产环境
NODE_ENV=production npm start

# 或使用PM2管理进程
npm install -g pm2
pm2 start server.js --name "football-dashboard"
```

## 📊 性能监控

访问以下URL查看系统状态：
- **健康检查**: http://localhost:12000/health
- **API状态**: 查看控制台输出

## 🎉 成功标志

当您看到以下内容时，说明部署成功：

1. ✅ 服务器启动无错误
2. ✅ 浏览器能正常访问 http://localhost:12000
3. ✅ 页面显示真实的比赛数据
4. ✅ 三个标签页都能正常切换
5. ✅ API状态显示"已连接"

## 🆘 获取帮助

如果遇到问题：

1. **查看控制台输出** - 通常会显示错误信息
2. **检查浏览器开发者工具** - F12打开，查看Network和Console
3. **验证API密钥** - 确保密钥有效且有剩余配额
4. **检查网络连接** - 确保能访问外网

---

**🎯 部署完成后，您将拥有一个功能完整的足球数据展示平台！**

**📊 实时数据**: 1700+联赛，今日比赛，球队统计  
**🎨 现代界面**: 响应式设计，流畅动画  
**⚡ 高性能**: 快速加载，实时更新  
**📱 全平台**: 支持桌面、平板、手机访问
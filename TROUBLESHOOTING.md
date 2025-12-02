# 🔧 故障排除指南

## 🐌 npm install 安装很慢的解决方案

### 方案1: 使用快速安装脚本 (推荐)
双击运行 `install-fast.bat`，这个脚本会：
- 自动使用淘宝镜像加速下载
- 自动处理安装失败的情况
- 显示详细的安装进度

### 方案2: 手动使用淘宝镜像
```cmd
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 安装依赖
npm install
```

### 方案3: 使用简化版package.json
如果安装仍然很慢：
```cmd
# 备份原文件
copy package.json package-backup.json

# 使用简化版
copy package-simple.json package.json

# 安装
npm install
```

### 方案4: 清除缓存重新安装
```cmd
# 清除npm缓存
npm cache clean --force

# 删除node_modules文件夹
rmdir /s node_modules

# 重新安装
npm install
```

## ⚡ 快速验证安装

安装完成后，运行以下命令验证：
```cmd
# 检查依赖是否正确安装
npm list --depth=0

# 应该显示：
# ├── axios@1.6.0
# ├── cors@2.8.5
# └── express@4.18.2
```

## 🚀 启动问题解决

### 问题1: 端口被占用
```cmd
# 使用其他端口
set PORT=3000 && npm start
```

### 问题2: 模块未找到
```cmd
# 重新安装依赖
npm install
```

### 问题3: API连接失败
- 检查网络连接
- 访问 http://localhost:12000/health 查看状态

## 📱 网络访问问题

### 手机无法访问
1. 确保电脑和手机在同一WiFi
2. 关闭Windows防火墙（临时）
3. 查找电脑IP：`ipconfig`
4. 访问：`http://电脑IP:12000`

## 🔍 调试信息

如果仍有问题，请提供以下信息：
```cmd
# 系统信息
node --version
npm --version
npm config get registry

# 错误日志
npm install --verbose
```

## 📞 常见错误代码

- **EADDRINUSE**: 端口被占用，换个端口
- **ENOTFOUND**: 网络连接问题
- **EACCES**: 权限问题，以管理员身份运行
- **ETIMEDOUT**: 网络超时，使用镜像源

## 🎯 最简单的解决方案

如果所有方法都不行：
1. 双击 `install-fast.bat`
2. 等待安装完成
3. 双击 `quick-start.bat`
4. 访问 http://localhost:12000

**99%的问题都能通过这个流程解决！**
# 足球数据展示平台

一个基于Footystats API的现代化足球数据展示网站，提供当日比赛信息、球队统计数据和联赛管理功能。

## 功能特性

- 📊 **今日比赛展示** - 显示当日所有比赛的基础信息
- ⚽ **详细统计数据** - 包括球队整体数据和最近6场比赛数据
- 🏆 **联赛管理** - 支持多联赛选择和过滤
- 🔧 **API配置** - 简单的API密钥管理界面
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🎨 **现代化UI** - 美观的用户界面和流畅的交互体验

## 数据来源

本项目使用 [Footystats API](https://footystats.org/api/) 获取足球数据，包括：

- 联赛和杯赛信息
- 比赛基础信息（球队名、时间等）
- 球队整体场均数据
- 球队最近6场比赛数据
- 进球、射门、控球率、角球等统计

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Node.js, Express.js
- **构建工具**: Vite
- **样式**: 原生CSS + Flexbox/Grid
- **图标**: Font Awesome
- **API**: Footystats REST API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
# 启动后端API服务器 (端口 12000)
npm start

# 或者启动前端开发服务器 (端口 12001)
npm run dev
```

### 3. 配置API密钥

1. 访问 [Footystats API](https://footystats.org/api/) 注册账户
2. 获取您的API密钥
3. 在网站的"设置"页面中输入API密钥
4. 保存后即可获取真实数据

## 项目结构

```
football-stats-dashboard/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 前端JavaScript
├── server.js           # 后端服务器
├── vite.config.js      # Vite配置
├── package.json        # 项目配置
└── README.md          # 项目说明
```

## API端点

### 后端API端点

- `GET /api/leagues` - 获取联赛列表
- `GET /api/matches/today` - 获取今日比赛
- `GET /api/teams/:id/stats` - 获取球队统计
- `POST /api/test-connection` - 测试API连接
- `GET /health` - 健康检查

### Footystats API端点（推测）

- `/v1/leagues` - 联赛列表
- `/v1/matches/today` - 今日比赛
- `/v1/teams/{id}/stats` - 球队统计
- `/v1/fixtures` - 赛程安排

## 功能说明

### 今日比赛

- 显示当日所有比赛信息
- 支持按联赛过滤
- 实时刷新数据
- 显示比赛时间和状态

### 球队数据

每场比赛显示两支球队的详细统计：

**整体数据**:
- 场均进球数
- 场均射门次数
- 平均控球率
- 场均角球数

**最近6场数据**:
- 近期表现趋势
- 状态分析指标

### 联赛管理

- 支持多个主流联赛
- 可选择关注的联赛
- 联赛信息本地存储

## 部署说明

### 生产环境部署

1. 构建项目：
```bash
npm run build
```

2. 启动生产服务器：
```bash
NODE_ENV=production npm start
```

### 环境变量

- `PORT` - 服务器端口（默认：12000）
- `NODE_ENV` - 环境模式（development/production）

## 注意事项

1. **API密钥安全**: 请妥善保管您的Footystats API密钥
2. **请求限制**: 注意API的请求频率限制
3. **数据更新**: 比赛数据会定期更新，建议适当缓存
4. **错误处理**: 当API不可用时，系统会自动使用模拟数据

## 模拟数据

在没有配置API密钥的情况下，系统会使用模拟数据进行演示，包括：

- 6个主流联赛（英超、西甲、德甲、意甲、法甲、欧冠）
- 3场示例比赛
- 完整的统计数据结构

## 浏览器支持

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 联系方式

如有问题或建议，请通过GitHub Issues联系。
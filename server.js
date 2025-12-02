const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 12000;

// 中间件
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('.'));

// Footystats API配置
const FOOTYSTATS_CONFIG = {
    BASE_URL: 'https://api.footystats.org',
    API_KEY: '6c109863f19aa00ae6259be0d1b60d715410f55d6335d5401916fcc5120911ed',
    // 基于实际测试的端点
    ENDPOINTS: {
        LEAGUES: '/league-list',
        MATCHES_TODAY: '/todays-matches',
        FIXTURES: '/fixtures',
        TEAM_STATS: '/team-stats'
    }
};

// 模拟数据 - 用于演示
const MOCK_DATA = {
    leagues: [
        { id: 1, name: '英超联赛', country: '英格兰', season: '2024-25' },
        { id: 2, name: '西甲联赛', country: '西班牙', season: '2024-25' },
        { id: 3, name: '德甲联赛', country: '德国', season: '2024-25' },
        { id: 4, name: '意甲联赛', country: '意大利', season: '2024-25' },
        { id: 5, name: '法甲联赛', country: '法国', season: '2024-25' },
        { id: 6, name: '欧冠联赛', country: '欧洲', season: '2024-25' }
    ],
    matches: [
        {
            id: 1,
            league: '英超联赛',
            homeTeam: '曼城',
            awayTeam: '利物浦',
            time: '22:00',
            date: new Date().toISOString().split('T')[0],
            status: 'scheduled',
            homeStats: {
                overall: { goals: 2.1, shots: 15.2, possession: 62.5, corners: 6.8 },
                last6: { goals: 2.3, shots: 16.1, possession: 64.2, corners: 7.2 }
            },
            awayStats: {
                overall: { goals: 1.9, shots: 13.8, possession: 58.3, corners: 5.9 },
                last6: { goals: 2.1, shots: 14.5, possession: 59.1, corners: 6.3 }
            }
        },
        {
            id: 2,
            league: '西甲联赛',
            homeTeam: '皇家马德里',
            awayTeam: '巴塞罗那',
            time: '04:00',
            date: new Date().toISOString().split('T')[0],
            status: 'scheduled',
            homeStats: {
                overall: { goals: 2.4, shots: 16.7, possession: 59.8, corners: 7.1 },
                last6: { goals: 2.6, shots: 17.3, possession: 61.2, corners: 7.5 }
            },
            awayStats: {
                overall: { goals: 2.2, shots: 15.4, possession: 63.1, corners: 6.4 },
                last6: { goals: 2.0, shots: 14.8, possession: 62.8, corners: 6.1 }
            }
        },
        {
            id: 3,
            league: '德甲联赛',
            homeTeam: '拜仁慕尼黑',
            awayTeam: '多特蒙德',
            time: '01:30',
            date: new Date().toISOString().split('T')[0],
            status: 'scheduled',
            homeStats: {
                overall: { goals: 2.8, shots: 18.3, possession: 65.2, corners: 8.1 },
                last6: { goals: 3.1, shots: 19.2, possession: 66.8, corners: 8.7 }
            },
            awayStats: {
                overall: { goals: 1.7, shots: 12.9, possession: 52.4, corners: 5.3 },
                last6: { goals: 1.9, shots: 13.6, possession: 54.1, corners: 5.8 }
            }
        }
    ]
};

// API代理中间件
async function proxyFootystatsAPI(endpoint, apiKey, params = {}) {
    try {
        const url = `${FOOTYSTATS_CONFIG.BASE_URL}${endpoint}`;
        
        // Footystats API使用key参数而不是Authorization header
        const queryParams = {
            key: apiKey,
            ...params
        };
        
        const response = await axios.get(url, {
            params: queryParams,
            timeout: 10000
        });
        
        return response.data;
    } catch (error) {
        console.error('Footystats API错误:', error.message);
        throw new Error(`API请求失败: ${error.response?.status || error.message}`);
    }
}

// 路由

// 主页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 获取联赛列表
app.get('/api/leagues', async (req, res) => {
    try {
        // 使用配置的API密钥或从请求头获取
        const apiKey = req.headers.authorization?.replace('Bearer ', '') || FOOTYSTATS_CONFIG.API_KEY;
        
        if (!apiKey) {
            // 返回模拟数据
            return res.json({
                success: true,
                data: MOCK_DATA.leagues,
                message: '使用模拟数据 - 请配置API密钥获取真实数据'
            });
        }
        
        // 尝试从真实API获取数据
        try {
            const data = await proxyFootystatsAPI(FOOTYSTATS_CONFIG.ENDPOINTS.LEAGUES, apiKey);
            res.json({
                success: true,
                data: data,
                message: '数据来自Footystats API'
            });
        } catch (apiError) {
            // API失败时回退到模拟数据
            res.json({
                success: true,
                data: MOCK_DATA.leagues,
                message: 'API请求失败，使用模拟数据',
                error: apiError.message
            });
        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '服务器错误',
            error: error.message
        });
    }
});

// 获取今日比赛
app.get('/api/matches/today', async (req, res) => {
    try {
        // 使用配置的API密钥或从请求头获取
        const apiKey = req.headers.authorization?.replace('Bearer ', '') || FOOTYSTATS_CONFIG.API_KEY;
        const league = req.query.league;
        
        if (!apiKey) {
            // 返回模拟数据
            let matches = MOCK_DATA.matches;
            if (league) {
                matches = matches.filter(match => match.league === league);
            }
            
            return res.json({
                success: true,
                data: matches,
                message: '使用模拟数据 - 请配置API密钥获取真实数据'
            });
        }
        
        // 尝试从真实API获取数据
        try {
            const params = {};
            if (league) params.league = league;
            
            const data = await proxyFootystatsAPI(FOOTYSTATS_CONFIG.ENDPOINTS.MATCHES_TODAY, apiKey, params);
            res.json({
                success: true,
                data: data,
                message: '数据来自Footystats API'
            });
        } catch (apiError) {
            // API失败时回退到模拟数据
            let matches = MOCK_DATA.matches;
            if (league) {
                matches = matches.filter(match => match.league === league);
            }
            
            res.json({
                success: true,
                data: matches,
                message: 'API请求失败，使用模拟数据',
                error: apiError.message
            });
        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '服务器错误',
            error: error.message
        });
    }
});

// 获取球队统计数据
app.get('/api/teams/:id/stats', async (req, res) => {
    try {
        const apiKey = req.headers.authorization?.replace('Bearer ', '');
        const teamId = req.params.id;
        
        if (!apiKey) {
            // 返回模拟数据
            const mockStats = {
                overall: { goals: 2.1, shots: 15.2, possession: 62.5, corners: 6.8 },
                last6: { goals: 2.3, shots: 16.1, possession: 64.2, corners: 7.2 }
            };
            
            return res.json({
                success: true,
                data: mockStats,
                message: '使用模拟数据 - 请配置API密钥获取真实数据'
            });
        }
        
        // 尝试从真实API获取数据
        try {
            const endpoint = FOOTYSTATS_CONFIG.ENDPOINTS.TEAM_STATS.replace('{id}', teamId);
            const data = await proxyFootystatsAPI(endpoint, apiKey);
            res.json({
                success: true,
                data: data,
                message: '数据来自Footystats API'
            });
        } catch (apiError) {
            // API失败时回退到模拟数据
            const mockStats = {
                overall: { goals: 2.1, shots: 15.2, possession: 62.5, corners: 6.8 },
                last6: { goals: 2.3, shots: 16.1, possession: 64.2, corners: 7.2 }
            };
            
            res.json({
                success: true,
                data: mockStats,
                message: 'API请求失败，使用模拟数据',
                error: apiError.message
            });
        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '服务器错误',
            error: error.message
        });
    }
});

// 测试API连接
app.post('/api/test-connection', async (req, res) => {
    try {
        const { apiKey } = req.body;
        
        if (!apiKey) {
            return res.status(400).json({
                success: false,
                message: 'API密钥不能为空'
            });
        }
        
        // 尝试调用API测试连接
        try {
            await proxyFootystatsAPI(FOOTYSTATS_CONFIG.ENDPOINTS.LEAGUES, apiKey);
            res.json({
                success: true,
                message: 'API连接成功'
            });
        } catch (apiError) {
            res.status(401).json({
                success: false,
                message: 'API连接失败',
                error: apiError.message
            });
        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: '服务器错误',
            error: error.message
        });
    }
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在'
    });
});

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? error.message : '服务器错误'
    });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 足球数据展示平台已启动`);
    console.log(`📍 本地访问: http://localhost:${PORT}`);
    console.log(`🌐 外部访问: http://0.0.0.0:${PORT}`);
    console.log(`📊 健康检查: http://localhost:${PORT}/health`);
    console.log(`⚽ 准备就绪，等待API密钥配置...`);
});
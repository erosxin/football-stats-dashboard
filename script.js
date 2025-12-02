// 全局变量
let apiKey = localStorage.getItem('footystats_api_key') || '';
let selectedLeagues = JSON.parse(localStorage.getItem('selected_leagues') || '[]');
let currentMatches = [];

// API配置 - 基于常见的足球API模式推测的端点
const API_CONFIG = {
    BASE_URL: 'https://api.footystats.org/v1',
    ENDPOINTS: {
        LEAGUES: '/leagues',
        MATCHES_TODAY: '/matches/today',
        TEAM_STATS: '/teams/{id}/stats',
        FIXTURES: '/fixtures'
    }
};

// 模拟数据 - 用于演示功能
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

// DOM元素
const elements = {
    navBtns: document.querySelectorAll('.nav-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    currentDate: document.getElementById('current-date'),
    leagueFilter: document.getElementById('league-filter'),
    refreshBtn: document.getElementById('refresh-btn'),
    matchesContainer: document.getElementById('matches-container'),
    leaguesContainer: document.getElementById('leagues-container'),
    apiKeyInput: document.getElementById('api-key'),
    saveApiKeyBtn: document.getElementById('save-api-key'),
    apiStatusIndicator: document.getElementById('api-status-indicator')
};

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    updateCurrentDate();
    updateApiStatus();
    loadLeagues();
    loadTodayMatches();
    
    // 如果有保存的API密钥，显示在输入框中（部分隐藏）
    if (apiKey) {
        elements.apiKeyInput.value = '••••••••' + apiKey.slice(-4);
    }
}

function setupEventListeners() {
    // 标签页切换
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // 刷新按钮
    elements.refreshBtn.addEventListener('click', loadTodayMatches);
    
    // 联赛过滤器
    elements.leagueFilter.addEventListener('change', filterMatches);
    
    // API密钥保存
    elements.saveApiKeyBtn.addEventListener('click', saveApiKey);
    
    // API密钥输入框焦点事件
    elements.apiKeyInput.addEventListener('focus', function() {
        if (this.value.startsWith('••••••••')) {
            this.value = '';
        }
    });
}

function switchTab(tabName) {
    // 更新导航按钮状态
    elements.navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // 更新标签页内容
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });
    
    // 根据标签页执行特定操作
    switch(tabName) {
        case 'today':
            loadTodayMatches();
            break;
        case 'leagues':
            loadLeagues();
            break;
        case 'settings':
            updateApiStatus();
            break;
    }
}

function updateCurrentDate() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    elements.currentDate.textContent = now.toLocaleDateString('zh-CN', options);
}

function updateApiStatus() {
    const indicator = elements.apiStatusIndicator;
    const icon = indicator.querySelector('i');
    const text = indicator.querySelector('span');
    
    if (apiKey) {
        indicator.classList.add('connected');
        icon.className = 'fas fa-circle';
        text.textContent = 'API已连接';
    } else {
        indicator.classList.remove('connected');
        icon.className = 'fas fa-circle';
        text.textContent = '未配置API密钥';
    }
}

function saveApiKey() {
    const newApiKey = elements.apiKeyInput.value.trim();
    
    if (!newApiKey || newApiKey.startsWith('••••••••')) {
        alert('请输入有效的API密钥');
        return;
    }
    
    apiKey = newApiKey;
    localStorage.setItem('footystats_api_key', apiKey);
    
    // 隐藏显示API密钥
    elements.apiKeyInput.value = '••••••••' + apiKey.slice(-4);
    
    updateApiStatus();
    alert('API密钥已保存');
    
    // 重新加载数据
    loadTodayMatches();
}

async function loadLeagues() {
    try {
        elements.leaguesContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>加载联赛数据中...</p></div>';
        
        let leagues;
        if (apiKey) {
            // 如果有API密钥，尝试从真实API获取数据
            leagues = await fetchFromAPI(API_CONFIG.ENDPOINTS.LEAGUES);
        } else {
            // 使用模拟数据
            leagues = MOCK_DATA.leagues;
        }
        
        renderLeagues(leagues);
        updateLeagueFilter(leagues);
        
    } catch (error) {
        console.error('加载联赛数据失败:', error);
        elements.leaguesContainer.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>加载联赛数据失败</p>
                <p>使用模拟数据进行演示</p>
            </div>
        `;
        
        // 回退到模拟数据
        renderLeagues(MOCK_DATA.leagues);
        updateLeagueFilter(MOCK_DATA.leagues);
    }
}

function renderLeagues(leagues) {
    const html = leagues.map(league => `
        <div class="league-card ${selectedLeagues.includes(league.id) ? 'selected' : ''}" 
             data-league-id="${league.id}">
            <h3>${league.name}</h3>
            <p>${league.country} | ${league.season}</p>
        </div>
    `).join('');
    
    elements.leaguesContainer.innerHTML = html;
    
    // 添加点击事件
    elements.leaguesContainer.querySelectorAll('.league-card').forEach(card => {
        card.addEventListener('click', () => toggleLeagueSelection(card));
    });
}

function toggleLeagueSelection(card) {
    const leagueId = parseInt(card.dataset.leagueId);
    const index = selectedLeagues.indexOf(leagueId);
    
    if (index > -1) {
        selectedLeagues.splice(index, 1);
        card.classList.remove('selected');
    } else {
        selectedLeagues.push(leagueId);
        card.classList.add('selected');
    }
    
    localStorage.setItem('selected_leagues', JSON.stringify(selectedLeagues));
    updateLeagueFilter();
}

function updateLeagueFilter(leagues = MOCK_DATA.leagues) {
    const options = ['<option value="">所有联赛</option>'];
    
    leagues.forEach(league => {
        options.push(`<option value="${league.name}">${league.name}</option>`);
    });
    
    elements.leagueFilter.innerHTML = options.join('');
}

async function loadTodayMatches() {
    try {
        elements.matchesContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>加载比赛数据中...</p></div>';
        
        let matches;
        if (apiKey) {
            // 如果有API密钥，尝试从真实API获取数据
            matches = await fetchFromAPI(API_CONFIG.ENDPOINTS.MATCHES_TODAY);
        } else {
            // 使用模拟数据
            matches = MOCK_DATA.matches;
        }
        
        currentMatches = matches;
        renderMatches(matches);
        
    } catch (error) {
        console.error('加载比赛数据失败:', error);
        elements.matchesContainer.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>加载比赛数据失败</p>
                <p>使用模拟数据进行演示</p>
            </div>
        `;
        
        // 回退到模拟数据
        currentMatches = MOCK_DATA.matches;
        setTimeout(() => renderMatches(MOCK_DATA.matches), 2000);
    }
}

function renderMatches(matches) {
    if (!matches || matches.length === 0) {
        elements.matchesContainer.innerHTML = `
            <div class="error">
                <i class="fas fa-calendar-times"></i>
                <p>今日暂无比赛</p>
            </div>
        `;
        return;
    }
    
    const html = matches.map(match => `
        <div class="match-card">
            <div class="match-header">
                <span class="league-name">${match.league}</span>
                <span class="match-time">${match.time}</span>
            </div>
            
            <div class="match-teams">
                <div class="team">
                    <div class="team-name">${match.homeTeam}</div>
                </div>
                <div class="vs">VS</div>
                <div class="team">
                    <div class="team-name">${match.awayTeam}</div>
                </div>
            </div>
            
            <div class="match-stats">
                <div class="stats-section">
                    <h4>${match.homeTeam} - 整体数据</h4>
                    <div class="stat-item">
                        <span class="stat-label">场均进球:</span>
                        <span class="stat-value">${match.homeStats.overall.goals}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">场均射门:</span>
                        <span class="stat-value">${match.homeStats.overall.shots}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">控球率:</span>
                        <span class="stat-value">${match.homeStats.overall.possession}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">场均角球:</span>
                        <span class="stat-value">${match.homeStats.overall.corners}</span>
                    </div>
                    
                    <h4 style="margin-top: 15px;">最近6场数据</h4>
                    <div class="stat-item">
                        <span class="stat-label">场均进球:</span>
                        <span class="stat-value">${match.homeStats.last6.goals}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">场均射门:</span>
                        <span class="stat-value">${match.homeStats.last6.shots}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">控球率:</span>
                        <span class="stat-value">${match.homeStats.last6.possession}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">场均角球:</span>
                        <span class="stat-value">${match.homeStats.last6.corners}</span>
                    </div>
                </div>
                
                <div class="stats-section">
                    <h4>${match.awayTeam} - 整体数据</h4>
                    <div class="stat-item">
                        <span class="stat-label">场均进球:</span>
                        <span class="stat-value">${match.awayStats.overall.goals}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">场均射门:</span>
                        <span class="stat-value">${match.awayStats.overall.shots}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">控球率:</span>
                        <span class="stat-value">${match.awayStats.overall.possession}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">场均角球:</span>
                        <span class="stat-value">${match.awayStats.overall.corners}</span>
                    </div>
                    
                    <h4 style="margin-top: 15px;">最近6场数据</h4>
                    <div class="stat-item">
                        <span class="stat-label">场均进球:</span>
                        <span class="stat-value">${match.awayStats.last6.goals}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">场均射门:</span>
                        <span class="stat-value">${match.awayStats.last6.shots}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">控球率:</span>
                        <span class="stat-value">${match.awayStats.last6.possession}%</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">场均角球:</span>
                        <span class="stat-value">${match.awayStats.last6.corners}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    elements.matchesContainer.innerHTML = html;
}

function filterMatches() {
    const selectedLeague = elements.leagueFilter.value;
    
    if (!selectedLeague) {
        renderMatches(currentMatches);
        return;
    }
    
    const filteredMatches = currentMatches.filter(match => 
        match.league === selectedLeague
    );
    
    renderMatches(filteredMatches);
}

async function fetchFromAPI(endpoint) {
    if (!apiKey) {
        throw new Error('API密钥未配置');
    }
    
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('API请求错误:', error);
        throw error;
    }
}

// 工具函数
function formatTime(timeString) {
    const time = new Date(`2024-01-01 ${timeString}`);
    return time.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
    });
}

// 错误处理
window.addEventListener('error', function(event) {
    console.error('全局错误:', event.error);
});

// 网络状态检测
window.addEventListener('online', function() {
    console.log('网络已连接');
    loadTodayMatches();
});

window.addEventListener('offline', function() {
    console.log('网络已断开');
    elements.matchesContainer.innerHTML = `
        <div class="error">
            <i class="fas fa-wifi"></i>
            <p>网络连接已断开</p>
            <p>请检查您的网络连接</p>
        </div>
    `;
});
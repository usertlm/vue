require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const dataManager = require('./scrapers/dataManager');
const authRoutes = require('./routes/auth');
const { initializeMailer } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5000;

// 初始化邮件服务
initializeMailer();

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============ API 路由 ============

// 认证路由
app.use('/api/auth', authRoutes);

/**
 * GET /api/components
 * 获取所有配件列表
 */
app.get('/api/components', (req, res) => {
  try {
    const components = dataManager.getAllComponents();
    res.json({
      success: true,
      data: components,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch components'
    });
  }
});

/**
 * GET /api/components/category/:category
 * 按分类获取配件
 */
app.get('/api/components/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const components = dataManager.getComponentsByCategory(category);
    res.json({
      success: true,
      data: components,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching components by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch components'
    });
  }
});

/**
 * GET /api/prices/:componentId
 * 获取指定配件的价格历史
 */
app.get('/api/prices/:componentId', (req, res) => {
  try {
    const { componentId } = req.params;
    const history = dataManager.getComponentHistory(componentId);

    if (!history) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      });
    }

    res.json({
      success: true,
      data: history,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch price history'
    });
  }
});

/**
 * POST /api/prices/:componentId/update
 * 手动更新配件价格
 */
app.post('/api/prices/:componentId/update', (req, res) => {
  try {
    const { componentId } = req.params;
    const { price } = req.body;

    if (!price || typeof price !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Invalid price'
      });
    }

    const success = dataManager.updateComponentPrice(componentId, price);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Component not found'
      });
    }

    res.json({
      success: true,
      message: 'Price updated successfully',
      data: dataManager.getComponentHistory(componentId)
    });
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update price'
    });
  }
});

/**
 * GET /api/prices
 * 获取最新的所有配件价格
 */
app.get('/api/prices', (req, res) => {
  try {
    const components = dataManager.getAllComponents();
    res.json({
      success: true,
      data: components,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch prices'
    });
  }
});

/**
 * GET /api/health
 * 健康检查端点
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ============ 定时任务 ============

// 每天每小时更新一次价格（模拟爬虫）
schedule.scheduleJob('0 * * * *', () => {
  console.log('📊 执行定时价格更新...');
  dataManager.simulateScrapeTaobao();
});

// ============ 错误处理 ============

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.path
  });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// ============ 启动服务 ============

app.listen(PORT, () => {
  console.log(`
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│  PC 配件价格 API 服务         │
│  http://localhost:${PORT}          │
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📊 API 端点:
  # 认证相关
  POST /api/auth/register              - 用户注册
  POST /api/auth/login                 - 用户登录
  POST /api/auth/verify-email          - 邮箱验证
  POST /api/auth/resend-code           - 重新发送验证码
  GET  /api/auth/verify-token          - 验证令牌

  # 配件相关
  GET  /api/components              - 获取所有配件
  GET  /api/components/category/:cat - 按分类获取配件
  GET  /api/prices                  - 获取所有配件价格
  GET  /api/prices/:id              - 获取指定配件历史
  POST /api/prices/:id/update       - 更新配件价格
  GET  /api/health                  - 健康检查

⏰ 定时任务: 每小时更新一次价格
🔄 开发模式: npm run dev
🔐 认证: JWT令牌（Bearer token）
  `);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM 收到，正在关闭服务器...');
  process.exit(0);
});

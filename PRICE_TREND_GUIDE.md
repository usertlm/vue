# 🖥️ 电脑配件实时价格趋势系统 - 完整使用指南

## 📋 系统概述

这是一个基于 Vue 3 + Chart.js 的电脑配件价格实时监测系统，支持：
- ✅ 从淘宝爬取实时价格数据
- ✅ 卡通色彩的交互式折线图
- ✅ 配件灵活选择和对比
- ✅ 价格趋势分析和统计

## 🎨 组件说明

### 1. **ComponentSelector.vue** - 配件选择器
位置：`src/components/ComponentSelector.vue`

**功能**：
- 分类浏览：CPU、GPU、内存、SSD、主板、散热器
- 价格卡片展示（当前价格 + 趋势）
- 多选对比
- 快速查看

**使用**：
```vue
<ComponentSelector 
  @update:selected="handleSelection"
  @view-chart="handleViewChart"
/>
```

### 2. **PriceTrendChartAdvanced.vue** - 价格趋势图
位置：`src/components/PriceTrendChartAdvanced.vue`

**功能**：
- 实时动态更新的折线图
- 多配件对比展示
- 统计信息面板
- 图表下载功能
- 暂停/继续更新按钮

**使用**：
```vue
<PriceTrendChartAdvanced 
  :selectedIds="['cpu-1', 'gpu-2']"
  @remove="removeComponent"
/>
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装爬虫依赖
pip install requests beautifulsoup4 cloudscraper selenium

# 或者只安装基础的
pip install requests beautifulsoup4
```

### 2. 运行爬虫获取数据

#### 方式一：一次性爬取
```bash
python scripts/taobao_price_scraper.py --once

# 爬取特定分类
python scripts/taobao_price_scraper.py --category cpu --once
```

#### 方式二：定时爬取（推荐）
```bash
# 每1小时更新一次
python scripts/taobao_price_scraper.py

# 每30分钟更新一次
python scripts/taobao_price_scraper.py --interval 1800

# 在后台运行（Windows）
start /B python scripts/taobao_price_scraper.py
```

### 3. 运行前端项目

```bash
# 开发模式
npm run serve

# 生产构建
npm run build
```

## 📊 数据结构

### price-history.json 格式

```json
{
  "lastUpdated": "2026-04-03T12:30:00Z",
  "categories": {
    "cpu": [
      {
        "id": "cpu-1",
        "name": "Intel Core Ultra 9 285K",
        "price": 3949,
        "history": [
          {
            "time": "2026-03-27T00:00:00Z",
            "price": 3999
          }
        ]
      }
    ]
  }
}
```

## 🎯 配件分类和颜色主题

| 分类 | 颜色梯度 | 表情符 | 基础产品数 |
|------|--------|-----|---------| 
| CPU | 粉色系 🎨 | 💻 | 4+ |
| GPU | 青色系 🎨 | 🎮 | 4+ |
| RAM | 绿松石系 🎨 | 🧠 | 3+ |
| SSD | 薄荷系 🎨 | 💾 | 3+ |
| MB | 金色系 🎨 | 🔌 | 3+ |
| Cool | 蓝色系 🎨 | ❄️ | 3+ |

### 色彩代码

```javascript
// CPU 粉色系
#FF6B9D, #FF85B4, #FFB3D9, #FFBE6F

// GPU 青色系  
#00D4FF, #00E5FF, #00F0FF, #00F7FF

// RAM 绿松石系
#4ECDC4, #5FD8CC, #70E5D8

// SSD 薄荷系
#95E1D3, #A8E8DC, #BCEFE5

// MB 金色系
#FFD700, #FFC700, #FFED4E

// Cool 蓝色系
#A8D8FF, #C5E0FF, #E1EEFF
```

## 🔧 配置说明

### 爬虫配置 (taobao_price_scraper.py)

```python
# 修改关键词映射
KEYWORDS_MAP = {
    "cpu": ["Intel Core Ultra 9 285K", ...],
    "gpu": ["RTX 5090 显卡", ...],
    ...
}

# 修改本地模拟数据价格范围（爬虫失败时使用）
FALLBACK_PRICES = {
    "cpu": {
        "Intel Core Ultra 9 285K": {
            "min": 3800,      # 最低价
            "max": 4100,      # 最高价
            "variation": 0.05  # 波动幅度
        }
    }
}
```

### 前端组件配置

#### ComponentSelector.vue
```javascript
// 修改分类
categories: [
  { id: 'cpu', name: 'CPU处理器', emote: '💻' },
  { id: 'gpu', name: 'GPU显卡', emote: '🎮' },
  ...
]

// 修改配件列表
componentsData: {
  cpu: [
    { 
      id: 'cpu-1', 
      name: '配件名称',
      price: 3949,
      emote: '💻',
      color: '#FF6B9D'
    }
  ]
}
```

#### PriceTrendChartAdvanced.vue
```javascript
// 修改配件信息
componentsInfo: {
  'cpu-1': {
    name: '配件名称',
    color: '#FF6B9D',
    basePrice: 3949
  }
}
```

## 📈 使用场景

### 1. 监测单个配件价格变化
```
用户操作：
1. 打开网站
2. 在 "CPU处理器" 分类中选择一个CPU
3. 点击 "查看趋势图"
4. 实时看到价格曲线
```

### 2. 对比多个配件
```
用户操作：
1. 在不同分类中分别选择配件（如：CPU + GPU + 内存）
2. 选中的配件会显示在底部摘要中
3. 点击 "查看趋势图"
4. 图表展示所有选中配件的对比
```

### 3. 组合推荐
```
可在 /api/components.js 中设置组合推荐
GET /api/components?action=recommend
返回预设的电脑配置组合
```

## 🔗 API 接口

### GET /api/components
获取配件列表

```bash
# 获取所有配件
GET /api/components?action=list

# 获取单个配件详情
GET /api/components?action=detail&id=cpu-1

# 获取推荐组合
GET /api/components?action=recommend

# 获取价格趋势
GET /api/components?action=trends&category=cpu
```

## 🛡️ 反爬虫对策

爬虫脚本已内置以下措施：

1. **User-Agent 轮换**：模拟真实浏览器
2. **请求间隔**：每个请求间隔 1-3 秒
3. **CloudScraper**：自动绕过 Cloudflare
4. **重试机制**：失败后自动重试
5. **本地缓存**：降低访问频率

## 🎪 动画和过渡效果

系统使用了多种视觉效果：

### 配件卡片
- **Hover 悬停**：向上浮起 + 发光
- **Select 选中**：颜色变亮 + 内阴影
- **Float 浮动**：emoji 上下浮动

### 折线图
- **实时绘制**：平滑的线条动画
- **Point 闪烁**：数据点悬停放大
- **Tooltip 提示**：优雅的数据提示框

### 整体
- **Neon 霓虹**：青色文字发光
- **Glass 毛玻璃**：半透明背景模糊

## 📱 响应式设计

所有组件在以下设备上测试：
- ✅ 桌面（1920px+）
- ✅ 平板（768px - 1024px）
- ✅ 手机（< 768px）

## 🐛 故障排查

### 问题：爬虫无法连接淘宝
```
解决方案：
1. 检查网络连接
2. 更新 cloudscraper：pip install --upgrade cloudscraper
3. 使用模拟数据模式（自动降级）
4. 检查是否被 IP 封禁，使用 VPN 或等待
```

### 问题：前端组件不显示
```
解决方案：
1. 检查浏览器控制台错误信息
2. 清除浏览器缓存：Ctrl+Shift+Delete
3. 检查 Chart.js 是否正确加载
4. 检查组件路径是否正确
```

### 问题：图表数据不更新
```
解决方案：
1. 检查 price-history.json 是否存在和最近更新
2. 确认爬虫脚本是否在运行
3. 检查 updateFrequency 是否设置过长
4. 刷新浏览器页面
```

## 📦 部署建议

### Vercel 部署（推荐）
```bash
# 1. 推送到 GitHub
git push origin main

# 2. 链接 Vercel 项目
# 3. 配置环境变量（如需要）
# 4. 部署！

# 定时爬虫：
# 使用 Vercel Cron 功能或在服务器运行爬虫脚本
```

### Docker 部署
```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "serve"]
```

## 🎁 扩展功能建议

1. **用户账户系统** - 保存用户关注列表
2. **价格警报** - 当价格掉到目标值时通知
3. **历史价格对比** - 按月/季度/年对比
4. **配件兼容性检查** - 提示某些配件搭配问题
5. **平台对比** - 同时爬取京东、亚马逊、苏宁等
6. **推荐配置** - 根据预算自动推荐配置
7. **分享功能** - 分享价格等对比
8. **暗黑/亮色主题** - UI 主题切换

## 📞 支持和反馈

遇到问题或有建议？欢迎提交 Issue 或 PR！

---

**最后更新**：2026-04-03
**维护者**：PC组件价格趋势项目团队
**许可证**：MIT

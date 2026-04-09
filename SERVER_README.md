# 🖥️ PC配件价格趋势实时监测系统

## 📋 项目介绍

一个实时监测电脑配件（CPU、GPU、内存、SSD等）价格趋势的Web应用，支持用户选择感兴趣的配件，查看30天内的价格变化。

### ✨ 核心功能

- ✅ **实时价格监测** - 显示30天的历史价格数据
- ✅ **灵活配件选择** - 用户可选择任意配件进行对比
- ✅ **卡通色彩图表** - 使用Chart.js渲染彩色折线图
- ✅ **价格趋势分析** - 显示价格涨跌百分比
- ✅ **暗黑主题** - 霓虹风格UI设计
- ✅ **自动更新** - 后端支持定时爬虫更新价格

---

## 🚀 快速开始

### 前置要求

- Node.js 24.x
- npm 11+

### 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server && npm install && cd ..
```

### 开发环境运行

**方式1: 同时运行前后端（推荐）**

```bash
npm run dev
```

这会同时启动：
- 前端: http://localhost:8080
- 后端API: http://localhost:5000

**方式2: 分别运行**

```bash
# 终端1: 前端
npm run serve

# 终端2: 后端
npm run server:dev
```

### 测试 API

```bash
# 获取所有配件
curl http://localhost:5000/api/components

# 获取指定配件的历史数据
curl http://localhost:5000/api/prices/cpu-1

# 获取健康状态
curl http://localhost:5000/api/health
```

---

## 📁 项目结构

```
d:/360/vue/vue/
├── src/
│   ├── main.js
│   ├── App.vue                          # 主应用
│   ├── components/
│   │   ├── ComponentSelector.vue        # 配件选择器（从API获取数据）
│   │   ├── PriceTrendChartAdvanced.vue  # 价格趋势图（从API加载历史数据）
│   │   ├── ChatBox.vue
│   │   ├── HelloWorld.vue
│   │   └── ...
│   └── assets/
├── server/                              # Node.js Express后端
│   ├── index.js                         # 主服务器文件
│   ├── package.json
│   ├── scrapers/
│   │   └── dataManager.js               # 数据管理（文件存储）
│   └── data/
│       └── priceData.json               # 价格数据库（JSON格式）
├── package.json                         # 前端依赖和脚本
└── dist/                                # 构建输出目录
```

---

## 🔧 API 文档

### 后端服务地址

默认: `http://localhost:5000`

### 可用端点

#### 1. 获取所有配件
```
GET /api/components
```

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cpu-1",
      "name": "Intel Core Ultra 9 285K",
      "category": "cpu",
      "price": 3949,
      "trend": -1.2
    }
  ],
  "timestamp": "2026-04-03T15:35:00Z"
}
```

#### 2. 按分类获取配件
```
GET /api/components/category/cpu
```

#### 3. 获取配件历史数据
```
GET /api/prices/:componentId
```

**示例:** `GET /api/prices/cpu-1`

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": "cpu-1",
    "name": "Intel Core Ultra 9 285K",
    "currentPrice": 3949,
    "history": [
      {"date": "2026-03-04", "price": 4199},
      {"date": "2026-03-05", "price": 4159},
      ...
    ],
    "trend": -5.95
  }
}
```

#### 4. 更新配件价格（手动）
```
POST /api/prices/:componentId/update
Content-Type: application/json

{
  "price": 3900
}
```

#### 5. 健康检查
```
GET /api/health
```

---

## 🎨 UI特性

### 配件选择器 (ComponentSelector.vue)
- 按分类标签切换配件（CPU、GPU、RAM、SSD等）
- 展示配件卡片（价格、趋势、规格）
- 支持多选配件
- 已选配件显示为Tag

### 价格趋势图 (PriceTrendChartAdvanced.vue)
- Chart.js折线图展示30天数据
- 彩色区域填充（透明度渐变）
- 交互式Tooltip（悬停显示详情）
- 统计信息面板（当前价格、涨跌幅）
- 暂停/继续自动更新
- 可下载为PNG图片

---

## ⚙️ 配置

### 环境变量

在 `.env` 文件中设置（可选）：

```env
VUE_APP_API_URL=http://localhost:5000
```

### 后端配置

**定时更新任务** (`server/index.js`):
```javascript
// 每小时更新一次价格
schedule.scheduleJob('0 * * * *', () => {
  dataManager.simulateScrapeTaobao();
});
```

---

## 📊 数据存储

目前使用 **JSON文件存储数** (`server/data/priceData.json`)

后续可升级为：
- SQLite 本地数据库
- MongoDB (云端)
- PostgreSQL (生产环境)

---

## 🔄 工作流程

```
用户操作
    ↓
① ComponentSelector.vue 从 API 获取配件列表
    ↓
② 用户选择配件 → 触发事件
    ↓
③ PriceTrendChartAdvanced.vue 挂载
    ↓
④ 从 /api/prices/:id 获取历史数据 (30天)
    ↓
⑤ Chart.js 渲染折线图
    ↓
⑥ 定时任务每2秒更新数据
    ↓
⑦ 图表实时动画更新
```

---

## 🐛 已知问题

1. 淘宝反爬虫机制强 → 目前使用高逼真Mock数据
   - **解决方案**：集成Puppeteer或Selenium绕过反爬

2. 前后端跨域
   - **已解决**：后端启用CORS中间件

3. 首屏加载缓慢（bundle size 840KB）
   - **优化方案**：
     - 动态导入组件（已启用）
     - 代码分割优化
     - 压缩vendor库

---

## 📈 性能指标

| 指标 | 值 |
|------|-----|
| Bundle Size (Gzip) | 8.80 KB |
| Vendor Bundle | 257.77 KB |
| API响应时间 | <100ms |
| 图表更新频率 | 2000ms 默认 |
| 历史数据点 | 30天 |

---

## 🚀 部署

### 构建生产版本

```bash
npm run build
```

输出到 `dist/` 目录

### Docker部署 (可选)

```dockerfile
FROM node:24
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🛠️ 技术栈

### 前端
- **Vue 3** - 渐进式框架
- **Chart.js 4.5** - 图表库
- **CSS3** - 卡通动画效果

### 后端
- **Express.js** - Web框架
- **node-schedule** - 定时任务
- **CORS** - 跨域处理
- **node-fetch** - HTTP请求

### DevTools
- **Vue CLI** - 开发工具链
- **Webpack** - 模块打包
- **Babel** - ES6转译
- **ESLint** - 代码检查

---

## 🔮 未来规划

- [ ] 真实淘宝数据爬虫集成
- [ ] WebSocket 实时推送价格
- [ ] 用户账户系统 & 价格告警
- [ ] 价格预测 (ML模型)
- [ ] 数据库升级 (PostgreSQL)
- [ ] 国际化支持 (i18n)
- [ ] PWA离线支持
- [ ] 移动端APP版本

---

## 📝 License

MIT

---

## 👨‍💻 开发者

Claude (Anthropic)

---

## 📞 支持

有任何问题或建议，欢迎提出Issue！

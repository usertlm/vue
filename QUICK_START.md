# 🚀 快速开始指南

## 📋 5分钟快速使用

### 1️⃣ 安装前端依赖
```bash
npm install
```

### 2️⃣ 安装爬虫依赖
```bash
pip install requests beautifulsoup4 cloudscraper
```

### 3️⃣ 启动爬虫获取数据

**Windows 用户**：
```bash
# 双击运行
start-scraper.bat

# 或命令行运行
python scripts/taobao_price_scraper.py --once
```

**Mac/Linux 用户**：
```bash
bash start-scraper.sh

# 或直接运行
python3 scripts/taobao_price_scraper.py --once
```

### 4️⃣ 启动开发服务器
```bash
npm run serve
```

### 5️⃣ 打开浏览器
访问 `http://localhost:8080`

---

## 🎯 使用流程

```
1. 打开网站
   ↓
2. 在 "电脑配件价格查询" 部分选择配件
   ↓
3. 选中多个配件后，点击 "查看趋势图"
   ↓
4. 实时查看价格曲线和统计信息
   ↓
5. 点击按钮操作：
   - 暂停/继续 更新
   - 重置 数据
   - 下载 图表
```

---

## 📦 项目结构

```
vue/
├── src/
│   ├── components/
│   │   ├── ComponentSelector.vue        ← 配件选择器
│   │   ├── PriceTrendChartAdvanced.vue  ← 价格趋势图
│   │   ├── PriceTrendChart.vue          ← 原始版本
│   │   └── ...其他组件
│   ├── App.vue                          ← 主应用（已更新）
│   └── main.js
├── api/
│   ├── components.js                    ← 配件API接口
│   └── prices.js
├── data/
│   └── price-history.json               ← 价格历史数据
├── scripts/
│   ├── taobao_price_scraper.py         ← 淘宝爬虫
│   ├── start-scraper.bat                ← Windows启动脚本
│   └── start-scraper.sh                 ← Linux/Mac启动脚本
└── PRICE_TREND_GUIDE.md                ← 完整文档
```

---

## 🎨 主要功能说明

### ComponentSelector（配件选择器）
- **分类标签**：CPU、GPU、内存、SSD、主板、散热器
- **配件卡片**：显示名称、价格、规格、趋势
- **选择框**：点击卡片选择/取消选择
- **摘要区**：显示已选配件和总数
- **查看图表**：查看所有选中配件的价格趋势

### PriceTrendChartAdvanced（价格趋势图）
- **实时折线图**：多条线同时显示，每条不同颜色
- **快速控制**：选中的配件快速列表和移除按钮
- **统计面板**：每个配件的当前价格和变化百分比
- **交互操作**：暂停/继续、重置、下载图表
- **数据提示**：悬停显示详细的价格和日期信息

---

## 🔧 配置调整

### 更改更新频率
编辑 `PriceTrendChartAdvanced.vue`：
```javascript
updateFrequency: 2000  // 改为想要的毫秒数（如 5000 = 5秒）
```

### 添加新的配件
编辑 `ComponentSelector.vue`：
```javascript
componentsData: {
  cpu: [
    // 添加新的配件
    { 
      id: 'cpu-5', 
      name: '新配件名称',
      price: 1999,
      trend: -2.5,
      specs: '配件规格',
      emote: '💻',
      color: '#FF6B9D'
    }
  ]
}
```

### 修改爬虫关键词
编辑 `taobao_price_scraper.py`：
```python
KEYWORDS_MAP = {
    "cpu": [
        "新的关键词1",
        "新的关键词2",
        ...
    ]
}
```

---

## 🌐 部署到线上

### 使用 Vercel（推荐）
```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 部署
vercel

# 3. 在 Vercel Dashboard 设置环境变量（如需要）
```

### 使用 Netlify
```bash
# 1. 构建项目
npm run build

# 2. 上传 dist 文件夹到 Netlify
# 或使用 Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir dist
```

### 使用服务器
```bash
# 1. 构建项目
npm run build

# 2. 上传 dist 文件夹到服务器
# 3. 配置 Web 服务器（Nginx/Apache）
# 4. 定时运行爬虫脚本

# 例如使用 crontab（Linux）：
# 每小时运行一次
0 * * * * /usr/bin/python3 /path/to/taobao_price_scraper.py --once
```

---

## 📊 数据文件示例

`data/price-history.json` 会自动生成，格式如下：

```json
{
  "lastUpdated": "2026-04-03T15:30:00Z",
  "categories": {
    "cpu": [
      {
        "id": "cpu-1",
        "name": "Intel Core Ultra 9 285K",
        "price": 3949,
        "history": [
          {
            "time": "2026-04-01T10:00:00Z",
            "price": 3999
          },
          {
            "time": "2026-04-02T10:00:00Z",
            "price": 3980
          }
        ]
      }
    ]
  }
}
```

---

## 🎪 常见问题

### Q: 爬虫无法访问淘宝？
A: 这是正常的。系统会自动降级到本地模拟数据模式。如要爬取真实数据，可以：
- 使用代理或 VPN
- 改进反爬虫策略
- 使用淘宝 API（需要授权）

### Q: 如何修改颜色主题？
A: 编辑组件中的 `color` 属性：
```javascript
color: '#FF6B9D'  // 改为你喜欢的颜色代码
```

### Q: 可以保存到数据库吗？
A: 可以！修改 `taobao_price_scraper.py` 的 `save_price_history()` 函数连接到数据库。

### Q: 如何添加更多配件类别？
A: 
1. 在 `ComponentSelector.vue` 的 `categories` 中添加
2. 在 `KEYWORDS_MAP` 中添加对应的爬虫关键词
3. 在 `componentsData` 中添加配件列表

---

## 🧪 测试

### 测试前端
```bash
npm run serve
# 打开浏览器访问 http://localhost:8080
# 测试配件选择和图表功能
```

### 测试爬虫
```bash
# 一次性测试
python scripts/taobao_price_scraper.py --once --category cpu

# 查看生成的数据
cat data/price-history.json  # Mac/Linux
type data\price-history.json  # Windows
```

---

## 📱 响应式设计

系统在所有设备上都能正常工作：
- ✅ 桌面浏览器（1920px+）
- ✅ 平板设备（768px - 1024px）
- ✅ 手机设备（< 768px）

---

## ⚡ 性能优化建议

1. **减少爬虫频率**：改为每3-6小时爬取一次
2. **缓存机制**：实现本地缓存减少 API 调用
3. **数据分页**：配件过多时只展示部分
4. **图表优化**：只展示最近 30 天数据

---

## 🔗 相关资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Chart.js 文档](https://www.chartjs.org/)
- [淘宝搜索页面](https://s.taobao.com/)

---

## ✨ 下一步

1. ✅ 配件数据爬取
2. ✅ 前端界面开发
3. ⏳ 服务器部署
4. ⏳ 数据库集成
5. ⏳ 用户账户系统
6. ⏳ 价格警报功能

---

**祝你使用愉快！有问题欢迎提 Issue！** 🎉


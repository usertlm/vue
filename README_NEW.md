# 🖥️ 电脑配件实时价格趋势系统

> 一个基于 Vue 3 + Chart.js 的电脑配件价格实时监测和对比平台，支持从淘宝爬取数据，具有卡通色彩的交互式为显示和灵活的配件选择功能。

[![Latest Release](https://img.shields.io/badge/Release-v2.0-blue)](https://github.com/your-repo)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3.5-brightgreen)](https://vuejs.org)

## ✨ 主要特性

### 🎨 卡通色彩设计
- 六大配件分类，各有独特的色彩系统
- 霓虹青色主题，富有科技感
- 平滑的动画和过渡效果
- 响应式设计，完美适配各种设备

### 📊 实时价格趋势图
- 多配件同时对比（支持最多6个）
- Chart.js 驱动的高性能折线图
- 每 2 秒自动更新（可配置）
- 灵活的鼠标悬停提示框
- 下载图表为 PNG 格式

### 🛒 配件灵活选择
- 6 大分类：CPU、GPU、内存、SSD、主板、散热器
- 每类 3-4 个代表型号
- 点击卡片选择/取消选择
- 实时显示选中配件摘要

### 🕷️ 智能爬虫系统
- 支持淘宝关键词搜索爬取
- CloudScraper 反爬虫绕过
- 自动重试机制
- 本地模拟数据降级
- 定时自动更新（支持自定义间隔）

### 📈 数据分析和统计
- 价格趋势百分比变化
- 历史最高/最低价记录
- 平均价格计算
- 分类统计信息
- 全局价格排行

### 🔗 强大的 API 接口
```
GET /api/components          # 获取配件列表
GET /api/prices              # 获取价格数据
GET /api/prices?action=search # 搜索功能
GET /api/prices?action=stats  # 统计信息
```

## 🚀 快速开始

### 安装依赖
```bash
# 前端依赖
npm install

# 爬虫依赖
pip install requests beautifulsoup4 cloudscraper
```

### 运行爬虫获取数据
```bash
# Windows
start-scraper.bat

# Mac/Linux
bash start-scraper.sh

# 或直接运行
python scripts/taobao_price_scraper.py --once
```

### 启动开发服务器
```bash
npm run serve
```

访问 `http://localhost:8080` 开始使用！

## 📦 项目结构

```
vue/
├── src/
│   ├── components/
│   │   ├── ComponentSelector.vue        # ✨ 新：配件选择器
│   │   ├── PriceTrendChartAdvanced.vue  # ✨ 新：高级价格趋势图
│   │   └── ...其他组件
│   ├── App.vue                          # 已更新：集成新组件
│   └── main.js
├── api/
│   ├── components.js                    # ✨ 新：配件列表接口
│   └── prices.js                        # 已增强：价格数据接口
├── data/
│   └── price-history.json               # 自动生成的价格数据
├── scripts/
│   ├── taobao_price_scraper.py         # ✨ 新：淘宝爬虫脚本
│   ├── start-scraper.bat                # ✨ 新：Windows启动脚本
│   └── start-scraper.sh                 # ✨ 新：Linux/Mac启动脚本
├── QUICK_START.md                       # ✨ 新：快速开始指南
├── PRICE_TREND_GUIDE.md                 # ✨ 新：完整使用文档
└── IMPLEMENTATION_SUMMARY.md            # ✨ 新：实现总结
```

## 🎯 使用场景

### 场景 1：监测单个配件价格
1. 打开网站 → 选择一个配件 → 点击"查看趋势图"
2. 实时查看过去30天的价格走势

### 场景 2：对比多个配件
1. 选择多个配件（如 CPU + GPU + 内存）
2. 在一个图表中对比它们的价格变化

### 场景 3：定期价格监测
1. 运行爬虫脚本定时更新数据
2. 每天访问网站查看最新价格动态

## 🎨 色彩系统

| 分类 | 颜色 | 表情 | 产品数 |
|------|------|------|--------|
| CPU | 粉色系 | 💻 | 4+ |
| GPU | 青色系 | 🎮 | 4+ |
| 内存 | 绿松石系 | 🧠 | 3+ |
| SSD | 薄荷系 | 💾 | 3+ |
| 主板 | 金色系 | 🔌 | 3+ |
| 散热器 | 蓝色系 | ❄️ | 3+ |

## 📊 支持的配件

### CPU 处理器
- Intel Core Ultra 9 285K (¥3949)
- Intel Core Ultra 7 265K (¥2799)
- AMD Ryzen 9 9950X (¥4499)
- AMD Ryzen 7 9700X (¥2299)

### GPU 显卡
- NVIDIA RTX 5090 D (¥16499)
- NVIDIA RTX 5080 (¥8299)
- AMD RX 9070 XT (¥4999)
- NVIDIA RTX 5070 Ti (¥6299)

### 内存条
- DDR5 32GB 6000MHz (¥699)
- DDR5 64GB 6000MHz (¥1399)
- DDR4 32GB 3200MHz (¥359)

### 固态硬盘
- 三星 990 Pro 2TB (¥1299)
- WD Black SN850X 2TB (¥1099)
- 致态 TiPlus7100 2TB (¥799)

### 主板
- ROG STRIX Z890-E (¥3999)
- ROG CROSSHAIR X870E HERO (¥4999)
- 华硕 B850M-K (¥799)

### 散热器
- 猫头鹰 NH-D15 (¥799)
- 猫头鹰 NH-U12A (¥699)
- 海盗船 H150i Elite (¥1299)

## 🔧 配置设置

### 修改更新频率
编辑 `src/components/PriceTrendChartAdvanced.vue`：
```javascript
updateFrequency: 2000  // 毫秒，默认2秒
```

### 调整数据显示范围
编辑 `src/components/PriceTrendChartAdvanced.vue`：
```javascript
dataPoints: 30  // 默认显示过去30天的数据
```

### 定制爬虫关键词
编辑 `scripts/taobao_price_scraper.py`：
```python
KEYWORDS_MAP = {
    "cpu": ["你的关键词1", "你的关键词2", ...]
}
```

## 📚 文档

- **[快速开始指南](./QUICK_START.md)** - 5分钟快速上手
- **[完整使用指南](./PRICE_TREND_GUIDE.md)** - 详细功能说明和配置
- **[实现总结](./IMPLEMENTATION_SUMMARY.md)** - 技术架构和设计详情

## 🛠️ 技术栈

### 前端
- **Vue 3.5** - 响应式 UI 框架
- **Chart.js 4.5** - 数据可视化库
- **CSS3** - 现代样式和动画

### 后端
- **Node.js** - 运行环境
- **Vercel Functions** - 无服务器计算

### 爬虫
- **Python 3** - 脚本语言
- **Requests** - HTTP 库
- **BeautifulSoup4** - HTML 解析
- **CloudScraper** - 反爬虫

## 🔒 安全特性

- ✅ CORS 兼容性
- ✅ XSS 自动防护（Vue 3）
- ✅ 反爬虫对策（User-Agent 轮换、请求延迟）
- ✅ IP 代理支持（可选）
- ✅ Token 认证（API 写入）

## 🌍 部署

### Vercel 部署（推荐）
```bash
npm install -g vercel
vercel
```

### Netlify 部署
```bash
npm run build
netlify deploy --prod --dir dist
```

### 自建服务器
```bash
npm run build
# 上传 dist 文件夹到服务器
# 配置 Web 服务器（Nginx/Apache）
# 定时运行爬虫脚本
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible JavaScript charting
- [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/) - Python HTML parser

## 📞 联系方式

- 📧 提交 Issue
- 💬 讨论功能建议
- 🐞 报告 Bug

## ⭐ 如果有帮助，请给个 Star 🌟

---

**项目状态**: ✅ 活跃开发中
**最后更新**: 2026-04-03
**当前版本**: 2.0


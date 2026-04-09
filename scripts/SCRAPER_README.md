# 电脑配件价格趋势 — 功能文档

## 🗂️ 概述

本功能模块实现"电脑配件价格趋势"图表，数据来自淘宝/天猫 + 京东双源爬取，实时更新。

**文件结构：**
```
vue/
├── src/
│   └── components/
│       ├── PriceChart.vue       # 旧版（保留）
│       └── PriceTrendChart.vue  # ✨ 新增强版卡通图表
├── scripts/
│   ├── scraper_taobao_jd.py     # ✨ 主爬虫（淘宝+京东）
│   └── run-scraper.sh           # ✨ 爬虫启动脚本
├── api/
│   └── prices.js                # 价格数据 API
└── data/
    └── price-history.json       # 历史价格数据库
```

---

## 📡 数据来源

| 来源 | 方式 | 稳定性 |
|------|------|--------|
| 京东 | 价格 API (`p.3.cn`) | ✅ 非常稳定 |
| 淘宝/天猫 | Playwright 真实浏览器 | ✅ 较好（需反爬应对） |

---

## 🚀 爬虫使用方法

### 安装依赖

```bash
# 安装 Playwright（仅首次）
pip3 install playwright
playwright install chromium --with-deps

# 或使用现有环境（已安装）
```

### 运行爬虫

```bash
# 单次运行
python3 scripts/scraper_taobao_jd.py

# 显示浏览器窗口（调试）
python3 scripts/scraper_taobao_jd.py --headful

# 每 60 分钟自动运行
python3 scripts/scraper_taobao_jd.py --interval 60
```

### 定时任务（Linux Crontab）

```bash
# 每天早上 9 点和晚上 9 点自动更新价格
0 9,21 * * * cd /home/drive/home/.openclaw/workspace/vue && python3 scripts/scraper_taobao_jd.py --no-push >> data/scraper.log 2>&1
```

---

## 📊 支持的配件分类

| 分类 | 名称 | 监控商品数 |
|------|------|-----------|
| cpu | CPU 处理器 | 8 款 |
| gpu | 显卡 | 8 款 |
| ram | 内存 | 5 款 |
| ssd | 固态硬盘 | 6 款 |
| mb | 主板 | 6 款 |
| cool | 散热器 | 5 款 |

---

## 🔧 API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/prices` | 获取所有分类最新价格 + 历史 |
| GET | `/api/prices?id=gpu-1` | 获取单个商品历史 |
| POST | `/api/prices` | 爬虫写入新价格（需认证） |

---

## 🎨 图表特性

- **卡通风格**：渐变背景、emoji 装饰、圆角卡片
- **交互选择**：点击分类卡片 → 选择具体型号 → 查看趋势
- **全局搜索**：支持跨分类关键词搜索商品
- **时间筛选**：7天 / 30天 / 90天 / 全部
- **价格统计**：历史最低、均价、当前价、历史最高
- **价格明细**：时间线列表，含价格变化标注
- **数据来源**：标注每个价格的数据来源（京东/淘宝）

---

## ⚠️ 注意事项

1. **爬虫频率**：建议每小时不超过 1 次，避免被封
2. **京东 API**：无需浏览器，直接请求，稳定可靠
3. **淘宝反爬**：如果淘宝爬取频繁失败，系统会自动降级到仅京东源
4. **数据量**：历史记录最多保留 500 条/商品，自动清理旧数据
5. **成本**：京东免费；淘宝 Playwright 约消耗 10-20MB 内存/次

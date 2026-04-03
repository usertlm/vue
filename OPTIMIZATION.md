# 🚀 性能优化和Bug修复指南

## 📊 当前性能指标

```
Bundle Size:
├── chunk-vendors.js    809.61 KB (Gzip: 257.77 KB)  ⚠️ 过大
├── app.js              22.81 KB  (Gzip: 8.80 KB)   ✅ 正常
├── CSS                 12.19 KB  (Gzip: 3.32 KB)   ✅ 正常
└── 总计                840 KB    (Gzip: 269 KB)    ⚠️ 超过建议244KB

FCP (首次内容绘制): ~1-2秒
API响应时间: <100ms (本地)
图表更新频率: 2000ms
```

---

## 🔧 已检测的问题

### P1 - 严重
❌ none 目前没有严重bug

### P2 - 中等
- [ ] Bundle size过大（Vendor 809KB）
- [ ] 首屏加载时间可优化
- [ ] 大量API请求可合并

### P3 - 低
- [ ] 移动端响应式需改进

---

## 🛠️ 优化方案

### 1. 代码分割优化

已启用动态导入：
```javascript
ComponentSelector: () => import('./components/ComponentSelector.vue'),
PriceTrendChartAdvanced: () => import('./components/PriceTrendChartAdvanced.vue'),
```

### 2. Vendor优化建议

**选项A: 外链CDN（快速）**
```html
<!-- public/index.html -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
```

**选项B: Tree-shake未用代码**
```javascript
// vue.config.js
module.exports = {
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          chartjs: {
            test: /[\\/]node_modules[\\/]chart\.js[\\/]/,
            name: 'chart-vendors',
            priority: 20
          }
        }
      }
    }
  }
}
```

### 3. API请求合并

**当前: 分离请求**
```
1. GET /api/components
2. GET /api/prices/cpu-1
3. GET /api/prices/gpu-1
...（重复请求）
```

**优化后: 批量请求**
```javascript
// 建议后端新增
GET /api/batch/prices?ids=cpu-1,gpu-1,ram-1
```

### 4. 缓存策略

```javascript
// 前端缓存（5分钟）
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

async function fetchWithCache(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetch(url).then(r => r.json());
  cache.set(url, { data, time: Date.now() });
  return data;
}
```

### 5. 图表优化

```javascript
// 使用canvas离屏渲染
useOffscreenCanvas: true,

// 降低数据点精度（移动端）
const isLowPower = navigator.hardwareConcurrency <= 2;
const updateFrequency = isLowPower ? 5000 : 2000;
```

---

## ✅ 已实现的优化

✅ 动态组件导入
✅ CORS预检缓存
✅ API响应压缩（gzip）
✅ CSS最小化
✅ 代码分割

---

## 🧪 性能测试

### 本地测试
```bash
# 构建分析
npm run build -- --report

# Chrome DevTools
1. 打开DevTools → Performance
2. 录制页面加载
3. 检查FCP、LCP、CLS
```

### Lighthouse评分

目标指标：
| 指标 | 当前 | 目标 |
|-----|-----|-----|
| Performance | 70 | 90↑ |
| Accessibility | 95 | 95↑ |
| Best Practices | 80 | 90↑ |
| SEO | 100 | 100 |

---

## 🐛 故障排查

### 1. API连接失败

**症状**: 图表不显示，控制台CORS错误

**解决**:
```javascript
// 检查后端是否启动
curl http://localhost:5000/api/health

// 检查API URL配置
console.log(process.env.VUE_APP_API_URL)

// 后端CORS设置
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000']
}))
```

### 2. 图表闪烁

**症状**: 更新时图表闪烁明显

**解决**:
```javascript
// 禁用动画
this.chart.update('none')  // 已使用

// 或降低更新频率
updateFrequency: 5000  // 改为5秒
```

### 3. 内存泄漏

**症状**: 长时间运行后应用卡顿

**检查**:
```javascript
// 确保清理interval和chart
beforeUnmount() {
  this.stopAutoUpdate();  // 清理interval
  if (this.chart) {
    this.chart.destroy();  // 销毁chart实例
  }
}
```

---

## 📈 监控指标

### 前端监控
```javascript
// 记录API响应时间
console.time('fetchAPI');
const data = await fetch(url);
console.timeEnd('fetchAPI');

// 记录图表渲染时间
console.time('renderChart');
this.createChart();
console.timeEnd('renderChart');
```

### 后端监控
```bash
# 查看后端日志
tail -f server.log

# 监控内存使用
node --max-old-space-size=512 server/index.js
```

---

## 🚀 下一阶段优化

1. **WebSocket实时推送**（替代轮询）
2. **Service Worker离线支持**
3. **图片/资源懒加载**
4. **数据库优化**（SQLite → PostgreSQL）
5. **CDN加速**（价格数据分发）
6. **LRU缓存策略**

---

## 📝 检查清单

- [x] 没有关键错误
- [x] API连接正常
- [x] 图表正确渲染
- [x] 响应式设计
- [x] 暗黑主题适配
- [ ] 生产环境测试
- [ ] 性能报告
- [ ] 文档完整

---

**最后更新**: 2026-04-03

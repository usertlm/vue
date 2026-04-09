<template>
  <div class="price-modal">

    <!-- 标题栏 -->
    <div class="modal-header">
      <div class="header-icon">🖥️</div>
      <h2 class="modal-title">电脑配件价格趋势</h2>
    </div>

    <!-- 分类选择 -->
    <div class="category-section">
      <p class="section-label">📦 选择配件类别</p>
      <div class="category-pills">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="category-pill"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <span class="pill-icon">{{ cat.icon }}</span>
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- 型号选择 -->
    <div class="model-section" v-if="selectedCategory">
      <p class="section-label">🔍 选择具体型号</p>
      <div class="model-grid">
        <button
          v-for="model in currentModels"
          :key="model.id"
          class="model-card"
          :class="{ active: selectedModel?.id === model.id }"
          @click="selectModel(model)"
        >
          <span class="model-tag">{{ model.tag }}</span>
          <span class="model-name">{{ model.name }}</span>
          <span class="model-price">¥{{ model.currentPrice.toLocaleString() }}</span>
        </button>
      </div>
    </div>

    <!-- 价格详情 & 图表 -->
    <div class="chart-section" v-if="selectedModel">
      <!-- 实时价格展示 -->
      <div class="price-spotlight">
        <div class="spotlight-chip">🔴 实时价格</div>
        <div class="spotlight-price">¥{{ selectedModel.currentPrice.toLocaleString() }}</div>
        <div class="spotlight-name">{{ selectedModel.name }}</div>
      </div>

      <!-- 时间范围选择 -->
      <div class="time-range-bar">
        <span class="range-label">📅 时间范围：</span>
        <div class="range-buttons">
          <button
            v-for="range in timeRanges"
            :key="range.value"
            class="range-btn"
            :class="{ active: selectedRange === range.value }"
            @click="selectedRange = range.value"
          >{{ range.label }}</button>
        </div>
      </div>

      <!-- SVG 折线图 -->
      <div class="chart-wrapper">
        <svg class="chart-svg" viewBox="0 0 680 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <!-- 网格线 -->
          <line v-for="i in 5" :key="'h'+i"
            :x1="10" :y1="i * 36" :x2="670" :y2="i * 36"
            stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4,4"/>
          <!-- Y轴价格标注 -->
          <text v-for="(label, i) in yLabels" :key="'y'+i"
            :x="8" :y="(5 - i) * 36 + 4"
            font-size="9" fill="#9ca3af" text-anchor="end">{{ label }}</text>
          <!-- 面积填充 -->
          <path :d="areaPath" fill="url(#chartGrad)"/>
          <!-- 折线 -->
          <path :d="linePath" fill="none" stroke="#7C3AED" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
          <!-- 数据点 -->
          <circle v-for="(pt, i) in chartPoints" :key="'pt'+i"
            :cx="pt.x" :cy="pt.y" r="4"
            fill="white" stroke="#7C3AED" stroke-width="2.5"
            class="chart-dot"/>
          <!-- X轴标注 -->
          <text v-for="(label, i) in xLabels" :key="'x'+i"
            :x="chartPoints[i]?.x" y="198"
            font-size="9" fill="#9ca3af" text-anchor="middle">{{ label }}</text>
        </svg>
      </div>

      <!-- 价格对比卡片 -->
      <div class="compare-cards">
        <div class="compare-card past">
          <div class="compare-icon">📅</div>
          <div class="compare-label">{{ rangeLabel }}前价格</div>
          <div class="compare-price">¥{{ pastPrice.toLocaleString() }}</div>
        </div>
        <div class="compare-arrow">
          <span :class="['trend-arrow', priceChange >= 0 ? 'up' : 'down']">
            {{ priceChange >= 0 ? '▲' : '▼' }}
          </span>
        </div>
        <div class="compare-card current">
          <div class="compare-icon">💰</div>
          <div class="compare-label">当前价格</div>
          <div class="compare-price">¥{{ selectedModel.currentPrice.toLocaleString() }}</div>
        </div>
        <div class="compare-card change" :class="priceChange >= 0 ? 'rose' : 'fell'">
          <div class="compare-icon">{{ priceChange >= 0 ? '📈' : '📉' }}</div>
          <div class="compare-label">涨幅</div>
          <div class="compare-price percent">
            {{ priceChange >= 0 ? '+' : '' }}{{ changePercent }}%
          </div>
        </div>
      </div>
    </div>

    <!-- 空态提示 -->
    <div class="empty-state" v-if="!selectedCategory">
      <div class="empty-mascot">🤖</div>
      <p>先选一个配件类别吧～</p>
    </div>
    <div class="empty-state" v-else-if="!selectedModel">
      <div class="empty-mascot">🔎</div>
      <p>再选择具体型号查看价格趋势！</p>
    </div>

    <!-- 底部装饰 -->
    <div class="modal-footer">
      <span class="footer-text">🕐 数据每小时更新 · 仅供参考</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PriceTrendChart',
  data() {
    return {
      selectedCategory: null,
      selectedModel: null,
      selectedRange: '1w',
      categories: [
        { id: 'cpu',  name: 'CPU 处理器', icon: '⚡' },
        { id: 'gpu',  name: '显卡 GPU',   icon: '🎮' },
        { id: 'ram',  name: '内存条',     icon: '🧠' },
        { id: 'ssd',  name: '固态硬盘',   icon: '💾' },
        { id: 'mb',   name: '主板',       icon: '🔧' },
        { id: 'psu',  name: '电源',       icon: '🔋' },
      ],
      timeRanges: [
        { label: '近1周', value: '1w' },
        { label: '近2周', value: '2w' },
        { label: '近1月', value: '1m' },
        { label: '近3月', value: '3m' },
        { label: '近6月', value: '6m' },
      ],
      modelsMap: {
        cpu: [
          { id:'c1', tag:'Intel', name:'i9-14900K', currentPrice:3899, trend:{ '1w':[3750,3780,3810,3830,3850,3875,3899], '2w':[3600,3640,3680,3710,3740,3780,3810,3830,3850,3870,3880,3890,3895,3899], '1m':[3400,3450,3500,3550,3600,3640,3680,3710,3740,3780,3810,3830,3850,3870,3880,3890,3895,3899,3898,3899,3897,3899,3900,3899,3898,3897,3899,3899,3898,3899], '3m':null, '6m':null } },
          { id:'c2', tag:'AMD',   name:'R9 7950X',  currentPrice:3299, trend:{ '1w':[3350,3330,3310,3305,3300,3298,3299], '2w':null, '1m':null, '3m':null, '6m':null } },
          { id:'c3', tag:'Intel', name:'i7-14700K', currentPrice:2699, trend:{ '1w':[2650,2660,2670,2680,2685,2690,2699], '2w':null, '1m':null, '3m':null, '6m':null } },
          { id:'c4', tag:'AMD',   name:'R7 7800X3D',currentPrice:2199, trend:{ '1w':[2300,2280,2260,2240,2220,2210,2199], '2w':null, '1m':null, '3m':null, '6m':null } },
        ],
        gpu: [
          { id:'g1', tag:'NVIDIA', name:'RTX 5090',   currentPrice:16999, trend:{ '1w':[16500,16600,16700,16800,16850,16900,16999], '2w':null, '1m':null, '3m':null, '6m':null } },
          { id:'g2', tag:'NVIDIA', name:'RTX 4090',   currentPrice:9999,  trend:{ '1w':[10200,10150,10100,10050,10020,10005,9999], '2w':null, '1m':null, '3m':null, '6m':null } },
          { id:'g3', tag:'AMD',    name:'RX 7900 XTX',currentPrice:5999,  trend:{ '1w':[5800,5830,5850,5870,5890,5950,5999], '2w':null, '1m':null, '3m':null, '6m':null } },
          { id:'g4', tag:'NVIDIA', name:'RTX 4070 Ti',currentPrice:4599,  trend:{ '1w':[4700,4680,4660,4640,4620,4610,4599], '2w':null, '1m':null, '3m':null, '6m':null } },
        ],
        ram: [
          { id:'r1', tag:'DDR5', name:'海盗船 32G DDR5-6000', currentPrice:699, trend:{ '1w':[720,715,710,705,703,700,699], '2w':null, '1m':null, '3m':null, '6m':null } },
          { id:'r2', tag:'DDR5', name:'芝奇 幻锋戟 32G',      currentPrice:749, trend:{ '1w':[730,735,738,741,744,747,749], '2w':null, '1m':null, '3m':null, '6m':null } },
          { id:'r3', tag:'DDR4', name:'金士顿 32G DDR4-3600', currentPrice:399, trend:{ '1w':[420,415,410,408,405,402,399], '2w':null, '1m':null, '3m':null, '6m':null } },
        ],
        ssd: [
          { id:'s1', tag:'NVMe', name:'三星 990 Pro 2TB',  currentPrice:999,  trend:{ '1w':[1050,1040,1030,1020,1010,1005,999], '2w':null, '1m':null, '3m':null, '6m':null } },
          { id:'s2', tag:'NVMe', name:'西数 SN850X 2TB',   currentPrice:899,  trend:{ '1w':[870,875,880,885,890,895,899], '2w':null, '1m':null, '3m':null, '6m':null } },
          { id:'s3', tag:'SATA', name:'三星 870 EVO 4TB',  currentPrice:1299, trend:{ '1w':[1350,1340,1330,1320,1310,1305,1299], '2w':null, '1m':null, '3m':null, '6m':null } },
        ],
        mb: [
          { id:'m1', tag:'Z790', name:'华硕 ROG MAXIMUS Z790',  currentPrice:5999, trend:{ '1w':[5900,5920,5940,5955,5965,5980,5999], '2w':null, '1m':null, '3m':null, '6m':null } },
          { id:'m2', tag:'X670', name:'微星 MEG X670E ACE',      currentPrice:3999, trend:{ '1w':[4100,4080,4060,4040,4020,4010,3999], '2w':null, '1m':null, '3m':null, '6m':null } },
          { id:'m3', tag:'B650', name:'华硕 TUF GAMING B650-E', currentPrice:1499, trend:{ '1w':[1480,1483,1486,1489,1492,1496,1499], '2w':null, '1m':null, '3m':null, '6m':null } },
        ],
        psu: [
          { id:'p1', tag:'1000W', name:'海盗船 RM1000x', currentPrice:1199, trend:{ '1w':[1220,1215,1210,1208,1205,1202,1199], '2w':null, '1m':null, '3m':null, '6m':null } },
          { id:'p2', tag:'850W',  name:'振华 LEADEX G850',currentPrice:699,  trend:{ '1w':[680,684,688,691,694,697,699], '2w':null, '1m':null, '3m':null, '6m':null } },
          { id:'p3', tag:'750W',  name:'安钛克 NE750G',   currentPrice:499,  trend:{ '1w':[510,508,506,504,502,500,499], '2w':null, '1m':null, '3m':null, '6m':null } },
        ],
      },
    }
  },
  computed: {
    currentModels() {
      return this.modelsMap[this.selectedCategory] || []
    },
    trendData() {
      if (!this.selectedModel) return []
      const raw = this.selectedModel.trend[this.selectedRange]
      if (raw) return raw
      return this.generateTrend(this.selectedModel.currentPrice, this.selectedRange)
    },
    chartPoints() {
      const data = this.trendData
      if (!data.length) return []
      const minV = Math.min(...data)
      const maxV = Math.max(...data)
      const pad = (maxV - minV) * 0.15 || 50
      const lo = minV - pad, hi = maxV + pad
      const W = 660, H = 170, ox = 20, oy = 10
      return data.map((v, i) => ({
        x: ox + (i / Math.max(data.length - 1, 1)) * W,
        y: oy + H - ((v - lo) / (hi - lo || 1)) * H,
      }))
    },
    linePath() {
      if (!this.chartPoints.length) return ''
      return this.chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
    },
    areaPath() {
      if (!this.chartPoints.length) return ''
      const pts = this.chartPoints
      const last = pts[pts.length - 1]
      return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
        + ` L${last.x},185 L${pts[0].x},185 Z`
    },
    yLabels() {
      const data = this.trendData
      if (!data.length) return []
      const minV = Math.min(...data), maxV = Math.max(...data)
      const pad = (maxV - minV) * 0.15 || 50
      const lo = minV - pad, hi = maxV + pad
      return Array.from({ length: 5 }, (_, i) =>
        '¥' + Math.round(lo + (i / 4) * (hi - lo)).toLocaleString()
      )
    },
    xLabels() {
      const n = this.trendData.length
      if (!n) return []
      const labels = []
      const rangeMap = { '1w': 7, '2w': 14, '1m': 30, '3m': 90, '6m': 180 }
      const days = rangeMap[this.selectedRange] || 7
      const step = Math.max(Math.floor(days / (n - 1)), 1)
      for (let i = 0; i < n; i++) {
        const d = new Date()
        d.setDate(d.getDate() - (n - 1 - i) * step)
        labels.push(`${d.getMonth() + 1}/${d.getDate()}`)
      }
      return labels
    },
    pastPrice() {
      return this.trendData[0] || 0
    },
    priceChange() {
      return this.selectedModel ? this.selectedModel.currentPrice - this.pastPrice : 0
    },
    changePercent() {
      if (!this.pastPrice) return '0.00'
      return ((this.priceChange / this.pastPrice) * 100).toFixed(2)
    },
    rangeLabel() {
      const map = { '1w': '1周', '2w': '2周', '1m': '1个月', '3m': '3个月', '6m': '6个月' }
      return map[this.selectedRange] || ''
    },
  },
  methods: {
    selectCategory(id) {
      this.selectedCategory = id
      this.selectedModel = null
    },
    selectModel(model) {
      this.selectedModel = model
    },
    generateTrend(currentPrice, range) {
      const countMap = { '1w': 7, '2w': 14, '1m': 30, '3m': 90, '6m': 180 }
      const n = countMap[range] || 7
      const result = []
      let price = currentPrice * (0.88 + Math.random() * 0.1)
      for (let i = 0; i < n; i++) {
        price += (Math.random() - 0.45) * currentPrice * 0.01
        result.push(Math.round(price))
      }
      result[n - 1] = currentPrice
      return result
    },
  },
}
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.price-modal {
  background: #faf8ff;
  border-radius: 24px;
  border: 3px solid #c4b5fd;
  box-shadow: 0 8px 32px rgba(109, 40, 217, 0.15);
  padding: 0 0 20px;
  font-family: 'Nunito', sans-serif;
  overflow: hidden;
}

/* ===== 标题栏 ===== */
.modal-header {
  background: linear-gradient(135deg, #7C3AED 0%, #a855f7 100%);
  padding: 18px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 28px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,.3));
  animation: wobble 3s ease-in-out infinite;
}

@keyframes wobble {
  0%,100% { transform: rotate(-5deg); }
  50%      { transform: rotate(5deg); }
}

.modal-title {
  font-family: 'Fredoka One', cursive;
  font-size: 20px;
  color: #fff;
  letter-spacing: .5px;
  text-shadow: 0 2px 4px rgba(0,0,0,.2);
  flex: 1;
}

/* ===== 区段公共 ===== */
.category-section, .model-section, .chart-section { padding: 16px 20px 0; }

.section-label {
  font-size: 12px;
  font-weight: 800;
  color: #7C3AED;
  letter-spacing: .3px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

/* ===== 分类 Pills ===== */
.category-pills { display: flex; flex-wrap: wrap; gap: 8px; }

.category-pill {
  border: 2.5px solid #e9d5ff;
  background: #fff;
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 700;
  color: #6b21a8;
  cursor: pointer;
  transition: all .2s;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Nunito', sans-serif;
}
.category-pill:hover { border-color: #a855f7; background: #f5f3ff; transform: translateY(-2px); }
.category-pill.active {
  background: linear-gradient(135deg, #7C3AED, #a855f7);
  border-color: #7C3AED;
  color: #fff;
  box-shadow: 0 4px 12px rgba(124,58,237,.4);
  transform: translateY(-2px);
}
.pill-icon { font-size: 15px; }

/* ===== 型号网格 ===== */
.model-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); gap: 10px; }

.model-card {
  border: 2.5px solid #e9d5ff;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  transition: all .2s;
  text-align: left;
}
.model-card:hover { border-color: #a855f7; transform: translateY(-3px); box-shadow: 0 6px 18px rgba(124,58,237,.15); }
.model-card.active {
  border-color: #7C3AED;
  background: #f5f3ff;
  box-shadow: 0 0 0 3px #ddd6fe, 0 6px 18px rgba(124,58,237,.2);
  transform: translateY(-3px);
}

.model-tag {
  font-size: 10px;
  font-weight: 900;
  color: #7C3AED;
  background: #ede9fe;
  border-radius: 6px;
  padding: 2px 7px;
}
.model-name { font-size: 12px; font-weight: 700; color: #1f2937; line-height: 1.3; }
.model-price { font-family: 'Fredoka One', cursive; font-size: 16px; color: #7C3AED; }

/* ===== 价格聚焦 ===== */
.price-spotlight {
  background: linear-gradient(135deg, #4c1d95, #7C3AED);
  border-radius: 18px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
  box-shadow: 0 6px 20px rgba(124,58,237,.3);
}

.spotlight-chip {
  font-size: 11px;
  font-weight: 900;
  color: #fff;
  background: rgba(255,255,255,.2);
  border-radius: 999px;
  padding: 4px 10px;
  white-space: nowrap;
  border: 1.5px solid rgba(255,255,255,.4);
}

.spotlight-price {
  font-family: 'Fredoka One', cursive;
  font-size: 32px;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,.3);
}

.spotlight-name { font-size: 13px; color: #ddd6fe; font-weight: 700; }

/* ===== 时间范围 ===== */
.time-range-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.range-label { font-size: 12px; font-weight: 800; color: #6b21a8; white-space: nowrap; }
.range-buttons { display: flex; gap: 6px; flex-wrap: wrap; }

.range-btn {
  border: 2px solid #ddd6fe;
  background: #fff;
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #7C3AED;
  cursor: pointer;
  transition: all .2s;
  font-family: 'Nunito', sans-serif;
}
.range-btn:hover { border-color: #a855f7; background: #f5f3ff; }
.range-btn.active {
  background: #7C3AED;
  border-color: #7C3AED;
  color: #fff;
  box-shadow: 0 3px 10px rgba(124,58,237,.35);
}

/* ===== 折线图 ===== */
.chart-wrapper {
  background: #fff;
  border-radius: 12px;
  border: 2.5px solid #e9d5ff;
  padding: 10px;
  margin-bottom: 14px;
  overflow: hidden;
}
.chart-svg { width: 100%; height: 200px; display: block; }
.chart-dot { transition: r .15s; }
.chart-dot:hover { r: 6; }

/* ===== 对比卡片 ===== */
.compare-cards {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.compare-card {
  flex: 1;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: 2.5px solid #e9d5ff;
  background: #fff;
}
.compare-card.past    { border-color: #bfdbfe; background: #eff6ff; }
.compare-card.current { border-color: #bbf7d0; background: #f0fdf4; }
.compare-card.rose    { border-color: #fecaca; background: #fff5f5; }
.compare-card.fell    { border-color: #bbf7d0; background: #f0fdf4; }

.compare-icon  { font-size: 20px; }
.compare-label { font-size: 11px; font-weight: 800; color: #6b7280; }
.compare-price {
  font-family: 'Fredoka One', cursive;
  font-size: 17px;
  color: #1f2937;
}
.compare-price.percent { font-size: 20px; }
.compare-card.rose .compare-price { color: #ef4444; }
.compare-card.fell .compare-price { color: #22c55e; }

.compare-arrow {
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.trend-arrow.up   { color: #ef4444; }
.trend-arrow.down { color: #22c55e; }

/* ===== 空态 ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 28px;
  color: #9ca3af;
  font-weight: 700;
  font-size: 14px;
}
.empty-mascot { font-size: 48px; animation: float 3s ease-in-out infinite; }
@keyframes float { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-10px) } }

/* ===== 底部 ===== */
.modal-footer {
  margin-top: 14px;
  padding: 0 20px;
  text-align: center;
}
.footer-text {
  font-size: 11px;
  color: #c4b5fd;
  font-weight: 700;
  background: #f5f3ff;
  border-radius: 999px;
  padding: 5px 14px;
  display: inline-block;
  border: 1.5px solid #ede9fe;
}

/* ===== 滚动条 ===== */
.price-modal::-webkit-scrollbar { width: 6px; }
.price-modal::-webkit-scrollbar-track { background: transparent; }
.price-modal::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 3px; }
</style>

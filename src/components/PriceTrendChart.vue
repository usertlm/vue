<template>
  <div class="price-wrap">

    <!-- ── 标题区 ── -->
    <div class="price-hero">
      <div class="hero-text">
        <div class="hero-badge">🖥️ 装机必备</div>
        <h2 class="hero-title">配件价格趋势</h2>
        <p class="hero-desc">
          实时追踪京东 / 淘宝 全网最低价，<br>
          智能分析历史走势，告诉你最佳入手时机 💰
        </p>
      </div>
      <div class="hero-stats">
        <div class="stat-card">
          <span class="stat-num">{{ totalItems }}</span>
          <span class="stat-label">收录型号</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">6</span>
          <span class="stat-label">商品类别</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">10min</span>
          <span class="stat-label">自动刷新</span>
        </div>
      </div>
    </div>

    <!-- ── 搜索 + 筛选 ── -->
    <div class="filter-bar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQ"
          class="search-input"
          placeholder="搜索型号：RTX 5090 / i9 285K / DDR5 32GB..."
          @input="onSearch"
        />
        <button v-if="searchQ" @click="searchQ=''; onSearch()" class="search-clear">✕</button>
      </div>

      <div class="category-pills">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="cat-pill"
          :class="{ active: activeCat === cat.id }"
          @click="setCat(cat.id)"
        >
          <span class="pill-icon">{{ cat.icon }}</span>
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- ── 选中配件对比区 ── -->
    <transition name="slide-up">
      <div class="compare-zone" v-if="selected.length > 0">
        <div class="compare-header">
          <div class="compare-title">
            <span>📈</span> 价格对比
            <span class="compare-count">{{ selected.length }} 个型号</span>
          </div>
          <div class="compare-actions">
            <button class="range-btn" v-for="r in ranges" :key="r.id"
              :class="{ active: range === r.id }" @click="range = r.id">
              {{ r.label }}
            </button>
            <button class="deselect-btn" @click="selected = []; selectedObjs = []">
              清空对比
            </button>
          </div>
        </div>

        <!-- 对比图表 -->
        <div class="chart-card">
          <div class="chart-legend-row">
            <span
              v-for="(obj, idx) in selectedObjs"
              :key="obj.id"
              class="legend-chip"
              :style="{ '--chip-color': chipColors[idx % chipColors.length] }"
            >
              <span class="chip-dot"></span>
              {{ obj.name }}
              <button class="chip-remove" @click="deselect(obj.id)">✕</button>
            </span>
          </div>
          <div class="chart-area">
            <canvas ref="compareCanvas"></canvas>
          </div>
        </div>

        <!-- 价格明细卡 -->
        <div class="price-cards-row">
          <div
            v-for="(obj, idx) in selectedObjs"
            :key="obj.id"
            class="price-detail-card"
            :style="{ '--card-accent': chipColors[idx % chipColors.length] }"
          >
            <div class="detail-header">
              <span class="detail-name">{{ obj.name }}</span>
              <span class="detail-trend" :class="trendClass(obj)">{{ trendIcon(obj) }}</span>
            </div>
            <div class="detail-price">¥{{ obj.price.toLocaleString() }}</div>
            <div class="detail-stats">
              <div class="stat-item">
                <span class="stat-key">均价</span>
                <span class="stat-val">¥{{ avgPrice(obj).toLocaleString() }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-key">最低</span>
                <span class="stat-val low">¥{{ minPrice(obj).toLocaleString() }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-key">趋势</span>
                <span class="stat-val" :class="trendClass(obj)">{{ trendText(obj) }}</span>
              </div>
            </div>
            <!-- 迷你柱状图 -->
            <div class="mini-bars">
              <div
                v-for="(h, i) in last7History(obj)"
                :key="i"
                class="mini-bar"
                :style="{ height: barHeight(h.price, obj) + 'px' }"
                :title="`¥${h.price}`"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- ── 商品网格 ── -->
    <div class="products-section">
      <div class="section-sub-header">
        <span v-if="!searchQ">👇 点击卡片加入价格对比</span>
        <span v-else>🔍 搜索结果 "{{ searchQ }}"</span>
      </div>

      <div class="product-grid" v-if="displayItems.length > 0">
        <button
          v-for="item in displayItems"
          :key="item.id"
          class="product-card"
          :class="{ selected: selected.has(item.id) }"
          @click="toggleSelect(item)"
        >
          <div class="card-top">
            <span class="card-cat-tag">{{ catLabel(item.cat) }}</span>
            <span class="card-check" v-if="selected.has(item.id)">✓</span>
          </div>
          <div class="card-name">{{ item.name }}</div>
          <div class="card-price">¥{{ item.price.toLocaleString() }}</div>
          <div class="card-trend" :class="trendClass(item)">
            <span>{{ trendIcon(item) }}</span> {{ trendText(item) }}
          </div>
          <!-- 7天迷你折线 -->
          <div class="card-sparkline">
            <svg viewBox="0 0 60 24" class="sparkline-svg">
              <polyline
                :points="sparklinePoints(item)"
                fill="none"
                :stroke="selected.has(item.id) ? '#c96442' : '#b0aea5'"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </button>
      </div>

      <div class="empty-grid" v-else>
        <div class="empty-emoji">🔍</div>
        <p>未找到 "{{ searchQ }}" 相关配件</p>
        <p class="empty-hint">试试更通用的名称，如 "RTX" / "DDR5" / "i9"</p>
      </div>
    </div>

    <!-- ── 价格提示卡 ── -->
    <div class="tips-row">
      <div class="tip-card tip-green">
        <div class="tip-icon">💚</div>
        <div class="tip-body">
          <strong>价格下降时入手</strong>
          <p>当显示"低于均价"时，通常是入手好时机。我们追踪 30 天均价帮你判断。</p>
        </div>
      </div>
      <div class="tip-card tip-orange">
        <div class="tip-icon">🧡</div>
        <div class="tip-body">
          <strong>关注历史最低价</strong>
          <p>点击配件卡片可以看到历史最低价。如果接近该价格，就不要犹豫了！</p>
        </div>
      </div>
      <div class="tip-card tip-blue">
        <div class="tip-icon">💙</div>
        <div class="tip-body">
          <strong>多型号横向对比</strong>
          <p>选择同价位多款配件可以直观对比价格走势，发现性价比之王。</p>
        </div>
      </div>
    </div>

    <!-- ── 数据来源 ── -->
    <div class="data-source">
      数据来源：京东 · 淘宝 · 拼多多 ｜ 每 10 分钟自动刷新 ｜
      <span v-if="lastUpdated">最后更新：{{ friendlyTime(lastUpdated) }}</span>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import priceData from('../data/price-history.json');
Chart.register(...registerables);

const RANGES = [
  { id: '7d',  label: '7天',  days: 7  },
  { id: '30d', label: '30天', days: 30 },
  { id: '90d', label: '90天', days: 90 },
];

const CHIPC = ['#FF9B9B', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF', '#FF9F43', '#a8dadc'];

export default {
  name: 'PriceTrendChart',
  data() {
    return {
      searchQ: '',
      activeCat: 'all',
      selected: new Set(),
      selectedObjs: [],
      range: '30d',
      chart: null,
      compareCanvas: null,
      lastUpdated: priceData.lastUpdated || null,
      chipColors: CHIPC,
      ranges: RANGES,
      categories: [
        { id: 'all',  icon: '🔍', label: '全部' },
        { id: 'cpu',  icon: '💻', label: 'CPU' },
        { id: 'gpu',  icon: '🎮', label: '显卡' },
        { id: 'ram',  icon: '🧠', label: '内存' },
        { id: 'ssd',  icon: '💾', label: 'SSD' },
        { id: 'mb',   icon: '🔲', label: '主板' },
        { id: 'cool', icon: '❄️', label: '散热' },
      ],
    };
  },
  computed: {
    allItems() {
      const result = [];
      const catMap = { cpu:'cpu', gpu:'gpu', ram:'ram', ssd:'ssd', mb:'mb', cool:'cool' };
      for (const [ck, items] of Object.entries(priceData.categories)) {
        for (const item of items) {
          result.push({ ...item, id: item.id || `${ck}-${item.name}`, cat: catMap[ck] || ck });
        }
      }
      return result;
    },
    displayItems() {
      let items = this.activeCat === 'all'
        ? this.allItems
        : this.allItems.filter(i => i.cat === this.activeCat);
      if (this.searchQ.trim()) {
        const q = this.searchQ.toLowerCase();
        items = items.filter(i => i.name.toLowerCase().includes(q));
      }
      return items;
    },
    totalItems() {
      return this.allItems.length;
    },
    activeDays() {
      return RANGES.find(r => r.id === this.range)?.days || 30;
    },
  },
  methods: {
    setCat(cat) { this.activeCat = cat; },
    onSearch() { /* driven by computed */ },

    toggleSelect(item) {
      if (this.selected.has(item.id)) {
        this.selected.delete(item.id);
      } else {
        if (this.selected.size >= 6) return; // max 6 for readability
        this.selected.add(item.id);
      }
      this.selectedObjs = this.allItems.filter(i => this.selected.has(i.id));
      this.buildChart();
    },
    deselect(id) {
      this.selected.delete(id);
      this.selectedObjs = this.allItems.filter(i => this.selected.has(i.id));
      this.buildChart();
    },

    // ── 历史数据 helpers ──
    historySlice(item, days) {
      const cutoff = Date.now() - days * 86400000;
      return (item.history || []).filter(h => new Date(h.time).getTime() >= cutoff);
    },
    avgPrice(item) {
      const h = this.historySlice(item, this.activeDays);
      if (!h.length) return item.price;
      return Math.round(h.reduce((s, x) => s + x.price, 0) / h.length);
    },
    minPrice(item) {
      const h = this.historySlice(item, this.activeDays);
      if (!h.length) return item.price;
      return Math.min(...h.map(x => x.price));
    },
    maxPrice(item) {
      const h = this.historySlice(item, this.activeDays);
      if (!h.length) return item.price;
      return Math.max(...h.map(x => x.price));
    },
    last7History(item) {
      return (item.history || []).slice(-7);
    },
    trendClass(item) {
      const diff = ((item.price - this.avgPrice(item)) / this.avgPrice(item)) * 100;
      if (diff < -3) return 'trend-low';
      if (diff > 3)  return 'trend-high';
      return 'trend-flat';
    },
    trendIcon(item) {
      const diff = ((item.price - this.avgPrice(item)) / this.avgPrice(item)) * 100;
      if (diff < -3) return '📉';
      if (diff > 3)  return '📈';
      return '➡️';
    },
    trendText(item) {
      const diff = ((item.price - this.avgPrice(item)) / this.avgPrice(item)) * 100;
      if (diff < -3) return `↓ ${Math.abs(diff).toFixed(1)}% 低于均价`;
      if (diff > 3)  return `↑ ${diff.toFixed(1)}% 高于均价`;
      return '→ 价格平稳';
    },
    catLabel(cat) {
      return this.categories.find(c => c.id === cat)?.label || cat;
    },
    barHeight(price, item) {
      const min = this.minPrice(item);
      const max = this.maxPrice(item);
      const range = max - min || 1;
      return Math.max(4, ((price - min) / range) * 40 + 4);
    },
    sparklinePoints(item) {
      const h = this.last7History(item);
      if (h.length < 2) return '';
      const prices = h.map(x => x.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const range = max - min || 1;
      return prices.map((p, i) => {
        const x = (i / (prices.length - 1)) * 60;
        const y = 22 - ((p - min) / range) * 18;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
    },
    friendlyTime(iso) {
      if (!iso) return '';
      const d = new Date(iso);
      return d.toLocaleString('zh-CN', { month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
    },

    // ── Chart ──
    buildChart() {
      if (!this.$refs.compareCanvas) return;
      const canvas = this.$refs.compareCanvas;
      const ctx = canvas.getContext('2d');

      if (!this.selectedObjs.length) {
        if (this.chart) { this.chart.destroy(); this.chart = null; }
        return;
      }

      const datasets = this.selectedObjs.map((obj, idx) => {
        const h = this.historySlice(obj, this.activeDays);
        const labels = h.map(p => {
          const d = new Date(p.time);
          return `${d.getMonth()+1}/${d.getDate()}`;
        });
        const prices = h.map(p => p.price);

        // Sync labels across all datasets
        if (!this.chart) {
          this.chart = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets: [] },
            options: this.chartOptions(),
          });
        }
        this.chart.data.labels = labels;

        const color = CHIPC[idx % CHIPC.length];
        const gradient = ctx.createLinearGradient(0, 0, 0, 260);
        gradient.addColorStop(0, color + '55');
        gradient.addColorStop(1, color + '00');

        return {
          label: obj.name,
          data: prices,
          borderColor: color,
          backgroundColor: gradient,
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: color,
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
          pointHoverRadius: 6,
          tension: 0.45,
          fill: true,
        };
      });

      if (!this.chart) {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: { labels: [], datasets },
          options: this.chartOptions(),
        });
      } else {
        this.chart.data.datasets = datasets;
        this.chart.update('none');
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(255,255,255,0.96)',
            titleColor: '#4d4c48',
            bodyColor: '#87867f',
            borderColor: '#f0eee6',
            borderWidth: 1.5,
            padding: 12,
            cornerRadius: 12,
            titleFont: { family: 'Georgia', size: 13, weight: 'bold' },
            bodyFont: { family: 'Arial', size: 12 },
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ¥${ctx.parsed.y.toLocaleString()}`,
            }
          }
        },
        scales: {
          y: {
            grid: { color: '#f0eee6', drawBorder: false },
            ticks: {
              color: '#87867f', font: { size: 11 },
              callback: v => '¥' + (v >= 1000 ? (v/1000).toFixed(0)+'k' : v),
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#87867f', font: { size: 10 }, maxTicksLimit: 10 }
          }
        }
      };
    },
  },
  beforeUnmount() {
    if (this.chart) { this.chart.destroy(); this.chart = null; }
  },
};
</script>

<style scoped>
/* Claude Design System — PriceTrendChart */
:host {
  display: block;
  font-family: Arial, system-ui, -apple-system, sans-serif;
  color: #141413;
}

/* ── Google Fonts ── */
.price-wrap {
  font-family: Arial, system-ui, sans-serif;
  font-family: 'Noto Sans SC', 'Noto Sans', Arial, sans-serif;
  color: var(--color-near-black, #141413);
}

/* ── Hero ── */
.price-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.hero-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #c96442;
  background: rgba(201,100,66,0.10);
  border: 1px solid rgba(201,100,66,0.20);
  padding: 4px 12px;
  border-radius: 12px;
  margin-bottom: 10px;
  letter-spacing: 0.3px;
}

.hero-title {
  font-family: 'Fredoka', 'Georgia', serif;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 600;
  color: #141413;
  margin-bottom: 10px;
  line-height: 1.2;
}

.hero-desc {
  font-size: 15px;
  color: #87867f;
  line-height: 1.70;
  max-width: 360px;
}

.hero-stats {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.stat-card {
  background: #fff;
  border: 1.5px solid #f0eee6;
  border-radius: 12px;
  padding: 14px 18px;
  text-align: center;
  min-width: 80px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.stat-num {
  display: block;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 22px;
  font-weight: 600;
  color: #c96442;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #87867f;
  white-space: nowrap;
}

/* ── Filter Bar ── */
.filter-bar {
  margin-bottom: 24px;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 2px solid #f0eee6;
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-wrap:focus-within {
  border-color: #c96442;
  box-shadow: 0 0 0 3px rgba(201,100,66,0.10);
}

.search-icon { font-size: 16px; flex-shrink: 0; }

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #141413;
  background: transparent;
  font-family: Arial, system-ui, sans-serif;
}

.search-input::placeholder { color: #b0aea5; }

.search-clear {
  background: none;
  border: none;
  color: #b0aea5;
  cursor: pointer;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 50%;
  transition: color 0.2s;
}
.search-clear:hover { color: #4d4c48; }

.category-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cat-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 16px;
  border: 1.5px solid #f0eee6;
  background: #fff;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 500;
  color: #5e5d59;
  cursor: pointer;
  transition: all 0.15s;
  font-family: Arial, system-ui, sans-serif;
}

.cat-pill:hover { border-color: #c96442; color: #c96442; }

.cat-pill.active {
  background: #c96442;
  border-color: #c96442;
  color: #fff;
  box-shadow: 0 2px 8px rgba(201,100,66,0.25);
}

.pill-icon { font-size: 14px; }

/* ── Compare Zone ── */
.compare-zone {
  background: #fff;
  border: 1.5px solid #f0eee6;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.compare-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 12px;
}

.compare-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 18px;
  font-weight: 600;
  color: #141413;
  display: flex;
  align-items: center;
  gap: 6px;
}

.compare-count {
  font-size: 12px;
  font-weight: 400;
  color: #87867f;
  font-family: Arial, system-ui, sans-serif;
  margin-left: 4px;
}

.compare-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.range-btn {
  padding: 5px 14px;
  border: 1.5px solid #f0eee6;
  background: #faf9f5;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #87867f;
  cursor: pointer;
  transition: all 0.15s;
  font-family: Arial, system-ui, sans-serif;
}

.range-btn.active {
  background: #141413;
  border-color: #141413;
  color: #fff;
}

.range-btn:hover:not(.active) { border-color: #c96442; color: #c96442; }

.deselect-btn {
  padding: 5px 12px;
  border: none;
  background: #faf9f5;
  border-radius: 12px;
  font-size: 12px;
  color: #b0aea5;
  cursor: pointer;
  transition: color 0.15s;
  font-family: Arial, system-ui, sans-serif;
}
.deselect-btn:hover { color: #c62828; }

/* ── Chart ── */
.chart-card {
  background: #faf9f5;
  border: 1px solid #f0eee6;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.chart-legend-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.legend-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px 4px 6px;
  background: 'rgba(255,155,155,0.13)' /* chip color 22% */;
  border: 1px solid 'rgba(255,155,155,0.33)' /* chip color 55% */;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #4d4c48;
}

.chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--chip-color);
  flex-shrink: 0;
}

.chip-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 10px;
  color: #87867f;
  margin-left: 2px;
  padding: 0;
  line-height: 1;
}
.chip-remove:hover { color: #c62828; }

.chart-area {
  height: 260px;
  position: relative;
}

/* ── Price Detail Cards ── */
.price-cards-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.price-detail-card {
  background: #faf9f5;
  border: 1.5px solid #f0eee6;
  border-top: 3px solid var(--card-accent, #c96442);
  border-radius: 12px;
  padding: 14px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.detail-name {
  font-size: 12px;
  font-weight: 600;
  color: #4d4c48;
  line-height: 1.3;
  flex: 1;
}

.detail-trend { font-size: 14px; }

.detail-price {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 22px;
  font-weight: 600;
  color: #141413;
  margin-bottom: 8px;
}

.detail-stats {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-key {
  font-size: 10px;
  color: #b0aea5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-val {
  font-size: 12px;
  font-weight: 600;
  color: #4d4c48;
}

.stat-val.low { color: #2e7d32; }
.trend-low  { color: #2e7d32; }
.trend-high { color: #c62828; }
.trend-flat { color: #87867f; }

.mini-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 44px;
}

.mini-bar {
  flex: 1;
  background: var(--card-accent, #c96442);
  border-radius: 3px 3px 0 0;
  opacity: 0.6;
  transition: opacity 0.2s;
  min-height: 4px;
}
.mini-bar:hover { opacity: 1; }

/* ── Products Grid ── */
.products-section { margin-bottom: 28px; }

.section-sub-header {
  font-size: 13px;
  color: #87867f;
  margin-bottom: 14px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 12px;
}

.product-card {
  background: #fff;
  border: 1.5px solid #f0eee6;
  border-radius: 12px;
  padding: 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  font-family: Arial, system-ui, sans-serif;
}

.product-card:hover {
  border-color: #c96442;
  box-shadow: 0 4px 16px rgba(201,100,66,0.12);
  transform: translateY(-2px);
}

.product-card.selected {
  border-color: #c96442;
  background: rgba(201,100,66,0.04);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-cat-tag {
  font-size: 10px;
  padding: 2px 8px;
  background: #f5f4ed;
  border-radius: 10px;
  color: #87867f;
  font-weight: 500;
}

.card-check {
  font-size: 13px;
  color: #c96442;
  font-weight: bold;
}

.card-name {
  font-size: 13px;
  font-weight: 500;
  color: #4d4c48;
  line-height: 1.35;
  margin-bottom: 6px;
  min-height: 34px;
}

.card-price {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 18px;
  font-weight: 600;
  color: #141413;
  margin-bottom: 5px;
}

.card-trend {
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.card-sparkline {
  height: 24px;
  opacity: 0.7;
}

.sparkline-svg { width: 100%; height: 100%; }

/* ── Empty / Error ── */
.empty-grid {
  text-align: center;
  padding: 48px 24px;
  background: #fff;
  border: 1.5px dashed #e8e6dc;
  border-radius: 12px;
}

.empty-emoji { font-size: 40px; margin-bottom: 12px; }
.empty-grid p { font-size: 15px; color: #4d4c48; margin-bottom: 6px; }
.empty-hint { font-size: 13px !important; color: #b0aea5 !important; }

/* ── Tips ── */
.tips-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.tip-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid;
}

.tip-green  { background: rgba(46,125,50,0.06);  border-color: rgba(46,125,50,0.20); }
.tip-orange { background: rgba(230,124,34,0.06); border-color: rgba(230,124,34,0.20); }
.tip-blue   { background: rgba(25,118,210,0.06); border-color: rgba(25,118,210,0.20); }

.tip-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }

.tip-body strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #141413;
  margin-bottom: 4px;
}

.tip-body p {
  font-size: 12px;
  color: #87867f;
  line-height: 1.60;
  margin: 0;
}

/* ── Data Source ── */
.data-source {
  text-align: center;
  font-size: 12px;
  color: #b0aea5;
  padding: 12px;
  border-top: 1px solid #f0eee6;
}

/* ── Animations ── */
.slide-up-enter-active { animation: slideUp 0.3s ease; }
.slide-up-leave-active { animation: slideUp 0.2s ease reverse; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .price-hero { flex-direction: column; }
  .hero-stats { width: 100%; justify-content: space-between; }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .compare-header { flex-direction: column; align-items: flex-start; }
  .price-cards-row { grid-template-columns: 1fr 1fr; }
  .chart-area { height: 200px; }
}
</style>

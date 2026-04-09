<template>
  <div class="price-section">
    <!-- Section Header -->
    <div class="section-header">
      <div class="section-eyebrow">🖥️ 配件价格</div>
      <h2 class="section-title">电脑配件价格趋势</h2>
      <p class="section-desc">实时追踪主流电商平台价格，支持搜索与多型号对比</p>
    </div>

    <!-- Search Bar -->
    <div class="price-search-bar">
      <input
        v-model="searchQuery"
        type="text"
        class="price-search-input"
        placeholder="搜索配件型号，如 RTX 5090 / i9 285K / DDR5 32GB..."
        @input="onSearch"
      />
      <button v-if="searchQuery" @click="searchQuery = ''; onSearch()" class="clear-btn">✕</button>
    </div>

    <!-- Category Tabs -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="cat-tab"
        :class="{ active: activeCategory === cat.id }"
        @click="setCategory(cat.id)"
      >
        {{ cat.icon }} {{ cat.label }}
      </button>
    </div>

    <!-- Product Grid -->
    <div class="product-grid" v-if="!searchQuery">
      <button
        v-for="item in currentCategoryItems"
        :key="item.id"
        class="product-card"
        :class="{ selected: selectedItems.has(item.id) }"
        @click="toggleItem(item)"
      >
        <div class="product-top">
          <span class="product-name">{{ item.name }}</span>
          <span v-if="selectedItems.has(item.id)" class="selected-badge">✓</span>
        </div>
        <div class="product-price">¥{{ item.price.toLocaleString() }}</div>
        <div class="product-trend" :class="getTrendClass(item)">
          {{ getTrendLabel(item) }}
        </div>
      </button>
    </div>

    <!-- Search Results -->
    <div class="search-results" v-else>
      <div v-if="searchResults.length === 0" class="no-results">
        未找到 "{{ searchQuery }}" 相关配件
      </div>
      <div v-else class="product-grid">
        <button
          v-for="item in searchResults"
          :key="item.id"
          class="product-card"
          :class="{ selected: selectedItems.has(item.id) }"
          @click="toggleItem(item)"
        >
          <div class="product-top">
            <span class="product-name">{{ item.name }}</span>
            <span v-if="selectedItems.has(item.id)" class="selected-badge">✓</span>
          </div>
          <div class="product-price">¥{{ item.price.toLocaleString() }}</div>
          <div class="product-cat-tag">{{ getCategoryLabel(item.category) }}</div>
        </button>
      </div>
    </div>

    <!-- Selected Items Summary -->
    <div class="selected-summary" v-if="selectedItems.size > 0">
      <span class="summary-label">已选择 ({{ selectedItems.size }})：</span>
      <div class="selected-chips">
        <span
          v-for="item in selectedItemObjects"
          :key="item.id"
          class="selected-chip"
          @click="toggleItem(item)"
        >
          {{ item.name }} ✕
        </span>
      </div>
      <button v-if="selectedItems.size > 1" @click="selectedItems.clear()" class="clear-all-btn">
        清除全部
      </button>
    </div>

    <!-- Chart Section -->
    <div class="chart-container" v-if="selectedItems.size > 0">
      <div class="chart-header-row">
        <h3 class="chart-title">{{ selectedItems.size === 1 ? selectedItemObjects[0]?.name + ' 价格走势' : '价格对比走势' }}</h3>
        <div class="time-range-tabs">
          <button
            v-for="range in timeRanges"
            :key="range.id"
            class="range-btn"
            :class="{ active: activeRange === range.id }"
            @click="setTimeRange(range.id)"
          >
            {{ range.label }}
          </button>
        </div>
      </div>

      <div class="chart-wrapper">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <!-- Price Table -->
      <div class="price-table">
        <table>
          <thead>
            <tr>
              <th>型号</th>
              <th>当前价格</th>
              <th>均价 ({{ activeRangeLabel }})</th>
              <th>最低价</th>
              <th>趋势</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in selectedItemObjects" :key="item.id">
              <td class="item-name">{{ item.name }}</td>
              <td class="item-price">¥{{ item.price.toLocaleString() }}</td>
              <td class="item-avg">¥{{ getAvgPrice(item).toLocaleString() }}</td>
              <td class="item-low">¥{{ getLowPrice(item).toLocaleString() }}</td>
              <td :class="getTrendClass(item)">{{ getTrendLabel(item) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div class="empty-state" v-else>
      <div class="empty-icon">📊</div>
      <p>从上方选择一个或多个配件型号</p>
      <p class="empty-sub">查看价格走势、对比历史数据、发现最佳入手时机</p>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import priceData from('../data/price-history.json');
Chart.register(...registerables);

export default {
  name: 'PriceTrendChart',
  data() {
    return {
      searchQuery: '',
      activeCategory: 'all',
      selectedItems: new Set(),
      selectedItemObjects: [],
      activeRange: '7d',
      chart: null,
      chartCanvas: null,
      timeRanges: [
        { id: '7d', label: '7天' },
        { id: '30d', label: '30天' },
        { id: '90d', label: '90天' },
      ],
      categories: [
        { id: 'all', icon: '🔍', label: '全部' },
        { id: 'cpu', icon: '💻', label: 'CPU' },
        { id: 'gpu', icon: '🎮', label: '显卡' },
        { id: 'ram', icon: '🧠', label: '内存' },
        { id: 'ssd', icon: '💾', label: 'SSD' },
        { id: 'mb', icon: '🔲', label: '主板' },
        { id: 'cool', icon: '❄️', label: '散热' },
      ],
    };
  },
  computed: {
    allItems() {
      const items = [];
      const catMap = { cpu: 'cpu', gpu: 'gpu', ram: 'ram', ssd: 'ssd', mb: 'mb', cool: 'cool' };
      for (const [catKey, catItems] of Object.entries(priceData.categories)) {
        for (const item of catItems) {
          items.push({ ...item, id: item.id || `${catKey}-${item.name}`, category: catMap[catKey] || catKey });
        }
      }
      return items;
    },
    currentCategoryItems() {
      if (this.activeCategory === 'all') return this.allItems;
      return this.allItems.filter(i => i.category === this.activeCategory);
    },
    searchResults() {
      if (!this.searchQuery.trim()) return [];
      const q = this.searchQuery.toLowerCase();
      return this.allItems.filter(i => i.name.toLowerCase().includes(q));
    },
    activeRangeLabel() {
      return this.timeRanges.find(r => r.id === this.activeRange)?.label || '7天';
    },
  },
  methods: {
    setCategory(catId) {
      this.activeCategory = catId;
    },
    onSearch() {
      // handled by computed
    },
    toggleItem(item) {
      if (this.selectedItems.has(item.id)) {
        this.selectedItems.delete(item.id);
      } else {
        this.selectedItems.add(item.id);
      }
      this.selectedItemObjects = this.allItems.filter(i => this.selectedItems.has(i.id));
      this.updateChart();
    },
    setTimeRange(rangeId) {
      this.activeRange = rangeId;
      this.updateChart();
    },
    getHistoryForItem(item, days) {
      if (!item.history || item.history.length === 0) return [];
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      return item.history.filter(h => new Date(h.time).getTime() >= cutoff);
    },
    getLabels(history) {
      return history.map(h => {
        const d = new Date(h.time);
        return `${d.getMonth()+1}/${d.getDate()}`;
      });
    },
    getPrices(history) {
      return history.map(h => h.price);
    },
    getAvgPrice(item) {
      const history = this.getHistoryForItem(item, this.getDaysFromRange());
      if (history.length === 0) return item.price;
      return Math.round(history.reduce((sum, h) => sum + h.price, 0) / history.length);
    },
    getLowPrice(item) {
      const history = this.getHistoryForItem(item, this.getDaysFromRange());
      if (history.length === 0) return item.price;
      return Math.min(...history.map(h => h.price));
    },
    getTrendClass(item) {
      const avg = this.getAvgPrice(item);
      const diff = ((item.price - avg) / avg) * 100;
      if (diff < -5) return 'trend-down';
      if (diff > 5) return 'trend-up';
      return 'trend-stable';
    },
    getTrendLabel(item) {
      const avg = this.getAvgPrice(item);
      const diff = ((item.price - avg) / avg) * 100;
      if (diff < -5) return `↓ ${Math.abs(diff).toFixed(1)}% 低于均价`;
      if (diff > 5) return `↑ ${diff.toFixed(1)}% 高于均价`;
      return '→ 价格稳定';
    },
    getDaysFromRange() {
      return { '7d': 7, '30d': 30, '90d': 90 }[this.activeRange] || 7;
    },
    getCategoryLabel(cat) {
      return this.categories.find(c => c.id === cat)?.label || cat;
    },
    buildChartDatasets() {
      const colors = [
        '#c96442', '#d97757', '#3d3d3a', '#87867f',
        '#4d4c48', '#5e5d59', '#b0aea5'
      ];
      return this.selectedItemObjects.map((item, idx) => {
        const history = this.getHistoryForItem(item, this.getDaysFromRange());
        const labels = this.getLabels(history);
        const prices = this.getPrices(history);

        if (this.chart && this.chart.data.labels.length > 0) {
          // Pad arrays to match chart labels length
          const chartLen = this.chart.data.labels.length;
          while (labels.length < chartLen) {
            labels.unshift(labels[0] || '');
            prices.unshift(prices[0] || item.price);
          }
          while (labels.length > chartLen) {
            labels.shift();
            prices.shift();
          }
        }

        return {
          label: item.name,
          data: prices,
          borderColor: colors[idx % colors.length],
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: colors[idx % colors.length],
          tension: 0.4,
          fill: false,
        };
      });
    },
    updateChart() {
      if (!this.$refs.chartCanvas) return;

      const ctx = this.$refs.chartCanvas.getContext('2d');

      if (!this.chart) {
        this.chart = new Chart(ctx, {
          type: 'line',
          data: { labels: [], datasets: [] },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  font: { family: 'Georgia', size: 12 },
                  color: '#5e5d59',
                  padding: 16,
                  usePointStyle: true,
                  pointStyleWidth: 8,
                }
              },
              tooltip: {
                backgroundColor: 'rgba(250,249,245,0.95)',
                titleColor: '#141413',
                bodyColor: '#5e5d59',
                borderColor: '#f0eee6',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                  label: ctx => `${ctx.dataset.label}: ¥${ctx.parsed.y.toLocaleString()}`
                }
              }
            },
            scales: {
              y: {
                grid: { color: '#f0eee6', drawBorder: false },
                ticks: {
                  color: '#87867f',
                  font: { size: 11 },
                  callback: v => '¥' + v.toLocaleString()
                }
              },
              x: {
                grid: { display: false },
                ticks: { color: '#87867f', font: { size: 10 }, maxTicksLimit: 12 }
              }
            }
          }
        });
      }

      if (this.selectedItemObjects.length === 0) {
        this.chart.destroy();
        this.chart = null;
        return;
      }

      const firstHistory = this.getHistoryForItem(this.selectedItemObjects[0], this.getDaysFromRange());
      const labels = this.getLabels(firstHistory);
      const datasets = this.buildChartDatasets();

      this.chart.data.labels = labels;
      this.chart.data.datasets = datasets;
      this.chart.update('none');
    },
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  },
};
</script>

<style scoped>
.price-section {
  padding: 0;
}

/* ── Section Header ── */
.section-header {
  margin-bottom: 32px;
}

.section-eyebrow {
  font-size: 13px;
  color: var(--color-terracotta);
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.section-title {
  font-family: var(--font-serif);
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 500;
  color: var(--color-near-black);
  line-height: 1.20;
  margin-bottom: 8px;
}

.section-desc {
  font-size: 15px;
  color: var(--color-stone-gray);
  line-height: 1.60;
}

/* ── Search Bar ── */
.price-search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-ivory);
  border: 1px solid var(--color-border-cream);
  border-radius: var(--radius-md);
  padding: 10px 16px;
  margin-bottom: 20px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.price-search-bar:focus-within {
  border-color: var(--color-terracotta);
  box-shadow: 0 0 0 3px rgba(201, 100, 66, 0.10);
}

.price-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: var(--color-near-black);
  font-family: var(--font-sans);
}

.price-search-input::placeholder { color: var(--color-stone-gray); }

.clear-btn {
  background: none;
  border: none;
  color: var(--color-stone-gray);
  cursor: pointer;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color 0.2s;
}

.clear-btn:hover { color: var(--color-near-black); }

/* ── Category Tabs ── */
.category-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.cat-tab {
  padding: 7px 16px;
  border: 1px solid var(--color-border-cream);
  background: var(--color-ivory);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-olive-gray);
  cursor: pointer;
  transition: all 0.15s;
  font-family: var(--font-sans);
}

.cat-tab:hover { border-color: var(--color-terracotta); color: var(--color-terracotta); }

.cat-tab.active {
  background: var(--color-terracotta);
  border-color: var(--color-terracotta);
  color: var(--color-ivory);
}

/* ── Product Grid ── */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.product-card {
  padding: 16px;
  background: var(--color-ivory);
  border: 1.5px solid var(--color-border-cream);
  border-radius: var(--radius-md);
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
  font-family: var(--font-sans);
}

.product-card:hover {
  border-color: var(--color-terracotta);
  box-shadow: 0 0 0 3px rgba(201, 100, 66, 0.08);
  transform: translateY(-1px);
}

.product-card.selected {
  border-color: var(--color-terracotta);
  background: rgba(201, 100, 66, 0.05);
}

.product-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.product-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-charcoal-warm);
  line-height: 1.30;
}

.selected-badge {
  color: var(--color-terracotta);
  font-size: 14px;
  font-weight: bold;
  flex-shrink: 0;
}

.product-price {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-near-black);
  font-family: var(--font-serif);
  margin-bottom: 6px;
}

.product-trend {
  font-size: 12px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 12px;
  display: inline-block;
}

.trend-down { color: #2e7d32; background: rgba(46,125,50,0.08); }
.trend-up { color: #c62828; background: rgba(198,40,40,0.08); }
.trend-stable { color: var(--color-olive-gray); background: var(--color-warm-sand); }

.product-cat-tag {
  font-size: 11px;
  color: var(--color-stone-gray);
  background: var(--color-warm-sand);
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
}

/* ── Search Results ── */
.no-results {
  text-align: center;
  padding: 40px;
  color: var(--color-stone-gray);
  font-size: 15px;
  background: var(--color-ivory);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-cream);
}

/* ── Selected Summary ── */
.selected-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: var(--color-warm-sand);
  border: 1px solid var(--color-border-warm);
  border-radius: var(--radius-md);
  margin-bottom: 20px;
}

.summary-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-charcoal-warm);
  white-space: nowrap;
}

.selected-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
}

.selected-chip {
  font-size: 12px;
  padding: 4px 10px;
  background: var(--color-white);
  border: 1px solid var(--color-border-cream);
  border-radius: 14px;
  color: var(--color-terracotta);
  cursor: pointer;
  transition: background 0.15s;
  font-family: var(--font-sans);
}

.selected-chip:hover { background: var(--color-border-warm); }

.clear-all-btn {
  padding: 4px 12px;
  background: none;
  border: 1px solid var(--color-border-warm);
  border-radius: 14px;
  font-size: 12px;
  color: var(--color-stone-gray);
  cursor: pointer;
  font-family: var(--font-sans);
  transition: all 0.15s;
  white-space: nowrap;
}

.clear-all-btn:hover { border-color: #c62828; color: #c62828; }

/* ── Chart ── */
.chart-container {
  background: var(--color-ivory);
  border: 1px solid var(--color-border-cream);
  border-radius: var(--radius-lg);
  padding: 28px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-card);
}

.chart-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.chart-title {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 500;
  color: var(--color-near-black);
  margin: 0;
}

.time-range-tabs {
  display: flex;
  gap: 4px;
  background: var(--color-warm-sand);
  padding: 3px;
  border-radius: 8px;
}

.range-btn {
  padding: 5px 14px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-olive-gray);
  cursor: pointer;
  transition: all 0.15s;
  font-family: var(--font-sans);
}

.range-btn.active {
  background: var(--color-white);
  color: var(--color-near-black);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.range-btn:hover:not(.active) { color: var(--color-near-black); }

.chart-wrapper {
  height: 320px;
  margin-bottom: 20px;
  position: relative;
}

/* ── Price Table ── */
.price-table {
  overflow-x: auto;
}

.price-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.price-table th {
  text-align: left;
  padding: 10px 14px;
  border-bottom: 2px solid var(--color-border-warm);
  color: var(--color-stone-gray);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border-cream);
  color: var(--color-olive-gray);
}

.price-table tr:last-child td { border-bottom: none; }

.item-name { color: var(--color-charcoal-warm); font-weight: 500; }
.item-price { font-weight: 600; color: var(--color-near-black); font-family: var(--font-serif); font-size: 15px; }
.item-avg { color: var(--color-olive-gray); }
.item-low { color: #2e7d32; font-weight: 500; }

/* ── Empty State ── */
.empty-state {
  text-align: center;
  padding: 60px 32px;
  background: var(--color-ivory);
  border: 1px solid var(--color-border-cream);
  border-radius: var(--radius-lg);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
  color: var(--color-charcoal-warm);
  font-family: var(--font-serif);
  margin-bottom: 8px;
}

.empty-sub {
  font-size: 14px !important;
  color: var(--color-stone-gray) !important;
  font-family: var(--font-sans) !important;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .product-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
  .chart-container { padding: 16px; }
  .chart-wrapper { height: 240px; }
  .chart-header-row { flex-direction: column; align-items: flex-start; }
}
</style>

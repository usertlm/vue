<template>
  <div class="price-tracker">
    <div class="section-header">
      <h3 class="section-title">🎮 电脑配件价格趋势</h3>
    </div>

    <!-- Search Bar -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 搜索配件型号..."
        class="search-input"
      />
      <button @click="searchProducts" class="search-btn">搜索</button>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="search-results">
      <div
        class="result-item"
        v-for="item in searchResults"
        :key="item.id"
        @click="selectSearchResult(item)"
      >
        <span class="result-name">{{ item.name }}</span>
        <span class="result-price">¥{{ item.price }}</span>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="['tab-btn', { active: selectedCategory === cat.id }]"
        @click="selectedCategory = cat.id"
      >
        {{ cat.icon }} {{ cat.name }}
      </button>
    </div>

    <!-- Product Select -->
    <div class="product-select">
      <select v-model="selectedProduct" @change="loadProductData">
        <option value="">📦 选择配件型号...</option>
        <option v-for="p in currentProducts" :key="p.id" :value="p.id">
          {{ p.name }} - ¥{{ p.price }}
        </option>
      </select>
    </div>

    <!-- Price Chart -->
    <div v-if="selectedProduct && chartData.datasets && chartData.datasets.length" class="chart-container">
      <div class="chart-header">
        <span class="product-title">{{ currentProductData?.name }}</span>
      </div>

      <div class="chart-wrapper">
        <PriceLineChart :data="chartData" :options="chartOptions" />
      </div>

      <!-- Price Stats -->
      <div class="price-stats">
        <div class="stat">
          <span class="stat-icon">💴</span>
          <span class="stat-label">当前价格</span>
          <span class="stat-value">¥{{ currentPrice }}</span>
        </div>
        <div class="stat" :class="priceChangeClass">
          <span class="stat-icon">{{ priceChange >= 0 ? '📈' : '📉' }}</span>
          <span class="stat-label">相比昨日</span>
          <span class="stat-value">
            {{ priceChange >= 0 ? '↑' : '↓' }} ¥{{ Math.abs(priceChange).toFixed(0) }} ({{ priceChangePercent }}%)
          </span>
        </div>
        <div class="stat">
          <span class="stat-icon">🪙</span>
          <span class="stat-label">历史最低</span>
          <span class="stat-value">¥{{ historyLow }}</span>
        </div>
        <div class="stat">
          <span class="stat-icon">💎</span>
          <span class="stat-label">历史最高</span>
          <span class="stat-value">¥{{ historyHigh }}</span>
        </div>
      </div>

      <!-- Price History Timeline -->
      <div v-if="priceHistory.length > 0" class="history-section">
        <div class="history-header">
          <span class="history-title">📅 价格历史</span>
        </div>
        <div class="history-filter">
          <button
            v-for="range in timeRanges"
            :key="range.value"
            :class="['range-btn', { active: selectedRange === range.value }]"
            @click="selectedRange = range.value"
          >
            {{ range.label }}
          </button>
        </div>
        <div class="history-list">
          <div v-for="(item, index) in filteredHistory" :key="index" class="history-item">
            <span class="history-date">{{ formatDate(item.time) }}</span>
            <span class="history-price">¥{{ item.price }}</span>
            <span class="history-change" :class="getChangeClass(item)">
              {{ getChangeLabel(item) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Last Update Time -->
      <div class="update-time">
        <span>⏰ 最后更新: {{ lastUpdateTime }}</span>
        <button @click="refreshData" class="refresh-btn" :disabled="isLoading">
          {{ isLoading ? '更新中...' : '刷新' }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!selectedProduct && searchResults.length === 0" class="empty-state">
      <div class="empty-icon">🎯</div>
      <p>👆 选择一个配件型号或搜索查看价格趋势</p>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="loading-state">
      <div class="loading-icon">⏳</div>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
import PriceLineChart from './PriceLineChart.vue';

export default {
  name: 'PriceChart',
  components: {
    PriceLineChart
  },
  data() {
    return {
      categories: [
        { id: 'gpu', name: '显卡', icon: '🎮' },
        { id: 'cpu', name: 'CPU', icon: '⚙️' },
        { id: 'ram', name: '内存', icon: '💾' },
        { id: 'ssd', name: '固态硬盘', icon: '💿' },
        { id: 'mb', name: '主板', icon: '🔌' },
        { id: 'cool', name: '散热器', icon: '❄️' }
      ],
      timeRanges: [
        { label: '7天', value: 7 },
        { label: '30天', value: 30 },
        { label: '90天', value: 90 },
        { label: '全部', value: 0 }
      ],
      selectedCategory: 'gpu',
      selectedProduct: '',
      selectedRange: 30,
      searchQuery: '',
      searchResults: [],
      priceData: null,
      isLoading: false,
    };
  },
  computed: {
    currentProducts() {
      if (!this.priceData || !this.priceData.categories) return [];
      return this.priceData.categories[this.selectedCategory] || [];
    },
    currentProductData() {
      if (!this.selectedProduct || !this.currentProducts.length) return null;
      return this.currentProducts.find(p => p.id === this.selectedProduct);
    },
    currentPrice() {
      return this.currentProductData?.price?.toFixed(0) || '0';
    },
    historyLow() {
      return this.currentProductData?.historyLow?.toFixed(0) || '0';
    },
    historyHigh() {
      return this.currentProductData?.historyHigh?.toFixed(0) || '0';
    },
    priceHistory() {
      if (!this.currentProductData || !this.currentProductData.trend) return [];
      return [...this.currentProductData.trend].reverse();
    },
    filteredHistory() {
      if (this.selectedRange === 0) return this.priceHistory;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - this.selectedRange);
      return this.priceHistory.filter(h => new Date(h.time) >= cutoff);
    },
    priceChange() {
      if (this.priceHistory.length < 2) return 0;
      return this.priceHistory[0].price - this.priceHistory[1].price;
    },
    priceChangePercent() {
      if (this.priceHistory.length < 2) return '0.00';
      const yesterdayPrice = this.priceHistory[1].price;
      if (yesterdayPrice === 0) return '0.00';
      return ((this.priceChange / yesterdayPrice) * 100).toFixed(2);
    },
    priceChangeClass() {
      if (this.priceChange > 0) return 'up';
      if (this.priceChange < 0) return 'down';
      return '';
    },
    lastUpdateTime() {
      if (!this.priceData || !this.priceData.lastUpdated) return '从未';
      const date = new Date(this.priceData.lastUpdated);
      return date.toLocaleString('zh-CN');
    },
    chartData() {
      if (!this.currentProductData || !this.currentProductData.trend) {
        return { labels: [], datasets: [] };
      }

      const trend = [...this.priceHistory].reverse();
      const productName = this.currentProductData.name || '';

      return {
        labels: trend.map(h => {
          const d = new Date(h.time);
          return `${d.getMonth() + 1}/${d.getDate()}`;
        }),
        datasets: [
          {
            label: productName,
            data: trend.map(h => h.price),
            borderColor: '#c96442',
            backgroundColor: 'rgba(201, 100, 66, 0.10)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointBackgroundColor: '#c96442',
            pointBorderColor: '#faf9f5',
            pointBorderWidth: 3
          }
        ]
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(20, 20, 19, 0.92)',
            titleColor: '#c96442',
            bodyColor: '#141413',
            padding: 14,
            borderColor: '#c96442',
            borderWidth: 2,
            cornerRadius: 12,
            displayColors: false,
            callbacks: {
              label: (context) => `💰 价格: ¥${context.raw.toFixed(0)}`
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(0,0,0,0.05)'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 0,
              color: '#87867f'
            }
          },
          y: {
            grid: {
              color: 'rgba(0,0,0,0.05)'
            },
            ticks: {
              callback: (value) => `¥${value}`,
              color: '#87867f'
            }
          }
        }
      };
    }
  },
  watch: {
    selectedCategory() {
      this.selectedProduct = '';
      this.searchResults = [];
      this.searchQuery = '';
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const response = await fetch('/api/prices');
        if (response.ok) {
          this.priceData = await response.json();
        }
      } catch (e) {
        console.error('Failed to load price data:', e);
      }
    },
    loadProductData() {
      if (!this.selectedProduct) return;
      this.searchResults = [];
      this.searchQuery = '';
    },
    selectSearchResult(item) {
      for (const [catKey, cat] of Object.entries(this.priceData.categories)) {
        const found = cat.find(p => p.id === item.id);
        if (found) {
          this.selectedCategory = catKey;
          this.$nextTick(() => {
            this.selectedProduct = item.id;
          });
          break;
        }
      }
      this.searchResults = [];
      this.searchQuery = '';
    },
    searchProducts() {
      if (!this.searchQuery.trim()) {
        this.searchResults = [];
        return;
      }

      const query = this.searchQuery.toLowerCase();
      const results = [];

      for (const [catKey, cat] of Object.entries(this.priceData.categories)) {
        for (const item of cat) {
          if (item.name.toLowerCase().includes(query)) {
            results.push({...item, category: catKey});
          }
        }
      }

      this.searchResults = results;
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    },
    getChangeClass(item) {
      if (this.priceHistory.indexOf(item) === 0) return '';
      if (item.price > this.priceHistory[this.priceHistory.indexOf(item) + 1]?.price) return 'up';
      if (item.price < this.priceHistory[this.priceHistory.indexOf(item) + 1]?.price) return 'down';
      return '';
    },
    getChangeLabel(item) {
      const idx = this.priceHistory.indexOf(item);
      if (idx >= this.priceHistory.length - 1) return '';
      const prev = this.priceHistory[idx + 1];
      const diff = item.price - prev.price;
      if (diff > 0) return `+¥${diff.toFixed(0)}`;
      if (diff < 0) return `-¥${Math.abs(diff).toFixed(0)}`;
      return '';
    },
    async refreshData() {
      this.isLoading = true;
      await this.loadData();
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
.price-tracker {
  max-width: 850px;
  margin: 40px auto;
  padding: 32px;
  background: #faf9f5;
  border: 1px solid #f0eee6;
  border-radius: 20px;
  box-shadow: rgba(0,0,0,0.05) 0px 4px 24px;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 500;
  color: #141413;
  text-align: center;
  line-height: 1.20;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #f0eee6;
  border-radius: 12px;
  font-size: 15px;
  background: #ffffff;
  color: #141413;
  font-family: Arial, sans-serif;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #c96442;
  box-shadow: 0 0 0 3px rgba(201, 100, 66, 0.10);
}

.search-btn {
  padding: 12px 22px;
  background: #c96442;
  color: #faf9f5;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 15px;
  font-family: Arial, sans-serif;
  transition: background 0.2s;
}

.search-btn:hover { background: #d97757; }

.search-results {
  background: #ffffff;
  border: 1px solid #f0eee6;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 20px;
  box-shadow: 0px 0px 0px 1px #d1cfc5;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 4px;
  background: #faf9f5;
  transition: background 0.15s;
}

.result-item:hover { background: #e8e6dc; }
.result-item:last-child { margin-bottom: 0; }

.result-name {
  font-weight: 500;
  color: #141413;
  font-size: 14px;
}

.result-price {
  color: #c96442;
  font-weight: 700;
  font-size: 14px;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 10px 18px;
  border: 1px solid #f0eee6;
  background: #ffffff;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #5e5d59;
  transition: all 0.2s;
  font-family: Arial, sans-serif;
}

.tab-btn:hover {
  border-color: #c96442;
  color: #c96442;
}

.tab-btn.active {
  background: #c96442;
  border-color: #c96442;
  color: #faf9f5;
}

.product-select {
  text-align: center;
  margin-bottom: 24px;
}

.product-select select {
  padding: 12px 20px;
  font-size: 15px;
  border: 1px solid #f0eee6;
  border-radius: 12px;
  min-width: 280px;
  cursor: pointer;
  background: #ffffff;
  color: #141413;
  font-family: Arial, sans-serif;
  transition: border-color 0.2s;
}

.product-select select:focus {
  outline: none;
  border-color: #c96442;
}

.chart-container {
  background: #ffffff;
  border: 1px solid #f0eee6;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0px 0px 0px 1px #d1cfc5;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.product-title {
  font-family: Georgia, serif;
  font-size: 18px;
  font-weight: 500;
  color: #141413;
}

.chart-wrapper {
  height: 260px;
  margin-bottom: 20px;
}

.chart-wrapper canvas { max-height: 260px; }

.price-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat {
  text-align: center;
  padding: 16px 10px;
  background: #faf9f5;
  border: 1px solid #f0eee6;
  border-radius: 12px;
  transition: transform 0.2s;
}

.stat:hover { transform: translateY(-3px); }

.stat-icon {
  font-size: 22px;
  display: block;
  margin-bottom: 6px;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #87867f;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #141413;
}

.stat.up .stat-value { color: #b53333; }
.stat.down .stat-value { color: #2d8a4e; }

.history-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0eee6;
}

.history-header {
  text-align: center;
  margin-bottom: 12px;
}

.history-title {
  font-family: Georgia, serif;
  font-size: 16px;
  font-weight: 500;
  color: #141413;
}

.history-filter {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 14px;
}

.range-btn {
  padding: 6px 16px;
  border: 1px solid #f0eee6;
  background: #ffffff;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  color: #5e5d59;
  transition: all 0.2s;
  font-family: Arial, sans-serif;
}

.range-btn.active {
  background: #c96442;
  border-color: #c96442;
  color: #faf9f5;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #faf9f5;
  border-radius: 8px;
  margin-bottom: 6px;
  transition: background 0.15s;
}

.history-item:hover { background: #f0eee6; }

.history-date { color: #5e5d59; font-size: 13px; }
.history-price { font-weight: 700; color: #141413; font-size: 14px; }
.history-change { font-size: 12px; font-weight: 600; }
.history-change.up { color: #b53333; }
.history-change.down { color: #2d8a4e; }

.update-time {
  text-align: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0eee6;
  color: #87867f;
  font-size: 13px;
}

.refresh-btn {
  margin-left: 14px;
  padding: 8px 18px;
  background: #e8e6dc;
  color: #4d4c48;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background 0.2s;
  font-family: Arial, sans-serif;
}

.refresh-btn:hover:not(:disabled) { background: #d1cfc5; }
.refresh-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.empty-state, .loading-state {
  text-align: center;
  padding: 48px 20px;
  color: #5e5d59;
}

.empty-icon, .loading-icon { font-size: 48px; margin-bottom: 12px; }
.empty-state p, .loading-state p { font-size: 16px; }

@media (max-width: 600px) {
  .price-tracker { margin: 20px 16px; padding: 20px 16px; }
  .price-stats { grid-template-columns: repeat(2, 1fr); }
  .chart-wrapper { height: 200px; }
  .chart-wrapper canvas { max-height: 200px; }
}
</style>

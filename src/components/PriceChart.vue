<template>
  <div class="price-tracker">
    <h3>🎮 电脑配件价格趋势 📊</h3>
    
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
      <div class="result-item" v-for="item in searchResults" :key="item.id" @click="selectSearchResult(item)">
        <span class="result-name">{{ item.name }}</span>
        <span class="result-price">💰 ¥{{ item.price }}</span>
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
          {{ p.name }} - 💵 ¥{{ p.price }}
        </option>
      </select>
    </div>

    <!-- Price Chart -->
    <div class="chart-container" v-if="selectedProduct && chartData.datasets && chartData.datasets.length">
      <div class="chart-header">
        <span class="product-emoji">📈</span>
        <span class="product-title">{{ currentProductData?.name }}</span>
      </div>
      
      <div class="chart-wrapper">
        <PriceLineChart :data="chartData" :options="chartOptions" />
      </div>
      
      <!-- Price Stats -->
      <div class="price-stats">
        <div class="stat current">
          <span class="stat-icon">💴</span>
          <span class="stat-label">当前价格</span>
          <span class="stat-value">¥{{ currentPrice }}</span>
        </div>
        <div class="stat change" :class="priceChangeClass">
          <span class="stat-icon">{{ priceChange >= 0 ? '📈' : '📉' }}</span>
          <span class="stat-label">相比昨日</span>
          <span class="stat-value">
            {{ priceChange >= 0 ? '↑' : '↓' }} ¥{{ Math.abs(priceChange).toFixed(0) }} ({{ priceChangePercent }}%)
          </span>
        </div>
        <div class="stat lowest">
          <span class="stat-icon">🪙</span>
          <span class="stat-label">历史最低</span>
          <span class="stat-value">¥{{ historyLow }}</span>
        </div>
        <div class="stat highest">
          <span class="stat-icon">💎</span>
          <span class="stat-label">历史最高</span>
          <span class="stat-value">¥{{ historyHigh }}</span>
        </div>
      </div>

      <!-- Price History Timeline -->
      <div class="history-section" v-if="priceHistory.length > 0">
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
            <span class="history-date">🗓️ {{ formatDate(item.time) }}</span>
            <span class="history-price">💰 ¥{{ item.price }}</span>
            <span class="history-change" :class="getChangeClass(item)">
              {{ getChangeLabel(item) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Last Update Time -->
      <div class="update-time">
        <span class="update-icon">⏰</span>
        最后更新: {{ lastUpdateTime }}
        <button @click="refreshData" class="refresh-btn" :disabled="isLoading">
          {{ isLoading ? '🔄 更新中...' : '🔄 刷新' }}
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
      
      const trend = this.priceHistory.slice(0, 30);
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
            borderColor: '#FF6B6B',
            backgroundColor: 'rgba(255, 107, 107, 0.2)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointBackgroundColor: '#FF6B6B',
            pointBorderColor: '#fff',
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
            backgroundColor: 'rgba(255, 107, 107, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 15,
            borderColor: '#FF4757',
            borderWidth: 2,
            displayColors: false,
            callbacks: {
              label: (context) => `💰 价格: ¥${context.raw.toFixed(0)}`
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 107, 107, 0.1)'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 0,
              color: '#666'
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 107, 107, 0.1)'
            },
            ticks: {
              callback: (value) => `¥${value}`,
              color: '#666'
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
  margin: 30px auto;
  padding: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
}

.price-tracker h3 {
  text-align: center;
  color: #fff;
  margin-bottom: 25px;
  font-size: 24px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 14px 20px;
  border: 3px solid #fff;
  border-radius: 50px;
  font-size: 15px;
  background: #fff;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.search-input:focus {
  outline: none;
  border-color: #FFD93D;
}

.search-btn {
  padding: 14px 28px;
  background: #FFD93D;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  color: #333;
  box-shadow: 0 4px 15px rgba(255, 217, 61, 0.4);
  transition: all 0.3s;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 217, 61, 0.5);
}

.search-results {
  background: #fff;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  cursor: pointer;
  border-radius: 12px;
  margin-bottom: 6px;
  background: #f8f9ff;
  transition: all 0.2s;
}

.result-item:hover {
  background: #667eea;
  color: #fff;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-name {
  font-weight: 500;
}

.result-price {
  color: #FF6B6B;
  font-weight: bold;
}

.result-item:hover .result-price {
  color: #FFD93D;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 12px 20px;
  border: 3px solid transparent;
  background: rgba(255,255,255,0.9);
  border-radius: 50px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.tab-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.tab-btn.active {
  background: #FFD93D;
  color: #333;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 217, 61, 0.4);
}

.product-select {
  text-align: center;
  margin-bottom: 20px;
}

.product-select select {
  padding: 14px 24px;
  font-size: 15px;
  border: 3px solid #fff;
  border-radius: 50px;
  min-width: 280px;
  cursor: pointer;
  background: #fff;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.product-select select:focus {
  outline: none;
  border-color: #FFD93D;
}

.chart-container {
  background: #fff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.product-emoji {
  font-size: 32px;
}

.product-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.chart-wrapper {
  height: 280px;
  margin-bottom: 20px;
}

.chart-wrapper canvas {
  max-height: 280px;
}

.price-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat {
  text-align: center;
  padding: 18px 12px;
  background: linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%);
  border-radius: 16px;
  border: 2px solid #e8ecff;
  transition: all 0.3s;
}

.stat:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.stat-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #888;
  margin-bottom: 6px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.stat.change.up .stat-value {
  color: #FF6B6B;
}

.stat.change.down .stat-value {
  color: #27AE60;
}

.history-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px dashed #e8ecff;
}

.history-header {
  text-align: center;
  margin-bottom: 15px;
}

.history-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.history-filter {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 15px;
}

.range-btn {
  padding: 8px 18px;
  border: 2px solid #667eea;
  background: #fff;
  border-radius: 50px;
  cursor: pointer;
  font-size: 13px;
  color: #667eea;
  transition: all 0.3s;
}

.range-btn.active {
  background: #667eea;
  color: #fff;
}

.history-list {
  max-height: 220px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f8f9ff;
  border-radius: 12px;
  margin-bottom: 8px;
}

.history-date {
  color: #666;
  font-size: 13px;
}

.history-price {
  font-weight: bold;
  color: #333;
  font-size: 15px;
}

.history-change {
  font-size: 13px;
  font-weight: 500;
}

.history-change.up {
  color: #FF6B6B;
}

.history-change.down {
  color: #27AE60;
}

.update-time {
  text-align: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px dashed #e8ecff;
  color: #888;
  font-size: 13px;
}

.update-icon {
  margin-right: 5px;
}

.refresh-btn {
  margin-left: 15px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  transition: all 0.3s;
}

.refresh-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 50px;
  color: #fff;
}

.empty-icon,
.loading-icon {
  font-size: 60px;
  margin-bottom: 15px;
}

.empty-state p,
.loading-state p {
  font-size: 18px;
}

@media (max-width: 600px) {
  .price-tracker {
    margin: 15px;
    padding: 20px;
    border-radius: 20px;
  }
  
  .price-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .category-tabs {
    gap: 8px;
  }
  
  .tab-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .chart-wrapper {
    height: 220px;
  }
  
  .chart-wrapper canvas {
    max-height: 220px;
  }
}
</style>

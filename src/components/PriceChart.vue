<template>
  <div class="price-tracker">
    <h3>💻 电脑配件价格趋势</h3>
    
    <!-- Search Bar -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索配件型号..."
        class="search-input"
      />
      <button @click="searchProducts" class="search-btn">🔍</button>
    </div>

    <!-- Search Results -->
    <div v-if="searchResults.length > 0" class="search-results">
      <h4>搜索结果</h4>
      <div class="result-item" v-for="item in searchResults" :key="item.id" @click="selectSearchResult(item)">
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
        <option value="">选择配件型号...</option>
        <option v-for="p in currentProducts" :key="p.id" :value="p.id">
          {{ p.name }} - ¥{{ p.price }}
        </option>
      </select>
    </div>

    <!-- Price Chart -->
    <div class="chart-container" v-if="selectedProduct && chartData.datasets && chartData.datasets.length">
      <PriceLineChart :data="chartData" :options="chartOptions" />
      
      <!-- Price Stats -->
      <div class="price-stats">
        <div class="stat current">
          <span class="label">当前价格</span>
          <span class="value">¥{{ currentPrice }}</span>
        </div>
        <div class="stat change" :class="priceChangeClass">
          <span class="label">相比昨日</span>
          <span class="value">
            {{ priceChange >= 0 ? '↑' : '↓' }} 
            ¥{{ Math.abs(priceChange).toFixed(0) }}
            ({{ priceChangePercent }}%)
          </span>
        </div>
        <div class="stat lowest">
          <span class="label">历史最低</span>
          <span class="value">¥{{ historyLow }}</span>
        </div>
        <div class="stat highest">
          <span class="label">历史最高</span>
          <span class="value">¥{{ historyHigh }}</span>
        </div>
      </div>

      <!-- Price History Timeline -->
      <div class="history-section" v-if="priceHistory.length > 0">
        <h4>📅 价格历史</h4>
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
        最后更新: {{ lastUpdateTime }}
        <button @click="refreshData" class="refresh-btn" :disabled="isLoading">
          {{ isLoading ? '刷新中...' : '🔄 刷新' }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!selectedProduct && searchResults.length === 0" class="empty-state">
      <p>👆 选择一个配件型号或搜索查看价格趋势</p>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="loading-state">
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
            borderColor: '#42b983',
            backgroundColor: 'rgba(66, 185, 131, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#42b983',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 12,
            borderColor: '#42b983',
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              label: (context) => `价格: ¥${context.raw.toFixed(0)}`
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 0
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: (value) => `¥${value}`
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
      // Find category for this item
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
      try {
        // 触发 GitHub Actions
        const response = await fetch('/api/prices/trigger', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          alert('✅ 已触发价格更新！GitHub Actions 正在运行，请稍后刷新页面查看最新价格。');
        } else {
          // 如果触发失败，尝试直接刷新数据
          await this.loadData();
          alert('⚠️ 触发失败，已直接刷新数据');
        }
      } catch (e) {
        console.error('Refresh error:', e);
        // 即使出错也尝试加载数据
        await this.loadData();
      }
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
.price-tracker {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.price-tracker h3 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.price-tracker h4 {
  color: #555;
  margin: 16px 0 12px;
}

.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #42b983;
}

.search-btn {
  padding: 10px 16px;
  background: #42b983;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.search-results {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  max-height: 200px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 4px;
}

.result-item:hover {
  background: #f0f9f4;
}

.result-name {
  color: #333;
}

.result-price {
  color: #42b983;
  font-weight: bold;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
}

.tab-btn {
  padding: 8px 16px;
  border: 2px solid #ddd;
  background: #fff;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: #42b983;
  background: #f0f9f4;
}

.tab-btn.active {
  border-color: #42b983;
  background: #42b983;
  color: white;
}

.product-select {
  text-align: center;
  margin-bottom: 20px;
}

.product-select select {
  padding: 10px 20px;
  font-size: 14px;
  border: 2px solid #ddd;
  border-radius: 8px;
  min-width: 250px;
  cursor: pointer;
}

.product-select select:focus {
  outline: none;
  border-color: #42b983;
}

.chart-container {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container canvas {
  max-height: 300px;
}

.price-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.stat {
  text-align: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.stat .label {
  display: block;
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}

.stat .value {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.stat.change.up .value {
  color: #e74c3c;
}

.stat.change.down .value {
  color: #27ae60;
}

.history-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.history-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.range-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

.range-btn.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.history-item:last-child {
  border-bottom: none;
}

.history-date {
  color: #888;
  font-size: 13px;
}

.history-price {
  font-weight: bold;
  color: #333;
}

.history-change {
  font-size: 12px;
}

.history-change.up {
  color: #e74c3c;
}

.history-change.down {
  color: #27ae60;
}

.update-time {
  text-align: center;
  margin-top: 16px;
  font-size: 12px;
  color: #888;
}

.refresh-btn {
  margin-left: 12px;
  padding: 6px 12px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.refresh-btn:hover:not(:disabled) {
  background: #359268;
}

.refresh-btn:disabled {
  background: #a5d6a7;
  cursor: not-allowed;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 40px;
  color: #888;
}

@media (max-width: 600px) {
  .price-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .category-tabs {
    gap: 6px;
  }
  
  .tab-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>

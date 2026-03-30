<template>
  <div class="price-tracker">
    <h3>💻 电脑配件价格趋势</h3>
    
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
          {{ p.name }}
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

      <!-- Last Update Time -->
      <div class="update-time">
        最后更新: {{ lastUpdateTime }}
        <button @click="refreshData" class="refresh-btn" :disabled="isLoading">
          {{ isLoading ? '刷新中...' : '🔄 刷新' }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!selectedProduct" class="empty-state">
      <p>👆 请选择一个配件型号查看价格趋势</p>
    </div>

    <!-- Loading State -->
    <div v-else class="loading-state">
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
import PriceLineChart from './PriceLineChart.vue';

// Product categories
const CATEGORIES = [
  { id: 'gpu', name: '显卡', icon: '🎮' },
  { id: 'cpu', name: 'CPU', icon: '⚙️' },
  { id: 'ram', name: '内存', icon: '💾' },
  { id: 'ssd', name: '固态硬盘', icon: '💿' },
  { id: 'mb', name: '主板', icon: '🔌' },
  { id: 'cool', name: '散热器', icon: '❄️' }
];

export default {
  name: 'PriceChart',
  components: {
    PriceLineChart
  },
  data() {
    return {
      categories: CATEGORIES,
      selectedCategory: 'gpu',
      selectedProduct: '',
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
    priceChange() {
      if (!this.currentProductData || !this.currentProductData.trend || this.currentProductData.trend.length < 2) return 0;
      const trend = this.currentProductData.trend;
      const len = trend.length;
      return trend[len - 1].price - trend[len - 2].price;
    },
    priceChangePercent() {
      if (!this.currentProductData || !this.currentProductData.trend || this.currentProductData.trend.length < 2) return '0.00';
      const trend = this.currentProductData.trend;
      const len = trend.length;
      const yesterdayPrice = trend[len - 2].price;
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
      
      const trend = this.currentProductData.trend;
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
    async loadProductData() {
      if (!this.selectedProduct) return;
      // Data is already loaded, just trigger reactivity
      this.$forceUpdate();
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
  max-width: 700px;
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
  min-width: 200px;
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

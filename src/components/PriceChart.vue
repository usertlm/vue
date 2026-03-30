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
    <div class="chart-container" v-if="selectedProduct">
      <LineChart :data="chartData" :options="chartOptions" />
      
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
            ¥{{ Math.abs(priceChange).toFixed(2) }}
            ({{ priceChangePercent }}%)
          </span>
        </div>
        <div class="stat lowest">
          <span class="label">历史最低</span>
          <span class="value">¥{{ lowestPrice }}</span>
        </div>
        <div class="stat highest">
          <span class="label">历史最高</span>
          <span class="value">¥{{ highestPrice }}</span>
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
    <div v-else class="empty-state">
      <p>👆 请选择一个配件型号查看价格趋势</p>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line vue/no-reserved-component-names
import { Line as LineChart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Product categories and items
const CATEGORIES = [
  { id: 'gpu', name: '显卡', icon: '🎮' },
  { id: 'cpu', name: 'CPU', icon: '⚙️' },
  { id: 'ram', name: '内存', icon: '💾' },
  { id: 'ssd', name: '固态硬盘', icon: '💿' },
  { id: 'monitor', name: '显示器', icon: '🖥️' }
];

const PRODUCTS = {
  gpu: [
    { id: 'rtx4090', name: 'RTX 4090' },
    { id: 'rtx4080', name: 'RTX 4080' },
    { id: 'rtx4070', name: 'RTX 4070' },
    { id: 'rx7900xtx', name: 'RX 7900 XTX' },
    { id: 'rx7800xt', name: 'RX 7800 XT' }
  ],
  cpu: [
    { id: 'i9-14900k', name: 'Intel i9-14900K' },
    { id: 'i7-14700k', name: 'Intel i7-14700K' },
    { id: 'r9-7950x', name: 'AMD R9 7950X' },
    { id: 'r7-7800x3d', name: 'AMD R7 7800X3D' },
    { id: 'i5-14600k', name: 'Intel i5-14600K' }
  ],
  ram: [
    { id: 'ddr5-32g', name: 'DDR5 32GB' },
    { id: 'ddr5-64g', name: 'DDR5 64GB' },
    { id: 'ddr4-32g', name: 'DDR4 32GB' }
  ],
  ssd: [
    { id: '990pro-2t', name: '三星 990 Pro 2TB' },
    { id: 'sn850x-2t', name: 'WD Black SN850X 2TB' },
    { id: 'p7000z-2t', name: '致态 P7000Z 2TB' }
  ],
  monitor: [
    { id: 'lg-27gp95r', name: 'LG 27GP95R' },
    { id: 'dell-g3223q', name: 'Dell G3223Q' },
    { id: 'samsung-odyssey', name: '三星 Odyssey G7' }
  ]
};

// Generate demo price history
function generateDemoHistory(basePrice, days = 30) {
  const history = [];
  const now = new Date();
  let price = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk with trend
    const change = (Math.random() - 0.5) * basePrice * 0.05;
    price = Math.max(basePrice * 0.7, Math.min(basePrice * 1.3, price + change));
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100
    });
  }
  
  return history;
}

export default {
  name: 'PriceChart',
  components: {
    LineChart
  },
  data() {
    return {
      categories: CATEGORIES,
      selectedCategory: 'gpu',
      selectedProduct: '',
      products: PRODUCTS,
      priceHistory: [],
      isLoading: false,
      lastUpdate: null
    };
  },
  computed: {
    currentProducts() {
      return this.products[this.selectedCategory] || [];
    },
    currentPriceData() {
      if (!this.selectedProduct || this.priceHistory.length === 0) return null;
      return this.priceHistory[this.priceHistory.length - 1];
    },
    currentPrice() {
      return this.currentPriceData?.price?.toFixed(2) || '0.00';
    },
    lowestPrice() {
      if (this.priceHistory.length === 0) return '0.00';
      const lowest = Math.min(...this.priceHistory.map(h => h.price));
      return lowest.toFixed(2);
    },
    highestPrice() {
      if (this.priceHistory.length === 0) return '0.00';
      const highest = Math.max(...this.priceHistory.map(h => h.price));
      return highest.toFixed(2);
    },
    priceChange() {
      if (this.priceHistory.length < 2) return 0;
      const current = this.priceHistory[this.priceHistory.length - 1].price;
      const yesterday = this.priceHistory[this.priceHistory.length - 2].price;
      return current - yesterday;
    },
    priceChangePercent() {
      if (this.priceHistory.length < 2) return '0.00';
      const yesterday = this.priceHistory[this.priceHistory.length - 2].price;
      if (yesterday === 0) return '0.00';
      return ((this.priceChange / yesterday) * 100).toFixed(2);
    },
    priceChangeClass() {
      if (this.priceChange > 0) return 'up';
      if (this.priceChange < 0) return 'down';
      return '';
    },
    lastUpdateTime() {
      if (!this.lastUpdate) return '从未';
      return new Date(this.lastUpdate).toLocaleString('zh-CN');
    },
    chartData() {
      if (this.priceHistory.length === 0) {
        return {
          labels: [],
          datasets: []
        };
      }
      
      const productName = this.currentProducts.find(p => p.id === this.selectedProduct)?.name || '';
      
      return {
        labels: this.priceHistory.map(h => h.date.slice(5)), // MM-DD format
        datasets: [
          {
            label: productName,
            data: this.priceHistory.map(h => h.price),
            borderColor: '#42b983',
            backgroundColor: 'rgba(66, 185, 131, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
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
              label: (context) => `价格: ¥${context.raw.toFixed(2)}`
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
      this.priceHistory = [];
    }
  },
  mounted() {
    this.loadDataFromStorage();
  },
  methods: {
    loadDataFromStorage() {
      try {
        const stored = localStorage.getItem('priceData');
        if (stored) {
          const data = JSON.parse(stored);
          this.priceHistory = data.history || [];
          this.lastUpdate = data.lastUpdate;
        }
      } catch (e) {
        console.error('Failed to load price data:', e);
      }
    },
    saveDataToStorage() {
      try {
        localStorage.setItem('priceData', JSON.stringify({
          history: this.priceHistory,
          lastUpdate: this.lastUpdate
        }));
      } catch (e) {
        console.error('Failed to save price data:', e);
      }
    },
    async loadProductData() {
      if (!this.selectedProduct) return;
      
      this.isLoading = true;
      
      try {
        // Try to fetch from API
        const response = await fetch(`/api/prices?product=${this.selectedProduct}`);
        if (response.ok) {
          const data = await response.json();
          this.priceHistory = data.history || [];
          this.lastUpdate = new Date().toISOString();
        } else {
          // Use demo data
          this.generateDemoData();
        }
      } catch (e) {
        // Use demo data on error
        this.generateDemoData();
      }
      
      this.saveDataToStorage();
      this.isLoading = false;
    },
    generateDemoData() {
      // Demo base prices
      const basePrices = {
        'rtx4090': 15999,
        'rtx4080': 8999,
        'rtx4070': 4999,
        'rx7900xtx': 7999,
        'rx7800xt': 3999,
        'i9-14900k': 4999,
        'i7-14700k': 3299,
        'r9-7950x': 3999,
        'r7-7800x3d': 2399,
        'i5-14600k': 2199,
        'ddr5-32g': 799,
        'ddr5-64g': 1499,
        'ddr4-32g': 499,
        '990pro-2t': 1299,
        'sn850x-2t': 1199,
        'p7000z-2t': 799,
        'lg-27gp95r': 3999,
        'dell-g3223q': 5999,
        'samsung-odyssey': 4999
      };
      
      const basePrice = basePrices[this.selectedProduct] || 1000;
      this.priceHistory = generateDemoHistory(basePrice);
      this.lastUpdate = new Date().toISOString();
    },
    async refreshData() {
      await this.loadProductData();
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

.empty-state {
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

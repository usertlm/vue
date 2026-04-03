<template>
  <div class="price-chart-container glass">
    <div class="chart-header">
      <h3>🖥️ 电脑配件价格趋势</h3>
      <div class="controls">
        <button @click="toggleAutoUpdate" :class="{ paused: !autoUpdate }">
          {{ autoUpdate ? '⏸ 暂停' : '▶ 继续' }}
        </button>
        <button @click="resetData">🔄 重置</button>
      </div>
    </div>

    <div class="product-filters">
      <button
        v-for="product in products"
        :key="product.id"
        @click="toggleProduct(product.id)"
        :class="{ active: selectedProducts.includes(product.id) }"
        class="filter-btn"
        :style="{ '--product-color': product.color }"
      >
        {{ product.emote }} {{ product.name }}
      </button>
    </div>

    <div class="chart-wrapper">
      <canvas id="priceChart" ref="chartCanvas"></canvas>
    </div>

    <div class="info-panel">
      <span class="time-update">🔄 实时更新中</span>
      <span class="data-points">数据点: {{ dataPoints }} | 频率: {{ updateFrequency }}ms</span>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'PriceTrendChart',
  data() {
    return {
      chart: null,
      autoUpdate: true,
      selectedProducts: ['cpu', 'gpu', 'ram'],
      products: [
        { id: 'cpu', name: 'CPU', emote: '💻', color: '#FF6B9D' },
        { id: 'gpu', name: 'GPU', emote: '🎮', color: '#FFA500' },
        { id: 'ram', name: 'RAM', emote: '🧠', color: '#4ECDC4' },
        { id: 'ssd', name: 'SSD', emote: '💾', color: '#95E1D3' }
      ],
      priceData: {
        cpu: [],
        gpu: [],
        ram: [],
        ssd: []
      },
      timeLabels: [],
      updateInterval: null,
      updateFrequency: 2000,
      dataPoints: 30
    };
  },
  mounted() {
    this.initializeData();
    this.createChart();
    this.startAutoUpdate();
  },
  beforeUnmount() {
    this.stopAutoUpdate();
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    initializeData() {
      const now = new Date();
      this.timeLabels = [];

      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        this.timeLabels.push(
          date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
        );
      }

      this.priceData = {
        cpu: this.generatePriceArray(2500, 400, 300),
        gpu: this.generatePriceArray(5000, 1000, 500),
        ram: this.generatePriceArray(800, 200, 100),
        ssd: this.generatePriceArray(600, 150, 80)
      };
    },
    generatePriceArray(basePrice, amplitude, variance) {
      const arr = [];
      for (let i = 0; i < 30; i++) {
        const price = basePrice + Math.sin(i / 10) * amplitude + (Math.random() - 0.5) * variance;
        arr.push(Math.max(100, price));
      }
      return arr;
    },
    createChart() {
      const ctx = this.$refs.chartCanvas?.getContext('2d');
      if (!ctx) return;

      const datasets = this.selectedProducts.map(productId => {
        const product = this.products.find(p => p.id === productId);
        return {
          label: `${product.emote} ${product.name}`,
          data: this.priceData[productId],
          borderColor: product.color,
          backgroundColor: this.hexToRgba(product.color, 0.15),
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: product.color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true
        };
      });

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.timeLabels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#00ffe7',
                font: { size: 13, weight: 'bold' },
                usePointStyle: true,
                padding: 15,
                boxWidth: 8,
                boxHeight: 8
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 32, 39, 0.95)',
              titleColor: '#00ffe7',
              bodyColor: '#fff',
              borderColor: '#00ffe7',
              borderWidth: 2,
              padding: 12,
              displayColors: true,
              callbacks: {
                label: (context) => context.dataset.label + ': ¥' + context.parsed.y.toFixed(2)
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 255, 231, 0.1)',
                drawBorder: false,
                drawTicks: false
              },
              ticks: {
                color: '#888',
                font: { size: 11 },
                callback: (value) => '¥' + value.toFixed(0)
              }
            },
            x: {
              grid: { display: false, drawBorder: false },
              ticks: {
                color: '#888',
                font: { size: 10 },
                maxTicksLimit: 8
              }
            }
          }
        }
      });
    },
    updateChart() {
      if (!this.chart) return;

      this.chart.data.datasets = this.selectedProducts.map(productId => {
        const product = this.products.find(p => p.id === productId);
        return {
          label: `${product.emote} ${product.name}`,
          data: this.priceData[productId],
          borderColor: product.color,
          backgroundColor: this.hexToRgba(product.color, 0.15),
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: product.color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true
        };
      });

      this.chart.update('none');
    },
    updatePriceData() {
      Object.keys(this.priceData).forEach(key => {
        const arr = this.priceData[key];
        arr.shift();

        const lastPrice = arr[arr.length - 1];
        const newPrice = Math.max(100, lastPrice + (Math.random() - 0.5) * 300);
        arr.push(newPrice);
      });

      const now = new Date();
      this.timeLabels.shift();
      this.timeLabels.push(now.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
    },
    startAutoUpdate() {
      this.updateInterval = setInterval(() => {
        if (this.autoUpdate) {
          this.updatePriceData();
          this.updateChart();
        }
      }, this.updateFrequency);
    },
    stopAutoUpdate() {
      if (this.updateInterval) clearInterval(this.updateInterval);
    },
    toggleAutoUpdate() {
      this.autoUpdate = !this.autoUpdate;
    },
    resetData() {
      this.initializeData();
      this.updateChart();
    },
    toggleProduct(productId) {
      const index = this.selectedProducts.indexOf(productId);
      if (index > -1) {
        if (this.selectedProducts.length > 1) {
          this.selectedProducts.splice(index, 1);
        }
      } else {
        this.selectedProducts.push(productId);
      }
      this.updateChart();
    },
    hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }
};
</script>

<style scoped>
.price-chart-container {
  margin: 30px auto;
  max-width: 1000px;
  padding: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h3 {
  color: #00ffe7;
  font-size: 22px;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 255, 231, 0.5);
}

.controls {
  display: flex;
  gap: 10px;
}

.controls button {
  padding: 8px 14px;
  background: rgba(0, 255, 231, 0.1);
  border: 2px solid #00ffe7;
  border-radius: 20px;
  color: #00ffe7;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.controls button:hover {
  background: rgba(0, 255, 231, 0.2);
  box-shadow: 0 0 10px #00ffe7;
}

.controls button.paused {
  background: #00ffe7;
  color: #0f2027;
}

.product-filters {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 16px;
  border: 2px solid var(--product-color);
  border-radius: 20px;
  background: rgba(0, 255, 231, 0.05);
  color: white;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 0 8px rgba(0, 255, 231, 0.2);
}

.filter-btn:hover {
  background: rgba(0, 255, 231, 0.15);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: var(--product-color);
  color: #0f2027;
  box-shadow: 0 0 15px var(--product-color), inset 0 0 8px rgba(255, 255, 255, 0.3);
}

.chart-wrapper {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid rgba(0, 255, 231, 0.2);
}

#priceChart {
  height: 400px !important;
  width: 100% !important;
}

.info-panel {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  text-align: center;
  padding: 10px;
  border-top: 1px solid rgba(0, 255, 231, 0.2);
}

.time-update {
  color: #00ffe7;
  font-weight: bold;
}

.data-points {
  font-size: 11px;
}
</style>

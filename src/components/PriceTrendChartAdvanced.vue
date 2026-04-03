<template>
  <div class="price-chart-container glass">
    <!-- 标题和控制 -->
    <div class="chart-header">
      <div class="header-left">
        <h3>📈 配件价格趋势分析</h3>
        <p class="chart-subtitle" v-if="selectedIds.length > 0">
          实时监测 {{ selectedIds.length }} 个配件，数据每 {{ updateFrequency / 1000 }}s 更新一次
        </p>
      </div>
      <div class="controls">
        <button @click="toggleAutoUpdate" :class="{ paused: !autoUpdate }" class="control-btn">
          {{ autoUpdate ? '⏸ 暂停更新' : '▶ 继续更新' }}
        </button>
        <button @click="resetData" class="control-btn">
          🔄 重置数据
        </button>
        <button @click="downloadChart" class="control-btn">
          ⬇️ 下载
        </button>
      </div>
    </div>

    <!-- 无选择提示 -->
    <div v-if="selectedIds.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <p>还没有选择任何配件</p>
      <p class="empty-hint">请从配件选择器中选择要对比的配件</p>
    </div>

    <!-- 图表区域 -->
    <div v-else>
      <!-- 配件快速操作 -->
      <div class="component-quick-controls">
        <div class="quick-items">
          <div
            v-for="id in selectedIds"
            :key="id"
            class="quick-item"
            :style="{ '--quick-color': getComponentColor(id) }"
          >
            <span class="quick-dot" :style="{ backgroundColor: getComponentColor(id) }"></span>
            <span class="quick-name">{{ getComponentName(id) }}</span>
            <button @click="removeComponent(id)" class="quick-remove">×</button>
          </div>
        </div>
      </div>

      <!-- 图表容器 -->
      <div class="chart-wrapper">
        <canvas id="priceChart" ref="chartCanvas"></canvas>
      </div>

      <!-- 统计信息面板 -->
      <div class="stats-panel">
        <div class="stats-grid">
          <div v-for="id in selectedIds" :key="id + '-stats'" class="stat-card" :style="{ '--stat-color': getComponentColor(id) }">
            <div class="stat-label">{{ getComponentName(id) }}</div>
            <div class="stat-value">¥{{ getCurrentPrice(id) }}</div>
            <div class="stat-change" :class="getPriceChange(id) > 0 ? 'positive' : 'negative'">
              {{ getPriceChange(id) > 0 ? '↑' : '↓' }} {{ Math.abs(getPriceChange(id)).toFixed(2) }}%
            </div>
          </div>
        </div>
      </div>

      <!-- 更新信息 -->
      <div class="info-panel">
        <span class="time-update">🔄 {{ lastUpdateTime }}</span>
        <span class="data-points">数据点: {{ timeLabels.length }} | 频率: {{ updateFrequency }}ms</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'PriceTrendChartAdvanced',
  props: {
    selectedIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null,
      autoUpdate: true,
      updateInterval: null,
      updateFrequency: 2000,
      lastUpdateTime: '现在',
      timeLabels: [],
      priceData: {},
      componentsInfo: {},
      originalPrices: {},
      apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:5000'
    };
  },
  watch: {
    selectedIds: {
      handler() {
        if (this.selectedIds.length > 0) {
          this.loadDataFromApi();
        } else {
          this.stopAutoUpdate();
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.selectedIds.length > 0) {
      this.loadDataFromApi();
    }
  },
  beforeUnmount() {
    this.stopAutoUpdate();
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    /**
     * 从API加载数据
     */
    async loadDataFromApi() {
      try {
        // 先加载所有配件信息用于初始化componentsInfo
        await this.loadAllComponents();
        // 然后加载选中配件的历史数据
        await this.loadSelectedComponentsData();
        this.createChart();
        this.startAutoUpdate();
      } catch (error) {
        console.error('加载数据失败:', error);
        // 降级到本地mock数据
        this.initializeData();
        this.createChart();
        this.startAutoUpdate();
      }
    },

    /**
     * 从API加载所有配件信息
     */
    async loadAllComponents() {
      try {
        const response = await fetch(`${this.apiUrl}/api/components`);
        if (!response.ok) throw new Error('Failed to fetch components');

        const result = await response.json();
        const components = result.data || [];

        // 构建componentsInfo对象（用于颜色和名称映射）
        this.componentsInfo = {};
        const colorPalette = {
          cpu: ['#FF6B9D', '#FF85B4', '#FFB3D9', '#FFBE6F'],
          gpu: ['#00D4FF', '#00E5FF', '#00F7FF'],
          ram: ['#4ECDC4', '#5FD8CC', '#70E5D8'],
          ssd: ['#95E1D3', '#A8E8DC', '#BCEFE5'],
          mb: ['#FFD700', '#FFC700', '#FFED4E'],
          cool: ['#A8D8FF', '#C5E0FF', '#E1EEFF']
        };

        let categoryIndex = {};

        components.forEach(comp => {
          const category = comp.category;
          if (!categoryIndex[category]) categoryIndex[category] = 0;

          const colorArray = colorPalette[category] || ['#00ffe7'];
          const color = colorArray[categoryIndex[category]++ % colorArray.length];

          this.componentsInfo[comp.id] = {
            name: comp.name,
            color: color,
            basePrice: comp.price
          };
        });
      } catch (error) {
        console.error('加载配件信息失败:', error);
      }
    },

    /**
     * 加载选中配件的历史数据
     */
    async loadSelectedComponentsData() {
      const now = new Date();
      this.timeLabels = [];

      // 生成过去30天的日期标签
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        this.timeLabels.push(
          date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
        );
      }

      this.priceData = {};
      this.originalPrices = {};

      // 并行加载所有选中配件的相关历史数据
      const promises = this.selectedIds.map(id => this.fetchComponentHistory(id));
      await Promise.all(promises);
    },

    /**
     * 获取单个配件的历史数据
     */
    async fetchComponentHistory(componentId) {
      try {
        const response = await fetch(`${this.apiUrl}/api/prices/${componentId}`);
        if (!response.ok) throw new Error(`Failed to fetch ${componentId}`);

        const result = await response.json();
        const historyData = result.data;

        if (historyData && historyData.history) {
          // 提取最后30条记录的价格
          const prices = historyData.history.slice(-30).map(h => h.price);
          this.priceData[componentId] = prices;
          this.originalPrices[componentId] = prices[0];
        }
      } catch (error) {
        console.error(`获取 ${componentId} 历史数据失败:`, error);
      }
    },

    initializeData() {
      // 初始化时间标签 - 过去30天
      const now = new Date();
      this.timeLabels = [];
      this.priceData = {};

      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        this.timeLabels.push(
          date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
        );
      }

      // 为每个选中的配件初始化价格数据
      this.selectedIds.forEach(id => {
        const info = this.componentsInfo[id];
        if (info) {
          const basePrice = info.basePrice;
          this.priceData[id] = this.generatePriceArray(basePrice, basePrice * 0.15, basePrice * 0.05);
          this.originalPrices[id] = this.priceData[id][0];
        }
      });
    },

    generatePriceArray(basePrice, amplitude, variance) {
      const arr = [];
      let currentPrice = basePrice;
      
      for (let i = 0; i < 30; i++) {
        // 使用正弦波 + 随机波动
        const sine = Math.sin((i / 10) * Math.PI) * amplitude * 0.7;
        const random = (Math.random() - 0.5) * variance;
        currentPrice = basePrice + sine + random;
        arr.push(Math.max(basePrice * 0.8, currentPrice));
      }
      return arr;
    },

    createChart() {
      const ctx = this.$refs.chartCanvas?.getContext('2d');
      if (!ctx || this.selectedIds.length === 0) return;

      const datasets = this.selectedIds.map(id => {
        const info = this.componentsInfo[id];
        return {
          label: info.name,
          data: this.priceData[id],
          borderColor: info.color,
          backgroundColor: this.hexToRgba(info.color, 0.15),
          borderWidth: 3.5,
          pointRadius: 5,
          pointBackgroundColor: info.color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2.5,
          pointHoverRadius: 8,
          tension: 0.4,
          fill: true,
          segment: {
            borderDash: () => [0],
          }
        };
      });

      if (this.chart) {
        this.chart.destroy();
      }

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
          animation: {
            duration: 750,
            easing: 'easeInOutQuart'
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#00ffe7',
                font: { size: 13, weight: 'bold', family: "'Orbitron', monospace" },
                usePointStyle: true,
                padding: 20,
                boxWidth: 10,
                boxHeight: 10,
                generateLabels: (chart) => {
                  return chart.data.datasets.map((dataset, i) => ({
                    text: dataset.label,
                    fillStyle: dataset.borderColor,
                    strokeStyle: dataset.borderColor,
                    lineWidth: 3,
                    hidden: false,
                    index: i
                  }));
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 32, 39, 0.98)',
              titleColor: '#00ffe7',
              bodyColor: '#fff',
              borderColor: '#00ffe7',
              borderWidth: 2,
              padding: 15,
              displayColors: true,
              boxPadding: 12,
              titleFont: { size: 13, weight: 'bold' },
              bodyFont: { size: 12 },
              callbacks: {
                title: (context) => {
                  return `日期: ${context[0].label}`;
                },
                label: (context) => {
                  const value = context.parsed.y;
                  return `${context.dataset.label}: ¥${value.toFixed(0)}`;
                },
                afterLabel: (context) => {
                  const originalPrice = this.componentsInfo[this.selectedIds[context.datasetIndex]].basePrice;
                  const change = (((context.parsed.y - originalPrice) / originalPrice) * 100).toFixed(2);
                  return `变化: ${change > 0 ? '+' : ''}${change}%`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: {
                color: 'rgba(0, 255, 231, 0.08)',
                drawBorder: false,
                drawTicks: false,
                lineWidth: 1
              },
              ticks: {
                color: '#888',
                font: { size: 11, family: "'Orbitron', monospace" },
                callback: (value) => '¥' + (value > 1000 ? (value / 1000).toFixed(1) + 'k' : value.toFixed(0)),
                padding: 10
              }
            },
            x: {
              grid: { display: false, drawBorder: false },
              ticks: {
                color: '#888',
                font: { size: 10, family: "'Orbitron', monospace" },
                maxTicksLimit: 10
              }
            }
          }
        }
      });
    },

    updateChart() {
      if (!this.chart || this.selectedIds.length === 0) return;

      this.chart.data.datasets = this.selectedIds.map(id => {
        const info = this.componentsInfo[id];
        return {
          label: info.name,
          data: this.priceData[id],
          borderColor: info.color,
          backgroundColor: this.hexToRgba(info.color, 0.15),
          borderWidth: 3.5,
          pointRadius: 5,
          pointBackgroundColor: info.color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2.5,
          pointHoverRadius: 8,
          tension: 0.4,
          fill: true
        };
      });

      this.chart.update('none');
    },

    updatePriceData() {
      Object.keys(this.priceData).forEach(key => {
        const arr = this.priceData[key];
        const info = this.componentsInfo[key];

        arr.shift();
        const lastPrice = arr[arr.length - 1];

        // 基于基础价格的随机波动
        const volatility = info.basePrice * 0.05;
        const newPrice = lastPrice + (Math.random() - 0.5) * volatility;
        arr.push(Math.max(info.basePrice * 0.8, newPrice));
      });

      const now = new Date();
      this.timeLabels.shift();
      this.timeLabels.push(
        now.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
      );

      this.lastUpdateTime = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },

    startAutoUpdate() {
      this.stopAutoUpdate();
      this.updateInterval = setInterval(() => {
        if (this.autoUpdate && this.selectedIds.length > 0) {
          this.updatePriceData();
          this.updateChart();
        }
      }, this.updateFrequency);
    },

    stopAutoUpdate() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
    },

    toggleAutoUpdate() {
      this.autoUpdate = !this.autoUpdate;
    },

    resetData() {
      this.initializeData();
      this.updateChart();
    },

    removeComponent(id) {
      this.$emit('remove', id);
    },

    getCurrentPrice(id) {
      if (this.priceData[id] && this.priceData[id].length > 0) {
        return this.priceData[id][this.priceData[id].length - 1].toFixed(0);
      }
      return this.componentsInfo[id]?.basePrice || 0;
    },

    getPriceChange(id) {
      if (this.priceData[id] && this.priceData[id].length > 0) {
        const original = this.originalPrices[id];
        const current = this.priceData[id][this.priceData[id].length - 1];
        return ((current - original) / original) * 100;
      }
      return 0;
    },

    getComponentColor(id) {
      return this.componentsInfo[id]?.color || '#00ffe7';
    },

    getComponentName(id) {
      return this.componentsInfo[id]?.name || id;
    },

    hexToRgba(hex, alpha) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    downloadChart() {
      if (this.chart && this.chart.canvas) {
        const link = document.createElement('a');
        link.href = this.chart.canvas.toDataURL('image/png');
        link.download = `price-trend-${new Date().toISOString().split('T')[0]}.png`;
        link.click();
      }
    }
  }
};
</script>

<style scoped>
.price-chart-container {
  background: rgba(15, 32, 39, 0.9);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 231, 0.2);
  padding: 40px;
  margin: 30px auto;
  max-width: 1400px;
  box-shadow: 0 8px 32px rgba(0, 255, 231, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.header-left h3 {
  font-size: 28px;
  color: #00ffe7;
  text-shadow: 0 0 20px #00ffe7;
  margin: 0 0 8px 0;
  font-weight: bold;
}

.chart-subtitle {
  color: #aaa;
  font-size: 13px;
  margin: 0;
}

.controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 10px 18px;
  background: linear-gradient(135deg, rgba(0, 255, 231, 0.1), rgba(0, 212, 255, 0.1));
  border: 2px solid rgba(0, 255, 231, 0.4);
  color: #00ffe7;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
  font-weight: bold;
}

.control-btn:hover {
  background: linear-gradient(135deg, rgba(0, 255, 231, 0.2), rgba(0, 212, 255, 0.15));
  border-color: #00ffe7;
  box-shadow: 0 0 15px rgba(0, 255, 231, 0.3);
}

.control-btn.paused {
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(255, 107, 157, 0.05));
  border-color: #FF6B9D;
  color: #FF6B9D;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.6;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.empty-state p {
  margin: 8px 0;
  font-size: 14px;
}

.empty-hint {
  color: #555;
  font-size: 12px;
}

/* 快速控制 */
.component-quick-controls {
  margin-bottom: 25px;
  background: rgba(0, 255, 231, 0.05);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(0, 255, 231, 0.1);
}

.quick-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.quick-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 255, 231, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 231, 0.2);
  font-size: 12px;
  color: #ccc;
}

.quick-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.quick-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick-remove {
  background: none;
  border: none;
  color: #FF6B9D;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  transition: color 0.2s;
}

.quick-remove:hover {
  color: #fff;
}

/* 图表容器 */
.chart-wrapper {
  background: rgba(15, 32, 39, 0.6);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 25px;
  border: 1px solid rgba(0, 255, 231, 0.1);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#priceChart {
  max-height: 400px;
  width: 100% !important;
}

/* 统计面板 */
.stats-panel {
  margin-bottom: 25px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(0, 255, 231, 0.08), rgba(0, 212, 255, 0.05));
  border: 2px solid rgba(0, 255, 231, 0.15);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s;
}

.stat-card:hover {
  border-color: var(--stat-color);
  box-shadow: 0 0 20px rgba(0, 255, 231, 0.2);
}

.stat-label {
  font-size: 12px;
  color: #888;
  margin-bottom: 8px;
  font-weight: bold;
}

.stat-value {
  font-size: 24px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 13px;
  font-weight: bold;
}

.stat-change.positive {
  color: #FF6B9D;
}

.stat-change.negative {
  color: #4ECDC4;
}

/* 信息面板 */
.info-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: rgba(0, 255, 231, 0.05);
  border-radius: 10px;
  font-size: 12px;
  color: #888;
  flex-wrap: wrap;
  gap: 15px;
}

.time-update {
  color: #4ECDC4;
  font-weight: bold;
}

.data-points {
  color: #888;
}

@media (max-width: 768px) {
  .price-chart-container {
    padding: 20px;
  }

  .chart-header {
    flex-direction: column;
  }

  .controls {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-wrapper {
    padding: 15px;
    min-height: 300px;
  }

  .info-panel {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

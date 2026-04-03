<template>
  <div class="component-selector-container glass">
    <div class="selector-header">
      <h3>🛍️ 电脑配件价格查询</h3>
      <p class="subtitle">选择感兴趣的配件，实时查看价格趋势</p>
    </div>

    <!-- 配件分类菜单 -->
    <div class="category-tabs">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectedCategory = category.id"
        :class="{ active: selectedCategory === category.id }"
        class="category-tab"
      >
        {{ category.emote }} {{ category.name }}
      </button>
    </div>

    <!-- 配件网格 -->
    <div class="components-grid">
      <div
        v-for="component in currentComponents"
        :key="component.id"
        @click="toggleComponent(component.id)"
        :class="{ selected: selectedComponents.includes(component.id) }"
        class="component-card"
        :style="{ '--card-color': component.color }"
      >
        <div class="card-header">
          <span class="component-icon">{{ component.emote }}</span>
        </div>
        <div class="card-body">
          <h4 class="component-name">{{ component.name }}</h4>
          <div class="component-price">
            <span class="current-price">¥{{ component.price }}</span>
            <span class="trend" :class="component.trend > 0 ? 'up' : 'down'">
              {{ component.trend > 0 ? '↑' : '↓' }} {{ Math.abs(component.trend) }}%
            </span>
          </div>
          <div class="component-specs">
            <span v-if="component.specs" class="specs-text">{{ component.specs }}</span>
          </div>
        </div>
        <div class="card-footer">
          <span class="select-indicator" v-if="selectedComponents.includes(component.id)">
            ✓ 已选择
          </span>
          <span class="select-hint" v-else>
            点击选择
          </span>
        </div>
      </div>
    </div>

    <!-- 选中的配件展示 -->
    <div v-if="selectedComponents.length > 0" class="selected-summary">
      <div class="summary-header">
        <h4>已选配件 ({{ selectedComponents.length }})</h4>
        <button @click="clearSelection" class="clear-btn">清空</button>
      </div>
      <div class="selected-pills">
        <span
          v-for="id in selectedComponents"
          :key="id"
          class="pill"
          :style="{ '--pill-color': getComponentColor(id) }"
        >
          {{ getComponentName(id) }}
          <button @click.stop="removeComponent(id)" class="pill-close">×</button>
        </span>
      </div>
      <button @click="viewChart" class="view-chart-btn">
        📊 查看趋势图
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentSelector',
  props: {
    components: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:selected', 'view-chart'],
  data() {
    return {
      selectedCategory: 'cpu',
      selectedComponents: [],
      categories: [
        { id: 'cpu', name: 'CPU处理器', emote: '💻' },
        { id: 'gpu', name: 'GPU显卡', emote: '🎮' },
        { id: 'ram', name: '内存条', emote: '🧠' },
        { id: 'ssd', name: '固态硬盘', emote: '💾' },
        { id: 'mb', name: '主板', emote: '🔌' },
        { id: 'cool', name: '散热器', emote: '❄️' }
      ],
      // 详细的配件数据（可从API获取）
      componentsData: {
        cpu: [
          { id: 'cpu-1', name: 'Intel Core Ultra 9 285K', price: 3949, trend: -3.2, specs: '24核', emote: '💻', color: '#FF6B9D' },
          { id: 'cpu-2', name: 'Intel Core Ultra 7 265K', price: 2799, trend: -2.8, specs: '16核', emote: '💻', color: '#FF85B4' },
          { id: 'cpu-3', name: 'AMD Ryzen 9 9950X', price: 4499, trend: -1.5, specs: '16核', emote: '💻', color: '#FFB3D9' },
          { id: 'cpu-4', name: 'AMD Ryzen 7 9700X', price: 2299, trend: -4.1, specs: '12核', emote: '💻', color: '#FFBE6F' }
        ],
        gpu: [
          { id: 'gpu-1', name: 'NVIDIA RTX 5090 D', price: 16499, trend: 2.1, specs: '32GB GDDR7', emote: '🎮', color: '#00D4FF' },
          { id: 'gpu-2', name: 'NVIDIA RTX 5080', price: 8299, trend: 1.3, specs: '16GB', emote: '🎮', color: '#00E5FF' },
          { id: 'gpu-3', name: 'AMD RX 9070 XT', price: 4999, trend: -2.0, specs: '16GB GDDR6', emote: '🎮', color: '#00F7FF' }
        ],
        ram: [
          { id: 'ram-1', name: 'DDR5 32GB 6000MHz', price: 699, trend: -5.3, specs: '2x16GB Kit', emote: '🧠', color: '#4ECDC4' },
          { id: 'ram-2', name: 'DDR5 64GB 6000MHz', price: 1399, trend: -3.8, specs: '2x32GB Kit', emote: '🧠', color: '#5FD8CC' },
          { id: 'ram-3', name: 'DDR4 32GB 3200MHz', price: 359, trend: -6.2, specs: '2x16GB Kit', emote: '🧠', color: '#70E5D8' }
        ],
        ssd: [
          { id: 'ssd-1', name: '三星 990 Pro 2TB', price: 1299, trend: -2.4, specs: 'PCIe 4.0', emote: '💾', color: '#95E1D3' },
          { id: 'ssd-2', name: 'WD Black SN850X 2TB', price: 1099, trend: -1.9, specs: 'PCIe 4.0', emote: '💾', color: '#A8E8DC' },
          { id: 'ssd-3', name: '致态 TiPlus7100 2TB', price: 799, trend: -3.5, specs: 'PCIe 4.0', emote: '💾', color: '#BCEFE5' }
        ],
        mb: [
          { id: 'mb-1', name: 'ROG STRIX Z890-E', price: 3999, trend: 0.5, specs: 'Intel Z890', emote: '🔌', color: '#FFD700' },
          { id: 'mb-2', name: 'ROG CROSSHAIR X870E', price: 4999, trend: 1.2, specs: 'AMD X870E', emote: '🔌', color: '#FFC700' },
          { id: 'mb-3', name: '华硕 B850M-K', price: 799, trend: -1.8, specs: 'AMD B850M', emote: '🔌', color: '#FFED4E' }
        ],
        cool: [
          { id: 'cool-1', name: '猫头鹰 NH-D15', price: 799, trend: -0.3, specs: '双塔风冷', emote: '❄️', color: '#A8D8FF' },
          { id: 'cool-2', name: '猫头鹰 NH-U12A', price: 699, trend: 0.8, specs: '单塔风冷', emote: '❄️', color: '#C5E0FF' },
          { id: 'cool-3', name: '海盗船 H150i Elite', price: 1299, trend: -1.5, specs: '360mm一体', emote: '❄️', color: '#E1EEFF' }
        ]
      }
    };
  },
  computed: {
    currentComponents() {
      return this.componentsData[this.selectedCategory] || [];
    }
  },
  methods: {
    toggleComponent(id) {
      const index = this.selectedComponents.indexOf(id);
      if (index > -1) {
        this.selectedComponents.splice(index, 1);
      } else {
        this.selectedComponents.push(id);
      }
      this.$emit('update:selected', this.selectedComponents);
    },
    removeComponent(id) {
      const index = this.selectedComponents.indexOf(id);
      if (index > -1) {
        this.selectedComponents.splice(index, 1);
      }
    },
    clearSelection() {
      this.selectedComponents = [];
      this.$emit('update:selected', this.selectedComponents);
    },
    getComponentColor(id) {
      for (const category of Object.values(this.componentsData)) {
        const comp = category.find(c => c.id === id);
        if (comp) return comp.color;
      }
      return '#00ffe7';
    },
    getComponentName(id) {
      for (const category of Object.values(this.componentsData)) {
        const comp = category.find(c => c.id === id);
        if (comp) return comp.name;
      }
      return id;
    },
    viewChart() {
      this.$emit('view-chart', this.selectedComponents);
    }
  }
};
</script>

<style scoped>
.component-selector-container {
  background: rgba(15, 32, 39, 0.8);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 231, 0.2);
  padding: 40px;
  margin: 30px auto;
  max-width: 1200px;
}

.selector-header {
  text-align: center;
  margin-bottom: 30px;
}

.selector-header h3 {
  font-size: 28px;
  color: #00ffe7;
  text-shadow: 0 0 20px #00ffe7;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.subtitle {
  color: #aaa;
  font-size: 14px;
  margin: 0;
}

/* 分类标签 */
.category-tabs {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  margin-bottom: 30px;
  padding-bottom: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.category-tab {
  padding: 10px 20px;
  border: 2px solid rgba(0, 255, 231, 0.3);
  background: rgba(0, 255, 231, 0.05);
  color: #aaa;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  white-space: nowrap;
}

.category-tab:hover {
  border-color: #00ffe7;
  color: #00ffe7;
  background: rgba(0, 255, 231, 0.15);
}

.category-tab.active {
  background: linear-gradient(135deg, #00ffe7, #00d4ff);
  color: #000;
  border-color: #00ffe7;
  font-weight: bold;
}

/* 配件网格 */
.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.component-card {
  background: linear-gradient(135deg, rgba(0, 255, 231, 0.08), rgba(0, 212, 255, 0.08));
  border: 2px solid rgba(0, 255, 231, 0.2);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.component-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--card-color, #00ffe7);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
}

.component-card:hover {
  border-color: var(--card-color, #00ffe7);
  transform: translateY(-8px);
  box-shadow: 0 8px 32px rgba(0, 255, 231, 0.2);
}

.component-card.selected {
  border-color: var(--card-color, #00ffe7);
  background: linear-gradient(135deg, rgba(0, 255, 231, 0.2), rgba(0, 212, 255, 0.15));
  box-shadow: 0 0 30px rgba(0, 255, 231, 0.4), inset 0 0 20px rgba(0, 255, 231, 0.1);
}

.card-header {
  font-size: 32px;
  margin-bottom: 12px;
}

.component-icon {
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.card-body {
  margin-bottom: 15px;
}

.component-name {
  font-size: 16px;
  color: #00ffe7;
  margin: 0 0 10px 0;
  font-weight: bold;
  line-height: 1.3;
}

.component-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.current-price {
  font-size: 20px;
  color: #fff;
  font-weight: bold;
}

.trend {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: bold;
}

.trend.up {
  background: rgba(255, 107, 157, 0.2);
  color: #FF6B9D;
}

.trend.down {
  background: rgba(78, 205, 196, 0.2);
  color: #4ECDC4;
}

.component-specs {
  font-size: 12px;
  color: #888;
}

.specs-text {
  display: inline-block;
  background: rgba(0, 255, 231, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
}

.card-footer {
  text-align: center;
  font-size: 12px;
  color: #666;
}

.select-indicator {
  color: #4ECDC4;
  font-weight: bold;
}

.select-hint {
  color: #666;
  transition: color 0.3s;
}

.component-card:hover .select-hint {
  color: #00ffe7;
}

/* 选中摘要 */
.selected-summary {
  background: rgba(0, 255, 231, 0.08);
  border: 2px solid rgba(0, 255, 231, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-top: 30px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.summary-header h4 {
  margin: 0;
  color: #00ffe7;
  font-size: 16px;
}

.clear-btn {
  padding: 6px 12px;
  background: rgba(255, 107, 157, 0.2);
  color: #FF6B9D;
  border: 1px solid #FF6B9D;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;
}

.clear-btn:hover {
  background: rgba(255, 107, 157, 0.3);
}

.selected-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--pill-color), rgba(0, 255, 231, 0.1));
  color: #fff;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  border: 1px solid var(--pill-color);
}

.pill-close {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  line-height: 1;
  transition: transform 0.2s;
}

.pill-close:hover {
  transform: scale(1.2);
}

.view-chart-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #00ffe7, #00d4ff);
  color: #000;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 255, 231, 0.3);
}

.view-chart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 255, 231, 0.5);
}

.view-chart-btn:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .component-selector-container {
    padding: 20px;
  }

  .components-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  .category-tabs {
    gap: 8px;
  }

  .category-tab {
    padding: 8px 14px;
    font-size: 12px;
  }
}
</style>

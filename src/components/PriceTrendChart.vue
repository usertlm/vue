<template>
  <div class="price-trend-wrap">

    <!-- ===== 页面标题 ===== -->
    <div class="section-header">
      <span class="header-emoji">📊</span>
      <h2>电脑配件价格趋势</h2>
      <p class="header-sub">实时追踪淘宝/京东全网最低价 · 点击感兴趣的部分查看详情</p>
    </div>

    <!-- ===== 分类选择（卡通卡片） ===== -->
    <div class="category-grid">
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="['cat-card', { active: selectedCategory === cat.id }]"
        @click="selectCategory(cat.id)"
      >
        <span class="cat-emoji">{{ cat.icon }}</span>
        <span class="cat-name">{{ cat.name }}</span>
        <span class="cat-count">{{ getCategoryCount(cat.id) }} 款</span>
      </button>
    </div>

    <!-- ===== 搜索框 ===== -->
    <div class="search-zone">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="`搜索 ${currentCategoryName} 型号...`"
          @input="onSearch"
          @focus="showSearchResults = true"
          class="search-input"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-btn">✕</button>
      </div>

      <!-- 搜索结果下拉 -->
      <div v-if="showSearchResults && filteredSearchResults.length > 0" class="search-dropdown">
        <div
          v-for="item in filteredSearchResults"
          :key="item.id"
          class="search-result-item"
          @click="selectProduct(item)"
        >
          <span class="result-emoji">{{ getCategoryEmoji(item.id) }}</span>
          <div class="result-info">
            <span class="result-name">{{ item.name }}</span>
            <span class="result-cat">{{ getCategoryName(item.id) }}</span>
          </div>
          <span class="result-price">¥{{ item.price }}</span>
        </div>
      </div>
    </div>

    <!-- ===== 商品选择（分类内下拉） ===== -->
    <div class="product-select-zone">
      <div class="select-wrapper">
        <span class="select-icon">{{ currentCategoryIcon }}</span>
        <select v-model="selectedProductId" @change="onProductChange" class="product-select">
          <option value="">—— 选择{{ currentCategoryName }}型号查看趋势 ——</option>
          <option v-for="p in currentProducts" :key="p.id" :value="p.id">
            {{ p.name }} · ¥{{ p.price }}
          </option>
        </select>
        <span class="select-arrow">▼</span>
      </div>
    </div>

    <!-- ===== 图表区域 ===== -->
    <div v-if="selectedProductId && chartDataReady" class="chart-zone">

      <!-- 商品信息头 -->
      <div class="product-hero">
        <div class="product-hero-left">
          <span class="hero-emoji">{{ currentCategoryIcon }}</span>
          <div>
            <h3 class="hero-name">{{ currentProduct.name }}</h3>
            <div class="hero-meta">
              <span class="meta-tag source-tag">
                <span class="tag-dot" :class="priceSourceClass"></span>
                {{ priceSourceLabel }}
              </span>
              <span class="meta-tag update-tag">⏰ {{ lastUpdatedStr }}</span>
            </div>
          </div>
        </div>
        <div class="product-hero-right">
          <div class="current-price-block">
            <span class="price-label">当前价格</span>
            <span class="price-value">¥{{ currentProduct.price }}</span>
          </div>
          <div :class="['price-change-block', priceChangeClass]">
            <span class="change-arrow">{{ priceChange >= 0 ? '📈' : '📉' }}</span>
            <span class="change-value">
              {{ priceChange >= 0 ? '+' : '' }}¥{{ Math.abs(priceChange).toFixed(0) }}
              ({{ priceChangePercent }}%)
            </span>
          </div>
        </div>
      </div>

      <!-- 卡通折线图 -->
      <div class="chart-card">
        <div class="chart-toolbar">
          <span class="chart-title">📈 {{ currentCategoryName }}价格走势</span>
          <div class="range-buttons">
            <button
              v-for="r in timeRanges"
              :key="r.value"
              :class="['range-btn', { active: selectedRange === r.value }]"
              @click="selectedRange = r.value"
            >{{ r.label }}</button>
          </div>
        </div>
        <div class="chart-body">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- 价格统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card stat-low">
          <span class="stat-card-icon">🪙</span>
          <span class="stat-card-label">历史最低</span>
          <span class="stat-card-value">¥{{ historyLow }}</span>
          <span class="stat-card-date">{{ historyLowDate }}</span>
        </div>
        <div class="stat-card stat-avg">
          <span class="stat-card-icon">📊</span>
          <span class="stat-card-label">均价</span>
          <span class="stat-card-value">¥{{ historyAvg }}</span>
        </div>
        <div class="stat-card stat-current">
          <span class="stat-card-icon">💰</span>
          <span class="stat-card-label">当前价格</span>
          <span class="stat-card-value">¥{{ currentProduct.price }}</span>
        </div>
        <div class="stat-card stat-high">
          <span class="stat-card-icon">💎</span>
          <span class="stat-card-label">历史最高</span>
          <span class="stat-card-value">¥{{ historyHigh }}</span>
          <span class="stat-card-date">{{ historyHighDate }}</span>
        </div>
      </div>

      <!-- 价格时间线 -->
      <div class="timeline-section">
        <div class="timeline-header">
          <span class="timeline-title">📅 价格历史明细</span>
          <span class="timeline-count">{{ filteredHistory.length }} 条记录</span>
        </div>
        <div class="timeline-list">
          <div
            v-for="(item, idx) in filteredHistory"
            :key="idx"
            :class="['timeline-item', { 'is-latest': idx === 0, 'is-lowest': item.price === historyLow && filteredHistory.length > 3 }]"
          >
            <div class="tl-left">
              <span class="tl-dot"></span>
              <span class="tl-date">{{ formatDate(item.time) }}</span>
            </div>
            <div class="tl-center">
              <div class="tl-bar-wrap">
                <div
                  class="tl-bar"
                  :style="{ width: getBarWidth(item.price) + '%' }"
                  :class="getBarClass(item.price)"
                ></div>
              </div>
            </div>
            <div class="tl-right">
              <span class="tl-price">¥{{ item.price }}</span>
              <span v-if="idx < filteredHistory.length - 1" :class="['tl-diff', getDiffClass(idx)]">
                {{ getDiffLabel(idx) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据来源说明 -->
      <div class="source-info">
        <span class="source-label">📡 数据来源：</span>
        <span class="source-tags">
          <span class="source-tag jd">京东实时价</span>
          <span class="source-tag tb">淘宝/天猫参考价</span>
        </span>
        <span class="source-note">· 每小时自动更新 · 低价提醒请收藏页面</span>
      </div>

    </div>

    <!-- ===== 空状态 ===== -->
    <div v-else-if="!selectedProductId" class="empty-state">
      <div class="empty-illustration">🎯</div>
      <h3>选择一个配件，开始追踪价格</h3>
      <p>从上方卡片选择一个分类，再选择具体型号<br/>即可查看历史价格走势</p>
      <div class="empty-hints">
        <span v-for="hint in emptyHints" :key="hint" class="hint-chip">{{ hint }}</span>
      </div>
    </div>

    <!-- ===== 加载状态 ===== -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">⏳</div>
      <p>正在加载最新价格数据...</p>
    </div>

  </div>
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

// 每分类颜色主题
const CATEGORY_THEMES = {
  cpu:  { color: "#FF6B6B", fill: "rgba(255,107,107,0.15)",  name: "CPU处理器" },
  gpu:  { color: "#4ECDC4", fill: "rgba(78,205,196,0.15)",   name: "显卡" },
  ram:  { color: "#FFD93D", fill: "rgba(255,217,61,0.15)",   name: "内存" },
  ssd:  { color: "#A29BFE", fill: "rgba(162,155,254,0.15)",  name: "固态硬盘" },
  mb:   { color: "#74B9FF", fill: "rgba(116,185,255,0.15)",  name: "主板" },
  cool: { color: "#00CEC9", fill: "rgba(0,206,201,0.15)",    name: "散热器" },
};

export default {
  name: "PriceTrendChart",
  components: { Line },
  data() {
    return {
      categories: [
        { id: "gpu",  name: "显卡",      icon: "🎮", emoji: "🎮" },
        { id: "cpu",  name: "CPU",       icon: "⚙️", emoji: "⚙️" },
        { id: "ram",  name: "内存",      icon: "💾", emoji: "💾" },
        { id: "ssd",  name: "固态硬盘",  icon: "💿", emoji: "💿" },
        { id: "mb",   name: "主板",      icon: "🔌", emoji: "🔌" },
        { id: "cool", name: "散热器",   icon: "❄️", emoji: "❄️" },
      ],
      timeRanges: [
        { label: "7天",  value: 7  },
        { label: "30天", value: 30 },
        { label: "90天", value: 90 },
        { label: "全部", value: 0  },
      ],
      selectedCategory: "gpu",
      selectedProductId: "",
      selectedRange: 30,
      searchQuery: "",
      showSearchResults: false,
      priceData: null,
      isLoading: false,
      emptyHints: ["RTX 5090 跌破万元", "DDR5 内存创新低", "SSD 持续降价中", "9800X3D 价格走势"],
    };
  },
  computed: {
    currentCategoryTheme() {
      return CATEGORY_THEMES[this.selectedCategory] || CATEGORY_THEMES.cpu;
    },
    currentCategoryName() {
      return this.currentCategoryTheme.name;
    },
    currentCategoryIcon() {
      const cat = this.categories.find(c => c.id === this.selectedCategory);
      return cat ? cat.icon : "⚙️";
    },
    currentProducts() {
      if (!this.priceData?.categories) return [];
      return this.priceData.categories[this.selectedCategory] || [];
    },
    currentProduct() {
      if (!this.selectedProductId || !this.currentProducts.length) return null;
      return this.currentProducts.find(p => p.id === this.selectedProductId) || null;
    },
    // 历史趋势（按时间正序，最旧→最新）
    priceHistory() {
      if (!this.currentProduct?.history?.length) return [];
      return [...this.currentProduct.history].reverse(); // newest-first → oldest-first for chart
    },
    // 过滤后的历史
    filteredHistory() {
      if (!this.priceHistory.length) return [];
      if (this.selectedRange === 0) return this.priceHistory;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - this.selectedRange);
      return this.priceHistory.filter(h => new Date(h.time) >= cutoff);
    },
    // 价格变化（相比昨天）
    priceChange() {
      if (this.filteredHistory.length < 2) return 0;
      return this.filteredHistory[0].price - this.filteredHistory[1].price;
    },
    priceChangePercent() {
      if (this.filteredHistory.length < 2 || this.filteredHistory[1].price === 0) return "0.00";
      return ((this.priceChange / this.filteredHistory[1].price) * 100).toFixed(2);
    },
    priceChangeClass() {
      if (this.priceChange > 0) return "up";
      if (this.priceChange < 0) return "down";
      return "flat";
    },
    // 历史统计
    historyLow() {
      if (!this.filteredHistory.length) return "0";
      return Math.min(...this.filteredHistory.map(h => h.price)).toFixed(0);
    },
    historyHigh() {
      if (!this.filteredHistory.length) return "0";
      return Math.max(...this.filteredHistory.map(h => h.price)).toFixed(0);
    },
    historyAvg() {
      if (!this.filteredHistory.length) return "0";
      const avg = this.filteredHistory.reduce((s, h) => s + h.price, 0) / this.filteredHistory.length;
      return avg.toFixed(0);
    },
    historyLowDate() {
      if (!this.filteredHistory.length) return "";
      const low = Math.min(...this.filteredHistory.map(h => h.price));
      const item = this.filteredHistory.find(h => h.price === low);
      return item ? this.formatDate(item.time) : "";
    },
    historyHighDate() {
      if (!this.filteredHistory.length) return "";
      const high = Math.max(...this.filteredHistory.map(h => h.price));
      const item = this.filteredHistory.find(h => h.price === high);
      return item ? this.formatDate(item.time) : "";
    },
    lastUpdatedStr() {
      if (!this.priceData?.lastUpdated) return "从未";
      return new Date(this.priceData.lastUpdated).toLocaleString("zh-CN", {
        month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
      });
    },
    priceSourceLabel() {
      if (!this.currentProduct?.history?.length) return "暂无数据";
      const last = this.currentProduct.history[this.currentProduct.history.length - 1];
      return last?.source === "taobao" ? "淘宝源" : "京东源";
    },
    priceSourceClass() {
      if (!this.currentProduct?.history?.length) return "unknown";
      const last = this.currentProduct.history[this.currentProduct.history.length - 1];
      return last?.source === "taobao" ? "tb" : "jd";
    },
    chartDataReady() {
      return this.currentProduct && this.filteredHistory.length > 0;
    },
    // Chart.js 数据
    chartData() {
      const theme = this.currentCategoryTheme;
      const hist = this.filteredHistory;

      return {
        labels: hist.map(h => {
          const d = new Date(h.time);
          return `${d.getMonth() + 1}/${d.getDate()}`;
        }),
        datasets: [{
          label: this.currentProduct?.name || "",
          data: hist.map(h => h.price),
          borderColor: theme.color,
          backgroundColor: theme.fill,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 9,
          pointBackgroundColor: theme.color,
          pointBorderColor: "#fff",
          pointBorderWidth: 2.5,
          pointStyle: "circle",
        }],
      };
    },
    chartOptions() {
      const theme = this.currentCategoryTheme;
      return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(20,20,30,0.92)",
            titleColor: "#FFD93D",
            bodyColor: "#fff",
            padding: 14,
            borderColor: theme.color,
            borderWidth: 2,
            cornerRadius: 12,
            displayColors: false,
            callbacks: {
              title: (items) => {
                const idx = items[0]?.dataIndex;
                const item = this.filteredHistory[idx];
                return item ? `📅 ${this.formatDate(item.time)}` : "";
              },
              label: (ctx) => `💰 价格: ¥${ctx.raw.toFixed(0)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "#aaa", maxRotation: 0, maxTicksLimit: 8 },
          },
          y: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: {
              color: "#aaa",
              callback: (v) => `¥${v.toFixed(0)}`,
            },
          },
        },
        animation: {
          duration: 800,
          easing: "easeOutQuart",
        },
      };
    },
    // 搜索结果（全局跨分类）
    allProducts() {
      if (!this.priceData?.categories) return [];
      const results = [];
      for (const [catId, items] of Object.entries(this.priceData.categories)) {
        for (const item of items) {
          results.push({ ...item, catId });
        }
      }
      return results;
    },
    filteredSearchResults() {
      if (!this.searchQuery.trim()) return [];
      const q = this.searchQuery.toLowerCase();
      return this.allProducts.filter(p =>
        p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
      ).slice(0, 8);
    },
  },
  watch: {
    selectedCategory() {
      this.selectedProductId = "";
    },
    searchQuery() {
      this.showSearchResults = !!this.searchQuery;
    },
  },
  mounted() {
    this.loadData();
    // 关闭搜索下拉
    document.addEventListener("click", this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      try {
        const resp = await fetch("/api/prices");
        if (resp.ok) {
          this.priceData = await resp.json();
        }
      } catch (e) {
        console.error("价格数据加载失败:", e);
      } finally {
        this.isLoading = false;
      }
    },
    selectCategory(catId) {
      this.selectedCategory = catId;
      this.selectedProductId = "";
      this.searchQuery = "";
      this.showSearchResults = false;
    },
    onProductChange() {
      this.selectedRange = 30;
    },
    selectProduct(item) {
      // 找到该商品所属分类并切换
      const catId = item.catId || item.id.split("-")[0];
      this.selectedCategory = catId;
      this.$nextTick(() => {
        this.selectedProductId = item.id;
      });
      this.searchQuery = "";
      this.showSearchResults = false;
    },
    onSearch() {
      this.showSearchResults = true;
    },
    clearSearch() {
      this.searchQuery = "";
      this.showSearchResults = false;
    },
    handleOutsideClick(e) {
      if (!e.target.closest(".search-zone")) {
        this.showSearchResults = false;
      }
    },
    getCategoryCount(catId) {
      return (this.priceData?.categories?.[catId] || []).length;
    },
    getCategoryEmoji(id) {
      const prefix = id.split("-")[0];
      const cat = this.categories.find(c => c.id === prefix);
      return cat ? cat.icon : "📦";
    },
    getCategoryName(id) {
      const prefix = id.split("-")[0];
      return CATEGORY_THEMES[prefix]?.name || prefix;
    },
    formatDate(dateStr) {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    },
    getBarWidth(price) {
      if (!this.filteredHistory.length) return 0;
      const min = Math.min(...this.filteredHistory.map(h => h.price));
      const max = Math.max(...this.filteredHistory.map(h => h.price));
      const range = max - min || 1;
      return ((price - min) / range * 100).toFixed(1);
    },
    getBarClass(price) {
      const current = this.filteredHistory[0]?.price || 0;
      if (price < current) return "bar-low";
      if (price > current) return "bar-high";
      return "bar-same";
    },
    getDiffClass(idx) {
      // filteredHistory is oldest-first for display
      const curr = this.filteredHistory[idx];
      const next = this.filteredHistory[idx + 1];
      if (!next) return "";
      return curr.price > next.price ? "diff-up" : curr.price < next.price ? "diff-down" : "diff-same";
    },
    getDiffLabel(idx) {
      const curr = this.filteredHistory[idx];
      const next = this.filteredHistory[idx + 1];
      if (!next) return "";
      const diff = curr.price - next.price;
      if (diff > 0) return `+¥${diff.toFixed(0)}`;
      if (diff < 0) return `-¥${Math.abs(diff).toFixed(0)}`;
      return "—";
    },
  },
};
</script>

<style scoped>
/* ── 全局容器 ── */
.price-trend-wrap {
  max-width: 900px;
  margin: 40px auto;
  padding: 32px 24px;
  background: linear-gradient(165deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 28px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(78,205,196,0.08);
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  position: relative;
  overflow: hidden;
}

/* 背景装饰圆 */
.price-trend-wrap::before {
  content: '';
  position: absolute;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(78,205,196,0.06) 0%, transparent 70%);
  top: -150px; right: -150px;
  pointer-events: none;
}
.price-trend-wrap::after {
  content: '';
  position: absolute;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(255,107,107,0.05) 0%, transparent 70%);
  bottom: -100px; left: -100px;
  pointer-events: none;
}

/* ── 标题区 ── */
.section-header {
  text-align: center;
  margin-bottom: 28px;
}
.header-emoji { font-size: 36px; display: block; margin-bottom: 8px; }
.section-header h2 {
  color: #fff;
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 8px;
  text-shadow: 0 2px 12px rgba(78,205,196,0.3);
}
.header-sub {
  color: #8899aa;
  font-size: 14px;
  margin: 0;
}

/* ── 分类卡片网格 ── */
.category-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}
@media (max-width: 640px) {
  .category-grid { grid-template-columns: repeat(3, 1fr); }
}

.cat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 8px;
  background: rgba(255,255,255,0.04);
  border: 2px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: #8899aa;
  gap: 4px;
}
.cat-card:hover {
  background: rgba(255,255,255,0.08);
  transform: translateY(-4px) scale(1.04);
  border-color: rgba(255,255,255,0.2);
  color: #fff;
}
.cat-card.active {
  background: rgba(78,205,196,0.15);
  border-color: #4ECDC4;
  color: #4ECDC4;
  box-shadow: 0 4px 20px rgba(78,205,196,0.2);
}
.cat-emoji { font-size: 26px; }
.cat-name { font-size: 12px; font-weight: 600; }
.cat-count { font-size: 10px; opacity: 0.6; }

/* ── 搜索区 ── */
.search-zone {
  position: relative;
  margin-bottom: 16px;
}
.search-box {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.06);
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 50px;
  padding: 0 18px;
  gap: 10px;
  transition: border-color 0.2s;
}
.search-box:focus-within {
  border-color: #4ECDC4;
  background: rgba(78,205,196,0.05);
}
.search-icon { font-size: 18px; }
.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #fff;
  font-size: 15px;
  padding: 13px 0;
}
.search-input::placeholder { color: #556677; }
.clear-btn {
  background: none;
  border: none;
  color: #667;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0; right: 0;
  background: #1e2a3a;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  overflow: hidden;
  z-index: 100;
  box-shadow: 0 16px 40px rgba(0,0,0,0.4);
}
.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.search-result-item:last-child { border-bottom: none; }
.search-result-item:hover { background: rgba(78,205,196,0.1); }
.result-emoji { font-size: 20px; }
.result-info { flex: 1; display: flex; flex-direction: column; }
.result-name { color: #fff; font-size: 14px; font-weight: 500; }
.result-cat { color: #667; font-size: 11px; }
.result-price { color: #FFD93D; font-weight: 700; font-size: 14px; }

/* ── 商品选择 ── */
.product-select-zone { margin-bottom: 20px; }
.select-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 0 16px;
  gap: 10px;
}
.select-icon { font-size: 22px; }
.product-select {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #fff;
  font-size: 15px;
  padding: 14px 0;
  cursor: pointer;
  appearance: none;
}
.product-select option { background: #1a1a2e; color: #fff; }
.select-arrow { color: #556; font-size: 12px; }

/* ── 商品信息头 ── */
.product-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 20px 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}
.product-hero-left { display: flex; align-items: center; gap: 14px; }
.hero-emoji { font-size: 40px; }
.hero-name { color: #fff; font-size: 18px; font-weight: 700; margin: 0 0 6px; }
.hero-meta { display: flex; gap: 10px; flex-wrap: wrap; }
.meta-tag {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 50px;
  background: rgba(255,255,255,0.06);
  color: #889;
  display: flex;
  align-items: center;
  gap: 5px;
}
.tag-dot { width: 7px; height: 7px; border-radius: 50%; }
.tag-dot.jd { background: #FF6B6B; }
.tag-dot.tb { background: #FFD93D; }
.tag-dot.unknown { background: #667; }

.product-hero-right { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.current-price-block { text-align: center; }
.price-label { display: block; font-size: 11px; color: #667; margin-bottom: 2px; }
.price-value { display: block; font-size: 26px; font-weight: 800; color: #FFD93D; }
.price-change-block {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
}
.price-change-block.up { background: rgba(255,107,107,0.15); color: #FF6B6B; }
.price-change-block.down { background: rgba(39,174,96,0.15); color: #27AE60; }
.price-change-block.flat { background: rgba(255,255,255,0.05); color: #667; }

/* ── 图表卡片 ── */
.chart-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
}
.chart-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
}
.chart-title { color: #aabbcc; font-size: 14px; }
.range-buttons { display: flex; gap: 6px; }
.range-btn {
  padding: 5px 14px;
  border-radius: 50px;
  border: 1.5px solid rgba(255,255,255,0.12);
  background: transparent;
  color: #778;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.range-btn.active {
  background: rgba(78,205,196,0.2);
  border-color: #4ECDC4;
  color: #4ECDC4;
}
.chart-body { height: 260px; position: relative; }
.chart-body canvas { max-height: 260px; }

/* ── 统计卡片 ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}
@media (max-width: 600px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

.stat-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 16px 12px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;
}
.stat-card:hover { transform: translateY(-3px); }
.stat-card-icon { font-size: 22px; display: block; margin-bottom: 6px; }
.stat-card-label { display: block; font-size: 11px; color: #556; margin-bottom: 4px; }
.stat-card-value { display: block; font-size: 18px; font-weight: 800; color: #fff; }
.stat-card-date { display: block; font-size: 10px; color: #445; margin-top: 3px; }
.stat-low .stat-card-value { color: #27AE60; }
.stat-high .stat-card-value { color: #FF6B6B; }

/* ── 时间线 ── */
.timeline-section {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 14px;
}
.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.timeline-title { color: #8899aa; font-size: 14px; }
.timeline-count { color: #445; font-size: 11px; }
.timeline-list { display: flex; flex-direction: column; gap: 6px; max-height: 280px; overflow-y: auto; }
.timeline-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 10px;
  transition: background 0.15s;
}
.timeline-item:hover { background: rgba(255,255,255,0.04); }
.timeline-item.is-latest { background: rgba(78,205,196,0.08); }
.timeline-item.is-lowest { background: rgba(39,174,96,0.08); }
.tl-left { display: flex; align-items: center; gap: 6px; min-width: 90px; }
.tl-dot { width: 8px.tl-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ECDC4; flex-shrink: 0; }
.tl-date { color: #667; font-size: 12px; white-space: nowrap; }
.tl-center { flex: 1; padding: 0 8px; }
.tl-bar-wrap { height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
.tl-bar { height: 100%; border-radius: 3px; transition: width 0.4s ease; }
.tl-bar.bar-low { background: #27AE60; }
.tl-bar.bar-high { background: #FF6B6B; }
.tl-bar.bar-same { background: #FFD93D; }
.tl-right { display: flex; flex-direction: column; align-items: flex-end; min-width: 70px; }
.tl-price { color: #fff; font-weight: 700; font-size: 13px; }
.tl-diff { font-size: 10px; font-weight: 600; }
.diff-up { color: #FF6B6B; }
.diff-down { color: #27AE60; }
.diff-same { color: #556; }

/* ── 数据来源 ── */
.source-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  background: rgba(255,255,255,0.02);
  border-radius: 12px;
  flex-wrap: wrap;
}
.source-label { color: #445; font-size: 12px; }
.source-tags { display: flex; gap: 8px; }
.source-tag {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 50px;
}
.source-tag.jd { background: rgba(255,107,107,0.12); color: #FF6B6B; }
.source-tag.tb { background: rgba(255,217,61,0.12); color: #FFD93D; }
.source-note { color: #445; font-size: 11px; }

/* ── 空状态 ── */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #889;
}
.empty-illustration { font-size: 64px; margin-bottom: 16px; }
.empty-state h3 { color: #ccd; font-size: 20px; margin: 0 0 10px; }
.empty-state p { font-size: 14px; line-height: 1.7; margin: 0 0 20px; }
.empty-hints { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.hint-chip {
  background: rgba(78,205,196,0.1);
  border: 1px solid rgba(78,205,196,0.2);
  color: #4ECDC4;
  font-size: 12px;
  padding: 5px 14px;
  border-radius: 50px;
}

/* ── 加载 ── */
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(10,10,20,0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  z-index: 50;
}
.loading-spinner { font-size: 48px; animation: spin 1.5s linear infinite; }
.loading-overlay p { color: #889; margin-top: 12px; font-size: 14px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── 响应式 ── */
@media (max-width: 640px) {
  .price-trend-wrap { margin: 16px 8px; padding: 20px 14px; }
  .section-header h2 { font-size: 20px; }
  .product-hero { flex-direction: column; align-items: flex-start; }
  .product-hero-right { width: 100%; justify-content: space-between; }
  .chart-body { height: 200px; }
  .chart-body canvas { max-height: 200px; }
}

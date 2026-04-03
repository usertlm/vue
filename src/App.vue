<template>
  <div id="app">
    <HlsPlayer src="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8" />
    <HelloWorld msg="👇👇👇"/>

    <!-- 电脑配件价格趋势系统 -->
    <div class="price-trend-section">
      <ComponentSelector 
        @update:selected="handleSelectionChange"
        @view-chart="handleViewChart"
      />
      <PriceTrendChartAdvanced 
        :selectedIds="selectedComponentIds"
        @remove="removeComponentFromChart"
      />
    </div>

    <SearchComponent />
    <svg
      class="icon-link"
      @click="goToWebsite"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  </div>
</template>

<script>
// 引入组件
import HelloWorld from './components/HelloWorld.vue'
import SearchComponent from './components/search.vue' // 确保路径正确
import HlsPlayer from './components/HlsPlayer.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    SearchComponent,
    HlsPlayer,
    ComponentSelector: () => import('./components/ComponentSelector.vue'),
    PriceTrendChartAdvanced: () => import('./components/PriceTrendChartAdvanced.vue'),
  },
  data() {
    return {
      selectedComponentIds: []
    };
  },
  methods: {
    goToWebsite() {
      window.open('http://www.staggeringbeauty.com/', '_blank')
    },
    handleSelectionChange(ids) {
      this.selectedComponentIds = ids;
    },
    handleViewChart(ids) {
      this.selectedComponentIds = ids;
      // 滚动到图表区域
      setTimeout(() => {
        const chartElement = document.querySelector('.price-trend-section');
        if (chartElement) {
          chartElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    },
    removeComponentFromChart(id) {
      const index = this.selectedComponentIds.indexOf(id);
      if (index > -1) {
        this.selectedComponentIds.splice(index, 1);
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Orbitron', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #00ffe7;
  margin-top: 60px;
  background-image: linear-gradient(135deg, #0f2027 0%, #2c5364 100%), url('@/assets/20231220_163216.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  box-shadow: 0 0 40px #00ffe7 inset;
}

.neon {
  text-shadow: 0 0 5px #00ffe7, 0 0 10px #00ffe7, 0 0 20px #00ffe7, 0 0 40px #00ffe7;
}

.glass {
  background: rgba(255,255,255,0.08);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 4px 32px 0 rgba(0,255,231,0.15);
  padding: 24px;
  margin: 24px auto;
  max-width: 800px;
}

.price-trend-section {
  margin: 60px auto;
  padding: 0 20px;
}

.icon-link {
  cursor: pointer;
  fill: #00ffe7;
  transition: fill 0.3s, filter 0.3s;
  filter: drop-shadow(0 0 6px #00ffe7);
}

.icon-link:hover {
  fill: #66b1ff;
  filter: drop-shadow(0 0 12px #66b1ff);
}
</style>

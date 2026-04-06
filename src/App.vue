<template>
  <div id="app">
    <nav class="nav">
      <div class="nav-brand">
        <span class="logo-mark">⚙</span>
        <span>我的导航</span>
      </div>
      <div class="nav-links">
        <a href="#video">视频</a>
        <a href="#price">价格趋势</a>
        <a href="#links">资源</a>
        <a href="#chat">AI 聊天</a>
      </div>
    </nav>

    <main class="main-content">
      <HlsPlayer src="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8" />

      <HelloWorld msg="👇👇👇" />
      <PriceTrendChart />
      <SearchComponent />

      <svg class="icon-link" @click="goToWebsite" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </main>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import SearchComponent from './components/search.vue'
import HlsPlayer from './components/HlsPlayer.vue'
import PriceTrendChart from './components/PriceTrendChart.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    SearchComponent,
    HlsPlayer,
    PriceTrendChart
  },
  methods: {
    goToWebsite() {
      window.open('http://www.staggeringbeauty.com/', '_blank')
    }
  }
}
</script>

<style>
/* ── CSS Variables (Claude Design System) ── */
:root {
  /* Brand */
  --color-terracotta: #c96442;
  --color-coral: #d97757;
  --color-near-black: #141413;

  /* Surfaces */
  --color-parchment: #f5f4ed;
  --color-ivory: #faf9f5;
  --color-white: #ffffff;
  --color-warm-sand: #e8e6dc;
  --color-dark-surface: #30302e;
  --color-deep-dark: #141413;

  /* Neutrals */
  --color-charcoal-warm: #4d4c48;
  --color-olive-gray: #5e5d59;
  --color-stone-gray: #87867f;
  --color-dark-warm: #3d3d3a;
  --color-warm-silver: #b0aea5;

  /* Borders */
  --color-border-cream: #f0eee6;
  --color-border-warm: #e8e6dc;
  --color-border-dark: #30302e;
  --color-ring-warm: #d1cfc5;

  /* Fonts */
  --font-serif: Georgia, 'Times New Roman', Times, serif;
  --font-sans: Arial, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-mono: SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace;
}

/* ── Reset & Base ── */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--color-parchment);
  color: var(--color-near-black);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.60;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: var(--color-terracotta);
  text-decoration: none;
  transition: color 0.2s;
}
a:hover { color: var(--color-coral); }

/* ── App Shell ── */
#app {
  min-height: 100vh;
}

/* ── Navigation ── */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: rgba(245, 244, 237, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-cream);
}

.nav-brand {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 500;
  color: var(--color-near-black);
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-brand .logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--color-terracotta);
  border-radius: 8px;
  color: var(--color-ivory);
  font-size: 16px;
}

.nav-links {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-links a {
  color: var(--color-olive-gray);
  font-size: 15px;
  font-weight: 400;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--color-near-black);
}

/* ── Main Content ── */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 40px;
}

/* ── Icon Link ── */
.icon-link {
  cursor: pointer;
  fill: var(--color-terracotta);
  transition: fill 0.3s, filter 0.3s;
  filter: drop-shadow(0 0 4px rgba(201, 100, 66, 0.3));
  display: block;
  margin: 40px auto 0;
}

.icon-link:hover {
  fill: var(--color-coral);
  filter: drop-shadow(0 0 8px rgba(201, 100, 66, 0.5));
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .nav { padding: 12px 20px; }
  .nav-links { gap: 20px; }
  .nav-links a:not(:last-child) { display: none; }
  .main-content { padding: 40px 20px; }
}
</style>

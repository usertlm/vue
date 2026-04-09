<template>
  <div id="app">
    <!-- Navigation -->
    <header class="site-header">
      <div class="header-inner">
        <a href="/" class="header-logo">
          <span class="logo-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L2 7V13L10 18L18 13V7L10 2Z" fill="#c96442"/>
              <path d="M10 6L6 8.5V13L10 15.5L14 13V8.5L10 6Z" fill="#faf9f5"/>
            </svg>
          </span>
          <span class="logo-text">导航站</span>
        </a>

        <nav class="header-nav">
          <a href="#news" class="nav-link">资讯</a>
          <a href="#price" class="nav-link">配件价格</a>
          <a href="#ai-chat" class="nav-link">AI 对话</a>
          <a href="#resources" class="nav-link">资源</a>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-inner">
        <div class="hero-badge">🧭 实用导航 + AI 助手</div>
        <h1 class="hero-headline">你的网络导航站</h1>
        <p class="hero-sub">
          整合常用资源、AI 工具与电脑配件价格追踪。<br>
          在这里找到你需要的一切。
        </p>

        <div class="hero-actions">
          <a href="#ai-chat" class="btn btn-primary">开始 AI 对话</a>
          <a href="#price" class="btn btn-secondary">查看配件价格</a>
        </div>

        <div class="hero-search">
          <SearchComponent />
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">

      <!-- AI Chat -->
      <section id="ai-chat" class="content-section">
        <ChatBox />
      </section>

      <!-- AdSense -->
      <section class="content-section">
        <AdSense />
      </section>

      <!-- Price Trend -->
      <section id="price" class="content-section">
        <PriceTrendChart />
      </section>

      <!-- News Section -->
      <section id="news" class="content-section news-section">
        <div class="section-header">
          <div class="section-eyebrow">📰 资讯</div>
          <h2 class="section-title">今日热闻</h2>
          <p class="section-desc">科技与游戏领域最新动态，一文速览</p>
        </div>

        <div class="news-grid">
          <div class="news-column">
            <h3 class="column-label">🖥️ 科技要闻</h3>
            <div class="news-list">
              <article class="news-card">
                <h4 class="news-title">GPT-5 发布：推理能力超越人类专家</h4>
                <p class="news-excerpt">OpenAI 发布 GPT-5，在 MMLU、GPQA Diamond 等权威基准上超越人类专家平均水平，训练数据量是 GPT-4 的 8 倍。API 将于本月底开放付费调用。</p>
                <span class="news-meta">AI · 3小时前</span>
              </article>
              <article class="news-card">
                <h4 class="news-title">苹果 M4 Ultra 登场：Mac Pro 性能飙升</h4>
                <p class="news-excerpt">3nm 制程，32 核 CPU + 128 核 GPU，ML 性能是 M3 Ultra 的 2.3 倍，功耗降低 25%。新款 Mac Pro 起步价 $6,999，4 月底发货。</p>
                <span class="news-meta">硬件 · 昨天</span>
              </article>
              <article class="news-card">
                <h4 class="news-title">华为昇腾 910C 开始批量出货</h4>
                <p class="news-excerpt">7nm 制程，FP16 算力接近英伟达 H100 的 90%。在中美科技战背景下，昇腾系列正成为国内大模型训练的重要选择。</p>
                <span class="news-meta">芯片 · 2天前</span>
              </article>
            </div>
          </div>

          <div class="news-column">
            <h3 class="column-label">🎮 游戏资讯</h3>
            <div class="news-list">
              <article class="news-card">
                <h4 class="news-title">《GTA VI》正式官宣 2026 年秋季发售</h4>
                <p class="news-excerpt">官方预告片 48 小时破 2 亿播放。设定在 Vice City，支持男女双主角，PS5/Xbox Series X|S 首发，PC 版稍后推出。</p>
                <span class="news-meta">主机 · 1天前</span>
              </article>
              <article class="news-card">
                <h4 class="news-title">《黑神话：悟空》DLC「再起西行」公布</h4>
                <p class="news-excerpt">今夏免费更新，新区域火焰山、白骨岭首次亮相，Boss 数量比本体增加 40%。今年稍晚还将推出付费资料片「天竺」。</p>
                <span class="news-meta">PC游戏 · 3天前</span>
              </article>
              <article class="news-card">
                <h4 class="news-title">Switch 2 正式发布：4K 输出，定价 $449</h4>
                <p class="news-excerpt">英伟达 T239 芯片，7.9 英寸 1080P 触控屏，6-9 小时续航。首发《马里奥赛车：世界》《塞尔达传说：梦境岛》重制版。</p>
                <span class="news-meta">掌机 · 1周前</span>
              </article>
              <article class="news-card">
                <h4 class="news-title">《赛博朋克2077》Steam 在线人数破纪录</h4>
                <p class="news-excerpt">得益于 3.0 重大更新，同时在线人数突破 15 万，创历史峰值。累计销量超过 3000 万份，《赛博朋克2078》已在开发中。</p>
                <span class="news-meta">PC游戏 · 2周前</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <!-- Resources Section -->
      <section id="resources" class="content-section resources-section">
        <div class="section-header">
          <div class="section-eyebrow">🛠️ 资源</div>
          <h2 class="section-title">精选推荐</h2>
          <p class="section-desc">经过筛选的高质量资源，涵盖工具、社区与素材</p>
        </div>

        <div class="resource-tabs">
          <button
            v-for="tab in resourceTabs"
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeResourceTab === tab.id }"
            @click="activeResourceTab = tab.id"
          >
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>

        <div class="resource-panels">
          <div v-for="tab in resourceTabs" :key="tab.id" v-show="activeResourceTab === tab.id">
            <div class="resource-grid">
              <a
                v-for="item in tab.items"
                :key="item.name"
                :href="item.url"
                target="_blank"
                rel="noopener"
                class="resource-card"
              >
                <div class="resource-card-top">
                  <span class="resource-name">{{ item.name }}</span>
                  <span class="resource-external">↗</span>
                </div>
                <p class="resource-desc">{{ item.desc }}</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="content-section about-section">
        <div class="about-card">
          <h2 class="about-title">关于本站</h2>
          <p class="about-text">
            这是一个整合了常用网络资源、AI 工具和电脑配件价格追踪的个人导航站点。
            通过上方的 AI 聊天框，你可以随时提问，获取技术建议和资源推荐。
            下方实时追踪主流电商平台的电脑配件价格变化，帮助你把握最佳入手时机。
          </p>
          <p class="about-text">
            网站持续更新中，所有内容完全免费。如有建议，欢迎通过 GitHub 与我交流。
          </p>
        </div>
      </section>

    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-inner">
        <p class="footer-text">
          © 2026 导航站 · 仅供学习交流
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import SearchComponent from './components/search.vue'
import ChatBox from './components/ChatBox.vue'
import AdSense from './components/AdSense.vue'
import PriceTrendChart from './components/PriceTrendChart.vue'

export default {
  name: 'App',
  components: {
    SearchComponent,
    ChatBox,
    AdSense,
    PriceTrendChart
  },
  data() {
    return {
      activeResourceTab: 'community',
      resourceTabs: [
        {
          id: 'community',
          icon: '💬',
          label: '社区资讯',
          items: [
            { name: '36氪', url: 'https://36kr.com/', desc: '深度科技商业媒体，聚焦创业投资与行业趋势' },
            { name: '少数派', url: 'https://sspai.com/', desc: '数字生活品质提升，效率工具与使用技巧' },
            { name: 'Product Hunt', url: 'https://www.producthunt.com/', desc: '全球最新产品发布，每天发现酷工具' },
            { name: 'Hacker News', url: 'https://news.ycombinator.com/', desc: '程序员必备，全球科技创业资讯' },
          ]
        },
        {
          id: 'video',
          icon: '🎬',
          label: '视频娱乐',
          items: [
            { name: 'YouTube', url: 'https://www.youtube.com/', desc: '全球最大视频平台，海量内容' },
            { name: '电影天堂', url: 'https://www.dy2018.com/', desc: '国内老牌电影下载站' },
            { name: 'AGE 动漫', url: 'https://www.agedm.org/', desc: '专注日本动画，新番老番全覆盖' },
            { name: '在线视频', url: '/video.html', desc: '集成多视频源，支持 HLS 流媒体播放' },
          ]
        },
        {
          id: 'design',
          icon: '🎨',
          label: '设计素材',
          items: [
            { name: 'iconfont', url: 'https://www.iconfont.cn/', desc: '阿里巴巴矢量图标库，免费可商用' },
            { name: 'flaticon', url: 'https://www.flaticon.com/', desc: '超过 63 万矢量图标，多格式下载' },
            { name: 'Google Fonts', url: 'https://fonts.google.com/', desc: '1500+ 免费开源字体' },
            { name: 'Unsplash', url: 'https://unsplash.com/', desc: '免费高清可商用图片库' },
            { name: 'Pixabay', url: 'https://pixabay.com/', desc: '400 万+ 素材，图片视频全覆盖' },
          ]
        },
        {
          id: 'tools',
          icon: '🛠️',
          label: '常用工具',
          items: [
            { name: 'UI中国', url: 'https://www.ui.cn/', desc: '国内最专业 UI/UX 设计交流平台' },
            { name: '站酷', url: 'https://www.zcool.com.cn/', desc: '中国人气最高设计师互动社区' },
            { name: 'Behance', url: 'https://www.behance.net/', desc: 'Adobe 旗下，全球顶级创意设计作品集' },
            { name: 'Google', url: 'https://www.google.com/', desc: '全球最大搜索引擎，程序员必备' },
          ]
        }
      ]
    }
  }
}
</script>

<style>
/* ── CSS Variables ── */
:root {
  --color-terracotta: #c96442;
  --color-coral: #d97757;
  --color-near-black: #141413;
  --color-parchment: #f5f4ed;
  --color-ivory: #faf9f5;
  --color-white: #ffffff;
  --color-warm-sand: #e8e6dc;
  --color-dark-surface: #30302e;
  --color-deep-dark: #141413;
  --color-charcoal-warm: #4d4c48;
  --color-olive-gray: #5e5d59;
  --color-stone-gray: #87867f;
  --color-dark-warm: #3d3d3a;
  --color-warm-silver: #b0aea5;
  --color-border-cream: #f0eee6;
  --color-border-warm: #e8e6dc;
  --color-ring-warm: #d1cfc5;
  --font-serif: Georgia, 'Times New Roman', Times, serif;
  --font-sans: Arial, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-mono: SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace;
  --shadow-card: rgba(0,0,0,0.05) 0 4px 24px;
  --shadow-card-hover: rgba(0,0,0,0.08) 0 8px 32px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
}

/* ── Reset ── */
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

a { color: var(--color-terracotta); text-decoration: none; transition: color 0.2s; }
a:hover { color: var(--color-coral); }

#app { min-height: 100vh; }

/* ── Header ── */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(245, 244, 237, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-border-cream);
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 14px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-near-black);
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 500;
  transition: opacity 0.2s;
}

.header-logo:hover { opacity: 0.8; color: var(--color-near-black); }

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-terracotta);
  border-radius: 8px;
}

.logo-text { letter-spacing: -0.2px; }

.header-nav {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 7px 16px;
  color: var(--color-olive-gray);
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
}

.nav-link:hover {
  background: var(--color-warm-sand);
  color: var(--color-near-black);
}

/* ── Hero ── */
.hero-section {
  padding: 80px 32px 60px;
  text-align: center;
  background: var(--color-parchment);
}

.hero-inner {
  max-width: 680px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  font-size: 13px;
  color: var(--color-olive-gray);
  background: var(--color-warm-sand);
  border: 1px solid var(--color-border-warm);
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 28px;
  letter-spacing: 0.2px;
}

.hero-headline {
  font-family: var(--font-serif);
  font-size: clamp(36px, 5vw, 52px);
  font-weight: 500;
  color: var(--color-near-black);
  line-height: 1.15;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
}

.hero-sub {
  font-size: 18px;
  color: var(--color-olive-gray);
  line-height: 1.70;
  margin-bottom: 36px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 40px;
}

.btn {
  display: inline-block;
  padding: 12px 28px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: var(--font-sans);
}

.btn-primary {
  background: var(--color-terracotta);
  color: var(--color-ivory);
  box-shadow: 0 0 0 3px rgba(201, 100, 66, 0.15);
}

.btn-primary:hover {
  background: var(--color-coral);
  color: var(--color-ivory);
  transform: translateY(-1px);
  box-shadow: 0 0 0 4px rgba(201, 100, 66, 0.2);
}

.btn-secondary {
  background: var(--color-white);
  color: var(--color-near-black);
  border: 1px solid var(--color-border-cream);
  box-shadow: var(--shadow-card);
}

.btn-secondary:hover {
  background: var(--color-ivory);
  color: var(--color-near-black);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card-hover);
}

.hero-search {
  max-width: 560px;
  margin: 0 auto;
}

/* ── Main Content ── */
.main-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px 80px;
}

.content-section {
  margin-bottom: 80px;
}

/* ── Section Headers ── */
.section-header {
  margin-bottom: 40px;
}

.section-eyebrow {
  font-size: 13px;
  color: var(--color-terracotta);
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.section-title {
  font-family: var(--font-serif);
  font-size: clamp(28px, 3.5vw, 36px);
  font-weight: 500;
  color: var(--color-near-black);
  line-height: 1.20;
  margin-bottom: 10px;
  letter-spacing: -0.3px;
}

.section-desc {
  font-size: 16px;
  color: var(--color-stone-gray);
  line-height: 1.60;
}

/* ── News Grid ── */
.news-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.column-label {
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 500;
  color: var(--color-near-black);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-border-warm);
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.news-card {
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border-cream);
}

.news-card:last-child { border-bottom: none; }

.news-title {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 500;
  color: var(--color-near-black);
  margin-bottom: 8px;
  line-height: 1.40;
}

.news-excerpt {
  font-size: 14px;
  color: var(--color-olive-gray);
  line-height: 1.70;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  font-size: 12px;
  color: var(--color-stone-gray);
}

/* ── Resource Tabs ── */
.resource-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  background: var(--color-warm-sand);
  padding: 4px;
  border-radius: var(--radius-md);
  width: fit-content;
}

.tab-btn {
  padding: 8px 18px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-olive-gray);
  cursor: pointer;
  transition: all 0.15s;
  font-family: var(--font-sans);
}

.tab-btn.active {
  background: var(--color-white);
  color: var(--color-near-black);
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.tab-btn:hover:not(.active) {
  color: var(--color-near-black);
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.resource-card {
  display: block;
  padding: 18px 20px;
  background: var(--color-ivory);
  border: 1px solid var(--color-border-cream);
  border-radius: var(--radius-md);
  transition: box-shadow 0.2s, transform 0.2s;
  text-decoration: none;
}

.resource-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
  color: var(--color-coral);
}

.resource-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.resource-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-terracotta);
  transition: color 0.2s;
}

.resource-card:hover .resource-name { color: var(--color-coral); }

.resource-external {
  font-size: 12px;
  color: var(--color-stone-gray);
}

.resource-desc {
  font-size: 13px;
  color: var(--color-olive-gray);
  line-height: 1.60;
  margin: 0;
}

/* ── About ── */
.about-card {
  background: var(--color-warm-sand);
  border: 1px solid var(--color-border-warm);
  border-radius: var(--radius-lg);
  padding: 48px;
  text-align: center;
}

.about-title {
  font-family: var(--font-serif);
  font-size: 26px;
  font-weight: 500;
  color: var(--color-near-black);
  margin-bottom: 20px;
}

.about-text {
  font-size: 16px;
  color: var(--color-olive-gray);
  line-height: 1.80;
  max-width: 640px;
  margin: 0 auto 14px;
}

.about-text:last-child { margin-bottom: 0; }

/* ── Footer ── */
.site-footer {
  border-top: 1px solid var(--color-border-cream);
  padding: 32px;
  background: var(--color-parchment);
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}

.footer-text {
  font-size: 13px;
  color: var(--color-stone-gray);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .header-inner { padding: 12px 20px; }
  .header-nav { gap: 4px; }
  .nav-link { padding: 6px 10px; font-size: 13px; }

  .hero-section { padding: 60px 20px 40px; }
  .hero-headline { font-size: 32px; }
  .hero-sub { font-size: 16px; }
  .hero-actions { flex-direction: column; align-items: center; }

  .main-content { padding: 0 20px 60px; }
  .content-section { margin-bottom: 60px; }

  .news-grid { grid-template-columns: 1fr; gap: 32px; }
  .resource-grid { grid-template-columns: 1fr 1fr; }
  .resource-tabs { flex-wrap: wrap; }

  .about-card { padding: 32px 24px; }
}
</style>

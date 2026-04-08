<template>
  <div class="hello">

    <!-- 关于本站 -->
    <section class="section-block intro-block">
      <h2 class="section-heading">欢迎来到导航站</h2>
      <p class="intro-text">
        这是一个整合了常用网络资源、AI 工具和电脑配件价格追踪的个人导航站点。
        通过上方的 AI 聊天框，你可以随时向我提问，获取技术建议、资源推荐或任何问题解答。
        下方我们实时追踪主流电商平台的电脑配件价格变化，帮助你把握最佳入手时机。
      </p>
      <p class="intro-text">
        网站持续更新中，所有内容完全免费。如有建议，欢迎通过 Discord 或 GitHub 与我交流。
      </p>
    </section>

    <!-- AI Chat Box -->
    <ChatBox />

    <!-- Google AdSense -->
    <AdSense />

    <!-- 电脑配件价格趋势 -->
    <PriceTrendChart />

    <!-- 今日热闻 -->
    <section class="section-block">
      <h3 class="section-heading">📰 今日科技要闻</h3>
      <div class="news-list">
        <article class="news-item">
          <h4 class="news-title">GPT-5 发布：OpenAI 新模型在复杂推理上超越人类专家平均水平</h4>
          <p class="news-body">
            OpenAI 于本周正式发布 GPT-5，在 MMLU、GPQA Diamond 等权威基准上超越人类专家平均水平，尤其在数学证明和代码生成任务上表现突出。GPT-5 采用全新架构，训练数据量是 GPT-4 的约 8 倍，推理效率却仅增加 30%。目前已向 ChatGPT Plus 用户开放，API 将于本月底开放付费调用。
          </p>
        </article>
        <article class="news-item">
          <h4 class="news-title">苹果 M4 Ultra 登场：Mac Pro 性能飙升，功耗下降 25%</h4>
          <p class="news-body">
            苹果在春季发布会上正式推出 M4 Ultra 芯片，采用 3nm 工艺制造，拥有 32 核 CPU 和 128 核 GPU，机器学习性能是 M3 Ultra 的 2.3 倍。更关键的是能效比大幅提升，在相同负载下功耗降低约 25%。搭载该芯片的新款 Mac Pro 起步价 $6,999，将于 4 月底正式发货。
          </p>
        </article>
        <article class="news-item">
          <h4 class="news-title">国产芯片突破：华为昇腾 910C 开始向大厂出货</h4>
          <p class="news-body">
            知情人士透露，华为昇腾 910C 已开始向国内头部云厂商和 AI 企业批量出货，7nm 制程，FP16 算力接近英伟达 H100 的 90%。在中美科技战持续背景下，昇腾系列正成为国内大模型训练的重要选择，订单已排期至 2026 年底。
          </p>
        </article>
      </div>
    </section>

    <!-- 游戏资讯 -->
    <section class="section-block">
      <h3 class="section-heading">🎮 近期游戏资讯</h3>
      <div class="news-list">
        <article class="news-item">
          <h4 class="news-title">《GTA VI》正式官宣 2026 年秋季发售，预告片 48 小时破 2 亿播放</h4>
          <p class="news-body">
            Rockstar Games 正式宣布《GTA VI》将于 2026 年秋季发售，平台首发为 PlayStation 5 和 Xbox Series X|S，PC 版稍后推出。官方预告片在 YouTube 上线 48 小时内突破 2 亿播放，创下游戏预告片新纪录。游戏设定在 Vice City 及其周边地区，支持男女双主角。
          </p>
        </article>
        <article class="news-item">
          <h4 class="news-title">《黑神话：悟空》DLC「再起西行」公布，今夏免费更新</h4>
          <p class="news-body">
            游戏科学在 GDC 2026 上正式公布《黑神话：悟空》首个 DLC「再起西行」，将于今年夏季免费向所有玩家推送。官方同步放出 8 分钟实机演示，新区域火焰山、白骨岭首次亮相，Boss 数量比本体增加 40%。此外还将在今年晚些时候推出付费大型资料片「天竺」。
          </p>
        </article>
        <article class="news-item">
          <h4 class="news-title">Switch 2 正式发布：4K 输出、DLSS 级升频，定价 $449</h4>
          <p class="news-body">
            任天堂正式发布 Switch 2，搭载英伟达 T239 定制芯片，支持 4K 60fps 输出和 AI 升频技术。配备 7.9 英寸 1080P 触控屏，电池续航提升至 6-9 小时。向下兼容全部 Switch 游戏，首发护航大作包括《马里奥赛车：世界》《塞尔达传说：梦境岛》重制版。官方建议零售价 $449，今夏全球同步发售。
          </p>
        </article>
        <article class="news-item">
          <h4 class="news-title">《赛博朋克2077》Steam 在线人数突破 15 万，创历史新高</h4>
          <p class="news-body">
            得益于 3.0 重大更新和 4 月促销，《赛博朋克2077》Steam 同时在线人数突破 15 万，创下发售以来的历史峰值。CDPR 同期宣布游戏累计销量已超过 3000 万份，救赎之路终于画上圆满句号。官方透露《赛博朋克2078》已在早期开发中。
          </p>
        </article>
      </div>
    </section>

    <!-- 实用教程推荐 -->
    <section class="section-block">
      <h3 class="section-heading">📚 精选技术文章</h3>
      <div class="article-list">
        <div class="article-item">
          <h4 class="article-title">从零开始用 GitHub Actions 搭建自动化工作流</h4>
          <p class="article-desc">
            GitHub Actions 是 GitHub 官方提供的 CI/CD 工具，可以自动完成代码测试、构建、部署等重复性工作。本文从基础概念讲起，手把手教你搭建第一个自动化工作流，无需服务器即可实现持续集成。
          </p>
          <span class="article-tag">DevOps</span>
        </div>
        <div class="article-item">
          <h4 class="article-title">Vue 3 Composition API 最佳实践指南</h4>
          <p class="article-desc">
            Vue 3 的 Composition API 相比 Options API 提供了更灵活的逻辑复用方式。本文整理了实际项目中的经验教训，涵盖响应式陷阱、computed 与 watch 选用原则、以及自定义 hook 的设计模式。
          </p>
          <span class="article-tag">前端</span>
        </div>
        <div class="article-item">
          <h4 class="article-title">国产大模型选型指南：通义 / 混元 / 智谱 / DeepSeek 对比</h4>
          <p class="article-desc">
            2026 年国内大模型竞争进入白热化阶段，本文从推理能力、API 定价、上下文长度、生态成熟度四个维度对通义千问、腾讯混元、智谱 GLM-4 和 DeepSeek V3 进行实测对比，并给出不同场景下的选型建议。
          </p>
          <span class="article-tag">AI</span>
        </div>
        <div class="article-item">
          <h4 class="article-title">TypeScript 6.0 重大更新：独立类型声明与更好用的范型推导</h4>
          <p class="article-desc">
            TypeScript 6.0 正式发布，最大亮点是终于支持独立 .d.ts 类型声明文件（无需对应源文件），同时泛型推导能力大幅增强，能处理更复杂的条件类型。本文详解新特性对大型项目的影响，以及迁移到 TS6 的实战步骤。
          </p>
          <span class="article-tag">前端</span>
        </div>
      </div>
    </section>

    <!-- 电影资源分享 -->
    <section class="section-block">
      <h3 class="section-heading">🎬 电影与视频资源</h3>
      <p class="section-intro">
        这里整理了一些我常看的电影和视频资源站点，每一类别都经过筛选，质量相对可靠。
        点击下方链接可直接访问，建议使用VPN访问境外站点以获得更好体验。
      </p>
      <div class="resource-grid">
        <div class="resource-item">
          <a href="/video.html" target="_blank" class="resource-link">📺 在线视频页面</a>
          <p class="resource-desc">集成多个视频源，支持 HLS 流媒体播放，可直接在线观看演示内容。</p>
        </div>
        <div class="resource-item">
          <a href="https://www.dy2018.com/" target="_blank" rel="noopener" class="resource-link">🎞️ 电影天堂</a>
          <p class="resource-desc">国内老牌电影下载站，资源丰富，更新速度快，覆盖国内外主流影片。</p>
        </div>
        <div class="resource-item">
          <a href="https://www.agedm.org/" target="_blank" rel="noopener" class="resource-link">📺 AGE 动漫</a>
          <p class="resource-desc">专注于日本动画的资源站，涵盖新番和经典老番，画质选择多样。</p>
        </div>
        <div class="resource-item">
          <a href="https://www.youtube.com/" target="_blank" rel="noopener" class="resource-link">▶️ YouTube</a>
          <p class="resource-desc">全球最大的视频平台，涵盖教育、娱乐、技术教程等海量内容，强烈推荐。</p>
        </div>
      </div>
    </section>

    <!-- 社区资讯 -->
    <section class="section-block">
      <h3 class="section-heading">💬 社区与资讯</h3>
      <p class="section-intro">
        每天留出一点时间浏览这些平台，可以帮助你保持对行业动态的敏感度。
        以下是我个人每天都会刷一遍的几个去处，各有侧重。
      </p>
      <div class="resource-grid">
        <div class="resource-item">
          <a href="https://36kr.com/" target="_blank" rel="noopener" class="resource-link">🚀 36氪</a>
          <p class="resource-desc">深度科技商业媒体，聚焦创业投资、新兴技术和行业趋势报道，适合了解大方向。</p>
        </div>
        <div class="resource-item">
          <a href="https://sspai.com/" target="_blank" rel="noopener" class="resource-link">🔧 少数派</a>
          <p class="resource-desc">专注数字生活品质提升，涵盖效率工具、数码产品使用技巧、软件推荐等实用内容。</p>
        </div>
        <div class="resource-item">
          <a href="https://www.producthunt.com/" target="_blank" rel="noopener" class="resource-link">🆕 Product Hunt</a>
          <p class="resource-desc">全球最新产品发布平台，每天更新最酷的新工具和创业项目，是发现海外新产品的首选。</p>
        </div>
        <div class="resource-item">
          <a href="https://www.behance.net/" target="_blank" rel="noopener" class="resource-link">🎨 Behance</a>
          <p class="resource-desc">Adobe 旗下的设计师作品展示平台，汇聚全球顶级创意设计，是 UI/UX 设计师的灵感来源。</p>
        </div>
      </div>
    </section>

    <!-- 素材资源 -->
    <section class="section-block">
      <h3 class="section-heading">🎨 设计素材资源</h3>
      <p class="section-intro">
        做 PPT、写文章、做设计，都离不开优质素材。这部分资源我日常工作中经常用到，
        免费且质量上乘，按需取用即可。
      </p>
      <div class="resource-grid">
        <div class="resource-item">
          <a href="https://www.iconfont.cn/" target="_blank" rel="noopener" class="resource-link">🖼️ iconfont</a>
          <p class="resource-desc">阿里巴巴出品的矢量图标库，支持自定义颜色和尺寸，图标均可免费商用，是中文项目首选。</p>
        </div>
        <div class="resource-item">
          <a href="https://www.flaticon.com/" target="_blank" rel="noopener" class="resource-link">🖼️ flaticon</a>
          <p class="resource-desc">超过 634,000 个免费矢量图标，支持 PNG、SVG、EPS 多格式下载，分类清晰检索方便。</p>
        </div>
        <div class="resource-item">
          <a href="https://fonts.google.com/" target="_blank" rel="noopener" class="resource-link">🔤 Google Fonts</a>
          <p class="resource-desc">免费开源字体库，涵盖超过 1500 款字体，支持 Web 嵌入，跨国项目使用无版权风险。</p>
        </div>
        <div class="resource-item">
          <a href="https://unsplash.com/" target="_blank" rel="noopener" class="resource-link">📷 Unsplash</a>
          <p class="resource-desc">免费高清可商用图片库，照片质量极高，涵盖自然、城市、人物等各类场景，每张都可用作商业用途。</p>
        </div>
        <div class="resource-item">
          <a href="https://pixabay.com/" target="_blank" rel="noopener" class="resource-link">📸 Pixabay</a>
          <p class="resource-desc">除了图片还提供免费视频素材，资源总量超过 400 万，全部采用 CC0 授权可商用。</p>
        </div>
      </div>
    </section>

    <!-- 常用推荐 -->
    <section class="section-block">
      <h3 class="section-heading">🛠️ 常用工具推荐</h3>
      <p class="section-intro">
        以下是我在日常开发、设计和项目管理中最常用的几个平台，每一个都经过长期使用验证。
      </p>
      <div class="resource-grid">
        <div class="resource-item">
          <a href="https://www.ui.cn/" target="_blank" rel="noopener" class="resource-link">🎯 UI中国</a>
          <p class="resource-desc">国内最专业的 UI/UX 设计交流平台，可以欣赏优秀作品集，也可参与设计比赛提升技能。</p>
        </div>
        <div class="resource-item">
          <a href="https://www.zcool.com.cn/" target="_blank" rel="noopener" class="resource-link">🏆 站酷</a>
          <p class="resource-desc">中国人气最高的设计师互动社区，涵盖平面设计、插画、3D、摄影等多个艺术领域。</p>
        </div>
        <div class="resource-item">
          <a href="https://www.google.com/" target="_blank" rel="noopener" class="resource-link">🔍 Google</a>
          <p class="resource-desc">全球最大的搜索引擎，也是程序员日常查找技术文档和解决方案的必备工具。</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import AdSense from './AdSense.vue';
import ChatBox from './ChatBox.vue';
import PriceTrendChart from './PriceTrendChart.vue';

export default {
  name: 'HelloWorld',
  components: {
    AdSense,
    ChatBox,
    PriceTrendChart
  },
  props: {
    msg: String,
  }
};
</script>

<style scoped>
.hello {
  text-align: center;
  padding: 20px 0;
}

.section-block {
  background: #faf9f5;
  border: 1px solid #f0eee6;
  border-radius: 16px;
  padding: 36px 32px;
  margin-bottom: 24px;
  text-align: left;
  box-shadow: rgba(0,0,0,0.04) 0px 4px 24px;
}

.section-heading {
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 500;
  color: #141413;
  margin: 0 0 20px 0;
  line-height: 1.20;
}

.section-intro {
  color: #5e5d59;
  font-size: 15px;
  line-height: 1.75;
  margin: 0 0 20px 0;
}

.intro-block {
  background: #f5f4ed;
  border-color: #e8e6dc;
}

.intro-block .section-heading {
  font-size: 28px;
}

.intro-text {
  color: #5e5d59;
  font-size: 16px;
  line-height: 1.80;
  margin: 0 0 14px 0;
}

.intro-text:last-child { margin-bottom: 0; }

/* ── 新闻列表 ── */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.news-item {
  padding-bottom: 24px;
  border-bottom: 1px solid #f0eee6;
}

.news-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.news-title {
  font-family: Georgia, serif;
  font-size: 17px;
  font-weight: 500;
  color: #141413;
  margin: 0 0 10px 0;
  line-height: 1.40;
}

.news-body {
  color: #5e5d59;
  font-size: 14px;
  line-height: 1.80;
  margin: 0;
}

/* ── 文章列表 ── */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.article-item {
  padding: 20px;
  background: #ffffff;
  border: 1px solid #f0eee6;
  border-radius: 12px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.article-item:hover {
  box-shadow: 0px 4px 16px rgba(0,0,0,0.06);
  transform: translateY(-2px);
}

.article-title {
  font-family: Georgia, serif;
  font-size: 16px;
  font-weight: 500;
  color: #141413;
  margin: 0 0 10px 0;
  line-height: 1.40;
}

.article-desc {
  color: #5e5d59;
  font-size: 14px;
  line-height: 1.75;
  margin: 0 0 12px 0;
}

.article-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  color: #c96442;
  background: rgba(201,100,66,0.08);
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

/* ── 资源网格 ── */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.resource-item {
  padding: 18px;
  background: #ffffff;
  border: 1px solid #f0eee6;
  border-radius: 12px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.resource-item:hover {
  box-shadow: 0px 4px 16px rgba(0,0,0,0.06);
  transform: translateY(-2px);
}

.resource-link {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  color: #c96442;
  margin-bottom: 8px;
  transition: color 0.2s;
}

.resource-link:hover {
  color: #d97757;
  text-decoration: none;
}

.resource-desc {
  color: #5e5d59;
  font-size: 13px;
  line-height: 1.70;
  margin: 0;
}

@media (max-width: 600px) {
  .section-block { padding: 24px 18px; }
  .section-heading { font-size: 20px; }
  .resource-grid { grid-template-columns: 1fr; }
}
</style>

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

    <!-- 网站使用指南 -->
    <section class="section-block">
      <h3 class="section-heading">📖 网站使用指南</h3>
      <p class="section-intro">
        欢迎来到本站！下面是各项功能的详细说明，帮助你充分利用网站的所有功能。
      </p>
      <div class="guide-list">
        <div class="guide-item">
          <h4 class="guide-title">🤖 AI聊天助手</h4>
          <p class="guide-desc">
            网站顶部的AI聊天框支持多轮对话。你可以提出任何技术问题、获取编程建议、咨询资源推荐，甚至讨论最新的行业动态。AI助手基于最新的大语言模型训练，能够理解上下文并提供高质量的回答。为了获得最佳体验，建议使用清晰、具体的问题描述，这样AI能更准确地理解你的需求。
          </p>
        </div>
        <div class="guide-item">
          <h4 class="guide-title">💰 电脑配件价格追踪</h4>
          <p class="guide-desc">
            本站集成了实时的电脑配件价格数据库，覆盖CPU、GPU、RAM、SSD等主流硬件。系统每小时自动更新价格数据，并展示过去30天的价格趋势图。通过配件选择器，你可以快速对比不同产品的价格变化，帮助你捕捉降价机会。价格数据来自主流电商平台，确保信息的时效性和准确性。
          </p>
        </div>
        <div class="guide-item">
          <h4 class="guide-title">📰 热点资讯推送</h4>
          <p class="guide-desc">
            "今日科技要闻"和"近期游戏资讯"板块每日更新，精选来自行业权威媒体的最新报道。我们关注AI大模型进展、芯片技术突破、云计算创新等热点话题，并将复杂的技术信息用通俗易懂的语言呈现。同时我们也不遗漏游戏行业的精彩资讯，包括新游发售、大作更新动态等。
          </p>
        </div>
        <div class="guide-item">
          <h4 class="guide-title">📚 精选技术文章</h4>
          <p class="guide-desc">
            精选技术文章板块整理了来自一线开发者和技术博主的深度分享。这些文章涵盖前端框架、后端架构、DevOps工程、数据科学等多个领域，每一篇都经过精心挑选，确保质量和实用价值。无论你是初学者还是资深工程师，都能在这里找到对你有帮助的内容。
          </p>
        </div>
        <div class="guide-item">
          <h4 class="guide-title">🔗 资源导航</h4>
          <p class="guide-desc">
            本站提供了分类清晰的资源链接导航，包括视频平台、设计素材、开源工具等。每个资源都配有简要说明，让你快速判断是否符合需求。这些资源大多经过我个人的长期使用验证，质量可靠。点击链接即可跳转，建议收藏以便日常快速访问。
          </p>
        </div>
        <div class="guide-item">
          <h4 class="guide-title">🔍 搜索功能</h4>
          <p class="guide-desc">
            网站集成了全局搜索功能，可以快速找到特定的内容、资源或工具。搜索支持关键词匹配和模糊查询，输入你感兴趣的话题即可看到相关内容的聚合结果。搜索结果按相关性排序，最相关的内容会首先出现。
          </p>
        </div>
      </div>
    </section>

    <!-- 深度技术分析 -->
    <section class="section-block">
      <h3 class="section-heading">🔬 深度技术分析</h3>
      <p class="section-intro">
        本板块深入探讨当下最热门的技术话题，分析其原理、应用场景和未来趋势。
      </p>
      <div class="analysis-list">
        <article class="analysis-item">
          <h4 class="analysis-title">大语言模型（LLM）工程化应用浅析</h4>
          <p class="analysis-body">
            2025-2026年，大语言模型已经从研究阶段进入产业化阶段。企业不再只是使用现成的API，而是开始探索如何将LLM集成到自己的业务流程中。这包括微调（Fine-tuning）、检索增强生成（RAG）、提示工程（Prompt Engineering）等多个维度。RAG技术尤为重要，它通过为模型提供外部知识库，显著提升了回答的准确性和时效性，已经成为企业级应用的标准配置。本文将分析这些技术方案的选型原则、成本考量，以及未来的发展方向。
          </p>
        </article>
        <article class="analysis-item">
          <h4 class="analysis-title">云原生后时代：Kubernetes生态的演进</h4>
          <p class="analysis-body">
            Kubernetes已经成为容器编排的事实标准，但社区的热情似乎开始转向更高层的抽象。Serverless、Service Mesh、GitOps 等新概念层出不穷。这背后的原因是什么？Kubernetes降低了基础设施管理的复杂性，但引入了新的学习成本。新兴技术试图进一步提升开发效率，让开发者能专注于应用逻辑而非基础设施细节。本文分析这一演进的必然性，以及各技术路线的优缺点。
          </p>
        </article>
        <article class="analysis-item">
          <h4 class="analysis-title">AI芯片竞争格局：从英伟达垄断到百花齐放</h4>
          <p class="analysis-body">
            英伟达GPU一度垄断AI计算市场，但2026年局面已然改变。AMD、Intel、以及众多初创公司推出了各具特色的AI芯片。中国企业如华为昇腾、高通、阿里含光也在快速迭代。这场竞争的本质是什么？首先是应用差异化——不同的模型和任务对芯片的需求不同，专用芯片往往性价比更高。其次是生态壁垒逐渐松动，业界对开放标准（如OpenXLA）的重视程度提高了。未来的市场格局将更加多元，硬件选型将根据具体场景而定。
          </p>
        </article>
      </div>
    </section>

    <!-- 编程学习路线 -->
    <section class="section-block">
      <h3 class="section-heading">🎓 编程学习路线建议</h3>
      <p class="section-intro">
        无论你是编程初学者还是准备转向新领域，这里提供了系统的学习建议和资源指引。
      </p>
      <div class="roadmap-list">
        <div class="roadmap-item">
          <h4 class="roadmap-title">🌱 零基础入门（0-3个月）</h4>
          <p class="roadmap-desc">
            首先掌握编程的核心概念：变量、控制流、函数、数据结构等。推荐从Python开始，因为它语法简洁、社区活跃。学习资源可以选择 Codecademy、freeCodeCamp 等互动平台，这样可以边学边练。每天坚持1-2小时，完成课程附带的小项目。目标是写出简单的脚本程序，理解编程的基本思维方式。
          </p>
        </div>
        <div class="roadmap-item">
          <h4 class="roadmap-title">🚴 初级进阶（3-6个月）</h4>
          <p class="roadmap-desc">
            开始学习面向对象编程（OOP）、数据库、Web框架。可以选择学习 Django 或 Flask，制作一个完整的Web应用（例如博客系统）。同时深入理解HTML、CSS、JavaScript的运作原理。参与开源项目，找一个活跃的开源仓库提交PR（从修复typo、改进文档开始）。这个阶段关键是做出实际项目，让抽象的知识具体化。
          </p>
        </div>
        <div class="roadmap-item">
          <h4 class="roadmap-title">🎯 中级深化（6-12个月）</h4>
          <p class="roadmap-desc">
            学习系统设计基础、算法与数据结构、数据库优化。刷题网站如 LeetCode、HackerRank 可以帮助你打牢算法基础。阅读业界经典书籍，如《设计模式》《代码大全》《系统设计面试》。开始关注架构设计，学习如何设计可扩展的系统。这个阶段应该能够独立完成中等规模的项目，能理解和改进他人的代码。
          </p>
        </div>
        <div class="roadmap-item">
          <h4 class="roadmap-title">🏆 高级精进（12个月以上）</h4>
          <p class="roadmap-desc">
            此时应该选择一个专业方向深钻，如Web后端、移动应用、Data Science、DevOps等。阅读源码是提升的最快方式——选择一个日常使用的开源库，深入理解其实现原理。开始写技术博客、参与技术讨论，分享你的学习心得，这既能巩固知识也能建立个人品牌。考虑为感兴趣的开源项目做出有意义的贡献，或者启动自己的开源项目。
          </p>
        </div>
      </div>
    </section>

    <!-- 开源项目推荐 -->
    <section class="section-block">
      <h3 class="section-heading">⭐ 必读开源项目</h3>
      <p class="section-intro">
        这些项目代表了当下软件工程的最佳实践，值得深入学习其架构和代码质量。
      </p>
      <div class="project-grid">
        <div class="project-item">
          <div class="project-header">
            <h4 class="project-name">Vue.js</h4>
            <span class="project-stars">⭐ 220k+</span>
          </div>
          <p class="project-desc">现代前端框架的典范。如果你想学习组件化架构、响应式系统设计、模块化打包，Vue的源码是最佳教材。代码注释详细，易于理解，特别适合初中级开发者学习高效的框架架构。</p>
        </div>
        <div class="project-item">
          <div class="project-header">
            <h4 class="project-name">Redis</h4>
            <span class="project-stars">⭐ 67k+</span>
          </div>
          <p class="project-desc">用C语言实现的高性能内存数据库。代码简洁高效，其事件驱动、单线程非阻塞设计思想对后端开发者有极高的教学价值。深入理解Redis能让你写出性能更优的应用。</p>
        </div>
        <div class="project-item">
          <div class="project-header">
            <h4 class="project-name">TensorFlow</h4>
            <span class="project-stars">⭐ 185k+</span>
          </div>
          <p class="project-desc">Google开源的机器学习框架。虽然代码规模庞大，但文档完善，生态成熟。适合有ML基础的开发者学习如何构建企业级的AI系统，理解张量计算、自动求导等核心概念。</p>
        </div>
        <div class="project-item">
          <div class="project-header">
            <h4 class="project-name">Kubernetes</h4>
            <span class="project-stars">⭐ 112k+</span>
          </div>
          <p class="project-desc">云原生时代的基础设施。学习K8s源码能理解分布式系统的设计理念、控制器模式、API设计等。对想成为高级DevOps或基础设施工程师的人来说是必读项目。</p>
        </div>
        <div class="project-item">
          <div class="project-header">
            <h4 class="project-name">Prometheus</h4>
            <span class="project-stars">⭐ 58k+</span>
          </div>
          <p class="project-desc">Go语言实现的监控系统。代码质量一流，优雅地演示了如何设计可观测系统、时间序列数据库、推送机制等。对后端工程师深化系统设计能力帮助巨大。</p>
        </div>
        <div class="project-item">
          <div class="project-header">
            <h4 class="project-name">freeCodeCamp</h4>
            <span class="project-stars">⭐ 430k+</span>
          </div>
          <p class="project-desc">全球最大的免费编程教育资源库。虽然主要是教学内容而非核心库，但维护者对教学质量的把控、对多语言支持的完善程度都值得学习。贡献者众多，生态活跃。</p>
        </div>
      </div>
    </section>

    <!-- 技术Newsletter推荐 -->
    <section class="section-block">
      <h3 class="section-heading">📬 值得订阅的技术Newsletter</h3>
      <p class="section-intro">
        订阅精选的技术周刊，每周用15-30分钟获取行业最新动态、技术见解和资源推荐，是保持学习动力的好方式。
      </p>
      <div class="newsletter-list">
        <div class="newsletter-item">
          <h4 class="newsletter-title">The Pragmatic Engineer</h4>
          <p class="newsletter-desc">由系统设计专家Gergely Orosz主持，深入讨论大厂技术趋势、职业发展、远程工作等话题。每期约15-20分钟阅读量，内容深度和实用性兼具。特别推荐给想了解大厂技术栈和工程文化的人。</p>
        </div>
        <div class="newsletter-item">
          <h4 class="newsletter-title">Hacker News Weekly</h4>
          <p class="newsletter-desc">精选Hacker News上最受欢迎的技术故事和讨论。如果你没有时间每天浏览HN，这个周刊可以让你快速抓住本周的技术热点。涵盖编程、系统设计、AI、安全等全领域。</p>
        </div>
        <div class="newsletter-item">
          <h4 class="newsletter-title">JavaScript Weekly</h4>
          <p class="newsletter-desc">前端开发者必读。从新框架发布到npm生态动向，从TypeScript最佳实践到浏览器API更新，从工具链优化到性能调优，应有尽有。保持订阅能让你及时掌握前端技术演进方向。</p>
        </div>
        <div class="newsletter-item">
          <h4 class="newsletter-title">Refactoring.Guru Newsletter</h4>
          <p class="newsletter-desc">定期分享设计模式、代码重构、SOLID原则等深度内容。内容质量稳定，每篇都配有优质示例代码。特别适合想提升代码质量、设计能力的工程师订阅。</p>
        </div>
      </div>
    </section>

    <!-- 常见问题 -->
    <section class="section-block">
      <h3 class="section-heading">❓ 常见问题解答</h3>
      <p class="section-intro">
        这里整理了用户常见的问题，希望能为你答疑解惑。如有未涉及的问题，欢迎通过AI聊天提问。
      </p>
      <div class="faq-list">
        <div class="faq-item">
          <h4 class="faq-question">Q: 网站会收集我的个人信息吗？</h4>
          <p class="faq-answer">A: 我们尊重用户隐私。AI聊天功能需要用户注册以便保存对话历史，但仅限必要信息（邮箱、用户名）。不会收集浏览行为或设备信息用于跟踪。所有数据都存储在安全的数据库中，不会第三方共享。详见隐私声明。</p>
        </div>
        <div class="faq-item">
          <h4 class="faq-question">Q: AI助手的回答为什么有时不准确？</h4>
          <p class="faq-answer">A: AI模型的训练存在知识截止日期，对最新信息的理解可能滞后。此外，AI偶尔会出现"幻觉"（生成看似合理但实际错误的内容）。建议使用前交叉验证重要信息，特别是技术细节涉及。未来我们会集成RAG技术提升准确性。</p>
        </div>
        <div class="faq-item">
          <h4 class="faq-question">Q: 价格数据的更新频率是多少？</h4>
          <p class="faq-answer">A: 后端定时任务每小时抓取一次价格数据，确保数据相对实时。但由于网络延迟和数据源更新不同步，实际价格可能略有差异。建议在做购买决策时再次访问电商平台确认最新价格。</p>
        </div>
        <div class="faq-item">
          <h4 class="faq-question">Q: 我能否在其他地方转载网站内容？</h4>
          <p class="faq-answer">A: 可以。本站内容采用CC BY 4.0许可，允许个人和商业使用，只需在转载时注明出处和链接。我们希望优质内容能被更多人看到，但也希望能获得合适的传播渠道审视。</p>
        </div>
        <div class="faq-item">
          <h4 class="faq-question">Q: 如何举报不当内容或提出改进建议？</h4>
          <p class="faq-answer">A: 欢迎通过多种方式反馈。你可以直接从导航栏的GitHub链接访问项目仓库提Issue，也可以通过邮件联系我们，还可以使用网站内的反馈表单。我们重视每一个用户的意见，并会定期审核反馈并做出改进。</p>
        </div>
        <div class="faq-item">
          <h4 class="faq-question">Q: 网站是否有移动版本？</h4>
          <p class="faq-answer">A: 网站已进行响应式设计，在手机、平板、电脑上都能正常浏览。但某些功能（如高度交互的图表）在手机上的体验可能不如桌面版。我们在积极开发专门的移动应用，敬请期待。</p>
        </div>
      </div>
    </section>

    <!-- 关于我们 -->
    <section class="section-block">
      <h3 class="section-heading">🙋 关于网站和创作者</h3>
      <div class="about-content">
        <p>
          本导航站创办于2024年，初衷很简单——为自己积累常用的资源和工具链接，逐渐演变成一个集资讯、工具、学习资源于一体的知识平台。随着功能的不断完善，我们希望能为更多开发者、设计师和科技爱好者提供价值。
        </p>
        <p>
          网站的核心特性包括：实时的电脑配件价格追踪，帮助硬件爱好者把握购机时机；AI驱动的聊天助手，为你答疑解惑；精选的资讯和资源导航，让你快速获取行业动态和优质工具；深度的技术文章和分析，探讨行业趋势和最佳实践。
        </p>
        <p>
          我们坚信优质内容应该免费提供。网站的所有核心功能都是免费的，不设付费墙。我们通过轻量级的广告支持运营成本。如果你想支持我们的工作，除了关闭广告拦截器，也可以分享网站给你的朋友，或在GitHub上为项目点星。
        </p>
        <p>
          网站代码完全开源，托管在GitHub上。如果你有想法、发现bug、或想贡献代码，都欢迎参与项目。这是一个由社区驱动的项目，每一个想法都可能被纳入考虑。
        </p>
        <p>
          <strong>联系方式：</strong><br>
          📧 Email: 通过GitHub Issues联系我们<br>
          🐦 Twitter: 关注更新动态<br>
          💻 GitHub: 提Issue或贡献代码<br>
          💬 Discord: 加入社区讨论
        </p>
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

/* ── 使用指南样式 ── */
.guide-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.guide-item {
  padding: 20px;
  background: #ffffff;
  border-left: 4px solid #c96442;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.guide-item:hover {
  box-shadow: 0px 4px 16px rgba(0,0,0,0.06);
}

.guide-title {
  font-family: Georgia, serif;
  font-size: 16px;
  font-weight: 500;
  color: #c96442;
  margin: 0 0 10px 0;
  line-height: 1.40;
}

.guide-desc {
  color: #5e5d59;
  font-size: 14px;
  line-height: 1.80;
  margin: 0;
}

/* ── 深度分析样式 ── */
.analysis-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.analysis-item {
  padding: 20px;
  background: #ffffff;
  border: 1px solid #f0eee6;
  border-radius: 12px;
  transition: all 0.2s;
}

.analysis-item:hover {
  box-shadow: 0px 4px 16px rgba(0,0,0,0.06);
  border-color: #d97757;
}

.analysis-title {
  font-family: Georgia, serif;
  font-size: 16px;
  font-weight: 600;
  color: #141413;
  margin: 0 0 12px 0;
  line-height: 1.40;
}

.analysis-body {
  color: #5e5d59;
  font-size: 14px;
  line-height: 1.85;
  margin: 0;
}

/* ── 学习路线图样式 ── */
.roadmap-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.roadmap-item {
  padding: 20px;
  background: linear-gradient(135deg, #faf9f5 0%, #ffffff 100%);
  border: 1px solid #f0eee6;
  border-radius: 12px;
  position: relative;
}

.roadmap-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #c96442 0%, #d97757 100%);
  border-radius: 12px 0 0 12px;
}

.roadmap-title {
  font-family: Georgia, serif;
  font-size: 16px;
  font-weight: 600;
  color: #141413;
  margin: 0 0 10px 0;
  padding-left: 0;
}

.roadmap-desc {
  color: #5e5d59;
  font-size: 14px;
  line-height: 1.80;
  margin: 0;
}

/* ── 项目网格样式 ── */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-item {
  padding: 20px;
  background: #ffffff;
  border: 1px solid #f0eee6;
  border-radius: 12px;
  transition: all 0.2s;
}

.project-item:hover {
  box-shadow: 0px 8px 24px rgba(201,100,66,0.12);
  transform: translateY(-4px);
  border-color: #d97757;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.project-name {
  font-family: Georgia, serif;
  font-size: 16px;
  font-weight: 600;
  color: #141413;
  margin: 0;
}

.project-stars {
  font-size: 12px;
  color: #c96442;
  font-weight: 500;
}

.project-desc {
  color: #5e5d59;
  font-size: 13px;
  line-height: 1.75;
  margin: 0;
}

/* ── Newsletter 列表样式 ── */
.newsletter-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.newsletter-item {
  padding: 18px;
  background: #ffffff;
  border-left: 3px solid #c96442;
  border-radius: 8px;
  transition: all 0.2s;
}

.newsletter-item:hover {
  box-shadow: 0px 4px 16px rgba(0,0,0,0.06);
  padding-left: 22px;
}

.newsletter-title {
  font-family: Georgia, serif;
  font-size: 15px;
  font-weight: 600;
  color: #141413;
  margin: 0 0 8px 0;
  line-height: 1.40;
}

.newsletter-item .newsletter-desc {
  color: #5e5d59;
  font-size: 13px;
  line-height: 1.75;
  margin: 0;
}

/* ── FAQ 列表样式 ── */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.faq-item {
  padding: 18px;
  background: #ffffff;
  border: 1px solid #f0eee6;
  border-radius: 12px;
  transition: all 0.2s;
}

.faq-item:hover {
  box-shadow: 0px 4px 12px rgba(0,0,0,0.05);
  border-color: #e8e6dc;
}

.faq-question {
  font-family: Georgia, serif;
  font-size: 15px;
  font-weight: 600;
  color: #c96442;
  margin: 0 0 10px 0;
  line-height: 1.40;
}

.faq-answer {
  color: #5e5d59;
  font-size: 14px;
  line-height: 1.80;
  margin: 0;
}

/* ── 关于我们样式 ── */
.about-content {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #f0eee6;
}

.about-content p {
  color: #5e5d59;
  font-size: 15px;
  line-height: 1.90;
  margin: 0 0 18px 0;
}

.about-content p:last-child {
  margin-bottom: 0;
}

.about-content strong {
  color: #141413;
  font-weight: 600;
}

@media (max-width: 600px) {
  .project-grid {
    grid-template-columns: 1fr;
  }

  .roadmap-item::before {
    width: 3px;
  }

  .guide-item {
    border-left-width: 3px;
  }
}
</style>

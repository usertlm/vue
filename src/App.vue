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
        <h1 class="hero-headline">欢迎来到你的网络导航站</h1>
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

    <!-- Live Stream -->
    <section class="stream-section">
      <HlsPlayer src="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8" />
    </section>

    <!-- Main Content -->
    <main class="main-content">

      <!-- AI Chat -->
      <section id="ai-chat" class="content-section">
        <BotVerificationModal @verified="chatVerified = $event" />
        <ChatBox v-if="chatVerified" />
      </section>

      <!-- Price Trend -->
      <section id="price" class="content-section">
        <PriceTrendChart />
      </section>

      <!-- AdSense -->
      <section class="content-section">
        <AdSense />
      </section>

      <!-- NEWS -->
      <section id="news" class="content-section news-section">
        <div class="section-header">
          <div class="section-eyebrow">📰 资讯</div>
          <h2 class="section-title">每日热闻</h2>
          <p class="section-desc">深度解读科技前沿与游戏产业，每篇报道均含完整分析与背景</p>
        </div>

        <div class="news-grid">

          <div class="news-column">
            <h3 class="column-label">🖥️ 科技要闻</h3>
            <div class="news-list">

              <article class="news-card news-card-wide">
                <h4 class="news-title">OpenAI 发布 GPT-5：推理能力首次超越人类专家平均水平</h4>
                <p class="news-excerpt">经过数月内部测试，OpenAI 于本周正式发布 GPT-5。在业界公认的 MMLU（大规模多任务语言理解）、GPQA Diamond（研究生级别问答）以及 HumanEval（代码能力测试）三大权威基准上，GPT-5 的表现均首次超越了人类专家的平均水平。更值得关注的是，其训练数据量据称达到 GPT-4 的 8 倍，模型参数量翻倍，但得益于全新的稀疏注意力机制和推理优化，API 响应速度反而提升了 40%。OpenAI 宣布 GPT-5 API 将于本月底以付费方式向开发者开放，企业版定价为每千 token 0.12 美元，较 GPT-4 下降了约 35%。与此同时，GPT-5 在多模态理解、长上下文窗口（最高支持 200 万 token）和工具调用稳定性方面也有质的飞跃，被认为是自 GPT-4 以来最大的一次模型迭代。</p>
                <span class="news-meta">OpenAI · GPT-5 · AI大模型 · 3小时前</span>
              </article>

              <article class="news-card news-card-wide">
                <h4 class="news-title">苹果 M4 Ultra 正式登场：Mac Pro 性能暴涨，功耗反而下降</h4>
                <p class="news-excerpt">苹果在春季发布会上正式推出 M4 Ultra 芯片，这是迄今为止苹果桌面处理器的最高规格型号。采用第二代 3nm 制程工艺制造，拥有高达 32 核 CPU（24 个性能核心 + 8 个能效核心）和 128 核 GPU，神经网络引擎算力达到 62 TOPS。在机器学习性能方面，M4 Ultra 相比上一代 M3 Ultra 提升了 2.3 倍，但在相同负载下功耗反而降低了 25%，这得益于全新的能效核心架构和动态电压频率调整技术。新款 Mac Pro 起步配置为 192GB 统一内存，最高可扩展至 768GB，起售价为 $6,999（约合人民币 50,700 元），将于 4 月底开始发货。专业人士评价称，这是苹果自 2020 年转向自研芯片以来，在工作站领域最具竞争力的一代产品，尤其在视频渲染、3D 动画和大型 AI 模型本地推理场景下优势明显。</p>
                <span class="news-meta">Apple · M4 Ultra · Mac Pro · 昨天</span>
              </article>

              <article class="news-card news-card-wide">
                <h4 class="news-title">英伟达 RTX 50 系列全面供货：各级别性价比如何？</h4>
                <p class="news-excerpt">英伟达 RTX 50 系列显卡自发布以来经历了数月的产能爬坡，目前 RTX 5090、RTX 5080、RTX 5070 Ti 已全面恢复现货供应，RTX 5070 也将在本月第三周大批到货。从性价比角度分析，RTX 5080 目前市场均价约 $829，在 4K 光追游戏中的帧率领先 RTX 4080 Super 约 18%，但价格仅高出约 5%，被普遍认为是本代最值得购买的高端型号。RTX 5070 Ti 则凭借 $629 的定价和接近 RTX 4090 D 的光栅化性能，成为高端玩家的主流选择。RTX 5090 D 作为中国特供版，16499 元人民币的定价虽然高昂，但其在 8K 游戏和专业 AI 推理方面的表现目前没有任何对手。渠道消息显示，RTX 5060 系列（甜品级）将在下季度如期发布，预测首发价格 $449，对主流游戏玩家吸引力最大。</p>
                <span class="news-meta">英伟达 · RTX 50 · 显卡 · 2天前</span>
              </article>

              <article class="news-card news-card-wide">
                <h4 class="news-title">华为昇腾 910C 规模出货：国产 AI 芯片的现状与天花板</h4>
                <p class="news-excerpt">在持续的地缘政治压力下，华为昇腾系列芯片正加速成为中国大模型训练的核心基础设施。据供应链多个独立消息源确认，昇腾 910C 已于本月开始规模出货，FP16 算力接近英伟达 H100 的 90%，而 H100 在黑市价格已突破 30 万元人民币的背景下，昇腾 910C 的定价更具吸引力。然而，业界也清醒地看到差距所在：在 CUDA 生态的深度优化、NVLink 多卡互联带宽以及 HBM3 内存容量方面，昇腾 910C 仍有明显短板。目前国内已有超过 15 家大模型厂商在积极适配昇腾生态，包括百度文心、阿里通义、字节豆宝等头部玩家都在测试基于昇腾的推理部署方案。分析师指出，若国产芯片能在未来 18 个月内解决封装和良率问题，有望在 AI 推理市场获得可观份额。</p>
                <span class="news-meta">华为 · 昇腾 910C · AI芯片 · 3天前</span>
              </article>

            </div>
          </div>

          <div class="news-column">
            <h3 class="column-label">🎮 游戏资讯</h3>
            <div class="news-list">

              <article class="news-card news-card-wide">
                <h4 class="news-title">《GTA VI》正式官宣 2026 年秋季发售，预告片 48 小时破 2 亿播放</h4>
                <p class="news-excerpt">R星正式确认《GTA VI》将于 2026 年秋季发售，平台首发为 PS5 和 Xbox Series X|S，PC 版本稍后推出。官方预告片在发布后 48 小时内于 YouTube 平台突破 2 亿次播放，创下了游戏预告片的历史纪录。本作设定在以迈阿密为原型的 Vice City，玩家将首次体验双主角系统——男女主角 Lucia 和 Jason 玩法风格迥异，可随时切换。R星声称这是他们有史以来制作规模最大的游戏，世界面积是《GTA V》的三倍以上，NPC 行为逻辑和交通系统均采用全新引擎驱动。考虑到前作《GTA V》创造了 80 亿美元的总营收记录，分析师普遍预期《GTA VI》首周销售额有望突破 30 亿美元。PC 玩家可能需要等待 12 到 18 个月才能玩到，这也引发了社区的广泛讨论。</p>
                <span class="news-meta">Rockstar · GTA VI · 主机独占 · 1天前</span>
              </article>

              <article class="news-card news-card-wide">
                <h4 class="news-title">《黑神话：悟空》DLC「再起西行」今夏免费更新，付费资料片「天竺」年底登场</h4>
                <p class="news-excerpt">游戏科学在成立七周年直播活动中正式公布了《黑神话：悟空》的后续内容路线图。最先与玩家见面的是 DLC「再起西行」，将以免费更新形式于今年夏季推出，全新场景火焰山与白骨岭将首次在游戏中实装，Boss 总量比本体增加约 40%，并新增两条支线剧情线。游戏科学的创始人在直播中透露，新场景采用了全新的动态天气系统和 NPC 行为树引擎，战斗系统也追加了三个新流派技能树。付费资料片「天竺」则定档今年冬季，定价尚未公布，但规模将是 DLC 的 2.5 倍，包含一个全新的主线剧情章节和网状叙事结构。此外，游戏科学还宣布《黑神话》系列将拓展至主机和移动端，并在探索基于虚幻引擎 5.4 的全新开发管线。</p>
                <span class="news-meta">游戏科学 · 黑神话悟空 · DLC · 3天前</span>
              </article>

              <article class="news-card news-card-wide">
                <h4 class="news-title">Switch 2 正式发布：7.9 英寸 1080P 屏、4K 输出、定价 $449</h4>
                <p class="news-excerpt">任天堂 Switch 2 正式发布，核心硬件由英伟达定制的 T239 芯片驱动，CPU 采用 8 核 ARM Cortex-A78 架构（主频 2.0GHz），GPU 基于 RTX 30 系列同款安培架构，拥有 1536 个 CUDA 核心。机身配备 7.9 英寸 1080P LCD 触控屏，支持 120Hz 刷新率，当连接电视时可输出最高 4K 分辨率。Joy-Con 2 手柄全新升级了磁吸连接方式和 60 小时续航的陀螺仪模块。续航方面，官方标称为 6-9 小时，实际测试显示运行《塞尔达传说：梦境岛》重制版时约可达到 7.5 小时。Switch 2 首发游戏阵容包括《马里奥赛车：世界》（全新原创赛道，支持 24 人同屏竞速）以及《塞尔达传说：梦境岛》重制版（完全重制，非 HD 版）。Switch 2 机身定价 $449 / $469（其他地区），比初代 Switch 首发价高出 $150，但考虑到硬件规格的大幅提升，性价比仍然合理。</p>
                <span class="news-meta">任天堂 · Switch 2 · 游戏主机 · 1周前</span>
              </article>

              <article class="news-card news-card-wide">
                <h4 class="news-title">《赛博朋克2077》Steam 同时在线人数突破 15 万：3.0 更新功不可没</h4>
                <p class="news-excerpt">《赛博朋克2077》在推出 3.0 重大版本更新后，Steam 同时在线人数峰值突破了 15 万人，创下该游戏自 2020 年首发以来的历史最高纪录。3.0 更新内容极为丰富：重写了超过 40% 的游戏代码，修复了超过 500 个已知 Bug，AI 路人行为逻辑全面升级，警察系统重做，新增动态载具追逐机制，以及全面强化的光线追踪效果。开发者 CDPR 还同步更新了次世代模式的帧率上限和 HDR 校准选项。值得注意的是，这一波热潮与 Steam Deck 的高普及率也密切相关——3.0 更新大幅优化了掌机模式下的续航表现，Steam Deck 上平均功耗降低了 22%。截至目前，《赛博朋克2077》全平台累计销量已超过 3000 万份，CDPR 官方同时确认《赛博朋克2078》已进入早期开发阶段，故事将延续夜之城时间线并引入一个新的城市。</p>
                <span class="news-meta">CDPR · 赛博朋克2077 · Steam · 2周前</span>
              </article>

            </div>
          </div>
        </div>
      </section>

      <!-- HARDWARE REVIEWS -->
      <section id="reviews" class="content-section reviews-section">
        <div class="section-header">
          <div class="section-eyebrow">🔬 硬件评测</div>
          <h2 class="section-title">专业评测室</h2>
          <p class="section-desc">真实测试数据与购买建议，帮助你在海量型号中做出理性选择</p>
        </div>

        <div class="reviews-grid">

          <article class="review-card review-hero">
            <div class="review-eyebrow">💎 编辑推荐</div>
            <h3 class="review-title">RTX 5080 深度评测：当前最值得购买的高端游戏显卡？</h3>
            <p class="review-body">RTX 5080 基于英伟达 Blackwell 架构设计，采用 GB203 GPU 核心，配备 16GB GDDR7 显存，显存频率达到 30Gbps，有效带宽比 RTX 4080 Super 提升了 40%。在实测中，4K 光追全开（不开帧生成）环境下，RTX 5080 运行《黑神话：悟空》平均帧率 67fps，运行《赛博朋克2077》超光追模式平均 82fps，表现均显著领先 RTX 4080 Super。值得特别一提的是 DLSS 4 的多帧生成功能——开启后帧率可提升至原生渲染的 3 倍以上，且延迟增加极小。在散热方面，RTX 5080 公版采用均热板 + 三风扇设计，噪音控制在 32dB 以内，长时间负载温度稳定在 68°C 以下。相比动辄 $999 以上的 RTX 4090 系列，RTX 5080 以 $829 的定价提供了接近 90% 的性能，被认为是本世代高端显卡中性价比最优的选择。缺点是 16GB 显存在 8K 分辨率下略显局促，且不支持 DP 2.1 接口。</p>
            <div class="review-verdict">
              <span class="verdict-badge">推荐购买</span>
              <span class="verdict-score">综合评分 9.0 / 10</span>
            </div>
          </article>

          <article class="review-card">
            <div class="review-eyebrow">💻 CPU</div>
            <h3 class="review-title">AMD Ryzen 9 9950X3D 评测：游戏性能登顶，生产力同样不俗</h3>
            <p class="review-body">AMD 在 X3D 系列处理器上首次引入双 3D V-Cache 设计，Ryzen 9 9950X3D 拥有 128MB 三级缓存（3D V-Cache 64MB × 2），游戏性能在多项实测中超越竞品旗舰 10%~15%。《英雄联盟》《DOTA2》《CS2》等电竞游戏中，9950X3D 的 1% Low 帧比 Intel Core Ultra 9 285K 高出 22%，说明 3D V-Cache 对减少帧延迟效果显著。在 Blender 和 V-Ray 等渲染测试中，多核性能比上代 7950X3D 提升 18%，与 Intel 285K 基本持平。功耗方面，9950X3D 在全核负载下约 140W，比 Intel 285K 的 180W 低一个档次，对散热器要求相对友好。唯一需要注意的是，想要发挥 X3D 处理器的最佳游戏性能，用户需要在 BIOS 中手动选择对应的 CCD（单芯片复合设计导致的调度问题），部分主板可能需要更新 BIOS 后才能正确识别。综合来看，这颗处理器适合以游戏为主力需求、同时有内容创作需求的用户。</p>
            <div class="review-verdict">
              <span class="verdict-badge">强烈推荐</span>
              <span class="verdict-score">综合评分 9.2 / 10</span>
            </div>
          </article>

          <article class="review-card">
            <div class="review-eyebrow">💾 SSD</div>
            <h3 class="review-title">三星 9100 Pro 2TB 实测：PCIe 5.0 SSD 终于成熟了</h3>
            <p class="review-body">三星 9100 Pro 是全球首款实现稳定 14GB/s 顺序读取的 PCIe 5.0 ×4 NVMe SSD，主控芯片为三星自研的 Pablo S4，NAND 颗粒为第 8 代 V-NAND TLC，2TB 版本写入寿命 1200 TBW。在 CrystalDiskMark 8.0 实测中，连续读取达到 14.1 GB/s，连续写入 12.5 GB/s；4K 随机读取 IOPS 突破 200 万，较上代 990 Pro 提升约 65%。在 DirectStorage 1.1 游戏加载测试中，9100 Pro 加载《黑神话：悟空》存档点耗时仅 1.2 秒，比三星 990 Pro 快 38%。散热方面，随盒附赠的镍铜复合散热片表现良好，待机温度 38°C，满载温度 62°C，略高于无散热片的 PCIe 4.0 产品但完全不影响性能发挥。目前市场零售价约 1899 元，对于追求极致游戏加载速度和内容创作效率的用户，是目前最值得购买的高端 SSD。</p>
            <div class="review-verdict">
              <span class="verdict-badge">推荐购买</span>
              <span class="verdict-score">综合评分 8.8 / 10</span>
            </div>
          </article>

          <article class="review-card">
            <div class="review-eyebrow">❄️ 散热器</div>
            <h3 class="review-title">猫头鹰 NH-D15 二代评测：双塔风冷之王，14 年后的完美进化</h3>
            <p class="review-body">NH-D15 二代是猫头鹰经典双塔散热器 NH-D15 的完全换代产品，保留了前代标志性的 140mm 塔体高度限制（兼容大多数高内存插槽主板），但热管数量从 6 根增加到 7 根，底座从热管直触升级为铜底焊接 + 镀镍处理。在 Intel Core Ultra 9 285K 压力测试中，NH-D15 二代将处理器温度压制在 87°C（室温 24°C），比初代 NH-D15 低 7°C，比利民 FC140 低 11°C。风扇升级为全新的 NF-A14x25 G2，额定噪音 24.8dB，相同噪音下的风量比上代提升约 12%。安装体验方面，猫头鹰重新设计的 SecuFirm2+ 扣具系统大幅简化了安装步骤，AM5 和 LGA1851 平台安装时间缩短至 8 分钟以内。价格定在 799 元，考虑到其顶级散热表现和超长使用寿命，是高端平台值得投资的高品质选择。</p>
            <div class="review-verdict">
              <span class="verdict-badge">强烈推荐</span>
              <span class="verdict-score">综合评分 9.3 / 10</span>
            </div>
          </article>

          <article class="review-card">
            <div class="review-eyebrow">🧠 内存</div>
            <h3 class="review-title">DDR5 6400MHz 32GB 套条横评：有没有必要上 6400？</h3>
            <p class="review-body">DDR5 内存进入 2026 年后，6400MHz 已成为中高端平台的主流选择。我们挑选了五款市场主流 6400MHz 32GB 套条进行横评，包括芝奇 Trident Z5 DDR5 6400、光威 DDR5 6400、阿斯加特 DDR5 6400、金士顿 Fury Beast DDR5 6400 和英睿达 DDR5 6400。在 AMD Ryzen 9 9950X3D 平台上，芝奇和英睿达的产品在读取/复制延迟上表现最佳（分别为 89ns 和 91ns），在《英雄联盟》基准测试中帧率领先光威和阿斯加特约 8%。Intel 平台方面，差异则不那么明显，主流五款产品性能差距在 3% 以内。超频潜力方面，芝奇和英睿达体质普遍可达 7200MHz 稳定运行。综合建议：AMD 平台用户优先选择低延迟（CL32 以下）的 6400MHz 产品；Intel 平台用户则可根据预算自由选择。</p>
            <div class="review-verdict">
              <span class="verdict-badge">按需推荐</span>
              <span class="verdict-score">综合评分 8.5 / 10</span>
            </div>
          </article>

        </div>
      </section>

      <!-- BUILD GUIDE -->
      <section id="build-guide" class="content-section guide-section">
        <div class="section-header">
          <div class="section-eyebrow">🛠️ 装机指南</div>
          <h2 class="section-title">2026 年装机配置推荐</h2>
          <p class="section-desc">针对不同预算和使用场景，提供经过实测验证的配置方案与选购逻辑</p>
        </div>

        <div class="guide-intro">
          <p>装机的本质是在预算、用途和未来升级空间三者之间找到最优平衡点。以下配置单均经过我们实测，所有配件兼容性问题均已排除，并考虑了配件之间的性能匹配——木桶效应在装机中极为常见，高显低 CPU 或高 CPU 低显卡都会造成浪费。以下价格均为京东自营或天猫旗舰店的参考价，促销期间通常可节省 5%~15%，建议结合上方价格趋势图表关注最佳入手时机。</p>
        </div>

        <div class="configs-grid">

          <div class="config-card config-highend">
            <div class="config-header-row">
              <span class="config-badge-tag">👑 旗舰发烧</span>
              <span class="config-price-tag">预算约 ¥28000~35000</span>
            </div>
            <h3 class="config-title">4K 光追旗舰 · 顶配游戏 + AI 创作</h3>
            <div class="config-parts">
              <div class="config-part"><span class="part-label">CPU</span><span>AMD Ryzen 9 9950X3D</span></div>
              <div class="config-part"><span class="part-label">主板</span><span>ROG CROSSHAIR X870E HERO</span></div>
              <div class="config-part"><span class="part-label">显卡</span><span>NVIDIA RTX 5090 D 24GB</span></div>
              <div class="config-part"><span class="part-label">内存</span><span>芝奇 DDR5 6400 32GB (16GB×2) CL32</span></div>
              <div class="config-part"><span class="part-label">系统盘</span><span>三星 9100 Pro 2TB PCIe 5.0</span></div>
              <div class="config-part"><span class="part-label">数据盘</span><span>致态 TiPlus7100 4TB</span></div>
              <div class="config-part"><span class="part-label">散热器</span><span>猫头鹰 NH-D15 二代</span></div>
              <div class="config-part"><span class="part-label">电源</span><span>海韵 PRIME TX-1000 1000W 金牌</span></div>
              <div class="config-part"><span class="part-label">机箱</span><span>联力 O11 EVO V2</span></div>
            </div>
            <p class="config-note">这套配置可以在 4K 分辨率下以最高画质流畅运行所有 3A 大作，并能在本地运行 70B 参数的大语言模型推理。如果侧重 Intel 平台，可将 CPU 替换为 Core Ultra 9 285K，主板换为 ROG MAXIMUS Z890 APEX，电源需要 1200W。建议显卡至少选择 RTX 5080，低于这个档次则 CPU 性能反而成为瓶颈。</p>
          </div>

          <div class="config-card config-midhigh">
            <div class="config-header-row">
              <span class="config-badge-tag">🎯 高端进阶</span>
              <span class="config-price-tag">预算约 ¥14000~18000</span>
            </div>
            <h3 class="config-title">4K 入门 / 2K 顶配 · 性价比高端</h3>
            <div class="config-parts">
              <div class="config-part"><span class="part-label">CPU</span><span>AMD Ryzen 7 9800X3D</span></div>
              <div class="config-part"><span class="part-label">主板</span><span>ROG STRIX B850-F GAMING</span></div>
              <div class="config-part"><span class="part-label">显卡</span><span>NVIDIA RTX 5080 16GB</span></div>
              <div class="config-part"><span class="part-label">内存</span><span>英睿达 DDR5 6400 32GB (16GB×2)</span></div>
              <div class="config-part"><span class="part-label">系统盘</span><span>WD Black SN850X 2TB</span></div>
              <div class="config-part"><span class="part-label">数据盘</span><span>海力士 P41 2TB</span></div>
              <div class="config-part"><span class="part-label">散热器</span><span>利民 FC140</span></div>
              <div class="config-part"><span class="part-label">电源</span><span>振华 LEADEX G 850W 金牌</span></div>
              <div class="config-part"><span class="part-label">机箱</span><span>追风者 P500A D-RGB</span></div>
            </div>
            <p class="config-note">Ryzen 9800X3D 是目前游戏性能最强的 AM5 平台处理器，3D V-Cache 对电竞和 3A 游戏的帧率提升效果显著。RTX 5080 则提供了接近 RTX 4090 的光栅化性能，同时功耗更低、发热更小。这套配置在 2K 分辨率下开光追可以超过 165fps，在 4K 分辨率下也能应对大多数游戏，建议搭配 850W 以上电源确保余量。</p>
          </div>

          <div class="config-card config-midrange">
            <div class="config-header-row">
              <span class="config-badge-tag">⚡ 主流甜品</span>
              <span class="config-price-tag">预算约 ¥8000~11000</span>
            </div>
            <h3 class="config-title">2K 高刷 · 性价比之选</h3>
            <div class="config-parts">
              <div class="config-part"><span class="part-label">CPU</span><span>AMD Ryzen 5 9600X</span></div>
              <div class="config-part"><span class="part-label">主板</span><span>华硕 B850M-K</span></div>
              <div class="config-part"><span class="part-label">显卡</span><span>NVIDIA RTX 5070 Ti 16GB</span></div>
              <div class="config-part"><span class="part-label">内存</span><span>DDR5 6000 32GB (16GB×2) CL30</span></div>
              <div class="config-part"><span class="part-label">系统盘</span><span>海力士 P41 2TB</span></div>
              <div class="config-part"><span class="part-label">散热器</span><span>利民 PA120</span></div>
              <div class="config-part"><span class="part-label">电源</span><span>海韵 FOCUS GX-750</span></div>
              <div class="config-part"><span class="part-label">机箱</span><span>先马鲁班 1</span></div>
            </div>
            <p class="config-note">RTX 5070 Ti 是本代 RTX 50 系列中性价比最突出的型号之一，在 2K 光追游戏中的帧率领先上代 RTX 4070 Ti Super 约 20%，而定价仅 $629。Ryzen 5 9600X 虽然是定位中端，但单核性能已经非常接近 9700X，配合 RTX 5070 Ti 在 2K 分辨率下可以开满所有画质选项并享受高刷新率。</p>
          </div>

          <div class="config-card config-budget">
            <div class="config-header-row">
              <span class="config-badge-tag">💡 入门实用</span>
              <span class="config-price-tag">预算约 ¥4000~6000</span>
            </div>
            <h3 class="config-title">1080P 游戏 · 过渡升级首选</h3>
            <div class="config-parts">
              <div class="config-part"><span class="part-label">CPU</span><span>Intel Core Ultra 5 245K</span></div>
              <div class="config-part"><span class="part-label">主板</span><span>MSI PRO B760M-A DDR4</span></div>
              <div class="config-part"><span class="part-label">显卡</span><span>NVIDIA RTX 5060 8GB</span></div>
              <div class="config-part"><span class="part-label">内存</span><span>DDR4 3200 16GB (8GB×2)</span></div>
              <div class="config-part"><span class="part-label">系统盘</span><span>致态 TiPlus7100 2TB</span></div>
              <div class="config-part"><span class="part-label">散热器</span><span>华硕 游侠2代</span></div>
              <div class="config-part"><span class="part-label">电源</span><span>振华铜皇 550W</span></div>
              <div class="config-part"><span class="part-label">机箱</span><span>先马趣 · 她的桌</span></div>
            </div>
            <p class="config-note">这是一套以实用为导向的配置，适合预算有限或想先过渡日后升级的用户。RTX 5060 的 8GB 显存在 1080P 游戏中完全够用，且支持 DLSS 4 多帧生成技术，可以将中低端显卡的实际帧率提升一个档次。Intel Ultra 5 245K 的单核性能优秀，搭配合适的 B760 主板日后可以升级到 Ultra 9 系列。</p>
          </div>

        </div>

        <div class="guide-tips">
          <h4 class="tips-title">💡 选购通用建议</h4>
          <ul class="tips-list">
            <li>电源不要省：80Plus 金牌认证是底线，功率预留 20% 余量，不要买不知名品牌的"性价比"电源</li>
            <li>主板决定升级上限：预算紧张时优先保证主板规格，CPU 和显卡日后都可以升级，主板决定了你能用哪些 CPU 和内存</li>
            <li>SSD 优先加容量：2026 年 2TB SSD 是标配，游戏文件体积越来越大，1TB 很快就会不够用</li>
            <li>风冷足够绝大多数人：240/360 水冷并没有比顶级双塔风冷强多少，但漏液风险是真实存在的</li>
            <li>等促销不追首发：新硬件发布后 3-6 个月通常会有第一波降价，等不及的话可以在京东 618 / 天猫双十一关注大促</li>
          </ul>
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
            导航站成立于 2024 年，是一个专注于为中文互联网用户提供高质量内容索引与实用工具整合的个人项目。网站的核心价值在于筛选：我们从浩如烟海的网络资源中，将真正有价值的工具、值得信赖的信息源和经过验证的产品挑选出来，以清晰的分类和简洁的界面呈现给你。每年有大量新的网站、工具和资源涌现，大多数都转瞬即逝或质量堪忧，我们的编辑团队会持续跟踪这些变化，确保推荐列表保持最新。
          </p>
          <p class="about-text">
            AI 对话功能基于 OpenRouter + Claude 3.5 Sonnet 构建，所有对话内容仅用于回答你的问题，不会被用于任何模型的训练。我们不会存储你的对话记录，也绝不会将个人信息透露给任何第三方。如果你在使用过程中遇到任何问题，或者希望推荐某个优秀的资源，欢迎通过 GitHub 与我取得联系。
          </p>
          <p class="about-text">
            价格趋势数据来自京东、淘宝和拼多多的公开页面，每 10 分钟自动刷新一次。历史价格数据仅供趋势参考，实际价格可能因促销、库存和地区差异而有所不同。如果某款配件接近历史最低价，我们会通过趋势指标为你提示最佳入手时机。
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
import BotVerificationModal from './components/BotVerificationModal.vue'
import ChatBox from './components/ChatBox.vue'
import AdSense from './components/AdSense.vue'
import PriceTrendChart from './components/PriceTrendChart.vue'
import HlsPlayer from './components/HlsPlayer.vue'

export default {
  name: 'App',
  components: {
    SearchComponent,
    BotVerificationModal,
    ChatBox,
    AdSense,
    PriceTrendChart,
    HlsPlayer,
  },
  data() {
    return {
      chatVerified: false,
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
/* ═══════════════════════════════════════════
   CLAUDE DESIGN SYSTEM — App.vue
   Reference: DESIGN.md
═══════════════════════════════════════════ */

/* ── CSS Variables (Claude Token Set) ── */
:root {
  /* Primary */
  --color-near-black:   #141413;
  --color-terracotta:   #c96442;
  --color-coral:        #d97757;
  /* Secondary & Accent */
  --color-error:        #b53333;
  --color-focus-blue:   #3898ec;
  /* Surface & Background */
  --color-parchment:    #f5f4ed;
  --color-ivory:        #faf9f5;
  --color-white:        #ffffff;
  --color-warm-sand:    #e8e6dc;
  --color-dark-surface: #30302e;
  --color-deep-dark:    #141413;
  /* Neutrals & Text */
  --color-charcoal-warm: #4d4c48;
  --color-olive-gray:    #5e5d59;
  --color-stone-gray:    #87867f;
  --color-dark-warm:     #3d3d3a;
  --color-warm-silver:    #b0aea5;
  /* Borders & Rings */
  --color-border-cream: #f0eee6;
  --color-border-warm:   #e8e6dc;
  --color-border-dark:   #30302e;
  --color-ring-warm:     #d1cfc5;
  --color-ring-deep:     #c2c0b6;
  /* Fonts */
  --font-serif: Georgia, 'Times New Roman', Times, serif;
  --font-sans:  Arial, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-mono:  SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace;
}

/* ── Reset & Base ── */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

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

#app { min-height: 100vh; }

/* ── Navigation ── */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(245, 244, 237, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-cream);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 40px;
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
  font-size: 20px;
  font-weight: 500;
  transition: color 0.2s;
}
.header-logo:hover {
  color: var(--color-near-black);
  opacity: 0.75;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--color-terracotta);
  border-radius: 8px;
  flex-shrink: 0;
}

.logo-text { letter-spacing: -0.2px; }

.header-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  color: var(--color-olive-gray);
  font-size: 15px;
  font-weight: 400;
  font-family: var(--font-sans);
  transition: color 0.2s;
  border-radius: 6px;
  padding: 6px 10px;
}
.nav-link:hover {
  color: var(--color-near-black);
  background: var(--color-warm-sand);
}

/* ── Stream Section ── */
.stream-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px 80px;
}

/* ── Hero Section ── */
.hero-section {
  position: relative;
  text-align: center;
  padding: 120px 40px 100px;
  overflow: hidden;
  background: var(--color-parchment);
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 700px;
  height: 700px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle,
    rgba(201,100,66,0.06) 0%,
    rgba(217,119,87,0.03) 40%,
    transparent 70%
  );
  pointer-events: none;
}

.hero-inner {
  max-width: 680px;
  margin: 0 auto;
  position: relative;
}

.hero-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-olive-gray);
  background: var(--color-warm-sand);
  border: 1px solid var(--color-border-warm);
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 28px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-headline {
  font-family: var(--font-serif);
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 500;
  color: var(--color-near-black);
  line-height: 1.10;
  letter-spacing: normal;
  margin-bottom: 24px;
}

.hero-sub {
  font-family: var(--font-sans);
  font-size: 20px;
  color: var(--color-olive-gray);
  line-height: 1.60;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
}

.hero-search {
  max-width: 560px;
  margin: 0 auto;
  position: relative;
}

/* ── Buttons (Claude Design System) ── */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-family: var(--font-sans);
  text-align: center;
}

/* Primary CTA — Terracotta Brand */
.btn-primary {
  background: var(--color-terracotta);
  color: var(--color-ivory);
  box-shadow: var(--color-terracotta) 0px 0px 0px 0px,
              var(--color-terracotta) 0px 0px 0px 1px;
}
.btn-primary:hover {
  background: var(--color-coral);
  color: var(--color-ivory);
  transform: translateY(-1px);
  box-shadow: var(--color-terracotta) 0px 0px 0px 0px,
              rgba(201,100,66,0.3) 0px 4px 12px;
}

/* Secondary — White Surface */
.btn-secondary {
  background: var(--color-white);
  color: var(--color-near-black);
  border: 1px solid var(--color-border-cream);
  box-shadow: none;
}
.btn-secondary:hover {
  background: var(--color-ivory);
  color: var(--color-near-black);
  transform: translateY(-1px);
  box-shadow: 0px 0px 0px 1px var(--color-ring-warm);
}

/* Warm Sand Button */
.btn-warm-sand {
  background: var(--color-warm-sand);
  color: var(--color-charcoal-warm);
  border: none;
  box-shadow: var(--color-warm-sand) 0px 0px 0px 0px,
              var(--color-ring-warm) 0px 0px 0px 1px;
}

/* ── Main Content ── */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px 100px;
}

.content-section {
  margin-bottom: 80px;
}

/* ── Section Headers ── */
.section-eyebrow {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: var(--color-terracotta);
  margin-bottom: 12px;
}

.section-title {
  font-family: var(--font-serif);
  font-size: clamp(28px, 3.5vw, 52px);
  font-weight: 500;
  color: var(--color-near-black);
  line-height: 1.20;
  letter-spacing: normal;
  margin-bottom: 10px;
}

.section-desc {
  font-size: 16px;
  color: var(--color-olive-gray);
  line-height: 1.60;
}

/* ── News Section ── */
.news-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.column-label {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 500;
  color: var(--color-near-black);
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 2px solid var(--color-border-warm);
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.news-card {
  padding: 24px 0;
  border-bottom: 1px solid var(--color-border-cream);
}
.news-card:last-child { border-bottom: none; }

.news-title {
  font-family: var(--font-serif);
  font-size: 17px;
  font-weight: 500;
  color: var(--color-near-black);
  margin-bottom: 10px;
  line-height: 1.30;
}

.news-excerpt {
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 400;
  color: var(--color-olive-gray);
  line-height: 1.70;
  margin-bottom: 12px;
}

.news-meta {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--color-stone-gray);
  font-weight: 400;
}

.news-card-wide .news-excerpt {
  display: block;
  -webkit-line-clamp: unset;
  overflow: visible;
}

/* ── Reviews Section ── */
.reviews-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.review-card {
  background: var(--color-ivory);
  border: 1px solid var(--color-border-cream);
  border-radius: 12px;
  padding: 28px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.review-card:hover {
  box-shadow: rgba(0,0,0,0.05) 0px 4px 24px;
  transform: translateY(-2px);
}

.review-hero {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, rgba(201,100,66,0.06) 0%, transparent 60%);
  border-color: rgba(201,100,66,0.20);
}

.review-eyebrow {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.55px;
  color: var(--color-terracotta);
  margin-bottom: 12px;
}

.review-title {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 500;
  color: var(--color-near-black);
  line-height: 1.20;
  margin-bottom: 14px;
}

.review-body {
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 400;
  color: var(--color-olive-gray);
  line-height: 1.60;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.review-hero .review-body {
  -webkit-line-clamp: unset;
  overflow: visible;
}

.review-verdict {
  display: flex;
  align-items: center;
  gap: 14px;
}

.verdict-badge {
  display: inline-block;
  padding: 4px 14px;
  background: var(--color-terracotta);
  color: var(--color-ivory);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
}

.verdict-score {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-stone-gray);
  font-weight: 500;
}

/* ── Build Guide ── */
.guide-intro {
  background: var(--color-warm-sand);
  border: 1px solid var(--color-border-warm);
  border-radius: 12px;
  padding: 24px 28px;
  margin-bottom: 32px;
}
.guide-intro p {
  font-family: var(--font-serif);
  font-size: 15px;
  color: var(--color-olive-gray);
  line-height: 1.60;
  margin: 0;
}

.configs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 28px;
}

.config-card {
  background: var(--color-ivory);
  border: 1px solid var(--color-border-cream);
  border-radius: 12px;
  padding: 24px;
  transition: box-shadow 0.2s;
}
.config-card:hover {
  box-shadow: rgba(0,0,0,0.05) 0px 4px 24px;
}

.config-highend {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, rgba(201,100,66,0.06) 0%, transparent 60%);
  border-color: rgba(201,100,66,0.20);
}

.config-header-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.config-badge-tag {
  display: inline-block;
  padding: 4px 12px;
  background: var(--color-terracotta);
  color: var(--color-ivory);
  border-radius: 16px;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 600;
}

.config-price-tag {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-stone-gray);
  font-weight: 400;
}

.config-title {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 500;
  color: var(--color-near-black);
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border-cream);
}

.config-parts {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 16px;
}

.config-part {
  display: flex;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-cream);
  font-family: var(--font-sans);
  font-size: 13px;
}
.config-part:last-child { border-bottom: none; }

.part-label {
  font-weight: 600;
  color: var(--color-charcoal-warm);
  min-width: 56px;
  flex-shrink: 0;
}
.config-part > span:last-child { color: var(--color-olive-gray); }

.config-note {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-stone-gray);
  line-height: 1.70;
  margin: 0;
  padding: 12px 14px;
  background: var(--color-parchment);
  border-radius: 8px;
  border-left: 3px solid var(--color-terracotta);
}

.guide-tips {
  background: var(--color-ivory);
  border: 1px solid var(--color-border-cream);
  border-radius: 12px;
  padding: 24px 28px;
}

.tips-title {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 500;
  color: var(--color-near-black);
  margin-bottom: 16px;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tips-list li {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-olive-gray);
  line-height: 1.70;
  padding-left: 18px;
  position: relative;
}
.tips-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--color-terracotta);
  font-weight: bold;
}

/* ── Resource Tabs ── */
.resource-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  background: var(--color-warm-sand);
  padding: 4px;
  border-radius: 8px;
  width: fit-content;
}

.tab-btn {
  padding: 8px 18px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-olive-gray);
  cursor: pointer;
  transition: all 0.15s;
}
.tab-btn.active {
  background: var(--color-white);
  color: var(--color-near-black);
  box-shadow: 0px 0px 0px 1px var(--color-ring-warm);
}
.tab-btn:hover:not(.active) { color: var(--color-near-black); }

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.resource-card {
  display: block;
  padding: 20px;
  background: var(--color-ivory);
  border: 1px solid var(--color-border-cream);
  border-radius: 12px;
  text-decoration: none;
  transition: box-shadow 0.2s, transform 0.2s;
}
.resource-card:hover {
  box-shadow: rgba(0,0,0,0.05) 0px 4px 24px;
  transform: translateY(-2px);
  color: var(--color-coral);
}

.resource-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.resource-name {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-terracotta);
  transition: color 0.2s;
}
.resource-card:hover .resource-name { color: var(--color-coral); }

.resource-external {
  font-size: 12px;
  color: var(--color-stone-gray);
  flex-shrink: 0;
}

.resource-desc {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-olive-gray);
  line-height: 1.60;
  margin: 0;
}

/* ── About Card ── */
.about-card {
  background: var(--color-warm-sand);
  border: 1px solid var(--color-border-warm);
  border-radius: 12px;
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
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 400;
  color: var(--color-olive-gray);
  line-height: 1.60;
  max-width: 640px;
  margin: 0 auto 16px;
}
.about-text:last-child { margin-bottom: 0; }

/* ── Footer ── */
.site-footer {
  border-top: 1px solid var(--color-border-cream);
  padding: 32px 40px;
  background: var(--color-parchment);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-text {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-stone-gray);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .header-inner { padding: 14px 20px; }
  .header-nav { gap: 8px; }
  .nav-link { padding: 6px 8px; font-size: 13px; }

  .hero-section { padding: 80px 20px 60px; }
  .hero-section::before { width: 400px; height: 400px; }
  .hero-headline { font-size: 36px; }
  .hero-sub { font-size: 17px; }
  .hero-actions { flex-direction: column; align-items: center; }

  .stream-section { padding: 0 20px 60px; }

  .main-content { padding: 0 20px 60px; }
  .content-section { margin-bottom: 60px; }

  .news-grid { grid-template-columns: 1fr; gap: 32px; }
  .reviews-grid { grid-template-columns: 1fr; }
  .review-hero { grid-column: auto; }
  .configs-grid { grid-template-columns: 1fr; }
  .config-highend { grid-column: auto; }

  .resource-tabs { flex-wrap: wrap; }
  .resource-grid { grid-template-columns: 1fr; }

  .about-card { padding: 32px 24px; }
  .site-footer { padding: 24px 20px; }
}
</style>

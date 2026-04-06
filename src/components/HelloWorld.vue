<template>
  <div class="hello">
    <!-- AI Chat Box -->
    <ChatBox />

    <!-- Price Tracker Chart -->
    <PriceChart />

    <!-- Google AdSense -->
    <AdSense />

    <!-- 电影资源分享 -->
    <section class="section-block">
      <h3 class="section-heading">电影资源分享</h3>
      <p class="section-link"><a href="/video.html" target="_blank">打开视频页面 →</a></p>
      <div class="link-grid">
        <a href="https://www.dy2018.com/" target="_blank" rel="noopener">电影天堂</a>
        <a href="https://www.agedm.org/" target="_blank" rel="noopener">AGE动漫</a>
      </div>
    </section>

    <!-- 社区资讯 -->
    <section class="section-block">
      <h3 class="section-heading">社区资讯</h3>
      <div class="link-grid">
        <a href="https://36kr.com/" target="_blank" rel="noopener">36kr</a>
        <span class="link-desc">创业资讯，科技新闻</span>
        <a href="https://sspai.com/" target="_blank" rel="noopener">少数派</a>
        <span class="link-desc">高品质数字消费指南</span>
        <a href="https://www.youtube.com/" target="_blank" rel="noopener">YouTube</a>
        <span class="link-desc">全球最大的学习分享平台</span>
        <a href="https://www.google.com/" target="_blank" rel="noopener">Google</a>
        <span class="link-desc">全球最大的搜索平台</span>
      </div>
    </section>

    <!-- 素材资源 -->
    <section class="section-block">
      <h3 class="section-heading">素材资源</h3>
      <div class="link-grid">
        <a href="https://www.iconfont.cn/" target="_blank" rel="noopener">iconfont</a>
        <span class="link-desc">阿里巴巴矢量图标库</span>
        <a href="https://www.flaticon.com/" target="_blank" rel="noopener">flaticon</a>
        <span class="link-desc">634,000+ 免费矢量图标</span>
        <a href="https://fonts.google.com/" target="_blank" rel="noopener">Google Font</a>
        <span class="link-desc">优质字体</span>
        <a href="https://unsplash.com/" target="_blank" rel="noopener">Unsplash</a>
        <span class="link-desc">免费高清图片</span>
        <a href="https://pixabay.com/" target="_blank" rel="noopener">pixabay</a>
        <span class="link-desc">免费图片和视频</span>
      </div>
    </section>

    <!-- 常用推荐 -->
    <section class="section-block">
      <h3 class="section-heading">常用推荐</h3>
      <div class="link-grid">
        <a href="https://www.ui.cn/" target="_blank" rel="noopener">UI中国</a>
        <span class="link-desc">图形交互与界面设计交流</span>
        <a href="https://www.zcool.com.cn/" target="_blank" rel="noopener">站酷</a>
        <span class="link-desc">中国人气设计师互动平台</span>
        <a href="https://www.producthunt.com/" target="_blank" rel="noopener">Product Hunt</a>
        <span class="link-desc">发现新鲜有趣的产品</span>
        <a href="https://www.behance.net/" target="_blank" rel="noopener">Behance</a>
        <span class="link-desc">Adobe旗下的设计师交流平台</span>
      </div>
    </section>
  </div>
</template>

<script>
import AdSense from './AdSense.vue';
import ChatBox from './ChatBox.vue';
import PriceChart from './PriceChart.vue';

export default {
  name: 'HelloWorld',
  components: {
    AdSense,
    ChatBox,
    PriceChart
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

.hello h1 {
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 500;
  color: #141413;
  margin-bottom: 12px;
}

.hello > p {
  color: #5e5d59;
  font-size: 16px;
  margin-bottom: 24px;
  line-height: 1.60;
}

.hello > p a {
  color: #c96442;
  font-weight: 500;
}

.section-block {
  background: #faf9f5;
  border: 1px solid #f0eee6;
  border-radius: 12px;
  padding: 32px 28px;
  margin-bottom: 20px;
  text-align: left;
  box-shadow: rgba(0,0,0,0.05) 0px 4px 24px;
}

.section-heading {
  font-family: Georgia, serif;
  font-size: 22px;
  font-weight: 500;
  color: #141413;
  margin: 0 0 16px 0;
  line-height: 1.20;
}

.section-link {
  margin-bottom: 16px;
}

.section-link a {
  color: #c96442;
  font-size: 15px;
  font-weight: 500;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px 24px;
}

.link-grid a {
  color: #5e5d59;
  font-size: 15px;
  font-weight: 500;
  display: block;
  transition: color 0.2s;
}

.link-grid a:hover {
  color: #c96442;
  text-decoration: none;
}

.link-desc {
  color: #87867f;
  font-size: 13px;
  grid-column: span 1;
}
</style>

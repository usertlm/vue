<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      👉👉👉👉👉,<br>
      check out the
      <a href="https://b23.tv/DmyVWD9" target="_blank" rel="noopener">宸墨嵐的哔哩哔哩</a>.
      <a href="http://www.staggeringbeauty.com/" target="_blank" rel="noopener">访问记录</a>.
    </p>

    <!-- DeepSeek Chat -->
    <div class="chat-container">
      <div class="chat-box" ref="chatBox">
        <div v-for="(msg, index) in messages" :key="index" class="message">{{ msg }}</div>
      </div>
      <input
        v-model="userInput"
        type="text"
        placeholder="输入消息..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">发送</button>
    </div>

    <!-- Google AdSense -->
    <AdSense />

    <!-- 直播页面 -->
    <h3>直播页面</h3>
    <p><a href="/zb.html" target="_blank">打开直播页面 →</a></p>

    <!-- 电影资源分享 -->
    <h3>电影资源分享</h3>
    <p><a href="/video.html" target="_blank">打开视频页面 →</a></p>
    <ul>
      <li><a href="https://www.dy2018.com/" target="_blank" rel="noopener">电影天堂</a></li>
      <li><a href="https://www.agedm.org/" target="_blank" rel="noopener">AGE动漫</a></li>
    </ul>

    <!-- 社区资讯 -->
    <h3>社区资讯</h3>
    <ul>
      <li><a href="https://36kr.com/" target="_blank" rel="noopener">36kr</a> - 创业资讯、科技新闻</li>
      <li><a href="https://sspai.com/" target="_blank" rel="noopener">少数派</a> - 高品质数字消费指南</li>
      <li><a href="https://www.youtube.com/" target="_blank" rel="noopener">YouTube</a> - 全球最大的学习分享平台</li>
      <li><a href="https://www.google.com/" target="_blank" rel="noopener">Google</a> - 全球最大的搜索平台</li>
    </ul>

    <!-- 素材资源 -->
    <h3>素材资源</h3>
    <ul>
      <li><a href="https://www.iconfont.cn/" target="_blank" rel="noopener">iconfont</a> - 阿里巴巴矢量图标库</li>
      <li><a href="https://www.flaticon.com/" target="_blank" rel="noopener">flaticon</a> - 634,000+ 免费矢量图标</li>
      <li><a href="https://fonts.google.com/" target="_blank" rel="noopener">Google Font</a> - 优质字体</li>
      <li><a href="https://unsplash.com/" target="_blank" rel="noopener">Unsplash</a> - 免费高清图片</li>
      <li><a href="https://pixabay.com/" target="_blank" rel="noopener">pixabay</a> - 免费图片和视频</li>
    </ul>

    <!-- 常用推荐 -->
    <h3>常用推荐</h3>
    <ul>
      <li><a href="https://www.ui.cn/" target="_blank" rel="noopener">UI中国</a> - 图形交互与界面设计交流</li>
      <li><a href="https://www.zcool.com.cn/" target="_blank" rel="noopener">站酷</a> - 中国人气设计师互动平台</li>
      <li><a href="https://www.producthunt.com/" target="_blank" rel="noopener">Product Hunt</a> - 发现新鲜有趣的产品</li>
      <li><a href="https://www.behance.net/" target="_blank" rel="noopener">Behance</a> - Adobe旗下的设计师交流平台</li>
    </ul>
  </div>
</template>

<script>
import { chatWithDeepSeek } from './deepseek.js';
import AdSense from './AdSense.vue';

export default {
  name: 'HelloWorld',
  components: {
    AdSense
  },
  props: {
    msg: String,
  },
  data() {
    return {
      userInput: '',
      messages: [],
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim()) return;
      this.messages.push(`You: ${this.userInput}`);
      try {
        const response = await chatWithDeepSeek(this.userInput);
        this.messages.push(`DeepSeek: ${response}`);
      } catch (err) {
        this.messages.push(`DeepSeek: 抱歉，出现错误 - ${err.message}`);
      }
      this.userInput = '';
    },
  },
};
</script>

<style scoped>
.hello {
  text-align: center;
  padding: 20px;
}

h1 {
  color: #42b983;
}

h3 {
  margin: 30px 0 15px;
  color: #00ffe7;
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

li {
  margin: 5px;
}

a {
  color: #42b983;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.chat-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.chat-box {
  height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  background: #fff;
  text-align: left;
}

.message {
  margin: 8px 0;
  padding: 8px;
  border-radius: 4px;
  background: #e3f2fd;
}

input {
  width: calc(100% - 80px);
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 5px;
}

button {
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #359268;
}
</style>

<template>
  <div id="app">
    <div v-if="!turnstilePassed" class="glass" style="margin-bottom: 32px;">
      <h2 class="neon">Cloudflare Turnstile 验证演示</h2>
      <div id="cf-turnstile-container">
        <div class="cf-turnstile" data-sitekey="1x00000000000000000000AA" data-theme="auto" data-callback="onTurnstileSuccess"></div>
      </div>
    </div>
    <div v-else>
      <img alt="Vue logo" src="./assets/logo.png">
      <HelloWorld msg="👇👇👇"/>
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
  </div>
</template>

<script>
// 引入组件
import HelloWorld from './components/HelloWorld.vue'
import SearchComponent from './components/search.vue' // 确保路径正确

export default {
  name: 'App',
  components: {
    HelloWorld,
    SearchComponent // 注册组件
  },
  data() {
    return {
      turnstilePassed: false
    }
  },
  mounted() {
    // 动态加载 Cloudflare Turnstile 脚本
    if (!document.getElementById('cf-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
    // 注册全局回调
    window.onTurnstileSuccess = this.onTurnstileSuccess;
  },
  methods: {
    goToWebsite() {
      window.open('http://www.staggeringbeauty.com/', '_blank')
    },
    onTurnstileSuccess() {
      this.turnstilePassed = true;
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

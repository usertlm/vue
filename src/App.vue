<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="👇👇👇"/>
    <SearchComponent />
  </div>
</template>

<template>
  <div>
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
export default {
  methods: {
    goToWebsite() {
      window.open('http://www.staggeringbeauty.com/', '_blank')
    }
  }
}
</script>

<style>
.icon-link {
  cursor: pointer;
  fill: #409eff;
  transition: fill 0.3s;
}

.icon-link:hover {
  fill: #66b1ff;
}
</style>

<script>
// 引入组件
import HelloWorld from './components/HelloWorld.vue'
import SearchComponent from './components/search.vue' // 确保路径正确

export default {
  name: 'App',
  components: {
    HelloWorld,
    SearchComponent // 注册组件
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  /* 添加背景图 */
  background-image: url('@/assets/20231220_163216.jpg'); /* 确保路径正确 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>

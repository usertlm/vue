<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="👇👇👇"/>
    <SearchComponent />
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

<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="👇👇👇"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
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
  background-image: url('@/assets/20231220_163216.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>

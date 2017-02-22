<template>
  <div id="app">
    <game></game>
    <shake></shake>
    <motion></motion>
    <orientation></orientation>
  </div>
</template>

<script>
import game from './components/game.vue'
import shake from './components/shake.vue'
import orientation from './components/orientation.vue'
import motion from './components/motion.vue'

export default {
  name: 'app',
  components: {
    game,
    shake,
    orientation,
    motion
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;
  color: #2c3e50;
  margin-top: 60px;*/
}
</style>

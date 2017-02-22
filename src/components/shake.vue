<template>
  <div class="bed-shake">
    Shake: {{ shakeCount }}
  </div>
</template>

<script>
import eventBus from '../EventBus'

export default {
  name: 'shake',
  data () {
    return {
      shakeCount: 0
    }
  },
  methods: {
    shake () {
      this.shakeCount++
    }
  },
  mounted () {
    let _this = this

    eventBus.$on('notifyShake', function () {
      _this.shake()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

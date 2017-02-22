<template>
  <div class="bed-motion">
    <!-- <div>acceleration: {{ parseInt(acceleration.x) }} | {{ parseInt(acceleration.y) }} | {{ parseInt(acceleration.z) }}</div> -->
    <!-- <div>accelerationGravity: {{ parseInt(accelerationIncludingGravity.x) }} | {{ parseInt(accelerationIncludingGravity.y) }} | {{ parseInt(accelerationIncludingGravity.z) }}</div>
    <div>rotationRate: {{ parseInt(rotationRate.alpha) }} | {{ parseInt(rotationRate.beta) }} | {{ parseInt(rotationRate.gamma) }}</div> -->
  </div>
</template>

<script>
import eventBus from '../EventBus'

export default {
  name: 'motion',
  data () {
    return {
      lastShakeX: 0,
      lastShakeY: 0,
      lastShakeZ: 0,
      acceleration: {
        // x: 0,
        // y: 0,
        // z: 0
      },
      accelerationIncludingGravity: {
        // x: 0,
        // y: 0,
        // z: 0
      },
      rotationRate: {
        // alpha: 0,
        // beta: 0,
        // gamma: 0
      },
      interval: 0
    }
  },
  methods: {
    analyzeMotion () {
      const speed = 26
      let x = this.accelerationIncludingGravity.x
      let y = this.accelerationIncludingGravity.y
      let z = this.accelerationIncludingGravity.z

      if (Math.abs(x - this.lastShakeX) > speed || Math.abs(y - this.lastShakeY) > speed || Math.abs(z - this.lastShakeZ) > speed) {
        // shaked!
        eventBus.$emit('notifyShake')
      }
      this.lastShakeX = x
      this.lastShakeY = y
      this.lastShakeZ = z
    }
  },
  created () {
    let _this = this

    if (window.DeviceMotionEvent) {
      eventBus.$emit('notifyMotionSupport', true)
      // bind motion event
      window.addEventListener('devicemotion', data => {
        // console.log(data)
        _this.acceleration = data.acceleration
        _this.accelerationIncludingGravity = data.accelerationIncludingGravity
        _this.rotationRate = data.rotationRate
        _this.interval = data.interval

        _this.analyzeMotion()
      }, true)
    } else {
      // device motion not supported
      eventBus.$emit('notifyMotionSupport', false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

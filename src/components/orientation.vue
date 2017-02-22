<template>
  <div class="bed-orientation">
    <!-- <div>up or down: {{ upDown }}</div>
    <div>left or right: {{ leftRight }}</div>
    <div>x: {{ x }}</div>
    <div>y: {{ y }}</div> -->
    <!-- <div>{{ z }}</div> -->
    <!-- <div>alpha(z): {{ alpha }}</div>
    <div>beta(x): {{ beta }}</div>
    <div>gamma(y): {{ gamma }}</div> -->
  </div>
</template>

<script>
import eventBus from '../EventBus'

export default {
  name: 'orientation',
  data () {
    return {
      upDown: 0,  // -3 -- rotate heavily up, -2 -- rotate mediumly up, -1 -- rotate slightly up, 0 -- updown still, 1 -- rotate slightly down, 2 -- rotate mediumly down, 3 -- rotate heavily down
      leftRight: 0,  // -3 -- rotate heavily left, -2 -- rotate mediumly left, -1 -- rotate slightly left, 0 -- leftRight still, 1 -- rotate slightly right, 2 -- rotate mediumly right, 3 -- rotate heavily right
      x: '',
      y: '',
      z: '',
      alpha: '',
      beta: '',
      gamma: ''
    }
  },
  methods: {
    // analyze orientation based on our rules
    // NOTE: only x, y value is considered. The rule is:
    // for X
    // >= 4 degrees means rotate down, <= -4 degrees means rotate up
    // [6, 20) means rotate down slightly
    // [20, 30) means rotate down mediumly
    // >= 30 means rotate down heavily
    // rotate up is the same rule
    // for Y, it's also the same rule
    analyzeOrientation () {
      let preUpDown = 1
      let preLeftRight = 1  // means if it's up(left) or down(right)
      let stateUpDown = 0
      let stateLeftRight = 0  // means how much rotates up(left) or down(right)
      this.x > 0 ? preUpDown = 1 : preUpDown = -1
      this.y > 0 ? preLeftRight = 1 : preLeftRight = -1
      let absX = Math.abs(this.x)
      let absY = Math.abs(this.y)
      if (absX >= 30) {
        // heavily
        stateUpDown = 3
      } else if (absX >= 20) {
        // mediumly
        stateUpDown = 2
      } else if (absX >= 4) {
        // slightly
        stateUpDown = 1
      } else {
        // consider still, do nothing with state
      }
      if (absY >= 30) {
        // heavily
        stateLeftRight = 3
      } else if (absY >= 20) {
        // mediumly
        stateLeftRight = 2
      } else if (absY >= 4) {
        // slightly
        stateLeftRight = 1
      } else {
        // consider still, do nothing with state
      }

      this.upDown = preUpDown * stateUpDown
      this.leftRight = preLeftRight * stateLeftRight
      if (this.upDown < 0) {
        // rotate up
        eventBus.$emit('notifyRotateUp', { degree: absX })
        if (stateUpDown === 1) {
          // slightly
          eventBus.$emit('notifyRotateUpSlightly', { degree: absX })
        } else if (stateUpDown === 2) {
          // mediumly
          eventBus.$emit('notifyRotateUpMediumly', { degree: absX })
        } else if (stateUpDown === 3) {
          // heavily
          eventBus.$emit('notifyRotateUpHeavily', { degree: absX })
        }
      } else if (this.upDown > 0) {
        // rotate down
        eventBus.$emit('notifyRotateDown', { degree: absX })
        if (stateUpDown === 1) {
          // slightly
          eventBus.$emit('notifyRotateDownSlightly', { degree: absX })
        } else if (stateUpDown === 2) {
          // mediumly
          eventBus.$emit('notifyRotateDownMediumly', { degree: absX })
        } else if (stateUpDown === 3) {
          // heavily
          eventBus.$emit('notifyRotateDownHeavily', { degree: absX })
        }
      }

      if (this.leftRight < 0) {
        // rotate left
        eventBus.$emit('notifyRotateLeft', { degree: absY })
        if (stateLeftRight === 1) {
          // slightly
          eventBus.$emit('notifyRotateLeftSlightly', { degree: absY })
        } else if (stateLeftRight === 2) {
          // mediumly
          eventBus.$emit('notifyRotateLeftMediumly', { degree: absY })
        } else if (stateLeftRight === 3) {
          // heavily
          eventBus.$emit('notifyRotateLeftHeavily', { degree: absY })
        }
      } else if (this.leftRight > 0) {
        // rotate right
        eventBus.$emit('notifyRotateRight', { degree: absY })
        if (stateLeftRight === 1) {
          // slightly
          eventBus.$emit('notifyRotateRightSlightly', { degree: absY })
        } else if (stateLeftRight === 2) {
          // mediumly
          eventBus.$emit('notifyRotateRightMediumly', { degree: absY })
        } else if (stateLeftRight === 3) {
          // heavily
          eventBus.$emit('notifyRotateRightHeavily', { degree: absY })
        }
      }
    }
  },
  created () {
    let _this = this

    if (window.DeviceOrientationEvent) {
      eventBus.$emit('notifyOrientationSupport', true)
      // bind orientation event
      window.addEventListener('deviceorientation', data => {
        // console.log(data)
        _this.alpha = data.alpha // 0~360
        _this.beta = data.beta  // -180~180
        _this.gamma = data.gamma  // -90~90
        // ignore when device is upside down, thus fix x value into -90~90
        _this.x = parseInt(_this.beta)
        _this.x > 90 ? _this.x = 90 : _this.x
        _this.x < -90 ? _this.x = -90 : _this.x
        // set y value based on gamma
        _this.y = parseInt(_this.gamma)
        // set z value based on alpha
        _this.z = parseInt(_this.alpha)

        _this.analyzeOrientation()
      }, true)
    } else {
      // device orientation not supported
      eventBus.$emit('notifyOrientationSupport', false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

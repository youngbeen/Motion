<template>
  <div class="bed-game">
    <div class="box-playground" v-bind:style="{ width: playgroundWidth + 'px', height: playgroundHeight + 'px' }">
      <!-- draw x vertical barriers -->
      <div class="x-barrier" v-for="x in xBarriers" v-bind:style="{ width: (x.coordTo - x.coordFrom) + 'px', height: (x.rangeTo - x.rangeFrom) + 'px', left: x.coordFrom + 'px', top: x.rangeFrom + 'px' }"></div>
      <!-- draw y horizen barriers -->
      <div class="y-barrier" v-for="y in yBarriers" v-bind:style="{ width: (y.rangeTo - y.rangeFrom) + 'px', height: (y.coordTo - y.coordFrom) + 'px', top: y.coordFrom + 'px', left: y.rangeFrom + 'px' }"></div>
      <!-- draw zones -->
      <div class="zone" v-bind:class="{ 'win-zone': zone.type === 'win', 'trap-zone': zone.type === 'trap', 'coin-zone': zone.type === 'coin' }" v-for="zone in zones" v-bind:style="{ width: zone.width + 'px', height: zone.height + 'px', left: zone.left + 'px', top: zone.top + 'px' }"></div>
      <div class="ball" v-bind:style="{ left: ballLeft + 'px', top: ballTop + 'px', width: ballSize + 'px', height: ballSize + 'px', borderRadius: ballRadius + 'px' }"></div>
    </div>
    <div class="box-info">
      <button v-on:click="start()">Play</button>
      <button v-on:click="resetGame()">Reset</button>
      Score: {{ score }}  Time: {{ gameTime }}
      <!-- <span>{{ timeDiv }}</span> -->
    </div>
  </div>
</template>

<script>
import { iOS } from '../utils/device'
import eventBus from '../EventBus'
import zoneConfig from '../models/ZoneConfig'
import gameCtrl from '../controllers/BallGameCtrl'

export default {
  name: 'game',
  data () {
    return {
      isGameStarted: false,  // is game started
      score: 0,  // game score
      gameTime: 0,  // game time played or left
      tcGameTime: '',  // time ctrl of game time
      ballX: 25,  // ball dot x
      ballY: 25,  // ball dot y
      // time: 0,
      // timeDiv: '',
      totalPlayTime: 20,  // pre-config game time(s), set into 0 means infinity
      ballSize: 28,  // pre-config ball size(width = height = size)
      playgroundWidth: 350,  // pre-config playground width
      playgroundHeight: 500,  // pre-config playground height
      // NOTE: win zone MUST config before normal zones, in case multi zones collapse together
      zones: [
        // { id: 1, type: 'trap', width: 40, height: 40, left: 180, top: 155 },
        // { id: 2, type: 'win', width: 40, height: 40, left: 205, top: 455 },
        // { id: 3, type: 'coin', width: 20, height: 20, left: 15, top: 65 },
        // { id: 4, type: 'coin', width: 20, height: 20, left: 65, top: 260 },
        // { id: 5, type: 'coin', width: 20, height: 20, left: 15, top: 450 },
        // { id: 6, type: 'coin', width: 20, height: 20, left: 215, top: 115 },
        // { id: 7, type: 'coin', width: 20, height: 20, left: 315, top: 210 },
        // { id: 8, type: 'coin', width: 20, height: 20, left: 215, top: 350 }
      ],  // per-config or dynamic-config all zones, e.g. coins, traps, finish-zone etc.
      xBarriers: [
        { coordFrom: 50, coordTo: 70, rangeFrom: 50, rangeTo: 150 },
        { coordFrom: 50, coordTo: 53, rangeFrom: 200, rangeTo: 250 },
        { coordFrom: 100, coordTo: 103, rangeFrom: 50, rangeTo: 100 },
        { coordFrom: 100, coordTo: 103, rangeFrom: 250, rangeTo: 350 },
        { coordFrom: 100, coordTo: 120, rangeFrom: 400, rangeTo: 450 },
        { coordFrom: 150, coordTo: 153, rangeFrom: 150, rangeTo: 250 },
        { coordFrom: 150, coordTo: 153, rangeFrom: 300, rangeTo: 400 },
        { coordFrom: 200, coordTo: 203, rangeFrom: 0, rangeTo: 150 },
        { coordFrom: 200, coordTo: 203, rangeFrom: 200, rangeTo: 300 },
        { coordFrom: 200, coordTo: 203, rangeFrom: 350, rangeTo: 400 },
        { coordFrom: 200, coordTo: 203, rangeFrom: 450, rangeTo: 500 },
        { coordFrom: 250, coordTo: 253, rangeFrom: 50, rangeTo: 100 },
        { coordFrom: 250, coordTo: 253, rangeFrom: 150, rangeTo: 250 },
        { coordFrom: 300, coordTo: 303, rangeFrom: 0, rangeTo: 50 },
        { coordFrom: 300, coordTo: 303, rangeFrom: 100, rangeTo: 150 },
        { coordFrom: 300, coordTo: 303, rangeFrom: 350, rangeTo: 450 }
      ],  // per-config vertical barriers
      yBarriers: [
        { coordFrom: 50, coordTo: 53, rangeFrom: 50, rangeTo: 100 },
        { coordFrom: 50, coordTo: 100, rangeFrom: 150, rangeTo: 200 },
        { coordFrom: 100, coordTo: 103, rangeFrom: 100, rangeTo: 150 },
        { coordFrom: 100, coordTo: 103, rangeFrom: 200, rangeTo: 250 },
        { coordFrom: 100, coordTo: 103, rangeFrom: 300, rangeTo: 350 },
        { coordFrom: 150, coordTo: 153, rangeFrom: 250, rangeTo: 300 },
        { coordFrom: 200, coordTo: 203, rangeFrom: 50, rangeTo: 100 },
        { coordFrom: 250, coordTo: 253, rangeFrom: 50, rangeTo: 150 },
        { coordFrom: 250, coordTo: 253, rangeFrom: 300, rangeTo: 350 },
        { coordFrom: 350, coordTo: 353, rangeFrom: 50, rangeTo: 150 },
        { coordFrom: 350, coordTo: 353, rangeFrom: 250, rangeTo: 300 },
        { coordFrom: 400, coordTo: 403, rangeFrom: 150, rangeTo: 200 },
        // { coordFrom: 400, coordTo: 403, rangeFrom: 300, rangeTo: 350 },
        { coordFrom: 450, coordTo: 453, rangeFrom: 50, rangeTo: 100 },
        { coordFrom: 450, coordTo: 453, rangeFrom: 200, rangeTo: 300 }
      ]  // // per-config horizen barriers
    }
  },
  computed: {
    // real ball position, from the left side of ball square
    ballLeft () {
      return this.ballX - this.ballRadius
    },
    // real ball position, from the top side of ball square
    ballTop () {
      return this.ballY - this.ballRadius
    },
    // ball radius
    ballRadius () {
      return this.ballSize / 2
    }
  },
  methods: {
    // start game
    start () {
      let _this = this
      this.score = 0
      if (this.totalPlayTime) {
        // configed total play time, using count down
        this.gameTime = this.totalPlayTime
      } else {
        // infinity playing
        this.gameTime = 0
      }
      this.isGameStarted = true

      this.tcGameTime = setInterval(function () {
        if (_this.totalPlayTime) {
          // configed total play time, using count down
          _this.gameTime--
          if (_this.gameTime <= 0) {
            // time runs out, game over
            _this.loseGame()
          }
        } else {
          // infinity playing
          _this.gameTime++
        }
      }, 1000)
    },

    resetGame () {
      this.isGameStarted = false
      this.score = 0
      this.gameTime = 0
      this.ballX = 25
      this.ballY = 25
      this.zones = zoneConfig.zones.slice(0)
    },

    winGame () {
      this.endGame()
      window.alert('You win')
    },

    loseGame () {
      this.endGame()
      window.alert('Game over')
    },

    // end game
    endGame () {
      this.isGameStarted = false
      clearInterval(this.tcGameTime)
    },

    addCoin () {
      this.score += 10
    },

    removeZone (zoneId) {
      for (let i = 0; i < this.zones.length; i++) {
        if (zoneId === this.zones[i].id) {
          // find the target zone, remove it
          this.zones.splice(i, 1)
          break
        }
      }
    },

    // check all zones under
    checkZones () {
      let underZones = gameCtrl.checkZones(this.ballX, this.ballY, this.zones)

      if (underZones && underZones.length) {
        // find underzones, take care of all underzones
        underZones.forEach(zone => {
          if (zone.type === 'win') {
            // finish zone
            this.winGame()
          } else if (zone.type === 'trap') {
            // trap zone
            this.loseGame()
          } else if (zone.type === 'coin') {
            // coin zone
            this.addCoin()
            this.removeZone(zone.id)
          }
        })
      } else {
        // no underzone found, do nothing
      }
    },

    // check interval time between 2 events
    checkTime () {
      let now = new Date()
      now = now.getTime()
      if (this.time) {
        this.timeDiv = now - this.time
      }
      this.time = now
    },

    moveUp (length) {
      if (this.isGameStarted) {
        const fromY = this.ballY
        let targetY = this.ballY - length
        let barrierBlockY = gameCtrl.findBlock('v', fromY, targetY, this.ballX, this.ballSize, this.xBarriers, this.yBarriers)
        if (barrierBlockY !== '') {
          targetY = barrierBlockY + this.ballRadius
        }
        targetY - this.ballRadius < 0 ? this.ballY = this.ballRadius : this.ballY = targetY

        this.checkZones()
      }
    },
    moveDown (length) {
      if (this.isGameStarted) {
        const fromY = this.ballY
        let targetY = this.ballY + length
        let barrierBlockY = gameCtrl.findBlock('v', fromY, targetY, this.ballX, this.ballSize, this.xBarriers, this.yBarriers)
        if (barrierBlockY !== '') {
          targetY = barrierBlockY - this.ballRadius
        }
        targetY + this.ballRadius > this.playgroundHeight ? this.ballY = this.playgroundHeight - this.ballRadius : this.ballY = targetY

        this.checkZones()
      }
    },
    moveLeft (length) {
      if (this.isGameStarted) {
        const fromX = this.ballX
        let targetX = this.ballX - length
        let barrierBlockX = gameCtrl.findBlock('h', fromX, targetX, this.ballY, this.ballSize, this.xBarriers, this.yBarriers)
        if (barrierBlockX !== '') {
          targetX = barrierBlockX + this.ballRadius
        }
        targetX - this.ballRadius < 0 ? this.ballX = this.ballRadius : this.ballX = targetX

        this.checkZones()
      }
    },
    moveRight (length) {
      if (this.isGameStarted) {
        const fromX = this.ballX
        let targetX = this.ballX + length
        let barrierBlockX = gameCtrl.findBlock('h', fromX, targetX, this.ballY, this.ballSize, this.xBarriers, this.yBarriers)
        if (barrierBlockX !== '') {
          targetX = barrierBlockX - this.ballRadius
        }
        targetX + this.ballRadius > this.playgroundWidth ? this.ballX = this.playgroundWidth - this.ballRadius : this.ballX = targetX

        this.checkZones()
      }
    }
  },
  created () {
    this.resetGame()
  },
  mounted () {
    let _this = this

    eventBus.$on('notifyRotateUp', params => {
      // _this.checkTime()
      let moveLength = 0
      if (iOS) {
        moveLength = params.degree / 2
      } else {
        moveLength = parseInt(params.degree / 1.5)
      }
      _this.moveUp(moveLength)
    })
    eventBus.$on('notifyRotateDown', params => {
      // _this.checkTime()
      let moveLength = 0
      if (iOS) {
        moveLength = params.degree / 2
      } else {
        moveLength = parseInt(params.degree / 1.5)
      }
      _this.moveDown(moveLength)
    })
    eventBus.$on('notifyRotateLeft', params => {
      // _this.checkTime()
      let moveLength = 0
      if (iOS) {
        moveLength = params.degree / 2
      } else {
        moveLength = parseInt(params.degree / 1.5)
      }
      _this.moveLeft(moveLength)
    })
    eventBus.$on('notifyRotateRight', params => {
      // _this.checkTime()
      let moveLength = 0
      if (iOS) {
        moveLength = params.degree / 2
      } else {
        moveLength = parseInt(params.degree / 1.5)
      }
      _this.moveRight(moveLength)
    })
    // eventBus.$on('notifyRotateUpSlightly', )
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box-playground {
  position: relative;
  /*width: 600px;
  height: 600px;*/
  /*margin: 30px;*/
  border: 1px solid gray;
}

.ball {
  position: absolute;
  /*left: 294px;
  top: 294px;
  width: 24px;
  height: 24px;
  border-radius: 12px;*/

  background-color: red;
}

.x-barrier {
  position: absolute;
  /*width: 1px;*/
  /*border: 1px solid black;*/
  background-color: black;
}

.y-barrier {
  position: absolute;
  /*height: 1px;*/
  /*border: 1px solid black;*/
  background-color: black;
}

.zone {
  position: absolute;
}

.win-zone {
  background-color: rgb(61,167,11);
}

.trap-zone {
  background-color: rgb(227,69,48);
}

.coin-zone {
  border-radius: 15px;
  background-color: rgb(248,252,48);
}
</style>

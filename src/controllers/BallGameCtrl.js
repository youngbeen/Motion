// import some relies

export default {
  // 校验是否已经进入某个设定区域 -- 当前位置点x, 当前位置点y, 所有存在的区域参数
  checkZones (x, y, zones) {
    x = x || 0
    y = y || 0
    zones = zones || []
    if (x || y) {
      let underZones = []
      zones.forEach(zone => {
        if (this.inZone(x, y, zone)) {
          // 发现了处于位置下的区域
          underZones.push(zone)
        }
      })
      return underZones
    } else {
      // 非法参数
      return ''
    }
  },

  // 寻找第一个阻挡障碍物并返回其对应位置 -- 移动类型('h' - 水平，'v' - 垂直), 起始位置, 结束位置, 另一个维度的位置，移动物本身尺寸, 所有x障碍物, 所有y障碍物
  findBlock (moveType, from, to, coordLine, size, xBarriers, yBarriers) {
    from = from || 0
    to = to || 0
    coordLine = coordLine || 0
    xBarriers = xBarriers || []
    yBarriers = yBarriers || []
    if ((from || to) && size) {
      const radius = size / 2
      if (moveType === 'h') {
        // 水平移动
        let barriersOnRoute = this.getBarriersOnRoute(from, to, coordLine, radius, xBarriers)
        let barriersOverhead = this.getBarriersOverhead(from, to, coordLine, radius, yBarriers)
        let nearestBarrierOnRoute = ''
        let nearestBarrierOverhead = ''
        if (barriersOnRoute && barriersOnRoute.length) {
          nearestBarrierOnRoute = barriersOnRoute[0]
        }
        if (barriersOverhead && barriersOverhead.length) {
          nearestBarrierOverhead = barriersOverhead[0]
        }
        if (nearestBarrierOnRoute && nearestBarrierOverhead) {
          // 路径上同时存在阻挡障碍跟挤压障碍，返回最近的一个
          if (from > to) {
            // 往左移动
            return Math.max(nearestBarrierOnRoute.coordTo, nearestBarrierOverhead.rangeTo)
          } else {
            // 往右移动
            return Math.min(nearestBarrierOnRoute.coordFrom, nearestBarrierOverhead.rangeFrom)
          }
        } else if (nearestBarrierOnRoute) {
          // 只存在阻挡障碍
          if (from > to) {
            // 往左移动
            return nearestBarrierOnRoute.coordTo
          } else {
            // 往右移动
            return nearestBarrierOnRoute.coordFrom
          }
        } else if (nearestBarrierOverhead) {
          // 只存在挤压障碍
          if (from > to) {
            // 往左移动
            return nearestBarrierOverhead.rangeTo
          } else {
            // 往右移动
            return nearestBarrierOverhead.rangeFrom
          }
        } else {
          // 无障碍
          return ''
        }
      } else if (moveType === 'v') {
        // 垂直移动
        let barriersOnRoute = this.getBarriersOnRoute(from, to, coordLine, radius, yBarriers)
        let barriersOverhead = this.getBarriersOverhead(from, to, coordLine, radius, xBarriers)
        let nearestBarrierOnRoute = ''
        let nearestBarrierOverhead = ''
        if (barriersOnRoute && barriersOnRoute.length) {
          nearestBarrierOnRoute = barriersOnRoute[0]
        }
        if (barriersOverhead && barriersOverhead.length) {
          nearestBarrierOverhead = barriersOverhead[0]
        }
        if (nearestBarrierOnRoute && nearestBarrierOverhead) {
          // 路径上同时存在阻挡障碍跟挤压障碍，返回最近的一个
          if (from > to) {
            // 往上移动
            return Math.max(nearestBarrierOnRoute.coordTo, nearestBarrierOverhead.rangeTo)
          } else {
            // 往下移动
            return Math.min(nearestBarrierOnRoute.coordFrom, nearestBarrierOverhead.rangeFrom)
          }
        } else if (nearestBarrierOnRoute) {
          // 只存在阻挡障碍
          if (from > to) {
            // 往上移动
            return nearestBarrierOnRoute.coordTo
          } else {
            // 往下移动
            return nearestBarrierOnRoute.coordFrom
          }
        } else if (nearestBarrierOverhead) {
          // 只存在挤压障碍
          if (from > to) {
            // 往上移动
            return nearestBarrierOverhead.rangeTo
          } else {
            // 往下移动
            return nearestBarrierOverhead.rangeFrom
          }
        } else {
          // 无障碍
          return ''
        }
      } else {
        // 非法move type，不处理
        return ''
      }
    } else {
      // 非法参数，不处理
      return ''
    }
  },

  // 寻找所有处于移动路径上的障碍物，返回的数组按照近->远排列 -- 移动起始点，移动结束点，另一个维度的位置，移动物半径，路径上所有可能的障碍物
  getBarriersOnRoute (from, to, coordLine, radius, barriers) {
    let fixedTo = 0
    let barriersOnRoute = []
    if (from > to) {
      // 往左或者往上移动，此时终点位置范围必须额外考虑半径
      fixedTo = to - radius
      barriers.forEach(item => {
        if (this.inRange(item.coordTo, from, fixedTo) && this.inRange(coordLine, item.rangeFrom - radius, item.rangeTo + radius)) {
          // 发现了阻挡的障碍
          barriersOnRoute.push(item)
        }
      })
      // 排序路径上发现的障碍，此时应该从大到小排列
      barriersOnRoute.sort(function (a, b) { return b.coordTo - a.coordTo })
    } else {
      // 往右或者往下移动，此时终点位置范围必须额外考虑半径
      fixedTo = to + radius
      barriers.forEach(item => {
        if (this.inRange(item.coordFrom, from, fixedTo) && this.inRange(coordLine, item.rangeFrom - radius, item.rangeTo + radius)) {
          // 发现了阻挡的障碍
          barriersOnRoute.push(item)
        }
      })
      // 排序路径上发现的障碍，此时应该从小到大排列
      barriersOnRoute.sort(function (a, b) { return a.coordFrom - b.coordFrom })
    }
    return barriersOnRoute
  },

  // 寻找移动途中会挤压移动点本身的障碍物，返回的数组按照近->远排列 -- 移动起始点，移动结束点，另一个维度的位置，移动物半径，所有可能挤压的障碍物
  getBarriersOverhead (from, to, coordLine, radius, barriers) {
    let fixedTo = 0
    let barriersOverhead = []
    if (from > to) {
      // 往左或者往上移动，此时终点位置范围必须额外考虑半径
      fixedTo = to - radius
      barriers.forEach(item => {
        // if ((this.inRange(item.coordFrom, coordLine - radius, coordLine + radius) || this.inRange(item.coordTo, coordLine - radius, coordLine + radius)) && this.inRange(item.rangeTo, from, fixedTo)) {
        if (this.crossRange(item.coordFrom, item.coordTo, coordLine - radius, coordLine + radius) && this.inRange(item.rangeTo, from, fixedTo)) {
          // 发现了阻挡的挤压障碍
          barriersOverhead.push(item)
        }
      })
      // 排序路径上发现的障碍，此时应该从大到小排列
      barriersOverhead.sort(function (a, b) { return b.rangeTo - a.rangeTo })
    } else {
      // 往右或者往下移动，此时终点位置范围必须额外考虑半径
      fixedTo = to + radius
      barriers.forEach(item => {
        // if ((this.inRange(item.coordFrom, coordLine - radius, coordLine + radius) || this.inRange(item.coordTo, coordLine - radius, coordLine + radius)) && this.inRange(item.rangeFrom, from, fixedTo)) {
        if (this.crossRange(item.coordFrom, item.coordTo, coordLine - radius, coordLine + radius) && this.inRange(item.rangeFrom, from, fixedTo)) {
          // 发现了阻挡的挤压障碍
          barriersOverhead.push(item)
        }
      })
      // 排序路径上发现的障碍，此时应该从小到大排列
      barriersOverhead.sort(function (a, b) { return a.rangeFrom - b.rangeFrom })
    }
    return barriersOverhead
  },

  // 判断某个位置是否处于某个区域中 -- 要判断的位置x， 要判断的位置y， 区域参数
  inZone (x, y, zone) {
    x = x || 0
    y = y || 0
    if (zone && zone.left !== undefined && zone.top !== undefined && zone.width && zone.height) {
      if ((x >= zone.left && x <= zone.left + zone.width) && (y >= zone.top && y <= zone.top + zone.height)) {
        // 在区域中
        return true
      } else {
        // 不在区域中
        return false
      }
    } else {
      // 非法参数
      return false
    }
  },

  // 判断某个位置是否在某个范围内 -- 要判断的位置，范围的边界，范围的另一个边界, 是否允许包含正好在边界的情况（默认不允许）
  inRange (pos, side1, side2, isOnSide) {
    pos = pos || 0
    side1 = side1 || 0
    side2 = side2 || 0
    isOnSide = isOnSide || false
    if (side1 || side2) {
      let to = Math.max(side1, side2)
      let from = Math.min(side1, side2)
      if (pos > from && pos < to) {
        // 处于范围内
        return true
      } else {
        if (isOnSide && (pos === from || pos === to)) {
          // 在边界上并且允许包含处于边界的情况
          return true
        } else {
          // 不在范围内
          return false
        }
      }
    } else {
      // 非法参数，返回false
      return false
    }
  },

  // 判断某个区间是否与另外一个区间重叠 -- 区域1起始位置，区域1结束位置，区域2起始位置，区域2结束位置
  crossRange (r1From, r1To, r2From, r2To) {
    r1From = r1From || 0
    r1To = r1To || 0
    r2From = r2From || 0
    r2To = r2To || 0
    if ((r1From || r1To) && (r2From || r2To)) {
      if (r1To > r2From && r1From < r2To) {
        return true
      } else {
        return false
      }
    } else {
      // 非法参数，返回false
      return false
    }
  }
}

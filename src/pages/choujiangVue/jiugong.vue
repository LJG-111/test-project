<!-- 九宫格抽奖 -->
<template>
  <div class="draw-page">
    <h2 class="page-title">🎁 九宫格抽奖</h2>
    <div class="wrapper">
      <!-- 九宫格 -->
      <div class="grid-wrap" ref="gridWrap">
        <div class="grid-3x3">
          <div
            v-for="(item, i) in state.prizeList"
            :key="i"
            class="cell"
            :class="{ active: currentIndex === i }"
          >
            <img v-if="item.pic" :src="item.pic" alt="" />
            <span class="cell-name">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <!-- 抽奖按钮 -->
      <button
        class="draw-btn"
        :class="{ running: state.isRunning }"
        :disabled="state.isRunning"
        @click="start"
      >
        {{ state.isRunning ? '抽奖中...' : '开始抽奖' }}
      </button>

      <!-- 剩余次数 -->
      <div class="tip-text">剩余次数：{{ state.times }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'jiugongDraw',
  data() {
    return {
      state: {
        prizeList: [
          { name: '手机',     pic: 'https://mercrt-fd.zol-img.com.cn//t_s640x2000/g7/M00/07/07/ChMkLGZyXuqIUoA0AAWYPe2i5ZQAAfejgE-e08ABZhV571.png' },
          { name: '手表',     pic: 'https://img1.baidu.com/it/u=2631716577,1296460670&fm=253&fmt=auto&app=120&f=JPEG' },
          { name: '苹果',     pic: 'https://img2.baidu.com/it/u=2611478896,137965957&fm=253&fmt=auto&app=138&f=JPEG' },
          { name: '棒棒糖',   pic: 'https://img2.baidu.com/it/u=576980037,1655121105&fm=253&fmt=auto&app=138&f=PNG' },
          { name: '娃娃',     pic: 'https://img2.baidu.com/it/u=4075390137,3967712457&fm=253&fmt=auto&app=138&f=PNG' },
          { name: '木马',     pic: 'https://img1.baidu.com/it/u=2434318933,2727681086&fm=253&fmt=auto&app=120&f=JPEG' },
          { name: '德芙',     pic: 'https://img0.baidu.com/it/u=1378564582,2397555841&fm=253&fmt=auto&app=120&f=JPEG' },
          { name: '玫瑰',     pic: 'https://img1.baidu.com/it/u=1125656938,422247900&fm=253&fmt=auto&app=120&f=JPEG' },
          { name: '谢谢参与', pic: '' }
        ],
        isRunning: false,
        prizeId: 0,
        times: 5
      },
      currentIndex: -1,
      _timer: null
    }
  },
  beforeDestroy() {
    if (this._timer) {
      clearTimeout(this._timer)
      this._timer = null
    }
  },
  methods: {
    start() {
      if (this.state.isRunning) return
      if (this.state.times <= 0) {
        this.$message && this.$message.warning('抽奖次数已用完！')
        return
      }
      try {
        this.state.isRunning = true
        this.state.times--
        this.state.prizeId = Math.floor(Math.random() * this.state.prizeList.length)

        const timeline = this.buildTimeline(this.state.prizeId)
        let step = 0
        const runNext = () => {
          if (step >= timeline.length) {
            this.state.isRunning = false
            // 先弹中奖消息，再延迟 2.5s 清除高亮（让用户看清）
            this.$message && this.$message.success(
              this.state.prizeId === 8
                ? '😅 谢谢参与，下次好运！'
                : '🎊 恭喜抽到【' + this.state.prizeList[this.state.prizeId].name + '】！'
            )
            this._timer = setTimeout(() => {
              this.currentIndex = -1
              this._timer = null
            }, 2500)
            return
          }
          const node = timeline[step]
          this.currentIndex = node.index
          step++
          this._timer = setTimeout(runNext, node.delay)
        }
        runNext()
      } catch (e) {
        console.error('抽奖出错:', e)
        this.state.isRunning = false
        this.currentIndex = -1
        this.$message && this.$message.error('抽奖出错了，请重试')
      }
    },

    buildTimeline(prizeId) {
      const timeline = []
      let idx = 0

      // Phase 1: 加速 200→62ms
      const accel = [200, 175, 155, 135, 118, 102, 88, 76, 68, 62]
      for (let i = 0; i < accel.length; i++) {
        timeline.push({ delay: accel[i], index: idx % 9 })
        idx++
      }

      // Phase 2: 匀速 60ms，跑 2 圈
      for (let i = 0; i < 18; i++) {
        timeline.push({ delay: 60, index: idx % 9 })
        idx++
      }

      // Phase 3: 减速 72→280ms，精确停在 prizeId
      const ramp = [72, 90, 110, 135, 160, 190, 220, 250, 280]
      const stepsToPrize = (prizeId - (idx % 9) + 9) % 9
      const phase3Total = stepsToPrize + 9
      for (let i = 0; i < phase3Total; i++) {
        const delay = ramp[Math.min(i, ramp.length - 1)]
        timeline.push({ delay: delay, index: idx % 9 })
        idx++
      }

      // Phase 4: 定格中奖位置 1.5s
      timeline.push({ delay: 1500, index: prizeId })
      return timeline
    }
  }
}
</script>

<style lang="css" scoped>
.draw-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
}

.page-title {
  font-size: 22px;
  color: #303133;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0;
  margin-top: -12px;
}

.grid-wrap {
  width: 420px;
  height: 420px;
  margin-bottom: 24px;
}

.grid-3x3 {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 10px;
  background: #303133;
  padding: 10px;
  border-radius: 16px;
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.25),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  box-sizing: border-box;
}

.cell {
  background: linear-gradient(145deg, #fff8e1, #ffe0b2);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.12s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.cell img {
  width: 55%;
  height: 50%;
  object-fit: contain;
  display: block;
  margin-bottom: 4px;
}

.cell-name {
  font-size: 13px;
  color: #303133;
  font-weight: 600;
  text-align: center;
}

.cell.active {
  background: linear-gradient(145deg, #ffd54f, #ff8f00);
  transform: scale(1.06);
  box-shadow:
    0 0 0 3px #ff6f00,
    0 0 20px rgba(255, 143, 0, 0.7),
    0 4px 14px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.cell.active .cell-name {
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.draw-btn {
  width: 180px;
  height: 56px;
  border: none;
  border-radius: 28px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(145deg, #ff5722, #d84315);
  box-shadow:
    0 6px 18px rgba(255, 87, 34, 0.45),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
  letter-spacing: 4px;
}

.draw-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 10px 24px rgba(255, 87, 34, 0.55),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.draw-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.draw-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.draw-btn.running {
  background: linear-gradient(145deg, #8d6e63, #5d4037);
}

.tip-text {
  font-size: 14px;
  color: #606266;
  margin-top: 12px;
}
</style>

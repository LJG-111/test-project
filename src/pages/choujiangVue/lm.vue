<!-- 老虎机抽奖 -->
<template>
  <div class="draw-page">
    <h2 class="page-title">🎰 老虎机抽奖</h2>

    <div class="wrapper">
      <div class="slot-machine">
        <!-- 视窗：3 列 × 3 行 -->
        <div class="slot-window">
          <div class="slot-reel" v-for="(reel, rIdx) in reels" :key="rIdx">
            <div class="reel-strip" :style="stripStyle(rIdx)">
              <div
                class="reel-item"
                v-for="(sym, i) in reel.symbols"
                :key="i"
                :class="{ highlight: isResult && i === centerRows[rIdx] }"
              >{{ sym }}</div>
            </div>
          </div>
        </div>

        <div class="slot-bottom">
          剩余次数：<b>{{ state.times }}</b>
        </div>
      </div>

      <button
        class="draw-btn"
        :class="{ running: state.isRunning }"
        :disabled="state.isRunning"
        @click="start"
      >
        {{ state.isRunning ? '抽奖中...' : '开始抽奖' }}
      </button>
    </div>
  </div>
</template>

<script>
const ICONS = ['🍒', '🍋', '🍊', '⭐', '💎', '7️⃣', '🔔']
const VISIBLE_ROWS = 3                  // 视窗可见行数
const TOTAL_ROWS = ICONS.length * 3     // 21：滚动取模周期，且是符号循环长度的整数倍
const STRIP_ROWS = TOTAL_ROWS + VISIBLE_ROWS + 1 // 25：条带只需比周期多几行
const MIN_TRAVEL = TOTAL_ROWS * 2       // 至少转 2 圈
const DURATIONS = [1800, 2200, 2600]    // 三列依次停下
const WIN_RATE = 0.35                   // 三列的预设概率

export default {
  name: 'slotMachine',
  data() {
    return {
      state: { isRunning: false, times: 5 },
      reels: [],
      centerRows: [-1, -1, -1],
      isResult: false
    }
  },
  created() {
    this._tracks = null
    this._rafId = null
    this._hlTimer = null
  },
  mounted() {
    this.initReels()
  },
  beforeDestroy() {
    if (this._rafId) cancelAnimationFrame(this._rafId)
    if (this._hlTimer) clearTimeout(this._hlTimer)
  },
  methods: {
    initReels() {
      const reels = []
      for (let r = 0; r < 3; r++) {
        const symbols = []
        for (let i = 0; i < STRIP_ROWS; i++) {
          symbols.push(ICONS[i % ICONS.length])
        }
        reels.push({
          symbols,
          rowPos: Math.floor(Math.random() * TOTAL_ROWS) // 整行，三列基准一致
        })
      }
      this.reels = reels
    },

    stripStyle(rIdx) {
      const reel = this.reels[rIdx]
      const row = reel ? reel.rowPos : 0
      // 用百分比位移：相对条带自身高度，自动跟随 rem 根字号缩放
      return {
        transform: `translateY(-${(row / STRIP_ROWS) * 100}%)`
      }
    },

    start() {
      if (this.state.isRunning) return
      if (this.state.times <= 0) {
        this.$message && this.$message.warning('抽奖次数已用完！')
        return
      }

      this.state.isRunning = true
      this.state.times--

      if (this._hlTimer) {
        clearTimeout(this._hlTimer)
        this._hlTimer = null
      }
      this.isResult = false
      this.centerRows = [-1, -1, -1]

      // 预设结果
      const forceWin = Math.random() < WIN_RATE
      const winIdx = Math.floor(Math.random() * ICONS.length)
      const results = [0, 1, 2].map(() =>
        forceWin ? winIdx : Math.floor(Math.random() * ICONS.length)
      )

      // 每列：起点 → 终点（终点保证中奖符号落在视窗中间行）
      const now = performance.now()
      this._tracks = this.reels.map((reel, i) => {
        let centerRow = results[i]
        while (centerRow - 1 - reel.rowPos < MIN_TRAVEL) {
          centerRow += ICONS.length
        }
        return {
          start: reel.rowPos,
          target: centerRow - 1, // 整数行，落点必然对齐
          duration: DURATIONS[i],
          startTime: now,
          done: false
        }
      })

      if (this._rafId) cancelAnimationFrame(this._rafId)
      this._tick()
    },

    _tick() {
      const tracks = this._tracks
      if (!tracks) return

      const now = performance.now()
      let allDone = true

      tracks.forEach((tr, i) => {
        if (tr.done) return

        const t = Math.min(1, (now - tr.startTime) / tr.duration)
        // easeInOutCubic：起步加速、收尾长时间减速
        const e = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2

        let pos
        if (t >= 1) {
          pos = tr.target
          tr.done = true
        } else {
          pos = tr.start + (tr.target - tr.start) * e
          allDone = false
        }

        // 位移对周期取模：条带始终只在一个周期内滚动，不会滚出内容区
        this.reels[i].rowPos = ((pos % TOTAL_ROWS) + TOTAL_ROWS) % TOTAL_ROWS
      })

      if (allDone) {
        this._finishSpin()
      } else {
        this._rafId = requestAnimationFrame(this._tick)
      }
    },

    _finishSpin() {
      const tracks = this._tracks
      this._tracks = null
      this._rafId = null

      // 精确落到整行（取模后画面等价，21 行是符号周期的整数倍）
      this.reels.forEach((reel, i) => {
        const target = tracks && tracks[i] ? tracks[i].target : reel.rowPos
        reel.rowPos = ((Math.round(target) % TOTAL_ROWS) + TOTAL_ROWS) % TOTAL_ROWS
      })

      // 视窗中间行 = rowPos + 1
      this.centerRows = this.reels.map(reel => reel.rowPos + 1)
      this.isResult = true
      this.state.isRunning = false

      const syms = this.centerRows.map((row, i) => this.reels[i].symbols[row])
      const win = syms[0] === syms[1] && syms[1] === syms[2]

      if (this.$message) {
        if (win) {
          this.$message.success('🎊 恭喜抽到【' + syms[0] + '】！')
        } else {
          this.$message.info('😅 差一点：' + syms.join(' ') + '，再来一次！')
        }
      }

      // 高亮保留 2.5s
      this._hlTimer = setTimeout(() => {
        this.isResult = false
        this.centerRows = [-1, -1, -1]
        this._hlTimer = null
      }, 2500)
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
  background: radial-gradient(circle at 50% 30%, #2d1b4e 0%, #150a26 70%);
}

.page-title {
  font-size: 24px;
  color: #ffd700;
  margin-bottom: 20px;
  flex-shrink: 0;
  letter-spacing: 4px;
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
}

.wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

/* ===== 机箱 ===== */
.slot-machine {
  padding: 18px 18px 12px;
  border-radius: 22px;
  background: linear-gradient(160deg, #4a4a55 0%, #2c2c34 45%, #1b1b21 100%);
  box-shadow:
    0 0 0 3px #6a6a78,
    0 0 0 6px #23232a,
    0 14px 40px rgba(0, 0, 0, 0.65),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  margin-bottom: 26px;
}

/* ===== 视窗：3 列 × 3 行 ===== */
.slot-window {
  width: 270px;
  height: 270px;
  display: flex;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background: #08080a;
  box-sizing: border-box;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.9);
}

/* 分隔线用绝对定位覆盖，不占用列宽，保证每列内容宽度严格 90px */
.slot-window::before,
.slot-window::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #1f1f27;
  z-index: 6;
  pointer-events: none;
}

.slot-window::before { left: 33.3333%; }
.slot-window::after  { left: 66.6667%; }

.slot-reel {
  flex: 0 0 90px;
  width: 90px;
  height: 270px;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
}

.reel-strip {
  display: flex;
  flex-direction: column;
  /* 不加 will-change：避免条带被提成合成层后远处瓦片不绘制 */
}

.reel-item {
  flex: 0 0 90px; /* 关键：禁止被压缩 */
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  line-height: 1;
  color: #fff;
  box-sizing: border-box;
  background: #08080a;
}

.reel-item.highlight {
  background: linear-gradient(180deg, rgba(255, 215, 0, 0.38), rgba(255, 160, 0, 0.22));
  animation: winPulse 0.6s ease-in-out infinite alternate;
}

@keyframes winPulse {
  from { box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.35); }
  to   { box-shadow: inset 0 0 28px rgba(255, 215, 0, 0.8); }
}

/* ===== 底部计数 ===== */
.slot-bottom {
  margin-top: 12px;
  text-align: center;
  font-size: 14px;
  color: #b9b9c6;
  letter-spacing: 1px;
}

.slot-bottom b {
  color: #ffd700;
}

/* ===== 按钮 ===== */
.draw-btn {
  width: 200px;
  height: 58px;
  border: none;
  border-radius: 29px;
  font-size: 19px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  letter-spacing: 4px;
  background: linear-gradient(145deg, #ff5a26, #b33000);
  box-shadow:
    0 6px 20px rgba(255, 69, 0, 0.45),
    inset 0 2px 4px rgba(255, 255, 255, 0.25);
  transition: transform 0.2s, box-shadow 0.2s;
}

.draw-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 10px 28px rgba(255, 69, 0, 0.55),
    inset 0 2px 4px rgba(255, 255, 255, 0.25);
}

.draw-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.draw-btn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.draw-btn.running {
  background: linear-gradient(145deg, #6b6b6b, #3d3d3d);
  box-shadow: none;
}
</style>

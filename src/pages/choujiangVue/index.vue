<!-- 转盘抽奖 -->
<template>
  <div class="draw-page">
    <h2 class="page-title">🎉 幸运大转盘</h2>
    <div class="lucky-wrapper">
      <div
        class="container"
        ref="dadBox"
        :style="containerStyle"
      >
        <div
          class="prize-list"
          ref="prizeWrap"
          :style="prizeWrapStyle"
        >
          <div
            class="prize-item"
            v-for="(item, index) in state.prizeList"
            :key="index"
            :style="prizeItemStyle(index)"
          >
            <img :src="item.pic" alt="" />
            <p>{{ item.name }}</p>
          </div>
        </div>
        <div class="btn" @click="start">
          <span class="btn-text">抽奖</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rotaryDraw',
  data() {
    return {
      state: {
        prizeList: [
          { name: '手机', pic: 'https://mercrt-fd.zol-img.com.cn//t_s640x2000/g7/M00/07/07/ChMkLGZyXuqIUoA0AAWYPe2i5ZQAAfejgE-e08ABZhV571.png' },
          { name: '手表', pic: 'https://img1.baidu.com/it/u=2631716577,1296460670&fm=253&fmt=auto&app=120&f=JPEG' },
          { name: '苹果', pic: 'https://img2.baidu.com/it/u=2611478896,137965957&fm=253&fmt=auto&app=138&f=JPEG' },
          { name: '棒棒糖', pic: 'https://img2.baidu.com/it/u=576980037,1655121105&fm=253&fmt=auto&app=138&f=PNG' },
          { name: '娃娃', pic: 'https://img2.baidu.com/it/u=4075390137,3967712457&fm=253&fmt=auto&app=138&f=PNG' },
          { name: '木马', pic: 'https://img1.baidu.com/it/u=2434318933,2727681086&fm=253&fmt=auto&app=120&f=JPEG' },
          { name: '德芙', pic: 'https://img0.baidu.com/it/u=1378564582,2397555841&fm=253&fmt=auto&app=120&f=JPEG' },
          { name: '玫瑰', pic: 'https://img1.baidu.com/it/u=1125656938,422247900&fm=253&fmt=auto&app=120&f=JPEG' }
        ],
        isRunning: false,
        baseRunAngle: 360 * 5,
        prizeId: 0
      },
      containerSize: 500,
      // 防抖 timer
      _resizeTimer: null
    }
  },
  computed: {
    containerStyle() {
      return {
        width: this.containerSize + 'px',
        height: this.containerSize + 'px'
      }
    },
    radius() {
      return this.containerSize / 2 - 10
    },
    rotateAngle() {
      return 360 / this.state.prizeList.length
    },
    totalRunAngle() {
      return this.state.baseRunAngle + 360
        - this.state.prizeId * this.rotateAngle
        - this.rotateAngle / 2
    },
    bgColorStr() {
      const colors = ['#FFE499', '#FF8181']
      const len = this.state.prizeList.length
      let val = ''
      for (let i = 0; i < len; i++) {
        val += `${colors[i % 2]} ${this.rotateAngle * i}deg ${this.rotateAngle * (i + 1)}deg,`
      }
      return `background: conic-gradient(${val.slice(0, -1)});`
    },
    prizeWrapStyle() {
      return {
        background: this.bgColorStr.replace('background: ', '').replace(';', ''),
        transform: `rotate(-${this.rotateAngle / 2}deg)`
      }
    },
    prizeItemStyle() {
      const deg = this.rotateAngle
      const R = this.radius
      return (i) => {
        const innerW = 2 * R * Math.sin((deg / 2) * Math.PI / 180)
        // 扇形高度 = 从转盘中心到边缘 = containerSize/2（正好到中心）
        return {
          width: innerW + 'px',
          height: (this.containerSize / 2) + 'px',
          transform: `rotate(${deg * i + deg / 2}deg)`,
          // 转盘中心 = containerSize/2 = 扇形高度 → 底边即中心
          transformOrigin: '50% 100%'
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.calcSize()
      this.initPrizeWrap()
    })
    // resize 加防抖，避免连续抖动
    this._onResize = this._debounce(this.calcSize, 150)
    window.addEventListener('resize', this._onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this._onResize)
    if (this.$refs.prizeWrap) {
      this.$refs.prizeWrap.removeEventListener('transitionend', this._onEnd)
    }
    if (this._resizeTimer) clearTimeout(this._resizeTimer)
  },
  methods: {
    // 简易防抖
    _debounce(fn, delay) {
      let timer = null
      return (...args) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          fn.apply(this, args)
        }, delay)
      }
    },

    // 动态计算容器尺寸
    calcSize() {
      // 旋转期间禁止重算（防止 $message 触发 resize → 转盘重算 → 抖动）
      if (this.state.isRunning) return

      const wrapper = this.$el.querySelector('.lucky-wrapper')
      if (!wrapper) return

      const padding = 60
      const availW = wrapper.offsetWidth - padding
      const availH = wrapper.offsetHeight - 80
      let size = Math.min(availW, availH)
      size = Math.max(280, Math.min(900, size))

      // 只有尺寸变化超过 2px 才更新，避免微小抖动
      if (Math.abs(size - this.containerSize) < 2) return

      this.containerSize = size
      this.$nextTick(() => {
        this.initPrizeWrap()
      })
    },

    initPrizeWrap() {
      const deg = this.rotateAngle
      if (this.$refs.prizeWrap) {
        this.$refs.prizeWrap.style.cssText = `
          ${this.bgColorStr}
          transform: rotate(-${deg / 2}deg);
          transition: none;
        `
      }
    },

    getRandomNum() {
      return Math.floor(Math.random() * this.state.prizeList.length)
    },

    start() {
      if (!this.state.isRunning) {
        this.getPrize()
      }
    },

    getPrize() {
      this.state.isRunning = true
      this.state.prizeId = this.getRandomNum()
      this.startRun()
    },

    startRun() {
      this.$refs.prizeWrap.style.cssText = `
        ${this.bgColorStr}
        transform: rotate(${this.totalRunAngle}deg);
        transition: transform 4s cubic-bezier(0.17, 0.67, 0.35, 1);
      `
      // 只监听 transform 属性的 transitionend，防止其他 transition 冒泡干扰
      this.$refs.prizeWrap.addEventListener('transitionend', this._onEnd, { once: true })
    },

    _onEnd(e) {
      // 只响应 transform 属性的结束事件，忽略其他
      if (e.propertyName !== 'transform') return
      this.stopRun()
    },

    stopRun() {
      this.state.isRunning = false
      this.$refs.prizeWrap.style.cssText = `
        ${this.bgColorStr}
        transform: rotate(${this.totalRunAngle - this.state.baseRunAngle}deg);
        transition: none;
      `
      // 延迟一点再弹窗，避免 transitionend 后立即触发 resize
      setTimeout(() => {
        this.$message.success(
          `🎊 恭喜你抽到【${this.state.prizeList[this.state.prizeId].name}】！`
        )
      }, 50)
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
  /* 防止任何溢出导致滚动条 */
  overflow: hidden;
}

.page-title {
  font-size: 22px;
  color: #303133;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.lucky-wrapper {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0; /* 关键：允许 flex 子元素正确收缩 */
}

/* ====== 转盘主体 ====== */
.container {
  position: relative;
}

.prize-list {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 10px solid #98d3fc;
  box-shadow:
    0 0 40px rgba(64, 158, 255, 0.4),
    inset 0 0 20px rgba(255, 255, 255, 0.5);
  overflow: hidden;
  position: relative;
}

.prize-item {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.prize-item img {
  width: 50%;
  max-width: 90px;
  height: 36%;
  margin-top: 25%;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.15));
  flex-shrink: 0;
}

.prize-item p {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
  margin-top: 4px;
  white-space: nowrap;
}

/* ====== 中心抽奖按钮 ====== */
.btn {
  width: 18%;
  height: 18%;
  min-width: 80px;
  min-height: 80px;
  max-width: 160px;
  max-height: 160px;
  background: linear-gradient(145deg, #ff9a9e, #fad0c4);
  border-radius: 50%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 6px 20px rgba(255, 129, 129, 0.5),
    inset 0 2px 6px rgba(255, 255, 255, 0.6);
  transition: transform 0.2s;
  z-index: 10;
}

.btn:hover {
  transform: scale(1.08);
}

.btn:active {
  transform: scale(0.95);
}

.btn::before {
  content: "";
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 24px solid #ff6b6b;
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  filter: drop-shadow(0 -1px 2px rgba(0, 0, 0, 0.2));
}

.btn-text {
  font-size: clamp(16px, 4vw, 32px);
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 2px;
}
</style>

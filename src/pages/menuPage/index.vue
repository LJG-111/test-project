<template>
  <div class="layout-wrapper">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapse: isCollapse }">
      <div class="logo-area">
        <i class="el-icon-s-home logo-icon"></i>
        <span class="logo-text" v-show="!isCollapse">功能演示中心</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="nav-menu"
        background-color="#1f2d3d"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :collapse="isCollapse"
        router
      >
        <el-menu-item index="/menuPage/echarts">
          <i class="el-icon-data-line"></i>
          <span slot="title">图表可视化</span>
        </el-menu-item>

        <el-menu-item index="/mapVue">
          <i class="el-icon-location-outline"></i>
          <span slot="title">地图展示</span>
        </el-menu-item>

        <el-menu-item index="/outLine">
          <i class="el-icon-map-location"></i>
          <span slot="title">轮廓地图</span>
        </el-menu-item>

        <el-submenu index="ui">
          <template slot="title">
            <i class="el-icon-picture-outline-round"></i>
            <span slot="title">UI 组件</span>
          </template>
          <el-menu-item index="/selectVue">
            <i class="el-icon-select"></i>
            <span slot="title">选择器</span>
          </el-menu-item>
          <el-menu-item index="/elCascader">
            <i class="el-icon-share"></i>
            <span slot="title">级联选择</span>
          </el-menu-item>
          <el-menu-item index="/tvVue">
            <i class="el-icon-monitor"></i>
            <span slot="title">TV 大屏</span>
          </el-menu-item>
        </el-submenu>

        <el-submenu index="media">
          <template slot="title">
            <i class="el-icon-files"></i>
            <span slot="title">媒体处理</span>
          </template>
          <el-menu-item index="/imgVue">
            <i class="el-icon-picture"></i>
            <span slot="title">图片处理</span>
          </el-menu-item>
          <el-menu-item index="/txtVue">
            <i class="el-icon-document"></i>
            <span slot="title">文本处理</span>
          </el-menu-item>
        </el-submenu>

        <el-menu-item index="/aiVue">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">AI 助手</span>
        </el-menu-item>

        <el-submenu index="choujiang">
          <template slot="title">
            <i class="el-icon-present"></i>
            <span slot="title">抽奖活动</span>
          </template>
          <el-menu-item index="/menuPage/choujiang/zhuanpan">
            <i class="el-icon-cpu"></i>
            <span slot="title">转盘抽奖</span>
          </el-menu-item>
          <el-menu-item index="/menuPage/choujiang/jiugong">
            <i class="el-icon-s-grid"></i>
            <span slot="title">九宫格抽奖</span>
          </el-menu-item>
          <el-menu-item index="/menuPage/choujiang/lm">
            <i class="el-icon-video-play"></i>
            <span slot="title">老虎机抽奖</span>
          </el-menu-item>
        </el-submenu>

        <el-divider class="menu-divider" v-show="!isCollapse"></el-divider>

        <el-submenu index="test" v-show="!isCollapse">
          <template slot="title">
            <i class="el-icon-s-tools"></i>
            <span slot="title">测试页面</span>
          </template>
          <el-menu-item index="/page1">
            <i class="el-icon-document-copy"></i>
            <span slot="title">测试页 1</span>
          </el-menu-item>
          <el-menu-item index="/page2">
            <i class="el-icon-document-copy"></i>
            <span slot="title">测试页 2</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <!-- 主区域 -->
    <div class="main-wrapper">
      <!-- 顶部导航栏 -->
      <div class="top-bar">
        <div class="top-bar-left">
          <i
            class="el-icon-s-fold collapse-btn"
            :class="{ 'is-expand': isCollapse }"
            @click="toggleCollapse"
          ></i>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/menuPage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="top-bar-right">
          <el-tooltip content="刷新" placement="bottom">
            <i class="el-icon-refresh action-icon" @click="refreshPage"></i>
          </el-tooltip>
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" icon="el-icon-user-solid"></el-avatar>
              <span class="username">Admin</span>
              <i class="el-icon-arrow-down"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="settings">系统设置</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <router-view v-if="!$route.meta.keepAlive" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      menuMap: {
        '/menuPage': '首页',
        '/menuPage/echarts': '图表可视化',
        '/echarts': '图表可视化',
        '/mapVue': '地图展示',
        '/outLine': '轮廓地图',
        '/selectVue': '选择器',
        '/elCascader': '级联选择',
        '/tvVue': 'TV 大屏',
        '/imgVue': '图片处理',
        '/txtVue': '文本处理',
        '/aiVue': 'AI 助手',
        '/menuPage/choujiang/zhuanpan': '转盘抽奖',
        '/menuPage/choujiang/jiugong': '九宫格抽奖',
        '/menuPage/choujiang/lm': '老虎机抽奖',
        '/page1': '测试页 1',
        '/page2': '测试页 2'
      }
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path
    },
    currentTitle() {
      return this.menuMap[this.$route.path] || ''
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    refreshPage() {
      this.$router.go(0)
    },
    handleCommand(cmd) {
      switch (cmd) {
        case 'profile':
          this.$message.info('个人中心 - 开发中')
          break
        case 'settings':
          this.$message.info('系统设置 - 开发中')
          break
        case 'logout':
          this.$confirm('确定退出登录？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message.success('已退出登录')
          }).catch(() => {})
          break
      }
    }
  },
  mounted() {
    // 默认进入首页子路由
    if (this.$route.path === '/menuPage') {
      this.$router.push('/menuPage/echarts')
    }
  }
}
</script>

<style scoped>
.layout-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  overflow: hidden;
}

/* ============ 侧边栏 ============ */
.sidebar {
  width: 220px;
  background: #1f2d3d;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.sidebar.collapse {
  width: 64px;
}

.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #1a2634;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #2d3e50;
  overflow: hidden;
}

.logo-icon {
  font-size: 26px;
  color: #409EFF;
}

.logo-text {
  white-space: nowrap;
}

.nav-menu {
  flex: 1;
  border-right: none !important;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 0;
}

.nav-menu::-webkit-scrollbar {
  width: 6px;
}

.nav-menu::-webkit-scrollbar-thumb {
  background: #3a4b5e;
  border-radius: 3px;
}

.nav-menu .el-menu-item,
.nav-menu .el-submenu__title {
  height: 50px;
  line-height: 50px;
}

.nav-menu .el-menu-item i,
.nav-menu .el-submenu__title i {
  font-size: 18px;
  margin-right: 10px;
}

.menu-divider {
  margin: 10px 16px;
  border-color: #2d3e50;
}

/* ============ 主区域 ============ */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f0f2f5;
  min-width: 0;
}

/* ============ 顶部栏 ============ */
.top-bar {
  height: 60px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 10;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  font-size: 22px;
  cursor: pointer;
  color: #606266;
  transition: color 0.3s;
}

.collapse-btn:hover {
  color: #409EFF;
}

.collapse-btn.is-expand {
  transform: rotate(180deg);
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.action-icon {
  font-size: 18px;
  cursor: pointer;
  color: #606266;
  transition: color 0.3s;
}

.action-icon:hover {
  color: #409EFF;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 4px;
  transition: background 0.3s;
}

.user-info:hover {
  background: #f5f7fa;
}

.username {
  color: #303133;
  font-size: 14px;
}

/* ============ 内容区 ============ */
.content-area {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  min-height: 0; /* 允许 flex 子元素正确收缩 */
}
</style>

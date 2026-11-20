<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  //自己测试
  created() {
    window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
  },

  methods: {
    beforeunloadFn(e) {
      sessionStorage.setItem('reload','false');
    },
  }

}
</script>
<style>
@import '@/assets/css/global.css';
</style>

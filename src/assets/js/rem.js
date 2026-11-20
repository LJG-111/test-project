// 基准文字⼤⼩
const BASESIZE = 16
//设置稿的宽度
const WIDTH = 1920
// 设置 rem 函数
function setRem() {
  // 当前页⾯宽度相对于 宽度 比如 375 宽的缩放⽐例，可根据⾃⼰需要修改，针对最大 375 的情况。
  let scale = document.documentElement.clientWidth / WIDTH
  // 设置页⾯根节点字体⼤⼩
  document.documentElement.style.fontSize = (BASESIZE * scale) + 'px'
}
// 初始化
setRem()
// 改变窗⼝⼤⼩时重新设置 rem
window.onresize = function () {
  setRem()
}

import Vue from 'vue'
let files = require.context('./', false, /\.vue$/)


files.keys().forEach(file => {
   let module = files(file).default
    Vue.component(`my-${module.name || file.replace('./', '').replace('.vue', '')}`, module)
})
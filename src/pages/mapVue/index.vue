<template>
    <div class="dashboard-editor-container">
        <div class="map_data" id="map_my" :style="{ width: `1920px`, height: `880px` }">
        </div>
    </div>
</template>
  
  <script>
import AMapLoader from '@amap/amap-jsapi-loader';
let Map = null;
export default {
    name: 'newmap',
    data() {
        return {
            Map: null,//地图对象
        }
    },
    created() {
        window._AMapSecurityConfig = {
            securityJsCode: '0213c784e13dfd07b859c78ea0b57e60',
        }

        AMapLoader.load({
            "key": "b6397fc52a8bd5f7781d46846dea0c33",// 申请好的Web端开发者Key，首次调用 load 时必填
            "version": "2.0",// 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            // "plugins": ["AMap.Scale","AMap.ToolBar","AMap.AutoComplete","AMap.PlaceSearch","AMap.ControlBar","AMap.MouseTool"],// 需要使用的的插件列表，如比例尺'AMap.Scale'等
        }).then((AMap) => {
            Map = new AMap.Map('map_my', {
                mapStyle: 'amap://styles/darkblue', //设置地图的显示样式        zoom: 13,//设置初始化级别
                zooms: [5, 30], //设置缩放级别范围 10-15 级
                center: [120.2052342, 30.2489634],//中心点
            });
            console.log('Map', Map);
            // 鼠标点击获取经纬度
            Map.on('click', function (e) {
                console.log("经度", e.lnglat.getLng())
                console.log("纬度", e.lnglat.getLat())
            });
        }).catch(e => {
            console.log(e);
        })
    },
    mounted() {
    },

    methods: {}
}
</script>
  
  <style lang="scss" scoped>
  </style>
  <style>
/* 隐藏高德logo  */
.amap-logo {
    display: none !important;
}

/* 隐藏高德版权  */
.amap-copyright {
    display: none !important;
}
</style>
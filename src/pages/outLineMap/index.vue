<template>
    <div class="box">
        <div id="map" />
        <div id="overlay-box"></div>
        <!-- 悬浮时的元素 -->
        <div id="popup" class="ol-popup">
            <div id="popup-content" class="popup-content"></div>
        </div>
    </div>
</template>
<script>
import 'ol/ol.css'
import XYZ from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Map, View, Feature } from 'ol'
import { Style, Fill, Icon, Text } from 'ol/style'
import { Point } from 'ol/geom'
import Overlay from "ol/Overlay";


export default {
    data() {
        return {
            map: null,//地图对象
            mapView: null,//地图配置
            // 瓦片引入地址 nginx
            // mapUrl: `http://127.0.0.1:9098/tiles/{z}/{x}/{y}.png`
            // 瓦片本地引入 瓦片等级越高加载编译越慢
            // 在 public 下新建 tiles 文件夹，将下好的瓦片放进去
            mapUrl: `tiles/{z}/{x}/{y}.png`,
            pointLayer: {},
            // 弹窗对象
            overlay: null,
        }
    },
    mounted() {
        this.initMap();
        let data = [
            {
                name: '123',
                coordinate: [119.54279491027831, 28.236430593705687]
            },
            {
                name: '456',
                coordinate: [120.05426981588826, 28.435938234579908]
            },
            {
                name: '789',
                coordinate: [119.91662943502888, 28.464765840309568]
            }
        ]
        data.map(i => {
            this.addPoints(i)
        })
    },
    methods: {
        // 初始化地图
        initMap() {
            this.mapView = {
                logo: 'false',
                zoom: 10, // 初始缩放级别
                minZoom: 9, // 最小缩放级别
                maxZoom: 10, // 最大缩放级别
                center: [119.923327, 28.473783],
                projection: 'EPSG:4326',
                constrainResolution: true,  // 设置缩放级别为整数 
                smoothResolutionConstraint: false,  // 关闭无级缩放地图
            }
            const tileLayer = new TileLayer({
                source: new XYZ({
                    url: this.mapUrl,
                    // 使用滤镜 将白色修改为深色 不需要删除即可
                    tileLoadFunction: (imageTile, src) => {
                        let img = new Image();
                        // img.crossOrigin = ''
                        // 设置图片不从缓存取，从缓存取可能会出现跨域，导致加载失败
                        img.setAttribute('crossOrigin', 'anonymous');
                        (img.onload = () => {
                            let canvas = document.createElement('canvas');
                            let w = img.width;
                            let h = img.height;
                            canvas.width = w;
                            canvas.height = h;
                            let context = canvas.getContext('2d');
                            context.filter =
                                'grayscale(98%) invert(100%) sepia(20%) hue-rotate(180deg) saturate(1600%) brightness(80%) contrast(90%)';
                            context.drawImage(img, 0, 0, w, h, 0, 0, w, h);
                            imageTile.getImage().src = canvas.toDataURL('image/png');
                        }),
                            (img.onerror = () => {
                                // imageTile.getImage().src = require('@/assets/logo.png');
                            });
                        img.src = src;
                    }
                })
            })
            this.map = null
            this.map = new Map({
                layers: [tileLayer],
                view: new View(this.mapView),
                target: 'map' // 将地图注入到 dom 元素中，此处写 dom id
            });
            // 添加弹窗
            this.addPopup();

            let that = this;
            //鼠标点击获取经纬度
            this.map.on('singleclick', (evt) => {
                console.log('coorTo4326', evt);
                that.addPoints(evt)
            });


        },
        //打点
        addPoints(data) {
            if (Object.keys(this.pointLayer).length == 0) {
                // 创建图层
                this.pointLayer = new VectorLayer({
                    source: new VectorSource(),
                });
                // 图层添加到地图上
                this.map.addLayer(this.pointLayer);
            }

            // 创建feature要素，一个feature就是一个点坐标信息
            const feature = new Feature({
                geometry: new Point(data.coordinate),
                self: data //可以存储一些数据表示 用来做悬浮或者点击时的标识
            });
            // 设置要素的图标
            feature.setStyle(
                new Style({
                    // 设置图片效果
                    image: new Icon({
                        src: "https://smart-garden-manage.oss-cn-chengdu.aliyuncs.com/shexiangtou.png",
                        // anchor: [0.5, 0.5],
                        scale: 0.6,
                    }),
                })
            );
            // 要素添加到地图图层上
            this.pointLayer.getSource().addFeature(feature);

            // 设置文字信息
            // this.addText(coordinate);
        },
        //设置文字信息
        addText(coordinate) {
            const overlayBox = document.getElementById("overlay-box"); //获取一个div
            const oSpan = document.createElement("span"); //创建一个span
            oSpan.style.color = 'white'
            oSpan.contentEditable = false; //设置文字是否可编辑
            oSpan.id = coordinate[0]; //创建一个id
            let pText = document.createTextNode("摄像头" + coordinate[0].toFixed(2)); //创建span的文本信息
            oSpan.appendChild(pText); //将文本信息添加到span
            overlayBox.appendChild(oSpan); //将span添加到div中
            let textInfo = new Overlay({
                position: coordinate, //设置位置
                element: document.getElementById(coordinate[0]),
                offset: [-45, 30], //设置偏移 第一个 左右 第二个 上下
            });
            this.map.addOverlay(textInfo);
        },
        // 添加弹窗
        addPopup(evt, evtFeature) {
            // 使用变量存储弹窗所需的 DOM 对象
            var container = document.getElementById("popup");
            var closer = document.getElementById("popup-closer");
            var content = document.getElementById("popup-content");

            // 创建一个弹窗 Overlay 对象
            this.overlay = new Overlay({
                element: container, //绑定 Overlay 对象和 DOM 对象的
                autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
                autoPanAnimation: {
                    duration: 250, //自动平移效果的动画时间 9毫秒
                },
            });
            // 将弹窗添加到 map 地图中
            this.map.addOverlay(this.overlay);
            let _that = this;
            /**
             * 添加单击响应函数来处理弹窗动作 pointermove
             */
            this.map.on("pointermove", async (evt) => {
                //判断鼠标是否悬停在要素上
                let feature = evtFeature
                    ? evtFeature
                    : this.map.forEachFeatureAtPixel(
                        evt.pixel,
                        function (feature, layer) {
                            return feature;
                        }
                    );
                // 如果要素 存在且有数据
                if (feature != undefined && feature.values_.self) {
                    // 改变鼠标样式
                    _that.map.getTargetElement().style.cursor = "pointer";
                    //拿数据
                    const data = feature.values_.self;
                    // 画弹窗样式
                    const contentHtml = `<div class='map-tip-box' >
                            <div>设备号：${data.name}</div>
                        </div>`;
                    content.innerHTML = contentHtml;
                    content.style.display = "block";
                    // content.style.left = evt.pixel[0] - 120 + "px";
                    // content.style.top = evt.pixel[1] - 120 + "px";
                    _that.overlay.setPosition(evt.coordinate);
                } else {
                    //鼠标没有悬停在要素上
                    _that.map.getTargetElement().style.cursor = "auto";
                    content.style.display = "none";
                    _that.overlay.setPosition(undefined);
                }
            });
        },
    }
}
</script>
  
<style scoped>
.box {
    height: 100%;
    width: 100%;
}

#map {
    width: 100%;
    height: 100%;
    position: absolute;
}
</style>
<style>
.map-tip-box {
    padding: 10px;
    border-radius: 5px;
    background: rgb(27, 45, 55);
    color: white;
    font-size: 14px;
    margin-left: 10px;
    position: relative;
    bottom: 30px;
}
</style>
  
  
  
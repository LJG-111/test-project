<template>
    <!--  地图 -->
    <div class="map-box">
        <div class="map" ref="mapBox"></div>
    </div>
</template>
<script>
import map_json from '@/assets/mapData/henan.json'
export default {
    name: 'maps',
    props: {
        mapData: {
            type: Array,
            default: () => { [] }
        },
        mapStyle: {
            type: Object,
            default: () => ({
                geo: null,//额外样式设置
                callBack: () => { },//鼠标移入地图或者地图上的柱子的回调
                type: null,//是否单独设置柱子的颜色
                click: false//是否需要地图的点击事件
            })
        }
    },
    data() {
        return {
            options: null,//地图配置项
            lonlat: {},//用来设置柱子
            echarts: null,//用来存储当前图标实例
            index: -1,
            mTime: null,//计时器
        }
    },
    watch: {
        mapData() {
            this.setOptions();
        }
    },
    mounted() {
        this.setOptions();
    },
    methods: {
        //获取数据并开始配置地图
        setOptions() {
            const { features } = map_json;

            features.map((v) => {
                this.lonlat[v.properties.name] = v.properties.cp;
            });

            echarts.registerMap("myMap", map_json);
            var chart = echarts.init(this.$refs.mapBox);

            if (chart) this.charts = chart;//保存实例

            chart.clear(); // 清空画布

            let opt = this.setMapOptions(
                this.mapData,
                this.mapStyle.geo,
                this.mapStyle.callBack
            );
            chart.setOption(opt, true);
            this.setBar(chart, this.mapData, this.mapStyle.type);
            if (this.mapStyle.click) {
                chart.on("click", (params) => {
                    this.$emit("mapclick", params);
                });
            }
        },
        //设置地图里的配置项目
        setMapOptions(data, geo, callBack) {
            this.mapActive();
            this.mouseEvents();

            var options = {
                tooltip: {
                    show: true,
                    trigger: "item",
                    borderColor: "rgba(0,0,0,0)",
                    backgroundColor: "rgba(0,0,0,0)",
                    shadowColor: "transparent",
                    formatter: function (params) {
                        //移到某个地图块的回调函数
                        if (callBack && params.componentSubType == "map") {
                            return callBack(params);
                        }
                        //移到某个地图块柱子上的回调函数
                        if (callBack && params.componentSubType == "bar" && (geo && geo.barFun)) {
                            return callBack(params, geo.barFun);
                        }
                    },
                    position: "top",
                },
                geo: {
                    map: "myMap",
                    show: true,
                    zlevel: 1,
                    zoom: geo && geo["setPosition"] && geo["zoom"] ? geo["zoom"] : 1.2,
                    roam: false,
                    aspectScale: 1.3,
                    left: "center",
                    top: geo && geo["setPosition"] && geo["top"] ? geo["top"] : "20%",
                    silent: true,
                    label: {
                        emphasis: {
                            show: false,
                        },
                    },
                    itemStyle: {
                        // 图形的样式
                        normal: {
                            borderColor: "rgba(42, 172, 176, 1)",
                            borderWidth: $fun.setRem(1),
                            color: "rgba(7,77,101,1)",
                            shadowBlur: $fun.setRem(10),
                            shadowColor: "rgba(12,62,78,1)",
                            shadowOffsetY: $fun.setRem(10),
                        },
                    },
                },

                grid: [],
                xAxis: [],
                yAxis: [],

                series: [
                    // 上层
                    {
                        type: "map",
                        map: "myMap",
                        show: true,
                        zlevel: 3,
                        z: 1,
                        roam: false,
                        zoom: geo && geo["setPosition"] && geo["zoom"] ? geo["zoom"] : 1.2, // 放大
                        aspectScale: 1.3, // 长宽比
                        left: "center",
                        top: geo && geo["setPosition"] && geo["top"] ? geo["top"] : "20%",
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: $fun.setRem(12),//字体大小
                                    fontWeight: 'bold',
                                    color: '#fff'//字体颜色
                                }
                            },
                            emphasis: {
                                show: true
                            },
                        },
                        itemStyle: {
                            // 图形的样式
                            normal: {
                                borderWidth: $fun.setRem(1.5),
                                borderColor: "rgba(92, 229, 248, 0.8)",
                                areaColor: "rgba(7,77,101,0)",
                                shadowBlur: $fun.setRem(6),
                                shadowColor: "rgba(92, 229, 248, 0.8)",
                            },
                            emphasis: {
                                show: true,
                                areaColor: '#3066ba', //鼠标滑过区域颜色
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'//鼠标经过字体颜色
                                    }
                                }
                            }
                        },
                        data: data,
                    },
                ],
            };
            return options;
        },
        // set柱状图
        setBar(chart, data, type) {
            var option = chart.getOption();
            var max = 0;
            data.forEach((v, i) => {
                if (v.value && v.value > max) {
                    max = v.value * 1;
                }
            });
            data = data || [];
            if (data) {
                var color = {};
                data.forEach((v, i) => {
                    color = this.judgeBarColor(v, type);
                    var geoCoord = this.lonlat[v.name];
                    if (v.x) {
                        geoCoord[0] = geoCoord[0] - 0.1;
                    }
                    var position = chart.convertToPixel(
                        {
                            seriesIndex: 0,
                        },
                        geoCoord
                    );
                    option.grid.push({
                        width: $fun.setRem(30),
                        height: $fun.setRem(85),
                        left: position[0] - $fun.setRem(45),
                        top: position[1] - $fun.setRem(76),
                        zlevel: 3,
                        z: 5,
                    });
                    option.xAxis.push({
                        gridIndex: i,
                        show: false,
                        zlevel: 3,
                        z: 5,
                        type: "category",
                        data: ["1"],
                    });
                    option.yAxis.push({
                        gridIndex: i,
                        show: false,
                        zlevel: 3,
                        z: 5,
                        type: "value",
                        max: max,
                    });
                    // 上底
                    option.series.push({
                        name: v.name || "",
                        yAxisIndex: i,
                        xAxisIndex: i,
                        type: "pictorialBar",
                        barMinHeight: $fun.setRem(20),
                        symbolSize: [$fun.setRem(20), $fun.setRem(8)],
                        symbolOffset: [0, $fun.setRem(-4)],
                        symbolPosition: "end",
                        zlevel: 3,
                        z: 6,
                        label: {
                            normal: {
                                show: true,
                                position: "top",
                                fontSize: $fun.setRem(20),
                                color: color.fontColor,
                            },
                        },
                        color: color.fontColor,
                        data: [v.value ? v.value * 1 : ""],
                    });
                    // 下底内
                    option.series.push({
                        name: v.name || "",
                        yAxisIndex: i,
                        xAxisIndex: i,
                        type: "pictorialBar",
                        symbolSize: [$fun.setRem(20), $fun.setRem(8)],
                        symbolOffset: [0, $fun.setRem(4)],
                        zlevel: 3,
                        z: 5,
                        itemStyle: {
                            normal: {
                                color: "transparent",
                                borderColor: color.border,
                                borderType: "solid",
                                borderWidth: $fun.setRem(1.5),
                            },
                        },
                        data: [v.value ? v.value * 1 : ""],
                    });
                    // 下底外
                    option.series.push({
                        name: v.name || "",
                        yAxisIndex: i,
                        xAxisIndex: i,
                        type: "pictorialBar",
                        symbolSize: [$fun.setRem(34), $fun.setRem(14)],
                        symbolOffset: [0, $fun.setRem(7)],
                        zlevel: 3,
                        z: 5,
                        itemStyle: {
                            normal: {
                                color: "transparent",
                                borderColor: color.border,
                                borderType: "solid",
                                borderWidth: $fun.setRem(1),
                            },
                        },
                        data: [v.value ? v.value * 1 : ""],
                    });
                    // 柱子
                    option.series.push({
                        name: v.name || "",
                        type: "bar",
                        yAxisIndex: i,
                        xAxisIndex: i,
                        barWidth: $fun.setRem(20),
                        barMinHeight: $fun.setRem(20),
                        zlevel: 3,
                        z: 5,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: color.backTop,
                                    },
                                    {
                                        offset: 1,
                                        color: color.backBot,
                                    },
                                ]),
                            },
                        },
                        data: [v.value ? v.value * 1 : ""],
                    });
                });
            }
            chart.setOption(option, true);
        },
        // 柱状图颜色判断
        judgeBarColor(v, type) {
            var color = null;
            if (v.x) {
                if (type === 1) {
                    color = {
                        fontColor: "#F8D800",//上方文字和顶部的颜色
                        border: "#F8D800",//下面2个圆圈的颜色
                        backTop: "rgba(255,165,0,0.9)",//柱子的上半部颜色
                        backBot: "rgba(245,222,179,0.5)",//柱子的下半部颜色
                    }
                }
            } else {
                color = {
                    fontColor: "#2effff",
                    border: "#09f6ff",
                    backTop: "rgba(60,213,219,0.9)",
                    backBot: "rgba(2,92,118,0.5)",
                }
            }
            return color;
        },
        //设置自动轮播
        mapActive() {
            let data = this.mapData.filter(v => !v.x);
            let dataLength = data.length - 1;

            // 用定时器控制高亮
            this.mTime = setInterval(() => {

                // 清除之前的高亮
                this.charts.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: this.index
                });
                this.index++;
                // 当前下标高亮
                this.charts.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: this.index
                });
                this.charts.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    dataIndex: this.index
                });
                if (this.index > dataLength) {
                    this.index = -1;
                }
            }, 2000);
        },
        //鼠标移入移出
        mouseEvents() {
            // 鼠标划入
            this.charts.on('mouseover', () => {
                // 停止定时器，清除之前的高亮
                clearInterval(this.mTime);
                this.mTime = '';
                this.charts.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: this.index
                });
            });
            // 鼠标划出重新定时器开始
            this.charts.on('mouseout', () => {
                this.mapActive();
            });
        }
    }
}
</script>
<style scoped>
.map-box,
.map {
    height: 100%;
    width: 100%;
}
</style>
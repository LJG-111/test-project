<template>
    <div class="dad">
        <!-- <div class="echarts-dad">
            <my-echarts :options="options" @click="echartsClick"></my-echarts>
        </div> -->
        <div class="dad-map">
            <my-maps :mapData="mapData" :mapStyle="mapStyle" @mapclick="mapClick"></my-maps>
        </div>
    </div>
</template>

<script>
import setOptions from './echarts'
export default {
    data() {
        return {
            message: '我是哈哈哈哈3',
            options: null,
            mapData: [
                { name: '宁陵县', value: 30 },
                { name: '柘城县', value: 10 },
                { name: '民权县', value: 20 },
                { name: '睢县', value: 15 },
                { name: '梁园区', value: 10 },
                { name: '睢阳区', value: 20 },
                { name: '虞城县', value: 15 },
                { name: '夏邑县', value: 20 },
                { name: '永城市', value: 10 },
                { name: '宁陵县', value: 10, x: true },
                { name: '柘城县', value: 5, x: true },
                { name: '民权县', value: 10, x: true },
                { name: '睢县', value: 10, x: true },
                { name: '梁园区', value: 5, x: true },
                { name: '睢阳区', value: 10, x: true },
                { name: '虞城县', value: 8, x: true },
                { name: '夏邑县', value: 10, x: true },
                { name: '永城市', value: 5, x: true }
            ],//地图数据
            mapStyle: {
                type: 1,
                click: true,
                callBack: (data) => {
                    let html = '';
                    html += `<div class="tip">
                             <p>地区：${data.name}；</p>
                             <p class="green">常驻人口：${data.data.value}百万；</p>
                             <p class="yellow">流动人口：${data.value - data.data.value}百万；</p>
                         </div>`
                    return html;
                }
            }
        }
    },
    mounted() {
        this.test({name:'小黑子',sex:'男',data:{a:1,b:2}},'2')
        this.options = setOptions.pie_huan([40, 30, 20, 30]);
    },
    methods: {
        test({name,sex,data},yes){
           console.log(name,sex,data,yes);
        },
        echartsClick(data) {
            console.log('data', data)
        },
        mapClick(date) {
            console.log('点击地图', date)
        }
    }
}
</script>

<style scoped>
.dad {
    display: flex;
    height: 100%;
    width: 100%;
}

.echarts-dad {
    height: 400px;
    width: 500px;
    background-color: black;
}

.dad-map {
    height: 100%;
    width: 100%;
    background-color: black;
}
</style>
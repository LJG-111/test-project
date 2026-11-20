<template>
    <div class="progress-box">
        <!-- 上方气泡字体 -->
        <div>
            <span class="pop-text" :style="{ color: popData.color, left: popData.size + '%' }">{{ popData.text }}</span>
        </div>
        <!-- 中间颜色分布 -->
        <div class="color-box">
            <template v-for="i in colorArr">
                <div class="color-item" :style="{ background: i.color }"></div>
            </template>
        </div>
        <!-- 下方数字 -->
        <div class="num-box">
            <div v-for="i in progressArr" :key="i.num">{{ i.num }}</div>
            <span class="finally-text">300</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'progresss',
    props: {
        //数据总条数
        num: {
            type: Number,
            default: 230
        },
    },
    data() {
        return {
            //颜色数组
            colorArr: [{
                color: 'aqua',
            }, {
                color: 'red',
            }, {
                color: 'pink',
            }, {
                color: 'yellow',
            }, {
                color: 'blue',
            }, {
                color: 'orange',
            }],
            // 下方表格数据数组
            progressArr: [{
                num: 0,
                color: 'aqua',
                text: '差'
            }, {
                num: 50,
                color: 'red',
                text: '良'
            }, {
                num: 100,
                color: 'pink',
                text: '好'
            }, {
                num: 150,
                color: 'yellow',
                text: '优'
            }, {
                num: 200,
                color: 'blue',
                text: '美'
            }, {
                num: 250,
                color: 'orange',
                text: '棒'
            },],
            //悬浮窗数据
            popData: {
                size: 0,
                text: '差',
                color: 'aqua'
            }
        }
    },
    mounted() {
        this.setColrrAndSize();
    },
    methods: {
        //获取当前每页条数
        setColrrAndSize() {
            let length = this.progressArr.length,
                progressArr = this.progressArr,
                num = this.num,
                index = 0;
            this.popData.size = (num / 300).toFixed(4) * 100;
            for (let i = 1; i < length; i++) {
                if (i == length - 1 && num > progressArr[i].num) {
                    index = i;
                    this.popData.size = 99;
                } else if (num < progressArr[i].num && num >= progressArr[i - 1].num) {
                    index = i - 1;
                }
            }
            this.popData.text = progressArr[index].text;
            this.popData.color = progressArr[index].color;
            console.log('xxxxxxxxx', this.popData);
        },
    }
}

</script>
<style scoped>
.progress-box {
    height: 400px;
    width: 100%;
}

.pop-text {
    position: relative;
}

.color-box {
    display: flex;
    align-items: center;
    height: 20px;
    width: 100%;
}

.color-box .color-item {
    width: calc(100% / 6);
    height: 100%;
}

.num-box {
    display: flex;
    align-items: center;
    position: relative;
}

.num-box div {
    width: calc(100% / 6);
}

.num-box div:not(:first-child) {
    position: relative;
    right: 10px;
}

.num-box .finally-text{
    position: absolute;
    right: 0.2%;
}
</style>
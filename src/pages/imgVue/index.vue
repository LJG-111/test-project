<template>
    <div class="img-vue">
        <div class="img-box">
            <el-image v-for="(item, index) in nowImgData" :key="index" class="imgs" :src="item" :preview-src-list="nowImgData">
            </el-image>
        </div>
        <my-pagination :total="total" class="img-pagination" @callBack="callBack"></my-pagination>
    </div>
</template>
<script>
import imgArr from '@/assets/js/imgArr';
import db from '../../assets/js/indexDbSet'
export default {
    name: 'tvVue',
    data() {
        return {
            imgArr: null,//所有的图片数据
            imgData: null,//分组处理过的图片数据
            nowImgData: null,//当前图片数据
            total: null,//总共有多少页
        }
    },
    mounted() {
        this.processingData();
        // this.article = this.myData;
        db.dbInit();
        // db.deleteDb('dbname');
        // db.add();
        db.readAll().then(res => {
            console.log('所有数据', res);
        })
        db.read().then(res => {
            console.log('查找数据', res);
        })
    },
    methods: {
        //处理数据 改成自己想要的
        processingData() {
            this.imgArr = imgArr.split(',');
            this.imgData = this.spArr(this.imgArr, 12);
            this.total = this.imgArr.length;
            this.nowImgData = this.imgData[0];
        },
        //分页器的回调函数
        callBack(page) {
            $fun.loading();
            this.nowImgData = this.imgData[page.page - 1];
            setTimeout(() => {
                $fun.loadingClose();
            }, 800);
        },
        //分割数组
        //arr是你要分割的数组，num是以几个为一组
        spArr(arr, num = 1) {
            let newArr = [];
            for (let i = 0; i < arr.length;) {
                newArr.push(arr.slice(i, i += num));
            }
            return newArr
        }
    }
}
</script>
<style scoped>
.img-vue {
    height: 100%;
    width: 100%;
}

.img-box {
    padding-top: 20px;
    height: 90vh;
    width: 100%;
    box-sizing: border-box;
}

.imgs {
    height: 300px;
    width: 400px;
    display: inline-block;
    margin-left: 55px;
}

.img-pagination {
    height: 10vh;
    width: 100%;
}
</style>
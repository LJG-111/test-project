<template>
    <div class="tv-vue">
        <!-- <el-button @click="back">登录</el-button> -->
        <!-- <div class="videos" v-for="item in videoData" :key="item.id">
             <img :src="item.coverUrl" alt="" class="feng-m">
             <p class="title">{{item.title}}</p>
             <p class="user">作者：{{item.userName}}</p>
        </div> -->
        <audio controls src="https://www.ihaoge.net/server/1/283424828.mp3"></audio>
    </div>
</template>
<script>
export default {
    name: 'tvVue',
    data() {
        return {
            videoData: null,//视频数据
        }
    },
    mounted() {
        console.log('process.env.VUE_APP_URL',process.env.VUE_APP_URL);
        this.getVideo();
    },
    methods: {
        //获取视频数据
        getVideo() {
            let data = {
                page: 0,
                size: 10
            };
            $api.getVideo(data).then(res => {
                if (res.code === 200) {
                    this.videoData = res.result.list;
                }
            }).catch(err => { console.log(err) });
        },
        back() {
            sessionStorage.setItem('reload','true');
            $fun.setAddRouter();
            let menuArr = [
                {
                    path: '/echarts',
                    component:'echartsVue'
                },
                {
                    path: '/tvVue',
                    component:'tvVue'
                },
                {
                    path: '/txtVue',
                    component:'txtVue'
                },
                {
                    path: '/imgVue',
                    component:'imgVue'
                },
                {
                    path: '/selectVue',
                    component:'selectVue'
                },
                {
                    path: '/mapVue',
                    component:'mapVue'
                }
            ]
            localStorage.setItem('menuArr',JSON.stringify(menuArr));
            this.$router.push('/txtVue');
        }
    }
}
</script>
<style scoped>
.tv-vue {
    height: 100%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}

.videos {
    height: 300px;
    width: 400px;
}

.feng-m {
    width: 100%;
    height: 200px;
    margin: 20px;
}

.title {
    font-size: 14px;
    margin-bottom: 10px;
}

.user {
    font-size: 16px;
}</style>
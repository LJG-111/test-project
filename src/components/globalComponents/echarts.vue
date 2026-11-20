<template>
    <div class="my-echarts" :ref="ref_id"></div>
</template>
<script>
export default {
    name: 'echarts',
    props: {
        options: Object,
    },
    data() {
        return {
            ref_id: $fun.createId(),
            echart: null
        }
    },
    watch: {
        options: {
            immediate: true,
            handler(opt) {
                if (!opt) return;
                if (this.chart) {
                    this.echart.clear();
                    this.echart.setOption(opt);
                    this.echart.resize();
                } else {
                    this.$nextTick(() => {
                        this.init(opt);
                    });
                }
            },
        },
    },
    mounted() {
        window.addEventListener("resize", this.resizeChart);
    },
    methods: {
        init(opt) {
            this.echart = echarts.init(this.$refs[this.ref_id]);
            if (this.echart) {
                this.echart.clear();
                this.echart.setOption(opt);
                this.echart.on("click", (res) => {
                    this.$emit("click", res);
                });
            }
        },
        resizeChart() {
            if (!this.echart) return;
            this.echart.resize();
            this.$emit("resize");
        }
    }
}
</script>
<style scoped>
.my-echarts {
    height: 100%;
    width: 100%;
}
</style>
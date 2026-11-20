<template>
    <div class="pagination-box">
        <el-pagination background layout="prev, pager, next" :page-size="size" :total="total" @size-change="sizeChange"
            @current-change="currentChange">
        </el-pagination>
    </div>
</template>
<script>
export default {
    name: 'pagination',
    props: {
        //数据总条数
        total: {
            type: Number,
            default: 0
        },
        //当前一页显示多少数据
        size: {
            type: Number,
            default: 12
        }
    },
    data() {
        return {

        }
    },
    mounted() {
        console.log(this.total);
    },
    methods: {
        //获取当前每页条数
        sizeChange(size) {
            console.log('size', size);
        },
        //获取当前页数
        currentChange(page) {
            this.$emit('callBack', { page })
        }
    }
}

</script>
<style scoped>
.pagination-box{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 90px;
    box-sizing: border-box;
}
</style>
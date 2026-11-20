<template>
  <div class="dad-box">
    <el-button @click="defaultSelectSomeone">默认选中某项</el-button>
    <el-button @click="defaultSelectAll">默认选中全部</el-button>
    <el-cascader v-model="ceshi.value" clearable filterable :options="ceshi.options" :props="{
      multiple: true
    }" :collapse-tags="true" placeholder="请选择" @change="selectHandle">
      <template slot-scope="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template>
    </el-cascader>
    <div class="test-box">
      <div :class="numChoose === index ? 'click' : 'no-click'" @click="chooseThis(index)" v-for="(i, index) in Arr">
        {{ i.name }}
      </div>
    </div>
    <!-- 分类 -->
    <div class="bank-list">
      <div class="bank-parent">
        <div class="bank-item" v-for="i in bankList" :key="i.title" :id="i.title">
          <div class="bank-title">{{ i.title }}</div>
          <div class="bank-name" v-for="it in i.list">{{ it.name }}</div>
        </div>
        <!-- 右侧字母分栏 -->
        <div class="paging-box">
          <a v-for="i in pageList" @click="jump(i)">{{ i }}</a>
        </div>
      </div>
    </div>
    <div class="box-one">
      <div class="left-box"></div>
      <div class="right-box"></div>
      <div class="top-box">重新测试</div>
    </div>
    <div class="txt-dad">
      测试文字：<span
        class="txt-box">哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'tvVue',
  data() {
    return {
      Arr: [],
      numChoose: null,
      preSelected: [], // 上次选中的数据
      originData: [], //  源数据平铺成一级节点
      ceshi: {
        value: [],
        options: [
          { label: '全选', value: '全选' },
          { label: '层级0', value: '0' },
          {
            label: '层级1', value: '1', children: [
              {
                label: '层级11', value: '11', children: [
                  { label: '层级111', value: '111', },
                  { label: '层级112', value: '112', }
                ]
              },
              {
                label: '层级12', value: '12', children: [
                  { label: '层级121', value: '121', }
                ]
              }
            ]
          },
          {
            label: '层级2', value: '2', children: [
              { label: '层级21', value: '21' },
              { label: '层级22', value: '22' },
            ]
          },
          {
            label: '层级3', value: '3', children: [
              { label: '层级31', value: '31' }
            ]
          }
        ]
      },
      //银行列表
      bankList: [],
      //字母栏数据
      pageList: []
    }
  },
  mounted() {
    for (let i = 0; i < 40; i++) {
      let obj = {
        name: 'Game',
        index: i
      }
      this.Arr.push(obj);
    }
    for (let i = 65; i < 91; i++) {
      this.pageList.push(String.fromCharCode(i))
    }
    this.pageList.forEach(i => {
      let obj = {
        title: i,
        list: []
      }
      for (let i = 0; i < 5; i++) {
        obj.list.push({ name: (i + 1) * 1000000 });
      }
      this.bankList.push(obj);
    });
    console.log('------------', this.pageList);
  },
  methods: {
    jump(i) {
      document.getElementById(i).scrollIntoView(true);
    },
    defaultSelectSomeone() {
      this.ceshi.value = [['2', '21']];
    },
    defaultSelectAll() {
      this.selectHandle([['全选']])
    },
    judgetAllSelected(node) {
      // 判断是否是全选,也就是看已选择的选中中包不包含"全选"
      let isAllSelected = false
      for (let i = 0; i < node.length; i++) {
        if (node[i][0] === '全选') {
          isAllSelected = true
          break;
        }
      }
      return isAllSelected
    },
    loopFlatData(list = [], parentNode = []) {
      list.length > 0 && list.forEach(e => {
        let pNode = [...parentNode]; // 注意这里必须是深拷贝，否则会由于引用类型赋值的是地址（指针），导致parentNode在pNode更新时，同时被更新
        if (e.children && e.children.length > 0) {
          pNode.push(e.value)// 1 11
          this.loopFlatData(e.children, pNode)
        } else {
          if (e.label !== '全选') {
            if (parentNode.length > 0) {
              pNode.push(e.value)
              this.originData.push({ ...e, parentNode: pNode })
            } else {
              this.originData.push(e)
            }
          }
        }
      })
    },
    loopSelectData(list, parentNode = []) {
      list.length > 0 && list.forEach(e => {
        let pNode = [...parentNode]; // 注意这里必须是深拷贝，否则会由于引用类型赋值的是地址（指针），导致parentNode在pNode更新时，同时被更新
        if (e.children && e.children.length > 0) {
          pNode.push(e.value)// 1 11
          this.loopSelectData(e.children, pNode)
        } else {
          if (parentNode.length > 0) {
            this.ceshi.value.push([...parentNode, e.value])
          } else {
            this.ceshi.value.push([e.value])
          }
        }
      })
    },
    checkIsAddAllSelected() {
      let list = this.ceshi.options; // 原始数据列表
      if (this.originData.length === 0) {
        this.loopFlatData(list) // 把所有的父子级平铺成一个一级列表
      }
      let origin = this.originData;
      let now = [...this.ceshi.value].filter(item => item[0] !== '全选')
      if (origin.length > now.length) {
        // 非全选时, 如果有之前选过全选,要把全选过滤掉
        this.ceshi.value = this.ceshi.value.filter(item => item[0] !== '全选')
      } else {
        // 当所有的数据都选择时, 要自动把全选勾选上
        if (this.ceshi.value[0] && this.ceshi.value[0][0] !== '全选') {
          this.ceshi.value = [['全选'], ...this.ceshi.value]
        }
      }
    },
    async selectHandle(node = []) {
      this.ceshi.value = []
      // 选中的数据格式: [['全选'], ['0'], ['1', '11', '111'], ['2', '21'],...]
      let list = this.ceshi.options
      let current = []; // 获取当前选中的option, 因为element文档中没有获取当前选中的option的方法,所以我通过上一次和本地的选中数据进行对比来获取
      if (node.length >= this.preSelected.length) {
        let keys = this.preSelected.map(item => JSON.stringify(item))
        current = node.filter(item => !keys.includes(JSON.stringify(item)))
        console.log('选中某项', current);
      } else {
        // 取消选中
        let keys = node.map(item => JSON.stringify(item))
        current = this.preSelected.filter(item => !keys.includes(JSON.stringify(item)))
        console.log('取消选中', current);
      }
      // 根据element的选中数据格式, 每一个选项都是一个列表, 列表第一项为父级value, 第二项为选中的子级value, ...以此类推
      const currentValue = current.length > 0 ? current[0][0] || '' : ''
      if (currentValue === '全选') {
        if (this.judgetAllSelected(node)) {
          this.loopSelectData(list)
        } else {
          this.ceshi.value = []
        }
      } else {
        this.ceshi.value = node
      }
      this.checkIsAddAllSelected(); // 主要是勾选或取消非“全选”项时，对于全选的逻辑处理
      this.preSelected = this.ceshi.value; // 保存上一次的选择结果
      this.changeHandle();
    },
    changeHandle() {
      // 这里是处理成自己需要的数据格式, 需要把全选的这一选项过滤掉
      // 原始选择的数据格式[['全选'], ['1', '11'], ['2', '21'],...]
      console.log('changeHandle: ', this.ceshi.value);
    },

    chooseThis(index) {
      this.numChoose = index;
    }
  }
}
</script>
<style scoped>
.dad-box {
  height: 100%;
  width: 100%;
}

::v-deep .el-input__inner {
  height: 38px !important;
}

::v-deep .el-cascader__search-input {
  display: none !important;
}

::v-deep .el-cascader__tags .el-tag {
  max-width: 70% !important;
}

.test-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow: auto;

  height: 300px;
  width: 300px;
  background: pink;
  padding-top: 10px;
}

.click {
  /* float: left; */
  height: 70px;
  width: 70px;
  text-align: center;
  background: yellow;
  line-height: 70px;
  border-radius: 50%;
  margin: 5px;
}

.no-click {
  /* float: left; */
  height: 60px;
  width: 60px;
  line-height: 60px;
  text-align: center;
  background: red;
  margin: 5px;
}

.bank-list {
  width: 500px;
  height: 600px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
}

.bank-parent {
  position: relative;
  overflow-y: auto;
  width: 500px;
  height: 600px;
}

.bank-item {
  padding: 0 10px;
}

.bank-title {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background: #ededed;
}

.bank-name {
  padding: 20px;
}

.paging-box {
  position: fixed;
  top: 0;
  right: 20px;
  display: flex;
  flex-direction: column;
}

.box-one {
  width: 600px;
  display: flex;
  align-items: flex-end;
  position: relative;
}

.left-box {
  width: 400px;
  height: 300px;
  border-radius: 20px 0 0 20px;
  background: red;
}

.right-box {
  width: 200px;
  height: 260px;
  border-radius: 0 20px 20px 0;
  background: yellow;
}

.top-box {
  height: 40px;
  width: 250px;
  background: blueviolet;
  border-radius: 0 0 0 80px;
  position: absolute;
  top: 0;
  right: 0;
}

.txt-dad {
  width: 300px;
}

.txt-box {
  position: relative;
}

.txt-box::before {
  content: '';
  position: absolute;
  width: 100%;
  top: 0;
  /* 边框在元素上方偏移5px */
  left: 0;
  /* 边框在元素左侧偏移5px */
  right: 0;
  bottom: 0;
  border: 5px solid red;
  z-index: -1;
  /* 确保边框位于元素下方 */
}</style>
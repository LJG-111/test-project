<template>
  <div class="menu-vue">
    <template v-if="0">
      <div class="menu-box">
        <div class="menu-item" v-for="(i, index) in menuArr" :key="index" @click="chooseMenuOne(index)">
          {{ i.name }}
        </div>
      </div>
      <div class="menu-box" v-if="menuArrTwo.length">
        <div class="menu-item" v-for="(i, index) in menuArrTwo" :key="index" @click="chooseMenuTwo(index)">
          {{ i.name }}
        </div>
      </div>
      <div class="menu-box" v-if="menuArrThree.length">
        <div class="menu-item" v-for="(i, index) in menuArrThree" :key="index" @click="chooseMenuThree(index)">
          {{ i.name }}
        </div>
      </div>
      <div class="menu-box" v-if="menuArrFour.length">
        <div class="menu-item" v-for="(i, index) in menuArrFour" :key="index" @click="chooseMenuFour(i)">
          {{ i.name }}
        </div>
      </div>
    </template>
    <template v-if="0">
      <div class="t-menu-box">
        <div class="t-menu-left">
          <div v-for="(i, index) in leftMenuArr" :key="index" class="t-left-item">
            {{ i }}
          </div>
        </div>
        <div class="t-menu-right">
          <div v-for="(i, index) in menuArr" :key="index" class="t-right-item">
            <div class="t-r-menu-title">{{ i.name }}</div>
            <template v-if="i.childrenArr.length">
              <div v-for="(it, indext) in i.childrenArr" :key="indext">
                <div class="menu-name">{{ it.name }}</div>
                <template v-if="it.childrenArr.length">
                  <div v-for="(ith, indexth) in it.childrenArr" :key="indexth">
                    <div class="menu-name">{{ ith.name }}</div>
                    <template v-if="ith.childrenArr.length">
                      <div v-for="(itf, indexf) in ith.childrenArr" :key="indexf">
                        <div class="menu-name">{{ itf.name }}</div>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
    <template v-if="1">
      <div>
        <img v-for="(image, index) in imagePaths" :key="index" :src="image.src" alt="Image">
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'menuVue',
  data() {
    return {
      menuArr: [
        {
          name: '我是菜单1',
          childrenArr: []
        },
        {
          name: '我是菜单2',
          childrenArr: [
            {
              name: '我是菜单2-1',
              childrenArr: [
                {
                  name: '我是菜单2-1-1',
                  childrenArr: []
                }
              ]
            }
          ]
        },
        {
          name: '我是菜单3',
          childrenArr: [
            {
              name: '我是菜单3-1',
              childrenArr: [
                {
                  name: '我是菜单3-1-1',
                  childrenArr: []
                },
                {
                  name: '我是菜单3-1-2',
                  childrenArr: []
                }
              ]
            },
            {
              name: '我是菜单3-2',
              childrenArr: [
                {
                  name: '我是菜单3-2-1',
                  childrenArr: []
                },
                {
                  name: '我是菜单3-2-2',
                  childrenArr: []
                }
              ]
            }
          ]
        },
        {
          name: '我是菜单4',
          childrenArr: [
            {
              name: '我是菜单4-1',
              childrenArr: [
                {
                  name: '我是菜单4-1-1',
                  childrenArr: [
                    {
                      name: '我是菜单4-1-1-1',
                      childrenArr: []
                    },
                    {
                      name: '我是菜单4-1-1-2',
                      childrenArr: []
                    }
                  ]
                },
                {
                  name: '我是菜单4-1-2',
                  childrenArr: []
                }
              ]
            },
            {
              name: '我是菜单4-2',
              childrenArr: [
                {
                  name: '我是菜单4-2-1',
                  childrenArr: []
                },
                {
                  name: '我是菜单4-2-2',
                  childrenArr: []
                }
              ]
            }
          ]
        }
      ],
      menuArrTwo: [],
      menuArrThree: [],
      menuArrFour: [],
      leftMenuArr: [],
      imagePaths: [
       
      ]
    }
  },
  mounted() {
    this.getLeftMenu();
    let arr = ['speak2.gif','tip-bgc.png'];
    arr.forEach(i => {
      this.imagePaths.push({
        src:require(`@/assets/img/${i}`)
      }
    );
    });
  },
  destroyed() {

  },
  methods: {
    //选择一级菜单
    chooseMenuOne(index) {
      console.log('------------------', this.menuArr[index]);
      this.menuArrTwo = [];
      this.menuArrThree = [];
      this.menuArrFour = [];
      if (this.menuArr[index].childrenArr.length) {
        this.menuArrTwo = this.menuArr[index].childrenArr;
      }
    },
    //选择二级菜单
    chooseMenuTwo(index) {
      this.menuArrThree = [];
      this.menuArrFour = [];
      if (this.menuArrTwo[index].childrenArr.length) {
        this.menuArrThree = this.menuArrTwo[index].childrenArr;
      }
    },
    //选择三级菜单
    chooseMenuThree(index) {
      this.menuArrFour = [];
      if (this.menuArrThree[index].childrenArr.length) {
        this.menuArrFour = this.menuArrThree[index].childrenArr;
      }
    },
    //选择四级菜单i
    chooseMenuFour(i) {
      console.log('------------------', i);
    },
    //获取左侧菜单
    getLeftMenu() {
      this.menuArr.map(i => {
        this.leftMenuArr.push(i.name);
      });
      console.log('--------------------', this.leftMenuArr);
    }
  }
}
</script>
<style scoped>
.menu-vue {
  height: 100%;
  width: 100%;
  display: flex;
}

.menu-box {
  height: 100%;
  flex: 1;
}

.menu-item {
  width: 100%;
  height: 60px;
  font-size: 16px;
  background: red;
  border: 1px solid yellow;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.t-menu-box {
  height: 100%;
  width: 100%;
  display: flex;
}

.t-menu-left {
  width: 30%;
  height: 100%;
  background: yellow;
}

.t-menu-right {
  width: 70%;
  height: 100%;
  padding-left: 4px;
  background: pink;
}

.t-left-item {
  padding: 6px;
  font-size: 14px;
}

.t-right-item {
  padding: 6px;
  margin-bottom: 10px;
}

.t-r-menu-title {
  font-size: 16px;
  margin-bottom: 4px;
}

.menu-name {
  font-size: 12px;
  margin-bottom: 4px;
}
</style>
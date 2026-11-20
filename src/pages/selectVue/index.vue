<template>
    <el-cascader :options="options" :props="props" :show-all-levels="false" v-model="selectedOptions" @change="handleChange" style="width: 100%">
    </el-cascader>
</template>
  
  <script>
  import mapJson from './map'
  export default {
      props: ['Address'],
      name: 'selectVue',
      data() {
          const res = mapJson;
          return {
              getData: JSON.parse(res),
              options: [],
              props: {
                  value: 'text',
                  label: 'text',
                  children: 'children'
              },
              selectedOptions:[ "河北省", "唐山市" ]
          }
      },
      methods: {
          handleChange(val) {
              console.log(val);
          }
      },
      created(){
          const t1 = new Date()  // t1 - 开始时间
          // 一级地址
          const arr1 = []
          for (const [k1, v1] of Object.entries(this.getData)) {
              const arr2 = []
              // 二级地址
              for (const [k2, v2] of Object.entries(v1)) {
                  // 三级地址
                  const arr3 = []
                  for (const [k3, v3] of Object.entries(v2)) {
                      // arr3.push({ text: k3 })
                      // 四级地址
                      const arr4 = []
                      v3.map((v4, k4) => {
                          arr4.push({ text: v4 })
                      })
                      arr4.length === 0
                          ? arr3.push({ text: k3 })
                          : arr3.push({ text: k3, children: arr4 })
                  }
                  arr3.length === 0
                      ? arr2.push({ text: k2 })
                      : arr2.push({ text: k2, children: arr3 })
              }
              arr2.length === 0
                  ? arr1.push({ text: k1 })
                  : arr1.push({ text: k1, children: arr2 })
          }
          console.log(arr1)
          this.options = arr1
          const t2 = new Date()  // t2 - 结束时间
      }
  }
  </script>
  
<template>
  <div class="txt-vue">
    <div style="height:100%;width:100%">
      <iframe style="width: 100%; height: 100%; frameborder:0; position: absolute; top: 0; left: 0;" :src="url"
        frameborder="0"></iframe>
    </div>
    <div class="text-box" id="txtBox" :style="`top:${top}%;left:${left}%;`">
      <div class="txt" :style="`height:${height}px;width:${width}px;fontSize:${size}px;background:${bgc}`"
        @click="show = !show">
        <div v-html="textData"></div>
      </div>
      <div v-show="show">
        <el-upload action="/" ref="upload" accept=".txt" :before-upload="beforeUpload" :default-file-list="this.fileList">
          <el-button type="primary">上传文件</el-button>
        </el-upload>
        <div>更改内嵌网址</div>
        <div class="flex-ac">
          <el-input type="search" style="width:200px;margin-right: 5px;" v-model="baseUrl"
            placeholder="输入更改内嵌网址"></el-input>
          <el-button type="primary" style="margin-right: 5px;" @click="sure">确定</el-button>
        </div>
        <div>关键词搜索</div>
        <div class="flex-ac">
          <el-input type="search" v-model="keyWords" placeholder="输入关键字搜索"
            style="width:200px;margin-right: 5px;"></el-input>
          <el-button type="primary" style="margin-right: 5px;" @click="search">搜索</el-button>
          <el-button type="success" style="margin-right: 5px;" @click="next">下一个</el-button>
          <el-button type="warning" @click="previous">上一个</el-button>
        </div>
        <div>位置设置</div>
        <div class="flex-ac">
          <el-input type="search" style="width:150px;margin-right: 5px;" v-model="topInput"
            placeholder="上方距离,初始化0"></el-input>
          <el-button type="primary" style="margin-right: 5px;" @click="top = topInput">确定</el-button>
          <el-input type="search" style="width:150px;margin-right: 5px;" v-model="leftInput"
            placeholder="左侧距离,初始化0"></el-input>
          <el-button type="primary" @click="left = leftInput">确定</el-button>
        </div>
        <div>浏览大小设置</div>
        <div class="flex-ac">
          <el-input type="search" style="width:150px;margin-right: 5px;" v-model="heightInput"
            placeholder="高度,初始化600"></el-input>
          <el-button type="primary" style="margin-right: 5px;" @click="height = heightInput">确定</el-button>
          <el-input type="search" style="width:150px;margin-right: 5px;" v-model="widthInput"
            placeholder="宽度,初始化400"></el-input>
          <el-button type="primary" @click="width = widthInput">确定</el-button>
        </div>
        <div>字体背景设置</div>
        <div class="flex-ac">
          <el-input type="search" style="width:150px;margin-right: 5px;" v-model="sizeInput"
            placeholder="字体,初始化14"></el-input>
          <el-button type="primary" style="margin-right: 5px;" @click="size = sizeInput">确定</el-button>
          <el-input type="search" style="width:150px;margin-right: 5px;" v-model="bgcInput"
            placeholder="背景色,初始化#fafafa"></el-input>
          <el-button type="primary" @click="width = bgc = bgcInput">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import db from '../../assets/js/indexDbSet'
export default {
  name: 'txtVue',
  data() {
    return {
      url: 'https://juejin.cn/',
      baseUrl: '',
      top: 0,
      left: 0,
      height: 600,
      width: 400,
      size: 14,
      bgc: '#fafafa',
      topInput: '',
      leftInput: '',
      heightInput: '',
      widthInput: '',
      sizeInput: '',
      bgcInput: '',
      show: true,
      fileList: [],//视频数据
      textData: null,
      textDataClone: null,
      myData: "",
      keyWords: "",
      article: "",
      checkIndex: 0,
    }
  },
  mounted() {
    // this.article = this.myData;
    db.dbInit();
    // db.deleteDb('dbname');
    // db.add();
    db.readAll().then(res => {
      console.log('所有数据', res);
    })
    db.read().then(res => {
      console.log('查找数据', res);
    });
    this.setDrive();
  },
  beforeCreate() {
    // 读取文件
    FileReader.prototype.reading = function ({ encode } = pms) {
      let bytes = new Uint8Array(this.result);    //无符号整型数组
      let text = new TextDecoder('UTF-8').decode(bytes);
      return text;
    };
    /* 重写readAsBinaryString函数 */
    FileReader.prototype.readAsBinaryString = function (f) {
      if (!this.onload)       //如果this未重写onload函数，则创建一个公共处理方式
        this.onload = e => {  //在this.onload函数中，完成公共处理
          let rs = this.reading();
          console.log(rs);
        };
      this.readAsArrayBuffer(f);  //内部会回调this.onload方法
    };
  },
  methods: {
    setDrive() {
      var odiv = document.getElementById('txtBox');

      //给需要移动的元素添加onmousedown事件
      odiv.onmousedown = function (ev) {
        var event = window.event || ev;
        // 获取屏幕中可视化的宽高的坐标
        var dx = event.clientX - odiv.offsetLeft;
        var dy = event.clientY - odiv.offsetTop;
        console.log(event);
        console.log(dy)
        //实时改变目标元素odiv的位置
        document.onmousemove = function (ev) {
          var event = window.event || ev;
          odiv.style.left = event.clientX - dx + 'px';
          odiv.style.top = event.clientY - dy + 'px';
        }

        //抬起停止拖动
        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;

        }
      }


    },
    //确定更改网址
    sure() {
      this.url = this.baseUrl;
    },
    beforeUpload(file) {
      this.textData = null;
      this.fileList = [file]
      // 读取数据
      this.read(file);
      return false
    },
    read(f) {
      let rd = new FileReader();
      rd.onload = e => {
        //this.readAsArrayBuffer函数内，会回调this.onload函数。在这里处理结果
        let cont = rd.reading({ encode: 'UTF-8' });
        let formerData = this.textData;
        this.textData = formerData + "\n" + cont;
        this.textData = this.textData.replace(/\n|\r\n/g, "<br/>");
        this.textDataClone = JSON.parse(JSON.stringify(this.textData));
      };
      rd.readAsBinaryString(f);
    },
    search() {
      this.checkIndex = 0;
      this.article = this.textDataClone;
      let regExp = new RegExp(this.keyWords, "g");
      this.textData = this.article.replace(
        regExp,
        '<span class="result" style="background:yellow;color:red;">' +
        this.keyWords +
        "</span>"
      );
      this.scrollToLocation(this.checkIndex);
    },
    next() {
      this.checkIndex++;
      this.scrollToLocation(this.checkIndex);
    },
    previous() {
      this.checkIndex--;
      this.scrollToLocation(this.checkIndex);
    },
    scrollToLocation(checkIndex) {
      setTimeout(() => {
        let mainContainer = document.querySelectorAll(".result");
        let search = document.querySelector(".txt");
        if (mainContainer.length == 0) {
          this.scrollToLocation();
        } else {
          search.scrollTo({
            top:
              mainContainer[checkIndex].offsetTop -
              search.clientHeight,
            behavior: "smooth",
          });
        }
      }, 300);
    }
  }
}
</script>
<style scoped>
.txt-vue {
  height: 100%;
  width: 100%;
  position: relative;
}

.url-box {
  position: absolute;
  right: 0;
  z-index: 1000;
}

.flex-ac {
  display: flex;
  align-items: center;
}

.txt {
  line-height: 25px;
  height: 880px;
  width: 850px;
  overflow-x: auto;
  overflow-y: auto;
  box-sizing: border-box;
  padding-left: 20px;
  scrollbar-width: none;
  /* firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
}

.txt::-webkit-scrollbar {
  display: none;
}

.text-box {
  position: absolute;
  top: 0;
}

br {
  background-color: transparent;
  text-indent: 2em;
}
</style>
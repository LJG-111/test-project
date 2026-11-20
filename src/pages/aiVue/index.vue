<template>
  <div class="ai-vue">
    <div class="ai-box">
      <div class="ai-content" id="elementId">
        <!-- 导航语言 -->
        <div class="ai-item">
          <img src="../../assets/img/speak2.gif" alt="">
          <div class="ai-back-text">
            您好，我是您的ai小助手，可以为您解决一些事情，您可以试着对我说：今天天气怎么样？
          </div>
        </div>
        <!-- 内容 -->
        <div v-for="(i, index) in listData" :key="index">
          <div v-if="i.type == 1" class="uesr-item">
            <div class="user-input">{{ i.text }}</div>
            <div class="user-logo">我</div>
          </div>
          <div v-if="i.type == 2" class="ai-item">
            <img src="../../assets/img/speak2.gif" alt="">
            <div class="ai-back-text">
              {{ (index == listData.length - 1 && i.type == 2) ? nowAiText : i.text }}
            </div>
          </div>
        </div>
        <!-- 清除对话 -->
        <div class="clear-box">
          <el-link type="primary" :underline="false" @click="clearData" v-if="listData.length">清除对话</el-link>
        </div>
      </div>
      <div class="ai-input">
        <el-input type="search" v-model="keyWords" @change="setKeyWords" placeholder="输入您想了解的内容" />
      </div>
    </div>
  </div>
</template>
<script>
import DATA from '../../assets/js/ai';
export default {
  name: 'tvVue',
  data() {
    return {
      listData: [],//通话数据
      keyWords: '',//用户输入的问题
      copyKeyWords: '',//复制关键词
      nowAiText: '',//当前ai的回话
      netBackText: '',//接口返回的值
    }
  },
  mounted() {
  },
  destroyed() {

  },
  methods: {
    //设置关键词
    setKeyWords() {
      if (this.keyWords === '') return;
      this.copyKeyWords = this.keyWords;
      let obj = {
        type: 1,
        text: this.keyWords
      };
      this.keyWords = '';
      this.listData.push(obj);
      setTimeout(() => {
        this.aiBack();
      }, 1000);
    },
    //请求ai接口
    aiBack() {
      this.nowAiText = '';
      this.netBackText = '';
      let text = '您说的问题有点高深呢，咱还要继续学习才能回答您的问题~';
      let length = DATA.length;
      for (let i = 0; i < length; i++) {
        for (let j = 0; j < DATA[i].key.length; j++) {
          if (DATA[i].key[j] === this.copyKeyWords) {
            text = DATA[i].value;
            break;
          }
        }
      }
      let obj = {
        type: 2,
        text
      };
      this.netBackText = obj.text;
      this.print();
      this.listData.push(obj);
    },
    //设置递归展示文案
    print() {
      if (this.nowAiText.length >= this.netBackText.length) {
        // 退出递归
        return;
      } else {
        //nowAiText仍然比text短，进入下一次等待和递归
        setTimeout(() => {
          this.nowAiText += this.netBackText.charAt(this.nowAiText.length);
          this.print(this.nowAiText, this.netBackText);
          let element = document.getElementById("elementId");
          element.scrollTop = element.scrollHeight;
        }, 50);
      }
    },
    //清除数据
    clearData() {
      this.listData = [];
      this.nowAiText = '';
      this.netBackText = '';
    }
  }
}
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-size: 16px;
}

.ai-vue {
  height: 100%;
  width: 100%;
}

.ai-box {
  height: 100%;
  width: 100%;
  padding: 20px 5px 20px;
  display: flex;
  flex-direction: column;
}

.ai-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
  width: 100%;
}

.ai-input {
  width: 100%;
}

.ai-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.ai-item img {
  height: 70px;
  width: 70px;
  margin-right: 10px;
}

.ai-back-text {
  max-width: 70%;
  line-height: 20px;
  background: #aed0ee;
  padding: 4px;
  border-radius: 4px;
}

.clear-box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.uesr-item {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.uesr-item .user-logo {
  height: 50px;
  width: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 50%;
  background-color: pink;
  color: white;
  font-size: 20px;
  margin-left: 10px;
}

.user-input {
  max-width: 500px;
  background: pink;
  padding: 4px;
  border-radius: 4px;
  color: white;
}
</style>
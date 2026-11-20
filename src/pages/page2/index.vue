<template>
    <div>
        <button @click="send('你要发送的数据')">发消息</button>
        <my-progress />
    </div>
</template>
 
<script>
import { sendSock, createWebSocket, closeSock } from "../../assets/js/ws";
export default {
    data() {
        return {
            path: "ws://127.0.0.1:8080/websocket/message",
            socket: ""
        }
    },
    mounted() {
        // 初始化
        // this.init()
        // WS.init();
        // console.log('WS',WS.init());
        createWebSocket(this.wsCallBack);
    },
    methods: {
        wsCallBack(msg) {
            console.log('----------------', msg);
        },
        init: function () {
            if (typeof (WebSocket) === "undefined") {
                alert("您的浏览器不支持socket")
            } else {
                // 实例化socket
                this.socket = new WebSocket(this.path)
                // 监听socket连接
                this.socket.onopen = this.open
                // 监听socket错误信息
                this.socket.onerror = this.error
                // 监听socket消息
                this.socket.onmessage = this.getMessage
            }
        },
        open: function () {
            console.log("socket连接成功")
        },
        error: function () {
            console.log("连接错误")
        },
        getMessage: function (msg) {
            console.log(msg.data)
        },
        // 发送消息给被连接的服务端
        send: function (params) {
            this.socket.send(params)
        },
        close: function () {
            console.log("socket已经关闭")
        }
    },
    destroyed() {
        closeSock();
        // 销毁监听
        // this.socket.onclose = this.close
    }
}
</script>
 
<style></style>
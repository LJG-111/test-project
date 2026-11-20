var webSocket = null,//初始化webSocket
    wsCallBack = null,//接收数据的回调函数 外部传入
    wsUrl = "ws://localhost:8888";//访问地址

//判断浏览器是否支持ws
function createWebSocket(callback) {
    if ('WebSocket' in window) {
        if (webSocket == null || typeof webSocket !== WebSocket) {
            initWebSocket(callback);
        }
    } else {
        alert('当前浏览器 Not support websocket');
    }
}

//创建ws服务
function initWebSocket(callback) {
    wsCallBack = callback;
    // 初始化websocket
    webSocket = new WebSocket(wsUrl);
    webSocket.onmessage = function (e) {
        websocketonmessage(e);
    };
    webSocket.onclose = function (e) {
        websocketclose(e);
    };
    webSocket.onopen = function () {
        websocketOpen();
    };

    // 连接发生错误的回调方法
    webSocket.onerror = function () {
        console.log("WebSocket连接发生错误");
    };
}

// 向服务端发送数据
function sendSock(agentData) {
    if (webSocket.readyState === webSocket.OPEN) {
        // 若是ws开启状态
        websocketsend(agentData);
    } else if (webSocket.readyState === webSocket.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData);
        }, 1000);
    } else {
        // 若未开启 ，则等待1s后重新调用
        setTimeout(function () {
            sendSock(agentData);
        }, 1000);
    }
}

function closeSock() {
    webSocket.close();
}

// 数据接收
function websocketonmessage(msg) {
    wsCallBack(msg);
}

// 数据发送
function websocketsend(agentData) {
    console.log("发送数据：" + agentData);
    webSocket.send(agentData);
}

// 关闭
function websocketclose(e) {
    console.log("connection closed (" + e.code + ")");
}

function websocketOpen(e) {
    console.log("连接打开");
}

export { sendSock, createWebSocket, closeSock };
class socket {
    constructor() {
        this.ws = null
    }
    WebSocketSet(par, Callback) {
        if ('WebSocket' in window) {
            this.ws = new socket('ws://127.0.0.1:8080/websocket/message');
            //  var ws = new WebSocket(`${axios.defaults.baseURL9}`);   
            this.ws.onopen = (res => {
                console.log("socket连接成功")
                this.ws.send();
            })
            this.ws.onmessage = (res => {
                let received_msg = JSON.parse(res.data);
                console.log("数据已接收...", received_msg);
                // this.newsList=received_msg;
                Callback(received_msg)
            })

        } else {
            alert('当前浏览器 Not support websocket')
        }
    }
    close() {
        this.ws.close()
        this.ws.onclose = (res => {
            console.log(console.log("socket已经关闭"))
        })
    }

}

export default socket;
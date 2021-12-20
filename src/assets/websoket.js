class joinRoomWs {

    status = false; // 当前连接状态
    WebSocket = null;
    roomId = null;

    constructor() {
        
    }
    init(roomId) {
        console.log('init')
        this.roomId = roomId;
        let url = 'wss://wx.tmgxbxwl.cn/api2/ws/';
        this.WebSocket = new WebSocket(url + roomId + '/');
        this.status = true;
        this.WebSocket.onclose = (e) => {
            console.log('onclose WebSocket断开链接');
            console.log(e);
            this.reload(this.roomId);
        }
        this.WebSocket.onerror = (e) => {
            console.log('onerror WebSocket断开链接');
            console.log(e);
            this.reload(this.roomId);
        }
    }
    reload(roomId, callback) {
        this.status = false;
        this.init(roomId);
        this.onopen(() => {
            if (sessionStorage.getItem('role')) {
                this.send(JSON.stringify({data_type: 'init', data: {name: sessionStorage.getItem('role'), phone: sessionStorage.getItem('phone') || ''}}))
                if (callback) {
                    callback();
                }
            }
        })
    }
    onopen (callback) {
        this.WebSocket.onopen = (e) => {
            callback(e);
        };
    }
    send(data) {
        console.log(this.status);
        console.log(data);
        if (this.status) {
            this.WebSocket.send(data)
        } else {
            console.log('您还没有建立连接');
            this.reload(this.roomId, () => {
                this.WebSocket.send(data)
            });
        }
    }
    onmessage(callback) {
        this.WebSocket.onmessage = (e) => {
            callback(JSON.parse(e.data), e);
        };
    }
    onclose() {
        
        // this.WebSocket.onclose = (e) => {
        //     callback(e);
        // };
    }
    onerror() {
        
        // this.status = false;
        // this.WebSocket.onerror = (e) => {
        //     callback(e);
        // };
    }
}
let ws = new joinRoomWs();
export default ws;
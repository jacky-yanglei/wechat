class joinRoomWs {

    status = false; // 当前连接状态
    WebSocket = null;
    roomId = null;
    focusClose = false;

    constructor() {
        
    }
    init(roomId) {
        console.log('init', this.focusClose)
        this.roomId = roomId;
        let url = 'wss://wx.tmgxbxwl.cn/api2/ws/';
        // let url = 'ws://192.168.100.33:8000/api2/ws/';
        this.WebSocket = new WebSocket(url + roomId + '/');
        this.status = true;
        this.WebSocket.onclose = (e) => {
            console.log('onclose WebSocket断开链接');
            console.log(e);
            setTimeout(() => {
                this.reload(this.roomId);
            }, 1000);
        }
        this.WebSocket.onerror = () => {
            console.log('onerror WebSocket断开链接');
            // console.log(e);
            // this.reload(this.roomId);
        }
    }
    reload(roomId, callback) {
        this.status = false;
        if (this.focusClose) {
            this.focusClose = false;
            return;
        }
        this.init(roomId);
        this.onopen(() => {
            if (sessionStorage.getItem('role')) {
                let data = {
                    name: sessionStorage.getItem('role'), 
                    phone: sessionStorage.getItem('phone') || '',
                };
                if (data.name === 'admin') {
                    data.check_token = localStorage.getItem('token');
                }
                this.send(
                    JSON.stringify({
                        data_type: 'init', data: data }))
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
        if (this.status) {
            this.WebSocket.send(data)
        } else {
            this.reload(this.roomId, () => {
                this.WebSocket.send(data)
            });
        }
    }
    onmessage(callback) {
        this.WebSocket.onmessage = (e) => {
            let data = JSON.parse(e.data);
            if (data.data_type === 'error') {
                if (data.data === '错误的房间号') {
                    this.focusClose = true;
                }
            }
            callback(data, e);
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
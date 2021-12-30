class joinRoomWs {

    status = false; // 当前连接状态
    WebSocket = null;
    roomId = null;
    focusClose = false;

    constructor() {
        
    }
    init(roomId) {
        // Vue.$message('121312312');
        this.roomId = roomId;
        let url = 'wss://wx.tmgxbxwl.cn/api2/ws/';
        // let url = 'ws://192.168.100.33:8000/api2/ws/';
        this.WebSocket = new WebSocket(url + roomId + '/');
        this.status = true;
        
        this.WebSocket.onclose = (e) => {
            console.log('onclose WebSocket断开链接');
            console.log(e);
            setTimeout(() => {
                this.reloadCallback();
            }, 1000);
        }
    }
    reloadCallback(callback) {
        if (callback) {
            this.callback();
        }
    }
    reload(roomId, callback, isForce) {
        this.status = false;
        if (this.focusClose) {
            this.focusClose = false;
            return;
        }
        this.init(roomId);
        this.onopen(() => {
            let role = sessionStorage.getItem('role');
            let phone = sessionStorage.getItem('phone') || '';
            if (isForce) {
                let playerInfo = JSON.parse(localStorage.getItem('playerInfo')??'{}')
                role = playerInfo.role;
            }
            if (role) {
                let data = {
                    name: role,
                    phone: phone,
                };
                if (data.name === 'admin') {
                    data.check_token = localStorage.getItem('token');
                }
                console.log(JSON.stringify({data_type: isForce?'reconnect':'init', data: data }))
                this.send(JSON.stringify({data_type: isForce?'reconnect':'init', data: data }));
                if (callback) {
                    callback();
                }
            }
        });
    }
    onopen (callback) {
        this.WebSocket.onopen = (e) => {
            callback(e);
        };
    }
    send(data) {
        if (this.status) {
            this.WebSocket.send(data)
        }
    }
    onmessage(callback) {
        this.WebSocket.onmessage = (e) => {
            if (e.data === 'ping') {
                ws.send('pong')
            } else {
                let data = JSON.parse(e.data);
                if (data.data_type === 'error') {
                    if (data.data === '错误的房间号') {
                        this.focusClose = true;
                    }
                }
                if (data.data_type === 'close') {
                    this.focusClose = true;
                }
                callback(data, e);
            }
        };
    }
    onclose() {
    }
    onerror() {
    }
}
let ws = new joinRoomWs();
export default ws;
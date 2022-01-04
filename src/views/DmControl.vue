<template>
    <div class="page">
        <div class="change-status">
            <img class="channel" src="../assets/exchange/channel.png" alt="">
            <div class="content">
                <div>
                    <div>是否开启交易</div>
                    <el-switch
                        v-model="value"
                        @change="changeExchange($event)"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </div>
                <div>
                    <div>1、开启交易阶段不能调整价格</div>
                    <div>2、关闭交易后开始计算最终价，价格开始变动（如有需要，此时DM可以用调价功能修改最终价）</div>
                </div>
                <div>
                    <img @click="openRank()" src="../assets/exchange/bang.png" alt="">
                </div>
                <!-- <div class="open-price" style="opacity:0">
                    <img src="../assets/exchange/open-price.png" alt="">
                </div> -->
            </div>
            <img class="channel" src="../assets/exchange/channel.png" alt="">
        </div>
        <div class="control">
            <div class="tabs">
                <div @click="selectTab(1)" :class="tabIndex === 1?'active':''">
                    <span>出入金管理</span>
                </div>
                <div @click="selectTab(2)" :class="tabIndex === 2?'active':''">
                    <span>价格控制</span>
                </div>
                <div @click="selectTab(3)" :class="tabIndex === 3?'active':''"><img class="channel" src="../assets/exchange/minicode.png" alt=""></div>
                <div @click="selectTab(4)" :class="tabIndex === 4?'active':''">设置</div>
            </div>
            <div class="content">
                <div v-if="tabIndex === 1" class="section1">
                    <div>选择人物</div>
                    <div>
                        <el-select v-model="role" placeholder="请选择">
                            <el-option
                            v-for="item in roleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="type">
                        <div :class="exchangeType === 0?'active':''" @click="selectType(0)"><i :class="exchangeType === 0?'active':''" class="check"></i>入金</div>
                        <div :class="exchangeType === 1?'active':''" @click="selectType(1)"><i :class="exchangeType === 1?'active':''" class="check"></i>出金</div>
                    </div>
                    <div>输入金额</div>
                    <div class="input-group">
                        <el-input type="number" v-model="amount">
                        </el-input>
                        <i class="after">万元</i>
                    </div>
                    <div class="confirm-btn">
                        <img @click="exchange()" src="../assets/exchange/confirm-btn.png" alt="">
                    </div>
                </div>
                <div v-if="tabIndex === 2" class="section2">
                    <div>输入价格</div>
                    <div class="input-group">
                        <el-input type="number" v-model="price">
                        </el-input>
                        <i class="after">元</i>
                    </div>
                    <div>上一次价格：{{ (roomInfo.last_price?roomInfo.last_price:roomInfo.price).toFixed(2) }}元</div>
                    <div>当前价格：{{ currentPrice.toFixed(2) }}元</div>
                    <div>最终价格：{{ roomInfo.price.toFixed(2) }}元</div>

                    <div style="margin-top: 10px;">按照上一次价格：</div>
                    <div class="fast-select">
                        <div @click="priceUp(1.1)" class="up">上涨 10%</div>
                        <div @click="priceUp(1.25)" class="up">上涨 20%</div>
                        <!-- <div @click="priceUp(1.75)" class="up">上涨 75%</div>
                        <div @click="priceUp(2)" class="up">上涨 100%</div> -->
                        <div @click="priceUp(0.9)" class="down">下跌 10%</div>
                        <div @click="priceUp(0.8)" class="down">下跌 20%</div>
                        <!-- <div @click="priceUp(0.25)" class="down">下跌 75%</div>
                        <div @click="priceUp(0.01)" class="down">下跌 99%</div> -->
                    </div>
                    <div class="confirm-btn" @click="setPrice()">
                        <img src="../assets/exchange/confirm-btn.png" alt="">
                    </div>
                </div>
                <div v-if="tabIndex === 3" class="section3">
                    <div>
                        <img src="../assets/exchange/player-join-text.png" alt="">
                    </div>
                    <div>
                        <img src="../assets/exchange/code-box.png" alt="">
                        <div class="code">
                            <a class="img" ref="qrcode"></a>
                        </div>
                    </div>
                </div>
                <div v-if="tabIndex === 4" class="section4">
                    <div>
                        录入本场MVP
                    </div>
                    <div>选择人物</div>
                    <div>
                        <el-select v-model="mvp" placeholder="请选择">
                            <el-option
                            v-for="item in roleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="confirm-btn">
                        <img @click="mvpPost()" src="../assets/exchange/confirm-btn.png" alt="">
                    </div>
                    <!-- <div class="confirm-btn">
                        <img @click="closeRoom()" src="../assets/exchange/close-room.png" alt="">
                    </div> -->
                </div>
            </div>
        </div>
        <el-dialog
        :custom-class="'dialog'"
        title="玩家排行榜"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        width="100%">
        <div>
            <div>
                <a @click="openRank()" class="refresh-btn"><i class="el-icon-refresh-left"></i>刷新排行榜</a>
            </div>
            <div class="item head">
                <div>角色</div>
                <div @click="orderByType = 'cash'">持有现金<i v-if="orderByType == 'cash'" class="el-icon-arrow-down el-icon--right"></i></div>
                <div @click="orderByType = 'stock'">持股量<i v-if="orderByType == 'stock'" class="el-icon-arrow-down el-icon--right"></i></div>
                <div @click="orderByType = 'marketValue'">总资产<i v-if="orderByType == 'marketValue'" class="el-icon-arrow-down el-icon--right"></i></div>
            </div>
            <div class="item" v-for="item in orderBy(userRank)" :key="item.value">
                <div :class="joined(item.role)?'green':'red'">{{ item.role }}</div>
                <div>{{ numberTransform(item.cash) }}</div>
                <div>{{ item.stock }}</div>
                <div>{{ numberTransform(item.cash + item.stock * currentPrice) }}</div>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <img @click="dialogVisible = false" src="../assets/exchange/confirm-btn.png" alt="">
        </span>
        </el-dialog>
    </div>
</template>
<script>
import ws from '../assets/websoket';
// import axios from 'axios';
export default {
    data() {
        return {
            value: false,
            tabIndex: 1,
            role: '帅帅', // 角色
            amount: '', // 数量
            price: '',
            currentPrice: '',
            exchangeType: 0,
            mvp: '',
            mvpPhone: '',
            roomInfo: {},
            dialogVisible: false,
            orderByType: 'marketValue',
            userRank: [
            ],
            roleOptions: [
                {
                    value: '帅帅',
                    label: '帅帅'
                }, 
                {
                    value: '宝宝',
                    label: '宝宝'
                }, 
                {
                    value: '玛玛',
                    label: '玛玛'
                }, 
                {
                    value: '觉觉',
                    label: '觉觉'
                }, 
                {
                    value: '臭臭',
                    label: '臭臭'
                },
                {
                    value: '霸霸',
                    label: "霸霸"
                },
                {
                    value: '野野',
                    label: "野野"
                },
                {
                    value: '蒂蒂',
                    label: "蒂蒂"
                },
                {
                    value: '莎莎',
                    label: "莎莎"
                }
            ]
        }
    },
    computed: {
        numberTransform() {
            return function(num) {
                if (isNaN(parseFloat(num))) {
                    return '--'
                } else if (parseFloat(num) > 100000000) {
                    return (parseFloat(num)/100000000).toFixed(2) + '亿元';
                } else {
                    return (parseFloat(num)/10000).toFixed(2) + '万元';
                }
            }
        },
        joined() {
            return (name) => {
                let list = [];
                if (this.roomInfo?.joined) {
                    let data = this.roomInfo.joined.concat();
                    var index = data.indexOf('admin');
                    if (index > -1) {
                        data.splice(index, 1); 
                    }
                    list = data;
                }
                return list.indexOf(name) > -1;
            }
        },
        orderBy() {
            return (list) => {
                let arr = list.concat();
                if (this.orderByType === 'marketValue') {
                    arr.sort((a,b) => {
                        return (b.cash + b.stock * this.currentPrice) - (a.cash + a.stock * this.currentPrice);
                    })
                    return arr
                } else if (this.orderByType === 'cash') {
                    arr.sort((a,b) => {
                        return b.cash - a.cash;
                    });
                    return arr;
                } else if (this.orderByType === 'stock') {
                    arr.sort((a,b) => {
                        return b.stock - a.stock;
                    });
                    return arr;
                }
                return arr;
            }      
        }
    },
    created() {
        let playerInfo = JSON.parse(localStorage.getItem('playerInfo')??'{}');
        if (playerInfo.role !== 'admin') {
            localStorage.removeItem('playerInfo');
            setTimeout(() => {
                location.href = '/ddd/';
            }, 10);
        }
    },
    mounted() {
        if (localStorage.getItem('playerInfo') && JSON.parse(localStorage.getItem('playerInfo')).role === 'admin') {
            this.initWs();
        } else {
            localStorage.removeItem('playerInfo');
            location.href = '/ddd/dmlogin';
        }
    },
    methods: {
        openRank() {
            this.postGetRoomInfo();
            this.postAllUserInfo();
            this.dialogVisible = true;
        },
        postAllUserInfo() {
            ws.send(JSON.stringify({data_type: 'all_user_info', data: null}));
        },
        priceUp(radio) {
            this.price = parseFloat((this.roomInfo.last_price * radio).toFixed(2));
        },
        selectType(index) {
            this.exchangeType = index;
        },
        selectTab(index) {
            this.tabIndex = index;
            if (index === 3) {
                setTimeout(() => {
                    this.getCode();
                }, 1)
            }
        },
        mvpPost() {
            ws.send(JSON.stringify({data_type: 'set_mvp', data: {name: this.mvp}}));
        },
        getCode() {
            // eslint-disable-next-line no-undef
            new QRCode(this.$refs.qrcode, {
                text: location.origin + process.env.VUE_APP_Redirect + "/playerLogin/" + this.$route.params.roomid,
                width: 120,
                height: 120,
                colorDark : "#000000",
                colorLight : "#ffffff",
                // eslint-disable-next-line no-undef
                correctLevel : QRCode.CorrectLevel.H
            });
        },
        initWs() {
            if (ws.status) {
                this.postGetRoomInfo();
                ws.onmessage((e) => {
                    this.onmessage(e)
                });
            } else {
                this.reloadWs();
            }
            ws.reloadCallback = () => {
                this.reloadWs();
            }
        },
        reloadWs() {
            ws.reload(this.$route.params.roomid, () => {
                this.postGetRoomInfo();
                ws.onmessage((e) => {
                    this.onmessage(e)
                });
            }, true);
        },
        // 修改股票价格
        setPrice() {
            if (!this.price) {
                this.$message({type: 'error', message: '请输入价格'});
                return;
            }
            if (isNaN(parseFloat(this.price))) {
                this.$message({type: 'error', message: '请输入正确的价格'});
                return;
            }
            if (this.price <= 0) {
                this.$message({type: 'error', message: '价格必须大于0'});
                return;
            }
            ws.send(JSON.stringify({data_type: 'change_price', data: parseFloat(this.price)}))
        },
        onmessage(e) {
            if (e.data_type === 'redeem') {
                this.redeemMsg(e);
            }
            if (e.data_type === 'apply') {
                this.applyMsg(e);
            }
            if (e.data_type === 'room_info') {
                this.getRoomInfo(e.data);
            }
            if (e.data_type === 'change_price') {
                if (e.success) {
                    this.$message({type: 'success', message: '价格调整成功'});
                } else {
                    this.$message({type: 'error', message: e.message});
                }
            }
            if (e.data_type === 'set_mvp') {
                if (e.success) {
                    this.$message({type: 'success', message: e.message});
                } else {
                    this.$message({type: 'error', message: e.message});
                }
            }
            if (e.data_type === 'trade_switch') {
                if (e.success) {
                    this.$message({type: 'success', message: e.message});
                } else {
                    this.$message({type: 'error', message: e.message});
                }
            }
            if (e.data_type === 'price_line') {
                if (e.success) {
                    this.setCurrentPrice(e.data);
                }
            }
            if (e.data_type === 'all_user_info') {
                if(e.success) {
                    let list = e.data;
                    this.userRank = list.filter(item => {
                        return item.role != 'admin';
                    });
                }
            }
            if (e.data_type === 'check_token') {
                if(!e.success) {
                    this.$alert(`${e.message}`, '提示', {
                        type: 'error',
                        confirmButtonText: '确定',
                        callback: () => {
                            ws.focusClose = true;
                            ws.WebSocket.close();
                            localStorage.removeItem('playerInfo');
                            localStorage.removeItem('token');
                            setTimeout(() => {
                                location.href = '/ddd/';
                            }, 10)
                        }
                    });
                }
            }
        },
        setCurrentPrice(data) {
            this.currentPrice = data.price;
        },
        postGetRoomInfo() {
            ws.send(JSON.stringify({data_type: 'room_info', data: {}}));
        },
        getRoomInfo(data) {
            this.roomInfo = data;
            this.value = data.is_open_trade;
            if(!this.currentPrice) {
                this.currentPrice = this.roomInfo.price;
            }
        },
        changeExchange(e) {
            ws.send(JSON.stringify({"data_type": 'trade_switch', data: e}));
        },
        exchange() {
            if (!this.amount) {
                this.$message({type: 'error', message: '请输入数量'});
                return;
            }
            if (isNaN(parseFloat(this.amount))) {
                this.$message({type: 'error', message: '请输入正确的数量'});
                return;
            }
            if (this.amount <= 0) {
                this.$message({type: 'error', message: '数量必须大于0'});
                return;
            }
            if (this.exchangeType === 0) {
                this.apply(this.role, parseFloat(this.amount));
            }
            if (this.exchangeType === 1) {
                this.redeem(this.role, parseFloat(this.amount));
            }
        },
        redeem(role, cash) {
            ws.send(JSON.stringify({"data_type": 'redeem', data: {name: role, cash: cash * 10000}}));
        },
        apply(role, cash) {
            ws.send(JSON.stringify({"data_type": 'apply', data: {name: role, cash: cash * 10000}}));
        },
        redeemMsg(data) {
            console.log(data);
            if (data.success) {
                this.$message({message: data.message, type: 'success'})
            } else {
                this.$message({message: data.message, type: 'error'})
            }
        },
        applyMsg(data) {
            if (data.success) {
                this.$message({message: data.message, type: 'success'})
            } else {
                this.$message({message: data.message, type: 'error'})
            }   
        },
        // closeRoom() {
        //     this.$confirm('您确定要关闭此房间?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         closeOnClickModal: false,
        //         type: 'warning'
        //     }).then(() => {
        //         axios.delete(
        //             process.env.VUE_APP_BASE_URL+ 'room/' + this.$route.params.roomid,
        //             {
        //                 headers: {
        //                     Authorization: 'Bearer ' + localStorage.getItem('token')
        //                 }
        //             }
        //         ).then(({data}) => {
        //             if(data.status === 200) {
        //                 location.href = '/ddd/dmlogin';
        //             } else {
        //                 this.$message({message: data.message, type: 'error'});
        //             }
        //         }).catch(() => {
        //             this.$message({message: '网络异常', type: 'error'});
        //         });
        //     }).catch(() => {  
        //     });
            
        // }
    }
}
</script>
<style lang="less">
.dialog {
    max-width: 500px;
}
</style>

<style lang="less" scoped>
.page {
    max-width: 750px;
    margin: 0 auto;
    min-height: 100vh;
    background-image: url('/ddd/static/images/exchange/bg.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #272828;
    .dialog-footer {
        img {
            cursor: pointer;
        }
    }
    .item {
        margin: 0 auto;
        display: flex;
        > div {
            flex: 0 0 25%;
            text-align: center;
        }
        max-width: 400px;
        &.head {
            > div {
                cursor: pointer;
                margin-top: 10px;
            }
        }
        .green {
            display: flex;
            align-items: center;
            justify-content: center;
            &::before {
                content: "";
                display: flex;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: rgb(92, 252, 0);
                margin-right: 5px;
            }
        }
        .red {
            display: flex;
            align-items: center;
            justify-content: center;
            &::before {
                content: "";
                display: flex;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: red;
                margin-right: 5px;
            }
        }
    }
    .change-status {
        .content {
            margin: -10px 0;
            padding: 30px 24px 20px;
            background-color: #CCB480;
            text-align: center;
            > div {
                &:first-child {
                    display: flex;
                    // justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    font-size: 24px;
                    > div:first-child {
                        margin-right: 20px;
                    }
                }
                &:nth-child(2) {
                    text-align: left;
                }
                &:nth-child(3) {
                    margin-top: 20px;
                    img {
                        cursor: pointer;
                    }
                }
            }
            .open-price {
                > img {
                    cursor: pointer;
                }
            }
        }
        .channel {
            width: 100%;
        }
    }

    .control {
        .tabs {
            display: flex;
            align-items: flex-end;
            margin-top: 10px;
            > div {
                background-color: #BC844F;
                height: 46px;
                border-radius: 8px 8px 0 0;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                &:nth-child(1) {
                    flex: 0 0 30%;
                    border-right: 1px solid #000000;
                    &.active {
                        background-color: #CCB480;
                        border-right: 1px solid transparent;
                        height: 46px;
                        &+div {
                            border-left: 1px solid #000000;
                        }
                    }
                }
                &:nth-child(2) {
                    flex: 0 0 30%;
                    border-left: 1px solid transparent;
                    border-right: 1px solid #000000;
                    &.active {
                        background-color: #CCB480;
                        border-right: 1px solid transparent;
                        height: 46px;
                        &+div {
                            border-left: 1px solid #000000;
                        }
                    }
                }
                &:nth-child(3) {
                    flex: 0 0 20%;
                    border-left: 1px solid transparent;
                    border-right: 1px solid #000000;
                    &.active {
                        background-color: #CCB480;
                        border-right: 1px solid transparent;
                        height: 46px;
                        &+div {
                            border-left: 1px solid #000000;
                        }
                    }
                }
                &:nth-child(4) {
                    flex: 0 0 20%;
                    border-left: 1px solid transparent;
                    &.active {
                        background-color: #CCB480;
                        height: 46px;
                    }
                }
            }
        }
        .content {
            background-color: #CCB480;
            padding: 24px 80px;
            &::v-deep input{
                font-size: 16px;
                background-color: #301802;
                border-radius: 25px;
                color: #fff;
                border: 1px solid #301802;
            }
            .input-group {
                position: relative;
                .after {
                    position: absolute;
                    right: 15px;
                    top: 8px;
                    color: white;
                }
            }
            .section1 {
                .check {
                    width: 20px;
                    height: 20px;
                    display: inline-block;
                    background-color: #62402C;
                    border-radius: 50%;
                    position: relative;
                    &.active::after {
                        content: "";
                        position: absolute;
                        width: 12px;
                        height: 12px;
                        background-color: #BC844F;
                        border-radius: 50%;
                        top: 4px;
                        left: 4px;
                    }
                }
                .type {
                    margin-top: 20px;
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    > div {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        color: rgba(0, 0, 0, 0.5);
                        &.active {
                            color: #000;
                        }
                        i {
                            margin-right: 5px;
                        }
                    }
                }
                .confirm-btn {
                    margin-top: 50px;
                    text-align: center;
                    margin-bottom: 50px;
                    > img {
                        cursor: pointer;
                    }
                }
            }
        }
        .section2 {
            .fast-select {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                // margin-top: 10px;
                > div {
                    width: 48%;
                    height: 32px;
                    border-radius: 16px;
                    margin-top: 5px;
                    margin-bottom: 5px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    cursor: pointer;
                    &.up {
                        background-color: #BC634F;
                        box-shadow: 0px 4px 0px #62402C;
                    }
                    &.down {
                        background-color: #BCB14F;
                        box-shadow: 0px 4px 0px #625D2C;
                    }
                }
            }
            .confirm-btn {
                margin-top: 50px;
                text-align: center;
                margin-bottom: 50px;
                > img {
                    cursor: pointer;
                }
            }
        }
        .section3 {
            text-align: center;
            > div {
                padding-top: 5px;
                position: relative;
                img {
                    width: 160px;
                }
                .code {
                    position: absolute;
                    width: 100%;
                    top: 0;
                    left: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    box-sizing: border-box;
                    padding-top: 60px;
                    > .img {
                        width: 130px;
                        height: 130px;
                        padding: 5px;
                        display: inline-block;
                        background-color: #fff;
                        border-radius: 6px;
                        box-sizing: border-box;
                    }
                }
            }
        }
        .section4 {
            > div {
                &:first-child {
                    margin-bottom: 20px;
                    font-size: 20px;
                }
                &:nth-child(3) {
                    margin-bottom: 10px
                }
            }
            .confirm-btn {
                margin-top: 50px;
                text-align: center;
                margin-bottom: 50px;
                > img {
                    cursor: pointer;
                }
            }
        }
    }
    ::v-deep .el-dialog__body {
        padding-top: 0;
    }
    .refresh-btn {
        cursor: pointer;
        font-size: 18px;
        margin-bottom: 10px;
    }
    ::v-deep {
        .el-dialog {
            background-color: #CCB480;
        }
    }
// #CCB480
}
</style>
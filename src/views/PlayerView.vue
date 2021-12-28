<template>
    <div class="page">
        <div class="title">
            <div>东印钞无限公司</div>
            <div><span>价格：</span><span>{{ showPrice }}</span></div>
        </div>
        <div class="chart" ref="chart">

        </div>
        <div class="role">
            <div>{{ currentRole }}</div>
            <div @click="openRank()">排行榜</div>
        </div>
        <div class="marketvalue">
            <div>
                <div>总资产</div>
                <div>{{ numberTransform(userInfo.cash + userInfo.stock * price) }}</div>
            </div>
            <div>
                <div>现金</div>
                <div>{{ numberTransform(userInfo.cash) }}</div>
            </div>
            <div>
                <div>股票价值</div>
                <div>{{ numberTransform(userInfo.stock * price) }}</div>
            </div>
            <div>
                <div>持仓量</div>
                <div>{{ userInfo.stock ? userInfo.stock.toFixed(0) : 0 }}股</div>
            </div>
        </div>
        <div class="channel">
            <div>
                <img class="pip" src="../assets/exchange/channel.png" alt="">
            </div>
            <div class="position clock">
                <img src="../assets/exchange/clock.png" alt="">
            </div>
            <div class="position lun">
                <img src="../assets/exchange/clock-lun.png" alt="">
            </div>
            <div class="position pointer">
                <img src="../assets/exchange/pointer.png" alt="">
            </div>
            <div class="position cover">
            </div>
        </div>
        <div class="print">
            <div class="type">
                <div @click="selectExchange(0)" :class="exchangeType === 0 ? 'active' : ''"><i class="check" :class="exchangeType === 0 ? 'active' : ''"></i>买入</div>
                <div @click="selectExchange(1)" :class="exchangeType === 1 ? 'active' : ''"><i class="check" :class="exchangeType === 1 ? 'active' : ''"></i>卖出</div>
            </div>
            <div>
                <div>{{ exchangeType === 0?'输入金额':'数量'}}</div>
                <div class="input-group">
                    <el-input type="number" @input="amountChange()" v-model="amount">
                    </el-input>
                    <i class="after">{{ exchangeType === 0?'万元':'股'}}</i>
                </div>
            </div>
            <div class="slider-block">
                <div class="el-slider-block">
                    <el-slider
                    v-model="radio"
                    :show-tooltip="false"
                    :step="0.1"
                    @change="radioChange()"
                    show-stops>
                    </el-slider>
                </div>
                <div class="slider">
                    <div class="down">
                        <div :class="radio > 0?'active':0" class="point"></div>
                        <div :class="radio > 25?'active':0" class="point"></div>
                        <div :class="radio > 50?'active':0" class="point"></div>
                        <div :class="radio > 75?'active':0" class="point"></div>
                        <div :class="radio == 100?'active':0" class="point"></div>
                        <div :style="{left: 'calc(' + radio + '% - 10px)'}" class="marker"></div>
                        <div :style="{width: radio + '%'}" class="finish"></div>
                    </div>
                </div>
            </div>
            <div class="slider-text">
                <div>0%</div>
                <div>25%</div>
                <div>50%</div>
                <div>75%</div>
                <div>100%</div>
            </div>
            <div class="btn" v-if="openTrade && !onTrading">
                <img v-if="exchangeType === 0" @click="buy()" src="../assets/exchange/buy-btn.png" alt="">
                <img v-if="exchangeType === 1" @click="sell()" src="../assets/exchange/sell-btn.png" alt="">
            </div>
            <div class="btn disabled" v-if="!openTrade && !onTrading">
                <span>
                    <img v-if="exchangeType === 0" src="../assets/exchange/buy-btn.png" alt="">
                    <img v-if="exchangeType === 1" src="../assets/exchange/sell-btn.png" alt="">
                </span>
            </div>
            <div class="btn" v-if="onTrading">
                <img @click="cancel()" src="../assets/exchange/cancel-btn.png" alt="">
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
                <a @click="postAllUserInfo()" class="refresh-btn"><i class="el-icon-refresh-left"></i>刷新排行榜</a>
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
import highcharts from 'highcharts/highstock'
import ws from '../assets/websoket';
import { setTimeout } from 'timers';
export default {
    data() {
        return {
            exchangeType: 0,
            amount: '',  
            radio: 0,
            chart: null,
            price: null,
            priceList: [],
            openTrade: false,
            onTrading: false,
            dialogVisible: false,
            roomInfo: {
            },
            userInfo: {

            },
            orderByType: 'marketValue',
            userRank: [
                // {
                //     cash: 0,
                //     id: "55",
                //     role: "觉觉",
                //     room_id: "89960",
                //     shares: 0,
                //     stock: 100,
                // },
                // {
                //     cash: 0,
                //     id: "55",
                //     role: "飒飒",
                //     room_id: "89960",
                //     shares: 0,
                //     stock: 0,
                // },
                // {
                //     cash: 0,
                //     id: "55",
                //     role: "霸霸",
                //     room_id: "89960",
                //     shares: 0,
                //     stock: 0,
                // },
                // {
                //     cash: 0,
                //     id: "55",
                //     role: "玛玛",
                //     room_id: "89960",
                //     shares: 0,
                //     stock: 0,
                // },
                // {
                //     cash: 0,
                //     id: "55",
                //     role: "臭臭",
                //     room_id: "89960",
                //     shares: 0,
                //     stock: 0,
                // },
                // {
                //     cash: 0,
                //     id: "55",
                //     role: "蒂蒂",
                //     room_id: "89960",
                //     shares: 0,
                //     stock: 0,
                // },
                // {
                //     cash: 10000,
                //     id: "55",
                //     role: "野也",
                //     room_id: "89960",
                //     shares: 0,
                //     stock: 0,
                // },
                // {
                //     cash: 0,
                //     id: "55",
                //     role: "帅帅",
                //     room_id: "89960",
                //     shares: 0,
                //     stock: 0,
                // },
                // {
                //     cash: 0,
                //     id: "55",
                //     role: "宝宝",
                //     room_id: "89960",
                //     shares: 0,
                //     stock: 0,
                // },
            ],
        }
    },
    computed: {
        currentRole() {
            return sessionStorage.getItem('role') || '--'
        },
        showPrice() {
            if (this.price) {
                return this.price.toFixed(2)
            }
            if (this.roomInfo.price) {
                return this.roomInfo.price.toFixed(2)
            }
            return '--';
        },
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
                        return b.cash + b.stock * this.currentPrice - a.cash + a.stock * this.currentPrice; 
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
    watch: {
    },
    created() {
        
    },
    mounted() {
        this.initWs();
    },
    methods: {
        initWs() {
            if (ws.status) {
                this.postGetUserInfo();
                this.postGetRoomInfo();
                ws.onmessage((e) => {
                    this.initOnMessage(e);
                });
            } else {
                ws.reload(this.$route.params.id, () => {
                    this.postGetUserInfo();
                    this.postGetRoomInfo();
                });
                ws.onmessage((e) => {
                    this.initOnMessage(e);
                });
            }
        },
        // 监听数量变化
        amountChange() {
            if (isNaN(parseFloat(this.amount))) {
                this.radio = 0;
                return;
            }
            if (this.exchangeType === 0) {
                this.radio = parseFloat(this.amount) * 10000 / this.userInfo.cash * 100;
                if (this.radio > 100) {
                    this.radio = 100
                }
            }
            if (this.exchangeType === 1) {
                this.radio = parseFloat(this.amount)/ this.userInfo.stock * 100;
                if (this.radio > 100) {
                    this.radio = 100
                }
            }
        },
        openRank() {
            this.postAllUserInfo();
            this.dialogVisible = true;
        },

        // 撤单
        cancel() {
            ws.send(JSON.stringify({data_type: 'cancel', data: null}));
        },

        radioChange() {
            if (this.exchangeType === 0) {
                this.amount = (this.userInfo.cash*this.radio/100/10000).toFixed(1);
            }
            if (this.exchangeType === 1) {
                this.amount = (this.userInfo.stock*this.radio/100).toFixed(1);
            }
        },

        initOnMessage(e) {
            if (e.data_type === 'buy' || e.data_type === 'sell') {
                if (e.success) {
                    this.onTrading = true;
                    // this.amount = '';
                    // this.amountChange();
                    // this.postGetUserInfo();
                    this.$message({type: 'success', message: e.message})
                } else {
                    // this.postGetUserInfo();
                    this.$message({type: 'error', message: e.message})
                }
            }
            if (e.data_type === 'user_info') {
                if (e.success) {
                    this.amount = '';
                    this.amountChange();
                    this.getUserInfo(e.data);
                }
            }
            if (e.data_type === 'room_info') {
                if (e.success) {
                    this.getRoomInfo(e.data);
                }
            }
            if (e.data_type === 'cancel') {
                if (e.success) {
                    this.onTrading = false;
                    this.$message({type: 'success', message: e.message});
                } else {
                    this.$message({type: 'error', message: e.message});
                }
            }
            if (e.data_type === 'price_line') {
                if(e.success) {
                    this.getPriceChart(e.data);
                }
            }
            if (e.data_type === 'all_user_info') {
                if(e.success) {
                    this.userRank = e.data;
                }
            }
        },
        
        selectExchange(index) {
            this.exchangeType = index;
            this.amount = '';
            this.amountChange();
        },

        postAllUserInfo() {
            ws.send(JSON.stringify({data_type: 'all_user_info', data: null}));
        },
        postGetUserInfo() {
            ws.send(JSON.stringify({data_type: 'user_info', data: {name: sessionStorage.getItem('role')}}));
        },
        postGetRoomInfo() {
            ws.send(JSON.stringify({data_type: 'room_info', data: {}}));
        },
        // 获取用户信息
        getUserInfo(data) {
            this.onTrading = data.wait_for_trade.buy + data.wait_for_trade.sell > 0;
            this.userInfo = data;
        },
        getPriceChart(data) {
            this.price = data.price;
            let initLine = [data.price];
            // for (let i = 0;i < data.price_line.length; i++) {
            //     initLine.push(data.price);
            // }
            if (this.priceList.length > 0) {
                this.updateChart(initLine);
                // if (initLine.length === this.priceList.length) {
                //     return;
                // } else {
                //     console.log('updateChart')
                //     let upLine = initLine.slice(this.priceList.length);
                //     this.priceList = initLine;
                //     this.updateChart(upLine);
                // }
            } else {
                this.priceList = [data.price];
                this.initChart();
            }
        },
        // 获取用户信息
        getRoomInfo(data) {
            this.roomInfo = data;
            this.openTrade = data.is_open_trade;
            if (!this.price) {
                this.price = this.roomInfo?.price;
            }
            if(!this.currentPrice) {
                this.currentPrice = this.roomInfo.price;
            }
        },
        updateChart(line) {
            if (this.chart.series[0].data.length > 200) {
                this.priceList = this.priceList.concat(line);
                this.priceList = this.priceList.slice(-201);
                this.chart.update(
                    {
                        chart: {
                            animation: false
                        },
                        series: [
                            {
                                data: this.priceList
                            }
                        ]
                    }
                )
            } else {
                for (let i = 0; i < line.length; i++) {
                    setTimeout(() => {
                        this.chart.series[0].addPoint(line[i])
                    }, (i) * 300)
                }
            }
            
        },
        buy() {
            if (!this.amount) {
                this.$message({type: 'error', message: '请输入金额'});
                return;
            }
            if (isNaN(parseFloat(this.amount))) {
                this.$message({type: 'error', message: '请输入正确的金额'});
                return;
            }
            if (parseFloat(this.amount) <= 0) {
                this.$message({type: 'error', message: '金额必须大于0'});
                return;
            }
            if (parseFloat(this.amount*10000) > this.userInfo.cash) {
                this.$confirm(`现金不足，最多可使用现金为${(this.userInfo.cash/10000).toFixed(1)}万元，是否将当前的现金全部买入?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ws.send(JSON.stringify({data_type: 'buy', data: this.userInfo.cash}))
                }).catch(() => {
                    
                });
            } else {
                ws.send(JSON.stringify({data_type: 'buy', data: parseFloat(this.amount) * 10000}))
            }
        },
        sell() {
            if (!this.amount) {
                this.$message({type: 'error', message: '请输入数量'});
                return;
            }
            if (isNaN(parseFloat(this.amount))) {
                this.$message({type: 'error', message: '请输入正确的数量'});
                return;
            }
            if (parseFloat(this.amount) <= 0) {
                this.$message({type: 'error', message: '数量必须大于0'});
                return;
            }
            if (this.userInfo.stock < this.amount) {
                this.$confirm(`股票数量不足，最多可使用${this.userInfo.stock}股，是否将持有股票全部卖出?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ws.send(JSON.stringify({data_type: 'sell', data: this.userInfo.stock}))
                }).catch(() => {
                    
                });
            } else {
                ws.send(JSON.stringify({data_type: 'sell', data: parseFloat(this.amount)}))
            }
        },
        initChart() {
            this.chart = highcharts.chart(this.$refs.chart, {
                chart: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    spacingTop: 0
                },
                animation: {
                    easing: 'easeOutBounce'
                },
                title: {
                    text: ''
                },
                colors: [
                    '#BC844F'
                ],
                subtitle: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    tickWidth:0,
                    gridLineWidth: 0,
                    labels: {
                        enabled: false
                    },
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderColor: 'rgba(0,0,0,0)',
                    shadow: false,
                    enabled: false
                },
                xAxis: {
                    lineWidth :0,
                    tickWidth:0,
                    title: {
                        text: ''
                    },
                    labels: {
                        enabled: false
                    },
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false,
                            enabled: false
                        },
                    }
                },
                series: [
                    {
                        lineWidth: 2,
                        marker: {
                            enabled: false
                        },
                        data: this.priceList
                    }
                ]
            });
        },
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
    background-color: #CCB480;
    min-height: 100vh;
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
    .title {
        padding: 16px 16px 5px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        > div {
            &:first-child {
                font-size: 24px;
                color: #3C2101;
            }
            &:last-child {
                > span {
                    &:first-child {
                        color: rgba(0, 0, 0, 0.5);
                        font-size: 14px;
                    }
                    &:last-child {
                        font-size: 18px;
                    }
                }
            }
        }
    }
    .chart {
        height: 180px;
        border-radius: 8px;
        border: 2px solid #A89061;
        box-sizing: border-box;
        margin: 0 16px;
    }
    .role {
        margin: 0 16px;
        padding: 10px 16px 0;
        display: flex;
        justify-content: space-between;
        > div:last-child {
            cursor: pointer;
        }
    }
    .marketvalue {
        display: flex;
        flex-wrap: wrap;
        padding: 5px 16px 20px;
        > div {
            flex: 0 0 50%;
            box-sizing: border-box;
            padding: 10px 0 10px 16px;
            &:nth-child(1) {
                border-bottom: 1px solid rgba(0, 0, 0, 0.2);
            }
            &:nth-child(2) {
                border-bottom: 1px solid rgba(0, 0, 0, 0.2);
            }
            > div {
                &:first-child {
                    color: rgba(0, 0, 0, 0.5);
                    font-size: 14px;
                }
                &:last-child {
                    font-size: 18px;
                }
            }
        }
    }
    .channel {
        position: relative;
        margin: 0 auto;
        max-width: 400px;
        .pip {
            width: 100%;
        }
        position: relative;
        z-index: 0;
        .position {
            position: absolute;
            width: 100%;
            text-align: center;
            top: 0;
            top: 50%;
            font-size: 0;
            &.lun {
                z-index: -2;
                transform: translateY(-50%);
                img {
                    width: (100/360)*100%;
                    animation:turn 10s linear infinite;
                }
            }
            &.clock {
                z-index: 2;
                img {
                    width: (60/360)*100%;
                    transform: translateY(-50%);
                }
            }
            &.pointer {
                z-index: 2;
                transform: translateY(-50%);
                img {
                    width: (60/360)*100%;
                    animation: 1.5s spin ease infinite;
                }
            }
            &.cover {
                height: 100px;
                background-color: #CCB480;
                z-index: -1;
                width: 100%;
            }
        }
    }
    .print {
        position: relative;
        padding: 0 60px 30px;
    }
    .type {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        position: relative;
        z-index: 2;
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
    }
    .slider-block {
        position: relative;
        z-index: 1;
        margin-top: 10px;
        .el-slider-block {
            opacity: 0;
        }
    }
    .slider {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        display: flex;
        align-items: center;
        z-index: -1;
        .down {
            width: 100%;
            height: 8px;
            background-color: #A39066;
            position: relative;
            z-index: 1;
            > .point {
                position: absolute;
                background-color: #A39066;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                top: -4px;
                z-index: -1;
                &.active {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    &::after {
                        content: "";
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        background-color: #683200;
                        border-radius: 50%;
                    }
                }
                &:nth-child(1) {
                    left: -8px;
                }
                &:nth-child(2) {
                    left: calc(25% - 8px);
                }
                &:nth-child(3) {
                    left: calc(50% - 8px);
                }
                &:nth-child(4) {
                    left: calc(75% - 8px);
                }
                &:nth-child(5) {
                    left: calc(100% - 8px);
                }
            }
            .finish {
                background-color: #683200;
                width: 100%;
                height: 8px;
            }
            .marker {
                width: 20px;
                height: 20px;
                background-image: url('../assets/exchange/slider.png');
                background-repeat: no-repeat;
                background-size: cover;
                position: absolute;
                top: -6px;
                left: -10px;
            }
        }
    }
    .slider-text {
        display: flex;
        margin: 0 -13%;
        text-align: center;
        font-size: 14;
        color: rgba(0, 0, 0, 0.5);
        > div {
            flex: 0 0 20%
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
    .btn {
        margin-top: 20px;
        text-align: center;
        &.disabled {
            span {
                position: relative;
                display: inline-block;
                
            }
            span::after {
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                left: 0;
                border-radius: 10px;
                top: 0;
            }
        }
        img {
            cursor: pointer;
            vertical-align: middle;
        }
    }
    ::v-deep {
        .el-dialog {
            background-color: #CCB480;
        }
    }
}
@keyframes turn{
    0%{
        transform: rotate(0deg);
    }
    25%{
        transform: rotate(-90deg);
    }
    50%{
        transform: rotate(-180deg);
    }
    75%{
        transform: rotate(-270deg);
    }
    100%{
        transform: rotate(-360deg);
    }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
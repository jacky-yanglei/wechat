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
                <div @click="selectTab(4)" :class="tabIndex === 4?'active':''">MVP</div>
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
                    <div>当前价格：{{ roomInfo.price.toFixed(2) }}元</div>
                    <div class="fast-select">
                        <div @click="priceUp(1.1)" class="up">上涨 10%</div>
                        <div @click="priceUp(1.25)" class="up">上涨 25%</div>
                        <div @click="priceUp(1.75)" class="up">上涨 75%</div>
                        <div @click="priceUp(2)" class="up">上涨 100%</div>
                        <div @click="priceUp(0.9)" class="down">下跌 10%</div>
                        <div @click="priceUp(0.75)" class="down">下跌 25%</div>
                        <div @click="priceUp(0.25)" class="down">下跌 75%</div>
                        <div @click="priceUp(0.01)" class="down">下跌 99%</div>
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
                    <div>录入手机号</div>
                    <div>
                        <el-input v-model="mvpPhone"></el-input>
                    </div>
                    <div class="confirm-btn">
                        <img @click="mvpPost()" src="../assets/exchange/confirm-btn.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ws from '../assets/websoket';
export default {
    data() {
        return {
            value: false,
            tabIndex: 1,
            role: '觉觉', // 角色
            amount: '', // 数量
            price: '',
            exchangeType: 0,
            mvp: '',
            mvpPhone: '',
            roomInfo: {},
            roleOptions: [
                {
                    value: '觉觉',
                    label: '觉觉'
                }, 
                {
                    value: '飒飒',
                    label: '飒飒'
                }, 
                {
                    value: '霸霸',
                    label: '霸霸'
                }, 
                {
                    value: '玛玛',
                    label: '玛玛'
                }, 
                {
                    value: '臭臭',
                    label: '臭臭'
                },
                {
                    value: '蒂蒂',
                    label: "蒂蒂"
                },
                {
                    value: '野也',
                    label: "野也"
                },
                {
                    value: '帅帅',
                    label: "帅帅"
                },
                {
                    value: '宝宝',
                    label: "宝宝"
                }
            ]
        }
    },
    mounted() {
        this.initWs();
    },
    methods: {
        priceUp(radio) {
            this.price = parseFloat((this.roomInfo.price * radio).toFixed(2));
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
            ws.send(JSON.stringify({data_type: 'set_mvp', data: {name: this.mvp, phone: this.mvpPhone}}));
        },
        getCode() {
            // console.log(this.$route.params.roomid)
            // console.log(process.env.VUE_APP_Redirect)
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
                ws.reload(this.$route.params.roomid, () => {
                    this.postGetRoomInfo();
                });
                ws.onmessage((e) => {
                    this.onmessage(e)
                });
            }
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
        },
        postGetRoomInfo() {
            ws.send(JSON.stringify({data_type: 'room_info', data: {}}));
        },
        getRoomInfo(data) {
            this.roomInfo = data;
            this.value = data.is_open_trade;
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
            
        }
    }
}
</script>
<style lang="less" scoped>
.page {
    max-width: 750px;
    margin: 0 auto;
    min-height: 100vh;
    background-image: url('/ddd/static/images/exchange/bg.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #272828;

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
                &:last-child {
                    text-align: left;
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
                margin-top: 10px;
                > div {
                    width: 48%;
                    height: 32px;
                    border-radius: 16px;
                    margin-top: 10px;
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


}
</style>
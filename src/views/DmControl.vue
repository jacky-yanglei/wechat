<template>
    <div class="page">
        <div class="change-status">
            <img class="channel" src="../assets/exchange/channel.png" alt="">
            <div class="content">
                <div>
                    <div>是否开启交易</div>
                    <el-switch
                        v-model="value"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </div>
                <div class="open-price">
                    <img src="../assets/exchange/open-price.png" alt="">
                </div>
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
                        <div><i class="check active"></i>入金</div>
                        <div><i class="check"></i>出金</div>
                    </div>
                    <div>输入金额</div>
                    <div class="input-group">
                        <el-input type="number" v-model="amount">
                        </el-input>
                        <i class="after">万元</i>
                    </div>
                    <div class="confirm-btn">
                        <img src="../assets/exchange/confirm-btn.png" alt="">
                    </div>
                </div>
                <div v-if="tabIndex === 2" class="section2">
                    <div>输入价格</div>
                    <div class="input-group">
                        <el-input type="number" v-model="amount">
                        </el-input>
                        <i class="after">元</i>
                    </div>
                    <div>当前价格：120.23元</div>
                    <div class="fast-select">
                        <div class="up">上涨 10%</div>
                        <div class="up">上涨 25%</div>
                        <div class="up">上涨 75%</div>
                        <div class="up">上涨 100%</div>
                        <div class="down">下跌 10%</div>
                        <div class="down">下跌 25%</div>
                        <div class="down">下跌 75%</div>
                        <div class="down">下跌 99%</div>
                    </div>
                    <div class="confirm-btn">
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
                            <a class="img"></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            value: true,
            tabIndex: 1,
            role: '派大星', // 角色
            amount: '', // 数量


            roleOptions: [
                {
                    value: '派大星',
                    label: '派大星'
                }, 
                {
                    value: '海绵宝宝',
                    label: '海绵宝宝'
                }, 
                {
                    value: '双皮奶',
                    label: '双皮奶'
                }, 
                {
                    value: '选项4',
                    label: '龙须面'
                }, 
                {
                    value: '选项5',
                    label: '北京烤鸭'
                }
            ]
        }
    },
    methods: {
        selectTab(index) {
            this.tabIndex = index;
        }
    }
}
</script>
<style lang="less" scoped>
.page {
    max-width: 750px;
    margin: 0 auto;
    min-height: 100vh;
    background-image: url('/static/images/exchange/bg.png');
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
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    font-size: 24px;
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
                &:nth-child(1) {
                    flex: 0 0 40%;
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
                    flex: 0 0 40%;
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
                    > .img {
                        width: 150px;
                        height: 150px;
                        display: inline-block;
                        background-color: #fff;
                        border-radius: 6px;
                    }
                }
            }
        }
    }


}
</style>
<template>
    <div class="page">
        <div class="title">
            <div>东印钞无限公司</div>
            <div><span>价格：</span><span>76.2</span></div>
        </div>
        <div class="chart" ref="chart">

        </div>
        <div class="marketvalue">
            <div>
                <div>总资产</div>
                <div>1000万元</div>
            </div>
            <div>
                <div>现金</div>
                <div>100万元</div>
            </div>
            <div>
                <div>股票价值</div>
                <div>900万元</div>
            </div>
            <div>
                <div>持仓量</div>
                <div>5000股</div>
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
                <div @click="selectExchange(1)" :class="exchangeType === 1 ? 'active' : ''"><i class="check" :class="exchangeType === 1 ? 'active' : ''"></i>卖出  </div>
            </div>
            <div>
                <div>输入金额</div>
                <div class="input-group">
                    <el-input type="number" v-model="amount">
                    </el-input>
                    <i class="after">万元</i>
                </div>
            </div>
            <div class="slider-block">
                <div class="el-slider-block">
                    <el-slider
                    v-model="radio"
                    :show-tooltip="false"
                    :step="0.1"
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
            <div class="btn">
                <img v-if="exchangeType === 0" @click="buy()" src="../assets/exchange/buy-btn.png" alt="">
                <img v-if="exchangeType === 1" @click="sell()" src="../assets/exchange/sell-btn.png" alt="">
            </div>
        </div>
    </div>
</template>
<script>
import highcharts from 'highcharts/highstock'
export default {
    data() {
        return {
            exchangeType: 0,
            amount: '',  
            radio: 0,
            chart: null,
        }
    },
    mounted() {
        this.chart = highcharts.chart(this.$refs.chart, {
            chart: {
                backgroundColor: 'rgba(0,0,0,0)'
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
                    marker: {
                        enabled: false
                    },
                    data: [1,2,3,4]
                }
            ]
        });
        // setTimeout(() => {
        //     let point = Math.random(10)*10
        //     console.log(point);
        //     this.chart.series[0].addPoint(
        //         point
        //     )
        // }, 1000)
        setInterval(() => {
            let point = Math.random(10)*10
            console.log(point);
            this.chart.series[0].addPoint(
                point
            )
        }, 1000);
    },
    methods: {
        selectExchange(index) {
            this.exchangeType = index;
        },
        buy() {

        },
        sell() {

        }
    }
}
</script>
<style lang="less" scoped>
.page {
    max-width: 750px;
    margin: 0 auto;
    background-color: #CCB480;
    min-height: 100vh;
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
    .btn {
        margin-top: 20px;
        text-align: center;
        img {
            cursor: pointer;
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
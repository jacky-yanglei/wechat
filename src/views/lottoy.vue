<template>
    <div class="page">
        <div class="title"><img src="../assets/exchange/title.png" alt=""></div>
        <div class="bg">
            <div class="lottery" ref="lottery">
                <div class="lottery-block lottery-block1 red">
                    代金券
                </div>
                <div class="lottery-block lottery-block2">
                    <!-- <div>手办</div>
                    <div>+</div>
                    <div>瓜子盲盒</div> -->
                    IPhone
                </div>
                <div class="lottery-block lottery-block3 red">
                    <div>纯黄金瓜子</div>
                    <div>+</div>
                    <div>手办盲盒</div>
                </div>
                <div class="lottery-block lottery-block4">
                    瓜子盲盒
                </div>
                <div class="lottery-block lottery-block12">
                    手办盲盒
                </div>
                <div class="lottery-block"></div>
                <div class="lottery-block"></div>
                <div class="lottery-block lottery-block5 red">代金券</div>
                <div class="lottery-block lottery-block11 red">代金券</div>
                <div class="lottery-block"></div>
                <div class="lottery-block"></div>
                <div class="lottery-block lottery-block6">手办盲盒</div>
                <div class="lottery-block lottery-block10">瓜子盲盒</div>
                <div class="lottery-block lottery-block9 red">
                    <div>纯黄金瓜子</div>
                    <div>+</div>
                    <div>手办盲盒</div>
                </div>
                <div class="lottery-block lottery-block8">
                    <!-- <div>手办</div>
                    <div>+</div>
                    <div>瓜子盲盒</div> -->
                    IPhone
                </div>
                <div class="lottery-block lottery-block7 red">代金券</div>
                <div class="center-btn">
                    <button class="btn" @click="todo()">抽奖</button>
                </div>
            </div>
        </div>
        <div class="tips">
            <div>#有奖话题#</div>
            <div>小红书or微博发布 玩吨2+嗑瓜子的场景</div>
            <div>关注 洽洽 并@洽洽 带话题#剧本杀，嗑洽洽</div>
            <div>（微博：洽洽坚果；小红书：洽洽）</div>
            <div>就有机会获得由洽洽瓜子提供的</div>
            <div>“拍立得&9口味洽洽瓜子大礼包”</div>
            <div>“大肚杯&9口味洽洽瓜子大礼包”</div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            price: [
                '代金券',
                'IPhone',
                '纯黄金瓜子+手办盲盒',
                '瓜子盲盒',
                '代金券',
                '手办盲盒',
                '代金券',
                'IPhone',
                '纯黄金瓜子+手办盲盒',
                '瓜子盲盒',
                '代金券',
                '手办盲盒'
            ]
        }
    },
    computed: {
        goods: function() {
            return function(id) {
                if (id == 1) {
                    return 2
                }
                if (id == 2) {
                    return 3
                }
                if (id == 3) {
                    return 4
                }
                if (id == 4) {
                    return 6
                }
                if (id == 5) {
                    return 1
                }
                return 11;
            }
        }
    },
    mounted() {
    },
    methods: {
        todo() {
            axios.put(process.env.VUE_APP_BASE_URL + `mvp/mvp/${this.$route.params.phone}/draw/`).then(({data}) => {
                if (data.status === 200) {
                    let winner = this.goods(data.data.id);
                    this.lottery(this.$refs.lottery,
                    {
                        winner: winner, // 中奖项 必传
                        price: this.price, // 奖品列表 非必传
                        callback: (index) => {
                            this.$alert(`抽中 ${ this.price[index-1] }`, '恭喜您', {
                                confirmButtonText: '去领奖',
                                callback: () => {
                                    if (winner == 1 || winner == 11) {
                                        location.href = 'https://s.vchangyi.com/sI6';
                                    } else {
                                        this.$router.push('/setAddress/' + this.$route.params.phone);
                                    }
                                }
                            });
                        } // 抽奖转完之后的回调方法
                    });
                } else {
                    this.$alert(data.message, '提示', {
                        confirmButtonText: '确定',
                        type: 'error',
                        showClose: false,
                        callback: () => {
                        }
                    });
                }
            })
        },
        lottery(elem, option) {
            option.winner = parseInt(option.winner);
            if (option.winner < 1 || option.winner > 12){
                console.error('中奖项不在范围内');
                return;
            }
            if (!option.callback) {
                option.callback = function (index) {
                    console.log(index);
                }
            }
            elem.priceArr = option.price || [1,2,3,4,5,6,7,8,9,0,11,12];
            elem.IntervalIndex = 0;
            var fastCircle = 3;
            var fastSpeed = 60;
            var fastCount = 0;
            var slowCircle = 2;
            var slowSpeed = 120;
            var slowCount = 0;
            elem.resultSpeed = [];
            for (var i = 0; i < elem.priceArr.length; i++) {
                elem.resultSpeed.push(slowSpeed + slowSpeed * 2 * i);
            }
            var _that = elem;
            var timer = setInterval(function () {
                _that.activeFun();
                fastCount += fastSpeed;
                if (fastCount === fastCircle*_that.priceArr.length*fastSpeed + fastSpeed*fastCircle) {
                    clearInterval(timer);
                    timer = setInterval(function () {
                        _that.activeFun();
                        slowCount += slowSpeed;
                        if (slowCount === slowCircle*_that.priceArr.length*slowSpeed + slowSpeed*slowCircle + option.winner * slowSpeed) {
                            clearInterval(timer);
                            _that.resultFun();
                        }
                    }, slowSpeed);
                }
            }, fastSpeed);
            elem.activeFun = function () {
                let block = elem.getElementsByClassName('lottery-block');
                for (let i = 0; i < block.length;i++) {
                    block[i].classList.remove('active');
                }
                if (elem.IntervalIndex === elem.priceArr.length) {
                    elem.IntervalIndex = -1;
                }
                elem.IntervalIndex++;
                if (elem.getElementsByClassName('lottery-block' + (elem.IntervalIndex+1)).length > 0) {
                    elem.getElementsByClassName('lottery-block' + (elem.IntervalIndex+1))[0].classList.add('active');
                }
            };
            elem.resultFun = function () {
                var Arr = elem.resultSpeed;
                var _that = elem;
                for (var i = 0;i < Arr.length; i++) {
                    setTimeout(function () {
                        _that.activeFun();
                        if (i === Arr.length - 1) {
                            setTimeout(option.callback(option.winner), 300);
                        }
                    }(i), Arr[i]);
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .page {
        min-height: 100vh;
        max-width: 750px;
        margin: 0 auto;
        background-image: url('/ddd/static/images/exchange/bg.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-color: #272828;
        padding: 0 15px;
        padding-top: 20px;
        box-sizing: border-box;
        .title {
            padding-top: 20px;
            text-align: center;
            margin-bottom: 20px;
        }
        .tips {
            width: 320px;
            color: #fff;
            font-size: 14px;
            margin: 20px auto 0;
        }
    }
    .bg {
        margin: 0 auto;
        width: 320px;
        height: 290px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('../assets/exchange/lotterybg.png')
    }
    .lottery {
        width: 280px;
        // max-width: 400px;
        margin: 0 auto;
        height: 250px;
        // background-color: #5fafea;
        display: flex;
        flex-wrap: wrap;
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        background-color: #F84B4F;
        font-size: 14px;
        color: white;
    }
    .lottery .lottery-block {
        width: 25%;
        height: 25%;
        // background-color: #ff000061;
        // border: 1px solid silver;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        line-height: 16px;
    }
    .lottery .lottery-block.red {
        background-color: #FF9EA2;
    }
    .lottery .lottery-block.active, .lottery .lottery-block.red.active {
        background-color: #C13538;
    }
    .lottery .center-btn {
        position: absolute;
        width: 50%;
        height: 50%;
        // background-color: rgba(255, 255, 0, 0.58);
        background-color: #ff644f;
        top: 25%;
        left: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 16px;
    }
    .lottery .center-btn button {
        padding: 20px;
        background: #F2E2B4;
        border: 2px solid #FF8B49;
        box-sizing: border-box;
        border-radius: 8px;
        color: #F84A4E;
        font-size: 20px;
        font-family: '优设标题黑';
    }
</style>
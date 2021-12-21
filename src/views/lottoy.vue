<template>
    <div>
        <div class="lottery" ref="lottery">
        <div class="lottery-block lottery-block1">
            5折优惠券
        </div>
        <div class="lottery-block lottery-block2">
            <div>手办</div>
            <div>+</div>
            <div>瓜子盲盒</div>
        </div>
        <div class="lottery-block lottery-block3">
            IPhone
        </div>
        <div class="lottery-block lottery-block4">
            5折优惠券
        </div>
        <div class="lottery-block lottery-block12">
            瓜子盲盒
        </div>
        <div class="lottery-block"></div>
        <div class="lottery-block"></div>
        <div class="lottery-block lottery-block5">手办盲盒</div>
        <div class="lottery-block lottery-block11">手办盲盒</div>
        <div class="lottery-block"></div>
        <div class="lottery-block"></div>
        <div class="lottery-block lottery-block6">瓜子盲盒</div>
        <div class="lottery-block lottery-block10">5折优惠券</div>
        <div class="lottery-block lottery-block9">
            IPhone
        </div>
        <div class="lottery-block lottery-block8">
            <div>手办</div>
            <div>+</div>
            <div>瓜子盲盒</div>
        </div>
        <div class="lottery-block lottery-block7">5折优惠券</div>
        <div class="center-btn">
            <button class="btn" @click="todo()">抽奖</button>
        </div>
    </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            price: [
                '5折优惠券',
                '手办+瓜子盲盒',
                'IPhone',   
                '5折优惠券',
                '手办盲盒',
                '瓜子盲盒',
                '5折优惠券',
                '手办+瓜子盲盒',
                'IPhone',
                '5折优惠券',
                '手办盲盒',
                '瓜子盲盒'
            ]
        }
    },
    methods: {
        todo() {
            this.lottery(this.$refs.lottery,
            {
                winner: 11, // 中奖项 必传
                price: this.price, // 奖品列表 非必传
                callback: (index) => {
                    this.$alert(`抽中 ${ this.price[index-1] }`, '恭喜您', {
                        confirmButtonText: '去领奖',
                        callback: () => {
                            if (index === 1 || index === 4 || index === 7 || index === 10) {
                                location.href = 'https://s.vchangyi.com/sI6';
                            } else {
                                this.$router.push('/setAddress')
                            }
                        }
                    });
                } // 抽奖转完之后的回调方法
            });
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
            var fastSpeed = 20;
            var fastCount = 0;
            var slowCircle = 2;
            var slowSpeed = 40;
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
                // elem.getElementsByClassName('.lottery-block').removeClass('active');
                if (elem.IntervalIndex === elem.priceArr.length) {
                    elem.IntervalIndex = -1;
                }
                elem.IntervalIndex++;
                if (elem.getElementsByClassName('lottery-block' + (elem.IntervalIndex+1)).length > 0) {
                    elem.getElementsByClassName('lottery-block' + (elem.IntervalIndex+1))[0].classList.add('active');
                }
                // elem.getElementsByClassName('lottery-block' + (elem.IntervalIndex+1))[0].classList.add('active');
                // elem.find('.lottery-block' + (elem.IntervalIndex+1)).addClass('active');
            };
            elem.resultFun = function () {
                var Arr = elem.resultSpeed;
                var _that = elem;
                for (var i = 0;i < Arr.length; i++) {
                    setTimeout(function () {
                        _that.activeFun();
                        if (i === Arr.length - 1) {
                            setTimeout(option.callback(option.winner),200);
                        }
                    }(i), Arr[i]);
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
    * {
        margin: 0;
        padding: 0;
    }
    .lottery {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        height: 300px;
        // background-color: #5fafea;
        display: flex;
        flex-wrap: wrap;
        position: relative;
    }
    .lottery .lottery-block {
        width: 25%;
        height: 25%;
        background-color: rgba(255, 0, 0, 0.38);
        border: 1px solid silver;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        line-height: 16px;
    }
    .lottery .lottery-block.active {
        background-color: red;
    }
    .lottery .center-btn {
        position: absolute;
        width: 50%;
        height: 50%;
        // background-color: rgba(255, 255, 0, 0.58);
        background-color: white;
        top: 25%;
        left: 25%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .lottery .center-btn button {
        padding: 20px 50px;
    }
</style>
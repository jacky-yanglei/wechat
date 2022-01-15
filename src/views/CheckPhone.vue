<template>
    <div class="page">
        <div class="title"><img src="../assets/exchange/title.png" alt=""></div>
        <div class="content">
            <div class="check_phone">
                <img src="../assets/exchange/check_phone_text.png" alt="">
            </div>
            <div class="check_phone">
                <img src="../assets/exchange/check_phone.png" alt="">
            </div>
            <div class="header">
                <img src="../assets/exchange/top-pip.png" alt="">
            </div>
            <div class="print">
                <div>
                    <div>手机号</div>
                    <div>
                        <el-input v-model="phone">
                        </el-input>
                    </div>
                    <div class="error-text" v-if="postStatus && !phone">手机号不能为空</div>
                </div>
                <div>
                    <div>角色</div>
                    <div>
                        <el-input v-model="name"></el-input>
                    </div>
                    <div class="error-text" v-if="postStatus && !name">角色不能为空</div>
                </div>
                <div>
                    <div>您赚到了多少金嗑啦？</div>
                    <div>
                        <el-input type="number" v-model="count"></el-input>
                    </div>
                    <div class="error-text" v-if="postStatus && !count">金嗑啦不能为空</div>
                </div>
                <div class="btn">
                    <img @click="post()" src="../assets/exchange/confirm-btn.png" alt="">
                </div>
            </div>
            <div class="footer">
                <img src="../assets/exchange/bottom-pip.png" alt="">
            </div>
            <!-- <div class="tips">
                <div>参与“吨2”即可获得【洽洽瓜子淘金大礼包专属5折优惠福利】</div>
                <div>-----------------------------</div>
                <div>淘“金”盲盒抽奖活动</div>
                <div>【iPhone手机】【洽洽真金瓜子&吨吨手办盲盒】【手办盲盒】【洽洽瓜子淘金盲盒大礼包】【洽洽瓜子淘金大礼包专属5折优惠福利】哪一个将是你带回去的宝藏呢！百分百中奖！！</div>
                <div>活动期至2022年2月28日，宝藏有限，抽完即止。</div>
                <div>活动解释权归壹直爽发行所有。</div>
                <div>-----------------------------</div>
                <div>#有奖话题#</div>
                <div>小红书or微博发布【玩吨2+嗑瓜子】的场景</div>
                <div>关注 洽洽 并@洽洽 带话题#剧本杀，嗑洽洽（微博：洽洽坚果；小红书：洽洽）</div>
                <div>就有机会获得由洽洽瓜子提供的“拍立得&9口味洽洽瓜子大礼包”“大肚杯&9口味洽洽瓜子大礼包”</div>
            </div> -->
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            phone: '',
            name: '',
            count: '',
            postStatus: false
        }
    },
    methods: {
        post() {
            this.postStatus = true;
            if(this.phone && this.name && this.count) {
                axios.get(process.env.VUE_APP_BASE_URL + `mvp/mvp/${this.phone}/check/`).then(({data}) => {
                    console.log(data);
                    if (data.status === 200) {
                        if (!data.data.played) {
                            this.$alert('对不起，你还未玩过吨吨吨2，不能参与抽奖', '提示', {
                                confirmButtonText: '确定',
                                type: 'error',
                                showClose: false,
                                callback: () => {
                                }
                            });
                            return;
                        } else if(data.data.played && !data.data.goods) {
                            this.$router.push('/lottery/' + this.phone);
                        } else if(data.data.played && data.data.goods && !data.data.is_sub_address) {
                            this.$router.push('/setAddress/' + this.phone)
                        } else if(data.data.played && data.data.goods && data.data.is_sub_address) {
                            this.$alert('对不起，您已抽过奖，不可重复', '提示', {
                                confirmButtonText: '确定',
                                type: 'error',
                                showClose: false,
                                callback: () => {
                                }
                            });
                        }
                        // if(data.data.played&&data.data.is_mvp&&!data.data.goods) {
                        //     this.$router.push('/lottery/' + this.phone)
                        //     return;
                        // }
                        // if(data.data.played&&!data.data.is_mvp&&!data.data.get_ticket) {
                        //     location.href = 'https://s.vchangyi.com/sJM';
                        //     return;
                        // }
                        // if (data.data.played&&data.data.is_mvp&&data.data.goods&&!data.data.is_sub_address) {
                        //     this.$router.push('/setAddress/' + this.phone)
                        //     return;
                        // }
                        // if (data.data.played&&data.data.is_mvp&&data.data.goods&&data.data.is_sub_address&&!data.data.get_ticket) {
                        //     location.href = 'https://s.vchangyi.com/sJM';
                        //     return;
                        // }
                        // if ((data.data.played&&data.data.is_mvp&&data.data.goods&&data.data.is_sub_address&&data.data.get_ticket) || (data.data.played&&!data.data.is_mvp&&data.data.get_ticket)) {
                        //     this.$alert('对不起，您已抽过奖或领过券，不可重复', '提示', {
                        //         confirmButtonText: '确定',
                        //         type: 'error',
                        //         showClose: false,
                        //         callback: () => {
                        //         }
                        //     });
                        // }
                    }
                })
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
    .el-select {
        width: 100%;
    }
    .error-text {
        color: red;
        font-size: 14px;
    }
    &::v-deep input{
        font-size: 16px;
        background-color: #301802;
        border-radius: 25px;
        color: #fff;
        border: 1px solid #301802;
    }
    .title {
        padding-top: 20px;
        text-align: center;
    }
    .content {
        max-width: 300px;
        margin: 0 auto;
        .header {
            margin: 0 -15px;
        }
        .footer {
            margin: 0 -15px;
        }
        .check_phone {
            text-align: center;
            margin-bottom: 10px;
            img {
                width: auto;
            }
        }
        .print {
            background-color: #CCB480;
            margin: -20px 0 -30px;
            padding: 30px 16px 30px;
            box-sizing: border-box;
            > div {
                margin-bottom: 10px;
            }
            .btn {
                margin-top: 20px;
                text-align: center;
                img {
                    width: auto;
                    cursor: pointer;
                }
            }
        }
        img {
            width: 100%;
            vertical-align: middle;
        }
    }
    .tips {
        margin-top: 20px;
        color: white;
        font-size: 14px;
    }
}
</style>
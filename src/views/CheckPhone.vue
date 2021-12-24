<template>
    <div class="page">
        <div class="title"><img src="../assets/exchange/title.png" alt=""></div>
        <div class="content">
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
                <div class="btn">
                    <img @click="post()" src="../assets/exchange/confirm-btn.png" alt="">
                </div>
            </div>
            <div class="footer">
                <img src="../assets/exchange/bottom-pip.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            phone: '',
            postStatus: false
        }
    },
    methods: {
        post() {
            this.postStatus = true;
            if(this.phone) {
                axios.get(process.env.VUE_APP_BASE_URL + `mvp/mvp/${this.phone}/check/`).then(({data}) => {
                    if (data.status === 200) {
                        if (!data.data.played) {
                            this.$alert('对不起，你还未玩过DDD2，不能参与抽奖/领券', '提示', {
                                confirmButtonText: '确定',
                                type: 'error',
                                showClose: false,
                                callback: () => {
                                }
                            });
                            return;
                        }
                        if(data.data.played&&data.data.is_mvp&&!data.data.goods) {
                            this.$router.push('/lottery/' + this.phone)
                            return;
                        }
                        if(data.data.played&&!data.data.is_mvp&&!data.data.ticket) {
                            location.href = 'https://s.vchangyi.com/sI6';
                            return;
                        }
                        if (data.data.played&&data.data.is_mvp&&data.data.goods&&!data.data.is_sub_address) {
                            this.$router.push('/setAddress/' + this.phone)
                            return;
                        }
                        if ((data.data.played&&data.data.is_mvp&&data.data.goods&&data.data.is_sub_address) || (data.data.played&&!data.data.is_mvp&&!data.data.ticket)) {
                            this.$alert('对不起，您已抽过奖或领过券，不可重复', '提示', {
                                confirmButtonText: '确定',
                                type: 'error',
                                showClose: false,
                                callback: () => {
                                }
                            });
                        }
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
}
</style>
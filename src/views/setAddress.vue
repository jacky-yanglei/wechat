<template>
    <div class="page">
        <div class="title"><img src="../assets/exchange/title.png" alt=""></div>
        <div class="content" v-if="!setSuccess">
            <div class="header">
                <img src="../assets/exchange/top-pip.png" alt="">
            </div>
            <div class="print">
                <div>
                    <div>请填写收货人</div>
                    <div>
                        <el-input v-model="name"></el-input>
                    </div>
                    <div class="error-text" v-if="postStatus && !name">收货人不能为空</div>
                </div>
                <div>
                    <div>请填写收货人手机号</div>
                    <div>
                        <el-input v-model="phone"></el-input>
                    </div>
                    <div class="error-text" v-if="postStatus && !phone">收货人手机号不能为空</div>
                </div>
                <div>
                    <div>请填写收货地址</div>
                    <div>
                        <el-input v-model="address"></el-input>
                    </div>
                    <div class="error-text" v-if="postStatus && !address">收货地址不能为空</div>
                </div>
                <div class="btn">
                    <img @click="post()" src="../assets/exchange/confirm-btn.png" alt="">
                </div>
            </div>
            <div class="footer">
                <img src="../assets/exchange/bottom-pip.png" alt="">
            </div>
        </div>
        <div class="success" v-else>
            提交成功，等待礼品送达吧!
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            name: '',
            phone: '',
            address: '',
            postStatus: false,
            setSuccess: false,
        }
    },
    methods: {
        post() {
            this.postStatus = true;
            if (!this.valid()) {
                return;
            }
            axios.put(process.env.VUE_APP_BASE_URL + `mvp/mvp/${this.$route.params.phone}/address/`, 
            {
                name: this.name,
                recv_phone: this.phone,
                address_details: this.address,
            }).then(({data}) => {
                if (data.status == 200) {
                    this.$alert('提交成功，等待礼品送达吧!', '提示', {
                        confirmButtonText: '确定',
                        showClose: false,
                        callback:() => {
                            this.setSuccess = true;
                            // axios.get(process.env.VUE_APP_BASE_URL + `mvp/mvp/${this.$route.params.phone}/check/`).then(({data}) => {
                            //     if (data.status === 200) {
                            //         location.href = 'https://s.vchangyi.com/sJM';
                            //     }
                            // })
                        }
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
            });
        },
        valid() {
            if (
                !this.phone
                ||
                !this.name
                ||
                !this.address
            ) {
                return false;
            }
            return true;
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
    padding: 0 15px 50px;
    .success {
        width: 100%;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #fff;
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
        .error-text {
            color: red;
            font-size: 14px;
        }
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
        }
        img {
            width: 100%;
            vertical-align: middle;
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
}
</style>
<template>
    <div class="page">
        <div class="title"><img src="../assets/exchange/title.png" alt=""></div>
        <div class="content">
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
    </div>
</template>

<script>
// import axios from 'axios';
export default {
    data() {
        return {
            name: '',
            phone: '',
            address: '',
            postStatus: false,
        }
    },
    methods: {
        post() {
            this.postStatus = true;
            if (!this.valid()) {
                return;
            }
            this.$alert('地址已提交，您可以关闭页面，等待收货啦！', '提示', {
                confirmButtonText: '确定',
            })
            // axios.post(
            //     process.env.VUE_APP_BASE_URL+ 'script/register/' + this.$route.params.id,
            //     {
            //         "name": this.name,
            //         "store_name": this.store,
            //         "phone": this.phone,
            //         "address": this.address,
            //         "password": this.password,
            //     }
            // ).then(({data}) => {
            //     if(data.status === 200) {
            //         // this.$router.push('/ActiveSuccess');
            //         this.$alert('激活成功', '提示', {
            //             confirmButtonText: '确定',
            //             type: 'success',
            //             showClose: false,
            //             callback: () => {
            //                 this.$router.push('/dmlogin');
            //             }
            //         });
            //     } else {
            //         this.$message('注册失败');
            //     }
            // }).catch(() => {
            //     this.$message('注册失败');
            // })
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
    background-image: url('/static/images/exchange/bg.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #272828;
    padding: 0 15px 50px;
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
<template>
    <div class="page">
        <div class="title"><img src="../assets/exchange/title.png" alt=""></div>
        <div class="content">
            <div class="header">
                <img src="../assets/exchange/top-pip.png" alt="">
            </div>
            <div class="print">
                <div>
                    <div>登录名</div>
                    <div>
                        <el-input v-model="name">
                        </el-input>
                    </div>
                    <div class="error-text" v-if="postStatus && !name">用户名不能为空</div>
                </div>
                <div>
                    <div>输入密码</div>
                    <div>
                        <el-input v-model="password" placeholder="" show-password>
                        </el-input>
                    </div>
                    <div class="error-text" v-if="postStatus && !password">密码不能为空</div>
                </div>
                <div>
                    <div>确认密码</div>
                    <div>
                        <el-input v-model="confirmPassword" placeholder="" show-password>
                        </el-input>
                    </div>
                    <div class="error-text" v-if="postStatus && !confirmPassword">确认密码不能为空</div>
                    <div class="error-text" v-if="postStatus && (!!confirmPassword && !!password) && confirmPassword != password">两次密码不一致</div>
                </div>
                <div>
                    <div>店名</div>
                    <div>
                        <el-input v-model="store">
                        </el-input>
                    </div>
                </div>
                <div>
                    <div>电话</div>
                    <div>
                        <el-input v-model="phone">
                        </el-input>
                    </div>
                </div>
                <div>
                    <div>地址</div>
                    <div>
                        <el-input v-model="address">
                        </el-input>
                    </div>
                </div>
                <div class="btn">
                    <img @click="post()" src="../assets/exchange/active.png" alt="">
                </div>
            </div>
            <div class="footer">
                <img src="../assets/exchange/bottom-pip.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: '',
            password: '',
            confirmPassword: '',
            store: '',
            phone: '',
            address: '',
            postStatus: false,
        }
    },
    methods: {
        post() {
            this.postStatus = true;
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
    padding-bottom: 50px;
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
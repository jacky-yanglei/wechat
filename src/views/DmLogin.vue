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
                <div class="btn">
                    <img @click="post()" src="../assets/exchange/login.png" alt="">
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
import ws from '../assets/websoket';
export default {
    data() {
        return {
            postStatus: false,
            name: '',
            password: ''
        }
    },
    methods: {
        post() {
            this.postStatus = true;
            if (!this.valid()) {
                return;
            }
            if(ws.status) {
                ws.focusClose = true;
                ws.WebSocket.close();
            }
            axios.post(
                process.env.VUE_APP_BASE_URL+ 'script/login',
                {
                    "name": this.name,
                    "password": this.password,
                }
            ).then(({data}) => {
                if(data.status === 200) {
                    sessionStorage.setItem('jiang', JSON.stringify(data.data.jiang??[1,1,1]));
                    if (data.data.last_room_id) {
                        this.$router.push('/home/' + data.data.last_room_id)
                    } else {
                        localStorage.setItem('token', data.data.token)
                        this.$router.push('/home');
                    }
                } else {
                    this.$message({message: data.message, type: 'error'});
                }
            }).catch(() => {
                this.$message({message: '登录失败', type: 'error'});
            })
        },
        valid() {
            if (
                !this.password
                ||
                !this.name
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
    padding: 0 15px;
    &::v-deep input{
        font-size: 16px;
        background-color: #301802;
        border-radius: 25px;
        color: #fff;
        border: 1px solid #301802;
    }
    .error-text {
        color: red;
        font-size: 14px;
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
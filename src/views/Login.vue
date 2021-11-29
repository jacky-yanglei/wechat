<template>
    <div class="page">
        <img class="avater" src="../assets/Frame.png" alt="">
        <div class="content">
            <div>
                <div>登录名</div>
                <div><el-input v-model="name" placeholder=""></el-input></div>
                <div v-if="post && !name" class="error-text">登录名不能为空</div>
            </div>
            <div>
                <div>密码</div>
                <div><el-input v-model="password" placeholder="" show-password></el-input></div>
                <div v-if="post && !password" class="error-text">密码不能为空</div>
            </div>
        </div>
        <div class="content text-center">
            <el-button type="primary" @click="activate" round>登录</el-button>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            name: '',
            password: '',
            post: false,
        }
    },
    created() {
        // axios.post(process.env.VUE_APP_BASE_URL + 'script/check_register/' + this.$route.params.id).then(({data}) => {
        //     if (data.data) {
        //     this.$router.push('/')
        //     } else {
        //     this.$router.push('/registerInfo/' + this.$route.params.id)
        //     }
        // });
    },
    methods: {
        activate() {
            console.log(1111);
            this.post = true;
            if (!this.valid()) {
                return;
            }
            axios.post(
                process.env.VUE_APP_BASE_URL+ 'script/login',
                {
                    "name": this.name,
                    "password": this.password,
                }
            ).then(({data}) => {
                if(data.status === 200) {
                    localStorage.setItem('token', data.data.token)
                    this.$router.push('/main');
                } else {
                    this.$message('登录失败');
                }
            }).catch(() => {
                this.$message('登录失败');
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
<style scoped lang="less">
    .page {
        display: flex;
        flex-direction: column;
        align-items: center;
        // justify-content: center;
        min-height: 100vh;
        padding: 50px 0;
        box-sizing: border-box;
        .avater {
            width: 80px;
            margin-bottom: 30px;
        }
        .text-center {
            text-align: center;
        }
        .content {
            width: 80%;
            max-width: 400px;
            > div {
                margin-bottom: 20px;
                > div:first-child {
                    color: #5D69B8;
                    font-size: 14px;
                    margin-bottom: 8px;
                }
            }
            .el-input {
                background-color: #F7F7F9;
                border-radius: 16px;
                ::v-deep .el-input__inner {
                    background-color: #F7F7F9;
                    border-radius: 16px;
                    border: none;
                }
            }
            .error-text {
                color: #f56c6c;
                margin-top: 5px;
            }
        }
        .el-button--primary {
            background-color: #3030E0;
            border: none;
            width: 100%;
            max-width: 400px;
            margin-top: 20px;
        }
    }
</style>
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
                        <el-input v-model="store"></el-input>
                    </div>
                    <div class="error-text" v-if="postStatus && !store">店名不能为空</div>
                </div>
                <div>
                    <div>电话</div>
                    <div>
                        <el-input v-model="phone">
                        </el-input>
                    </div>
                    <div class="error-text" v-if="postStatus && !phone">电话不能为空</div>
                </div>
                <div>
                    <div>地址</div>
                    <div>
                        <el-input v-model="address">
                        </el-input>
                    </div>
                    <div class="error-text" v-if="postStatus && !address">地址不能为空</div>
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
import axios from 'axios';
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
            if (!this.valid()) {
                return;
            }
            
            axios.post(
                process.env.VUE_APP_BASE_URL+ 'script/register/' + this.$route.params.id,
                {
                    "name": this.name,
                    "store_name": this.store,
                    "phone": this.phone,
                    "address": this.address,
                    "password": this.password,
                }
            ).then(({data}) => {
                if(data.status === 200) {
                    // this.$router.push('/ActiveSuccess');
                    this.$alert('激活成功', '提示', {
                        confirmButtonText: '确定',
                        type: 'success',
                        showClose: false,
                        callback: () => {
                            this.$router.push('/dmlogin');
                        }
                    });
                } else {
                    this.$message({message: data.message, type: 'error'});
                }
            }).catch(() => {
                this.$message({message: '注册失败', type: 'error'});
            })
        },
        valid() {
            if (
                !this.password
                ||
                !this.store
                ||
                !this.name
                ||
                !this.address
                ||
                !this.phone
                ||
                !this.confirmPassword
            ) {
                return false;
            }
            if (this.password !== this.confirmPassword) {
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
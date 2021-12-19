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
                <div>
                    <div>选择人物</div>
                    <div>
                        <el-select v-model="role" placeholder="请选择">
                            <el-option
                            v-for="item in roleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="error-text" v-if="postStatus && !role">请选择一个角色</div>
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
import ws from '../assets/websoket.js';
export default {
    data() {
        return {
            phone: '',
            role: '',
            postStatus: '',
            roleOptions: [
                {
                    value: '觉觉',
                    label: '觉觉'
                }, 
                {
                    value: '飒飒',
                    label: '飒飒'
                }, 
                {
                    value: '霸霸',
                    label: '霸霸'
                }, 
                {
                    value: '玛玛',
                    label: '玛玛'
                }, 
                {
                    value: '臭臭',
                    label: '臭臭'
                },
                {
                    value: '蒂蒂',
                    label: "蒂蒂"
                },
                {
                    value: '野也',
                    label: "野也"
                },
                {
                    value: '帅帅',
                    label: "帅帅"
                },
                {
                    value: '宝宝',
                    label: "宝宝"
                }
            ]
        }
    },
    methods: {
        post() {
            this.postStatus = true;
            if(this.phone && this.role) {
                if (ws.status) {
                    ws.send(JSON.stringify({data_type: 'init', data: this.role}));
                } else {
                    ws.init(this.$route.params.id);
                    ws.onopen((e) => {
                        console.log(e);
                        ws.send(JSON.stringify({data_type: 'init', data: this.role}));
                    });
                    ws.onmessage(
                        (e) => {
                            if(e.data_type === 'init' && e.success) {
                                sessionStorage.setItem('role', this.role);
                                this.$router.replace('/playerView/' + this.$route.params.id);
                            } else {
                                this.$message({message: e.message, type: 'error'})
                            }
                        }
                    );
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
    background-image: url('/static/images/exchange/bg.png');
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
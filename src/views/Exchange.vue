<template>
    <div class="page" v-if="tokenStatusLoading">
        <div class="banner">
            <img src="../assets/exchange/banner.png" alt="">
        </div>
        <div class="key">
            <img src="../assets/exchange/key.png" alt="">
            <div>
                <div class="btn">
                    <img @click="getCode()" src="../assets/exchange/create-btn.png" alt="">
                </div>
                <div class="tips">
                    <div>
                        文字说明:
                    </div>
                    <p>1、DM创建好房间后,将二维码给玩家扫码</p>
                    <p>2、DM在游戏中可以接受玩家的入金和出金请求</p>
                    <p>3、完成游戏后，DM需要录入谁是MVP并告诉玩家MVP可以抽奖，其他玩家可以领取洽洽瓜子优惠券</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            tokenStatusLoading: false
        }
    },
    created() {
        this.checkToken()
    },
    mounted() {
    },
    methods: {
        checkToken() {
            axios.post(
                process.env.VUE_APP_BASE_URL+ 'script/check_login',
                {
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
            ).then(({data}) => {
                if(data.status === 200) {
                    localStorage.setItem('token', data.data.new_token)
                    this.tokenStatusLoading = true;
                } else {
                    this.$router.push('/dmlogin');
                }
            }).catch(() => {
                this.checkToken();
            })
        },
        getCode() {
            // console.log('创建房间号并获取房间二维码');
            // this.$router.push('/playerJoin')
            // 创建房间并获取房间号
            axios.post(
                process.env.VUE_APP_BASE_URL+ 'room/',
                {
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
            ).then(({data}) => {
                if(data.status === 200) {
                    this.$router.push('/playerJoin/' + data.data.room_id)
                } else {
                    this.$message({message: '网络异常，创建失败', type: 'error'});
                }
            }).catch(() => {
                this.$message({message: '网络异常，创建失败', type: 'error'});
            })
        }
    }
}
</script>

<style lang="less" scoped>
.page {
    max-width: 750px;
    margin: 0 auto;
    min-height: 100vh;
    background-image: url('../assets/exchange/bg.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #272828;
    color: #fff;
    .banner {
        text-align: center;
        img {
            max-width: 240px;
        }
    }
    .key {
        margin-top: 40px;
        text-align: center;
        > img {
            width: 100%;
            max-width: 400px;
            vertical-align: middle;
        }
        > div {
            width: 100%;
            max-width: 400px;
            margin: -5px auto 0;
            background-color: #CCB480;
            padding-top: 20px;
            padding-bottom: 20px;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            .btn {
                > img {
                    cursor: pointer;
                }
            }
            .tips {
                background-color: rgba(147, 102, 64, 0.15);
                border-radius: 8px;
                margin: 20px;
                color: #90681A;
                padding: 10px 40px;
                text-align: left;
            }
        }
    }
}
</style>
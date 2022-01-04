<template>
    <div class="page">
        <div>
            <img src="../assets/exchange/code-box.png" alt="">
            <div class="code">
                <a class="img" ref="qrcode"></a>
            </div>
            <div class="lun">
                <img src="../assets/exchange/code-lun.png" alt="">
            </div>
        </div>
        <div>
            <img src="../assets/exchange/player-join-text.png" alt="">
        </div>
        <div>{{ joined.length }}/9</div>
        <!-- <div>9人本</div> -->
        <div class="online">
            <div class="join" v-for="item in joined" :key="item">{{ item }}</div>
            <div class="no-join" v-for="item in noJoined" :key="item">{{ item }}</div>
        </div>
        <div class="start-game">
            <img @click="startGame()" src="../assets/exchange/play-game.png" alt="">
        </div>
    </div>
</template>
<script>
import ws from '../assets/websoket';
export default {
    data() {
        return {
            roomInfo: {}
        }
    },
    computed: {
        joined: function () {
            if (!this.roomInfo.joined) {
                return [];
            }
            let data = this.roomInfo.joined.concat();
            var index = data.indexOf('admin');
            if (index > -1) {
                data.splice(index, 1);
            }
            return data;
        },
        noJoined() {
            let arr = ['帅帅', '宝宝', '玛玛', '觉觉', '臭臭', '霸霸', '野野', '蒂蒂', '莎莎'];
            return arr.filter(item => this.joined.indexOf(item) == -1);
        }
    },
    created() {
        // let playerInfo = JSON.parse(localStorage.getItem('playerInfo')??'{}');
        // if (playerInfo.role !== 'admin') {
        //     localStorage.removeItem('playerInfo');
        //     setTimeout(() => {
        //         location.href = '/ddd/';
        //     }, 10);
        // }
    },
    mounted() {
        this.initWs();
        console.log(location.origin + process.env.VUE_APP_Redirect + "/playerLogin/" + this.$route.params.roomid,);
        // eslint-disable-next-line no-undef
        new QRCode(this.$refs.qrcode, {
            text: location.origin + process.env.VUE_APP_Redirect + "/playerLogin/" + this.$route.params.roomid,
            width: 140,
            height: 140,
            colorDark : "#000000",
            colorLight : "#ffffff",
            // eslint-disable-next-line no-undef
            correctLevel : QRCode.CorrectLevel.H
        })
    },
    methods: {
        initWs() {
            localStorage.setItem('playerInfo', JSON.stringify({roomId: this.$route.params.roomid, role: 'admin', phone: ""}))
            if (ws.status) {
                ws.send(JSON.stringify({data_type: 'reconnect', data: {name: "admin", phone: '', check_token: localStorage.getItem('token')}}));
                this.postGetRoomInfo();
                ws.onmessage((e) => {
                    this.onmessage(e)
                });
            } else {
                this.reloadWs();
            }
            ws.reloadCallback = () => {
                this.reloadWs();
            }
        },
        reloadWs() {
            ws.reload(this.$route.params.roomid, () => {
                this.postGetRoomInfo();
                ws.onmessage((e) => {
                    this.onmessage(e)
                });
            }, true);
        },
        onmessage(e) {
            if(e.data_type === 'init' || e.data_type === 'reconnect') {
                if (e.success) {
                    sessionStorage.setItem('role', "admin");
                } else {
                    this.$message({message: e.message, type: 'error'})
                }   
            }
            if (e.data_type === 'room_info') {
                if (e.success) {
                    this.roomInfo = e.data;
                }
            }
            if (e.data_type === 'check_token') {
                if(!e.success) {
                    this.$alert(`${e.message}`, '提示', {
                        type: 'error',
                        confirmButtonText: '确定',
                        callback: () => {
                            ws.focusClose = true;
                            ws.WebSocket.close();
                            localStorage.removeItem('playerInfo');
                            localStorage.removeItem('token');
                            setTimeout(() => {
                                location.href = '/ddd/';
                            }, 10)
                        }
                    });
                }
            }
        },
        postGetRoomInfo() {
            ws.send(JSON.stringify({data_type: 'room_info', data: {}}));
        },
        startGame() {
            console.log('开始游戏');
            this.$router.push('/controlCenter/' + this.$route.params.roomid)
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
        text-align: center;
        > div {
            &:first-child {
                // padding-top: 50px;
                > img {
                    width: 200px;
                }
                position: relative;
                z-index: 1;
                .code {
                    position: absolute;
                    width: 100%;
                    top: 0;
                    left: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-top: 60px;
                    height: 100%;
                    box-sizing: border-box;
                    > .img {
                        width: 150px;
                        height: 150px;
                        display: inline-flex;
                        justify-content: center;
                        align-items: center;
                        background-color: #fff;
                        border-radius: 6px;
                    }
                }
                .lun {
                    position: absolute;
                    width: 100%;
                    top: 0;
                    left: 0;
                    // display: flex;
                    // align-items: center;
                    // justify-content: center;
                    padding-top: 15px;
                    height: 100%;
                    box-sizing: border-box;
                    z-index: -1;
                    > img {
                        width: 120px;
                        animation:turn 10s linear infinite;
                    }
                }
            }
            &:nth-child(2) {
                margin-top: 20px;
            }
            &:nth-child(3) {
                margin-top: 10px;
            }
            &:last-child {
                margin-top: 50px;
                &.start-game {
                    img {
                        cursor: pointer;
                    }
                }
            }
            &.online {
                margin: 10px auto 0;
                max-width: 300px;
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                > div {
                    flex: 0 0 33.33%
                }
            }
            .join {
                color: rgb(92, 252, 0);
            }
            .no-join {
                color: red;
            }
        }
    }
    @keyframes turn{
      0%{-webkit-transform:rotate(0deg);}
      25%{-webkit-transform:rotate(90deg);}
      50%{-webkit-transform:rotate(180deg);}
      75%{-webkit-transform:rotate(270deg);}
      100%{-webkit-transform:rotate(360deg);}
    }
</style>
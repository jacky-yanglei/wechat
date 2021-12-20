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
        <!-- <div>9/9</div> -->
        <div>9人本</div>
        <div class="start-game">
            <img @click="startGame()" src="../assets/exchange/play-game.png" alt="">
        </div>
    </div>
</template>
<script>
import ws from '../assets/websoket';
export default {
    data() {
        return {}
    },
    mounted() {
        this.initWs();
        console.log(this.$route.params.roomid);
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
            sessionStorage.setItem('role', 'admin');
            if (ws.status) {
                ws.send(JSON.stringify({data_type: 'init', data: {name: "admin", phone: ''}}));
            } else {
                ws.init(this.$route.params.roomid);
                ws.onopen((e) => {
                    console.log(e);
                    ws.send(JSON.stringify({data_type: 'init', data: {name: "admin", phone: ''}}));
                });
                ws.onmessage(
                    (e) => {
                        if(e.data_type === 'init') {
                            if (e.success) {
                                sessionStorage.setItem('role', {name: "admin", phone: ''});
                            } else {
                                this.$message({message: e.message, type: 'error'})
                            }   
                        }
                    }
                );
            }
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
            &:nth-child(4) {
                margin-top: 80px;
                &.start-game {
                    img {
                        cursor: pointer;
                    }
                }
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
<template>
    <div class="page">
        <div>
            <img src="../assets/exchange/code-box.png" alt="">
            <div class="code">
                <a class="img"></a>
            </div>
        </div>
        <div>
            <img src="../assets/exchange/player-join-text.png" alt="">
        </div>
        <div>9/9</div>
        <div class="start-game">
            <img @click="startGame()" src="../assets/exchange/play-game.png" alt="">
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {}
    },
    methods: {
        startGame() {
            console.log('开始游戏');
            this.$router.push('/controlCenter')
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
                padding-top: 50px;
                position: relative;
                .code {
                    position: absolute;
                    width: 100%;
                    top: 0;
                    left: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-top: 40px;
                    height: 100%;
                    box-sizing: border-box;
                    > .img {
                        width: 150px;
                        height: 150px;
                        display: inline-block;
                        background-color: #fff;
                        border-radius: 6px;
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
</style>
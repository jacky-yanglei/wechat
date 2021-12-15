<template>
    <div class="page">
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
                    <p>1</p>
                    <p>1</p>
                    <p>1</p>
                    <p>1</p>
                    <p>1</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {
        getCode() {
            console.log('创建房间号并获取房间二维码');
            this.$router.push('/playerJoin')
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
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
                    <div class="error-text" v-if="postStatus && !name">手机号不能为空</div>
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
export default {
    data() {
        return {
            phone: '',
            role: '',
            postStatus: '',
            roleOptions: [
                {
                    value: '派大星',
                    label: '派大星'
                }, 
                {
                    value: '海绵宝宝',
                    label: '海绵宝宝'
                }, 
                {
                    value: '双皮奶',
                    label: '双皮奶'
                }, 
                {
                    value: '选项4',
                    label: '龙须面'
                }, 
                {
                    value: '选项5',
                    label: '北京烤鸭'
                }
            ]
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
<template>
    <div>
        <div class="page" v-if="step === 1">
            <div class="perpar">
                <img src="/static/images/perpar.png" alt="">
                <div class="content">
                    <div class="qustion">
                        <div>你是谁？</div>
                        <div class="select">
                            <div>{{ you }} <i class="el-input__icon el-icon-arrow-down"></i></div>
                            <div>
                                <el-select v-model="you" placeholder="请选择">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="qustion">
                        <div>你想对谁说？</div>
                        <div class="select">
                            <div>{{ other }} <i class="el-input__icon el-icon-arrow-down"></i></div>
                            <div>
                                <el-select v-model="other" placeholder="请选择">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="letter-block">
                        <div class="title">写下你想说的话</div>
                        <div class="letter">
                            <el-input type="textarea" v-model="letter"></el-input>
                        </div>
                    </div>
                    <div class="contact">
                        <div class="title">留下你的电话：</div>
                        <div>
                            <el-input v-model="phone" placeholder=""></el-input>
                        </div>
                    </div>
                    <div  class="contact">
                        <div class="title">或者你的微信号：</div>
                        <div>
                            <el-input v-model="wechatCode" placeholder=""></el-input>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn">
                <el-button type="primary" @click="submit" round>扔出漂流瓶</el-button>
            </div>
        </div>
        <div class="page step2" v-if="step === 2 || step === 3">
            <div v-if="step === 2" class="step2init">
                <div style="text-align: left;padding-left: 50px;">
                    <div>你收到一个漂流瓶</div>
                    <div>快打开吧</div>
                </div>
                <div class="btn">
                    <el-button type="primary" @click="step = 3" round>打开漂流瓶</el-button>
                </div>
            </div>
            <div v-if="step === 3" class="step3">
                <div class="perpar">
                    <img src="/static/images/perpar.png" alt="">
                    <div class="content">
                        <div>
                            {{ returnLetter.recv_user }} :
                        </div>
                        <div>
                            {{ returnLetter.content }}
                        </div>
                        <div>
                            我的电话：{{ returnLetter.phone || '--' }}或者加我微信：{{ returnLetter.wechat || '--' }}
                        </div>
                        <div style="text-align: right;">
                            <div>{{ returnLetter.create_user }}</div>
                            <div>{{ today }}</div>
                        </div>
                    </div>
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
            you: '魏莱',
            other: '苏忍冬',
            letter: '',
            phone: '',
            wechatCode: '',
            options: [
                {
                    value: '魏莱',
                    label: '魏莱'
                }, 
                {
                    value: '苏半夏',
                    label: '苏半夏'
                }, 
                {
                    value: '夏一一',
                    label: '夏一一'
                }, 
                {
                    value: '李木子',
                    label: '李木子'
                }, 
                {
                    value: '陆远',
                    label: '陆远'
                }, 
                {
                    value: '苏忍冬',
                    label: '苏忍冬'
                }, 
                {
                    value: '马平川',
                    label: '马平川'
                }
            ],
            // returnLetter: null,
            returnLetter: {
                "create_user": "create_user",
                "recv_user": "recv_user",
                "content": "content",
                "phone": "phone",
                "wechat": "wechat",
                "is_default": false
            },
            step: 1,
        }
    },
    computed: {
        today() {
            let now = new Date();
            return now.getFullYear() + '.' + (now.getMonth() + 1) + '.' + now.getDate()
        }
    },
    methods: {
        submit() {
            if (this.you === this.other) {
                this.$message('不能对自己说')
                return;
            }
            if (!this.letter) {
                this.$message('信件内容不能为空')
                return;
            }
            // if (!this.phone && !this.wechatCode) {
            //     this.$message('请至少留下一种联系方式')
            //     return;
            // }
            axios.post(process.env.VUE_APP_BASE_URL+ 'bottle/',
            {
                "create_user": this.you,
                "recv_user": this.other,
                "content": this.letter,
                "phone": this.phone,
                "wechat": this.wechatCode,
            }).then(({data}) => {
                if (data.status === 200) {
                    this.$message('发送成功，并且您收到了一个漂流瓶');
                    this.returnLetter = data.data;
                    this.step = 2;
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.page {
    min-height: 100vh;
    box-sizing: border-box;
    background-image: url('/static/images/bottle-bg1.png');
    background-size: cover;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &.step2 {
        justify-content: space-between;
        background-image: url('/static/images/bottle-bg2.png');
        .step2init {
            width: 100%;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20vh 0;
            box-sizing: border-box;
            color: white;
        }
    }
    .step3 {
        width: 100%;
        min-height: 100vh;
        justify-content: center;
        align-items: center;
        display: flex;
        .content {
            box-sizing: border-box;
            > div {
                margin-bottom: 20px;
            }
            > div:last-child {
                position: absolute;
                width: 100%;
                bottom: 80px;
                left: 0;
                box-sizing: border-box;
                padding-right: 30px;
            }
        }
    }
    .perpar {
        // width: 80%;
        margin: 0 auto;
        position: relative;
        box-sizing: border-box;
        img {
            width: 100%;
            max-width: 400px;
        }
        .content {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            padding: 30px;
            box-sizing: border-box;
            text-align: left;
            .qustion {
                display: flex;
                align-items: center;
                justify-content: space-between;
                > div:first-child {
                    color: #414141;
                    font-size: 14px;
                }
                .select {
                    height: 30px;
                    position: relative;
                    overflow: hidden;
                    border-bottom: 1px solid #C6C6E9;
                    > div:first-child {
                        box-sizing: border-box;
                        padding: 0 5px;
                        width: 120px;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .el-input__icon {
                            line-height: 30px;
                        }
                    }
                    > div:last-child {
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 200;
                        height: 100%;
                    }
                }
                .el-select {
                    height: 100%;
                    opacity: 0;
                    box-sizing: border-box;

                    ::v-deep .el-input {
                        width: 100%;
                        height: 100%;
                    }
                    ::v-deep .el-input__inner{
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                    }
                }
            }
            .title {
                color: #414141;
                font-size: 14px;
            }
            .letter-block {
                margin-top: 30px;
                margin-bottom: 10px;
                > div:first-child {
                    margin-bottom: 10px;
                }
            }
            .contact {
                > div:first-child {
                    margin-bottom: 5px;
                }
                ::v-deep .el-input__inner {
                    background-color: transparent;
                    height: 30px;
                    line-height: 30px;
                }
            }
        }
    }
    .btn {
        width: 100%;
    }
    .el-button--primary {
        background-color: #E0305A;
        border: none;
        width: 80%;
        max-width: 200px;
    }
    .el-textarea {
        ::v-deep .el-textarea__inner {
            resize: none;
            background-color: transparent;
            height: 120px;
        }
    }
}
</style>

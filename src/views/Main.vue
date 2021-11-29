<template>
    <div class="page" :class="!tokenStatusLoading ? 'loading': ''">
        <div class="title">
            <div>
                <div>玩家资产排名</div>
                <div v-if="hasBeforeBtn">
                    <el-button type="danger" round @click="back">
                        返回上一次操作
                    </el-button>
                </div>
            </div>
            <div>
                <el-button type="primary" @click="openAssetsChange" round>资产价格调整</el-button>
            </div>
        </div>
        <div>
            <div v-for="(item, index) of usersSortByAssets(users)" :key="index" class="list">
                <el-row type="flex" :gutter="10">
                    <el-col :xs="24" :sm="8">
                        <div @click="openTotalAssets(item.name)" class="user-info">
                            <div>
                                <img class="avater" :src="'/static/images/' + item.name + '.png'" alt="">
                            </div>
                            <div>
                                <div v-if="index === 0">
                                    {{ item.name }} <img src="/static/images/金牌.png" alt="">
                                </div>
                                <div v-else-if="index === 1">
                                    {{ item.name }} <img src="/static/images/银牌.png" alt="">
                                </div>
                                <div v-else-if="index === 2">
                                    {{ item.name }} <img src="/static/images/铜牌.png" alt="">
                                </div>
                                <div v-else>
                                    {{ item.name }}
                                </div>
                                <div>{{ filterMoneyFixed(totalAssets(item.name)) }}</div>
                            </div>
                        </div>
                    </el-col>
                    <div class="hidden-sm-and-up"></div>
                    <el-col class="assets" :xs="24" :sm="16">
                        <el-row type="flex" :gutter="10">
                            <el-col :span="12">
                                <div class="type" @click="openMoneyChange(item.name)">
                                    <div>
                                        <img src="/static/images/现金.png" alt="">
                                    </div>
                                    <div>
                                        <div>现金</div>
                                        <div>{{ filterMoneyFixed(currentMoney(item.name)) }}</div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div @click="openStockChange(item.name, '股票')" class="type">
                                    <div>
                                        <img src="/static/images/股票.png" alt="">
                                    </div>
                                    <div>
                                        <div>股票</div>
                                        <div>{{ filterMoneyFixed(assetsToMoney(currentStock(item.name))) }}</div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div @click="openStockChange(item.name, '房产')" class="type">
                                    <div>
                                        <img src="/static/images/房产.png" alt="">
                                    </div>
                                    <div>
                                        <div>房产</div>
                                        <div>{{ filterMoneyFixed(assetsToMoney(currentHouse(item.name))) }}</div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div @click="openStockChange(item.name, '企业')" class="type">
                                    <div>
                                        <img src="/static/images/企业.png" alt="">
                                    </div>
                                    <div>
                                        <div>企业</div>
                                        <div>{{ filterMoneyFixed(assetsToMoney(currentCompany(item.name))) }}</div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
        </div>
        <el-dialog
        title="资产价格变动调整"
        :visible.sync="assetsChangeVisible"
        width="80%">
            <div class="assets-model">
                <div>
                    <div>选择资产</div>
                    <div>
                        <el-select v-model="setAssetsValue" @change="setAssetsValueChange" placeholder="请选择">
                            <el-option
                            v-for="item in assets"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div>
                    <div>输入最新价格</div>
                    <div>
                        <el-input type="number" v-model="setAssetsPrice" placeholder="请输入内容"></el-input>
                    </div>
                </div>
                <div>
                    当前价格: ￥{{currentAssetsPrice}}
                </div>
                <el-button type="primary" @click="setAssets" round>录入</el-button>
            </div>
        </el-dialog>
        <el-dialog
        :title="currentPerson + '现金调整'"
        :visible.sync="moneyChangeVisible"
        width="80%">
            <div class="money-model">
                <div>
                    <div>当前现金</div>
                    <div>{{ format(currentMoney(currentPerson)) }} ({{ filterMoney(currentMoney(currentPerson)) }})</div>
                </div>
                <div>
                    <div>变动类型</div>
                    <div class="set-money-type">
                        <div @click="setMoneyType = 1" :class="setMoneyType === 1?'active':''">增加</div>
                        <div @click="setMoneyType = -1" :class="setMoneyType === -1?'active':''">减少</div>
                    </div>
                </div>
                <div>
                    <div>金额</div>
                    <div>
                        <el-input type="number" v-model="setMoneyValue" placeholder="请输入内容"></el-input>
                    </div>
                </div>
                <el-button type="primary" @click="setMoney" round>录入</el-button>
            </div>
        </el-dialog>
        <el-dialog
        :title="currentPerson + currentAssetsType + '资产'"
        :visible.sync="stockChangeVisible"
        width="80%">
            <div class="stock-model">
                <div class="tabs">
                    <div @click="changeExchangeType(1)" :class="exchangeType === 1?'active': ''">买入</div>
                    <div @click="changeExchangeType(-1)" :class="exchangeType === -1?'active': ''">卖出</div>
                </div>
                <div>
                    <div>选择{{ currentAssetsType }}</div>
                    <div>
                        <el-select v-model="setAssetsValue" @change="setAssetsValueChange" placeholder="请选择">
                            <el-option
                            v-for="item in setCurrentAssetList"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div>
                    <div>价格</div>
                    <div>
                        <el-input type="number" @input="quikType = 0" v-model="setAssetsPrice" placeholder=""></el-input>
                    </div>
                </div>
                <div>
                    当前价格: {{ currentAssetsPrice }}
                </div>
                <div>
                    <div>{{ exchangeType === 1?'买入':'卖出' }}数量</div>
                    <div>
                        <el-input type="number" @input="changeCount" v-model="setStockCount" placeholder=""></el-input>
                    </div>
                </div>
                <div v-if="exchangeType === -1">
                    最大卖出数量: {{ maxSellCount(currentPerson, setAssetsValue) }}
                </div>
                <div v-if="exchangeType === 1">
                    最大可买数量: {{ setAssetsPrice && setAssetsPrice > 0 ? format(currentMoney(currentPerson)/setAssetsPrice) : '--' }}
                </div>
                <div>
                    <div>总金额</div>
                    <div>
                        <el-input type="number" @input="changeMoney" v-model="setStockMoney" placeholder=""></el-input>
                    </div>
                </div>
                <div v-if="exchangeType === 1">
                    可用金额: {{ format(currentMoney(currentPerson)) }}
                </div>
                <div>
                    <div>快捷买入</div>
                    <div class="quik">
                        <div @click="setQuikType(0.25)" :class="quikType === 0.25 ? 'active': ''">25%</div>
                        <div @click="setQuikType(0.5)" :class="quikType === 0.5 ? 'active': ''">50%</div>
                        <div @click="setQuikType(0.75)" :class="quikType === 0.75 ? 'active': ''">75%</div>
                        <div @click="setQuikType(1)" :class="quikType === 1 ? 'active': ''">100%</div>
                    </div>
                </div>
                
                <div class="buy-btn">
                    <el-button type="primary" class="buy" v-if="exchangeType === 1" @click="buy" round>买入</el-button>
                    <el-button type="primary" class="sell" v-if="exchangeType === -1" @click="sell" round>卖出</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog
        :title="currentPerson + '资产总览'"
        :visible.sync="totalAssetsVisible"
        width="80%">
            <div class="total-assets-model">
                <div>
                    <div>持有现金</div>
                    <div class="money">{{ format(currentMoney(currentPerson)) }} ({{ filterMoney(currentMoney(currentPerson)) }})</div>
                </div>
                <div v-if="currentStock(currentPerson).length > 0">
                    <div>持有股票</div>
                    <div>
                        <div>股票</div>
                        <div>价格</div>
                        <div>数量</div>
                        <div>价值</div>
                    </div>
                    <div v-for="(item, index) in currentStock(currentPerson)" :key="index">
                        <div>{{ item.name }}</div>
                        <div>{{ format(getStockPrice(item.name)) }}</div>
                        <div>{{ format(item.count) }}</div>
                        <div>{{ format(assetsToMoney([item])) }}</div>
                    </div>
                </div>
                <div v-if="currentHouse(currentPerson).length > 0">
                    <div>持有房产</div>
                    <div>
                        <div>房产</div>
                        <div>价格</div>
                        <div>数量</div>
                        <div>价值</div>
                    </div>
                    <div v-for="(item, index) in currentHouse(currentPerson)" :key="index">
                        <div>{{ item.name }}</div>
                        <div>{{ format(getStockPrice(item.name)) }}</div>
                        <div>{{ format(item.count) }}</div>
                        <div>{{ format(assetsToMoney([item])) }}</div>
                    </div>
                </div>
                <div v-if="currentCompany(currentPerson).length > 0">
                    <div>持有企业</div>
                    <div>
                        <div>企业</div>
                        <div>价格</div>
                        <div>数量</div>
                        <div>价值</div>
                    </div>
                    <div v-for="(item, index) in currentCompany(currentPerson)" :key="index">
                        <div>{{ item.name }}</div>
                        <div>{{ format(getStockPrice(item.name)) }}</div>
                        <div>{{ format(item.count) }}</div>
                        <div>{{ format(assetsToMoney([item])) }}</div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog
        :visible.sync="cacheVisible"
        :close-on-click-modal="false"
        width="80%">
            <div class="cache-model">
                <div>
                    <img src="/static/images/save.png" alt="">
                </div>
                <div class="cache-title">检测到存档</div>
                <div class="cache-content">是否读取存档？</div>
                <div><el-button class="cache-read" type="primary" @click="init" round>读取</el-button></div>
                <div><el-button class="cache-reload" type="primary" @click="reload" round>重新开局</el-button></div>
            </div>  
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {

            hasBeforeBtn: false,

            tokenStatusLoading: false,

            cacheVisible: false,

            totalAssetsVisible: false,

            assetsChangeVisible: false,
            setAssetsValue: '',
            setAssetsPrice: '',

            currentPerson: '', // 当前调整的人
            currentAssetsType: '', // 当前调整的资产类型
            
            moneyChangeVisible: false,
            setMoneyType: 1, // 可能值 1 或 -1
            setMoneyValue: '',

            stockChangeVisible: false,
            exchangeType: 1, // 交易类型  可能值 1  -1
            quikType: 0,
            setStockCount: '',
            setStockMoney: '',

            users: [
                {
                    name: '魏莱',
                    money: 0,
                    assets: [
                        // {
                        //     typeName: '股票',
                        //     name: '10001',
                        //     count: 10,
                        // }
                    ]
                },
                {
                    name: '苏半夏',
                    money: 0,
                    assets: [
                    ]
                },
                {
                    name: '夏一一',
                    money: 0,
                    assets: [
                    ]
                },
                {
                    name: '李木子',
                    money: 0,
                    assets: [
                    ]
                },
                {
                    name: '陆远',
                    money: 0,
                    assets: [
                    ]
                },
                {
                    name: '苏忍冬',
                    money: 0,
                    assets: [
                    ]
                },
                {
                    name: '马平川',
                    money: 0,
                    assets: [
                    ]
                },
            ],
            assets: [
                {
                    type: 'stock',
                    typeName: '股票',
                    name: 'DL025',
                    price: 10,
                },
                {
                    type: 'stock',
                    typeName: '股票',
                    name: 'YZS01',
                    price: 10,
                },
                {
                    type: 'stock',
                    typeName: '股票',
                    name: 'ZH001',
                    price: 10,
                },
                {
                    type: 'house',
                    typeName: '房产',
                    name: 'F001',
                    price: 10,
                },
                {
                    type: 'house',
                    typeName: '房产',
                    name: 'F002',
                    price: 10,
                },
                {
                    type: 'house',
                    typeName: '房产',
                    name: 'F003',
                    price: 10,
                },
                {
                    type: 'company',
                    typeName: '企业',
                    name: '老年康养企业',
                    price: 10,
                },
                {
                    type: 'company',
                    typeName: '企业',
                    name: '人寿保险企业',
                    price: 10,
                },
                {
                    type: 'company',
                    typeName: '企业',
                    name: '动漫制作企业',
                    price: 10,
                },
                
            ]
        }
    },
    computed: {
      currentAssetsPrice() {
        for (let i = 0; i < this.assets.length; i++) {
            if(this.assets[i].name == this.setAssetsValue){
                return this.assets[i].price;
            }
        }
        return '--';
      },
      currentMoney() {
          return function (name) {
            let compareName = this.currentPerson;
            if (name) {
                compareName = name;
            }
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].name === compareName) {
                    return this.users[i].money;
                }
            }
            return 0;
          }
      },
      currentStock() {
          return function (name) {
            let compareName = this.currentPerson;
            if (name) {
                compareName = name;
            }
            let stockList = [];
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].name === compareName) {
                    let assets = this.users[i].assets  //所有的资产
                    for (let j = 0; j < assets.length; j++) {
                        if (assets[j].typeName === '股票') {
                            stockList.push(assets[j]);
                        }
                    }
                }
            }
            return stockList;
          }
      },
      currentHouse() {
          return function (name) {
            let compareName = this.currentPerson;
            if (name) {
                compareName = name;
            }
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].name === compareName) {
                    let assets = this.users[i].assets  //所有的资产
                    let stockList = [];
                    for (let j = 0; j < assets.length; j++) {
                        if (assets[j].typeName === '房产') {
                            stockList.push(assets[j]);
                        }
                    }
                    return stockList;
                }
            }
            return [];
          }
      },
      currentCompany() {
          return function (name) {
            let compareName = this.currentPerson;
            if (name) {
                compareName = name;
            }
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].name === compareName) {
                    let assets = this.users[i].assets  //所有的资产
                    let stockList = [];
                    for (let j = 0; j < assets.length; j++) {
                        if (assets[j].typeName === '企业') {
                            stockList.push(assets[j]);
                        }
                    }
                    return stockList;
                }
            }
            return [];
          }
      },
      // 总资产
      totalAssets() {
          return function(name) {
            let money = 0;
            let assets = [];
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].name == name) {
                    money += this.users[i].money;
                    assets = this.users[i].assets;
                }
            }
            money += this.assetsToMoney(assets);
            return money;
          }
      },
      getStockPrice() {
          let _this = this;
          return function(name) {
              let price = 0;
              for (let i = 0; i < _this.assets.length; i++) {
                  if (_this.assets[i].name === name) {
                      price = _this.assets[i].price;
                      break;
                  }
              }
              return price;
          }
      },
      maxSellCount() {
          let _this = this;
          return function (name, assetName) {
              let assets = [];
              for (let i = 0; i < _this.users.length; i++) {
                  if (_this.users[i].name === name) {
                      assets = _this.users[i].assets;
                  }
              }
              let count = 0;
              for (let i = 0;i < assets.length; i++) {
                  if(assets[i].name === assetName) {
                      count = assets[i].count;
                  }
              }
              return count;
          }
      },
      // 资产转钱
      assetsToMoney () {
          let _this = this;
          return function(assets) {
              let money = 0;
              for (let i = 0; i < assets.length; i++) {
                  for (let j = 0; j < _this.assets.length; j++) {
                    if (assets[i].name === _this.assets[j].name) {
                        money += parseFloat(_this.assets[j].price) * parseFloat(assets[i].count);
                    }
                  }
              }
              return money;
          }
      },
      setStockCountMoney() {
          if (
              isNaN(parseFloat(this.setStockCount)) || 
              isNaN(parseFloat(this.setAssetsPrice))
            ) {
              return '--';
          }
          return parseFloat(this.setStockCount) * parseFloat(this.setAssetsPrice);
      },
      filterMoney() {
          let _this = this;
          return function(money) {
              if (isNaN(parseFloat(money))) {
                  return '--';
              }
              return _this.format(money/10000) + '万';
          }
      },
      filterMoneyFixed() {
          let _this = this;
          return function(money) {
              if (isNaN(parseFloat(money))) {
                  return '--';
              }
              if (money >= 10000) {
                  return _this.format(money/10000) + '万';
              }
              return _this.format(money);
          }
      },
      format() {
          return function(num) {
            if (isNaN(parseFloat(num))) {
                return '--';
            }
            let re=/\d{1,3}(?=(\d{3})+$)/g;
            let n1=num.toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
            return n1;
          }
      },
      setCurrentAssetList() {
          let list = [];
          for (let i = 0; i < this.assets.length; i++) {
              if(this.assets[i].typeName === this.currentAssetsType) {
                  list.push(this.assets[i])
              }
          }
          return list;
      },
      usersSortByAssets() {
          let _this = this;
          return function (users) {
              let list = users.concat();
              list.sort(function(a, b) {
                  return _this.totalAssets(b.name) - _this.totalAssets(a.name);
              });
              return list;
          }
      }
    },
    created() {
        this.checkToken();
        this.checkHistory();
        this.checkBeforeCache();
    },
    methods: {
        // 检查是否有token
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
                    this.$router.push('/login');
                }
            }).catch(() => {
                this.checkToken();
            })
            
        },

        // 检查是否有存档
        checkHistory() {
            if (localStorage.getItem('cache')) {
                this.cacheVisible = true;
            }
        },

        checkBeforeCache() {
            this.hasBeforeBtn = false;
            if (localStorage.getItem('beforeCache')) {
                this.hasBeforeBtn = true;
            }
            console.log(this.hasBeforeBtn);
        },

        // 初始化
        init() {
            let cache = JSON.parse(localStorage.getItem('cache'));
            this.users = cache.users;
            this.assets = cache.assets;
            this.cacheVisible = false;
        },

        reload() {
            localStorage.removeItem('beforeCache')
            localStorage.removeItem('cache');
            this.cacheVisible = false;
            this.hasBeforeBtn = false;
        },

        back() {
             this.$confirm('您确定要撤回到上一次操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (localStorage.getItem('beforeCache')) {
                    let cache = JSON.parse(localStorage.getItem('beforeCache'));
                    this.users = cache.users;
                    this.assets = cache.assets;
                    localStorage.removeItem('beforeCache');
                    this.cache();
                }
            }).catch(() => {
                
            });
        },

        cache() {
            this.checkBeforeCache();
            let cache = {
                users: this.users,
                assets: this.assets,
            };
            localStorage.setItem('cache', JSON.stringify(cache));
        },

        beforeCache() {
            let cache = {
                users: JSON.parse(JSON.stringify(this.users)),
                assets: JSON.parse(JSON.stringify(this.assets)),
            };
            localStorage.setItem('beforeCache', JSON.stringify(cache));
        },

        openTotalAssets(name) {
            this.currentPerson = name;
            this.totalAssetsVisible = true;
        },

        openMoneyChange(name) {
            this.currentPerson = name;
            this.setMoneyValue = '';
            this.moneyChangeVisible = true;
        },

        setMoney() {
            if (isNaN(parseFloat(this.setMoneyValue))) {
                this.$message('您输入的不是一个正确的数值');
                return;
            }
            if (parseFloat(this.setMoneyValue) < 0) {
                this.$message('金额不能为负');
                return;
            }
            
            for (let i = 0; i < this.users.length; i++) {
              if (this.users[i].name === this.currentPerson) {
                  let result = this.users[i].money + parseFloat(this.setMoneyValue) * this.setMoneyType;
                  if(result < 0) {
                      this.$message('金额不足');
                      return;
                  }
                  this.beforeCache();
                  this.users[i].money += parseFloat(this.setMoneyValue) * this.setMoneyType;
              }
            }
            this.moneyChangeVisible = false;
            this.cache();
        },


        changeExchangeType(type) {
            this.exchangeType = type;
            this.setStockCount = '';
            this.setStockMoney = '';
            this.quikType = 0;
        },

        setQuikType(type) {
            if (!this.setAssetsPrice) {
                this.$message('价格异常');
                return;
            }
            if (isNaN(parseFloat(this.setAssetsPrice))) {
                this.$message('价格异常');
                return;
            }
            if (this.exchangeType === 1) {
                this.quikType = type;
                this.setStockCount = this.currentMoney(this.currentPerson) * type / this.setAssetsPrice;
                this.setStockMoney = this.setStockCount * this.setAssetsPrice;
            }
            if (this.exchangeType === -1) {
                this.quikType = type;
                this.setStockCount = this.maxSellCount(this.currentPerson, this.setAssetsValue) * this.quikType;
                this.setStockMoney = this.setStockCount * this.setAssetsPrice;
            }
        },

        changeCount() {
            this.setStockMoney = this.setStockCount * this.setAssetsPrice;
            this.quikType = 0;
        },

        changeMoney() {
            this.setStockCount = this.setStockMoney / this.setAssetsPrice;
            this.quikType = 0;
        },

        // 开启资产价格调整modal 
        openAssetsChange() {
            this.setAssetsValue = '';
            this.setAssetsPrice = '';
            this.assetsChangeVisible = true;
        },

        setAssetsValueChange(value) {
            this.quikType = 0;
            for (let i = 0; i < this.assets.length; i++) {
                if(this.assets[i].name == value) {
                    this.setAssetsPrice = this.assets[i].price;
                }
            }
        },

        setAssets() {
            if (isNaN(parseFloat(this.setAssetsPrice))) {
                this.$message('请输入一个正确的数值');
                return;
            }
            if (parseFloat(this.setAssetsPrice) <= 0) {
                this.$message('价格必须大于0');
                return;
            }
            this.beforeCache();
            for (let i = 0; i < this.assets.length; i++) {
                if (this.assets[i].name == this.setAssetsValue) {
                    this.assets[i].price = this.setAssetsPrice;
                }
            }
            this.assetsChangeVisible = false;
            this.cache();
        },


        openStockChange(name, type) {
            this.currentPerson = name;
            this.currentAssetsType = type;
            this.setAssetsValue = '';
            this.setAssetsPrice = '';
            this.setStockCount = '';
            this.exchangeType = 1;
            this.quikType = 0;
            this.stockChangeVisible = true;
        },


        async buy() {
            // this.currentPerson // 谁买
            // this.setStockCount // 买了多少
            // this.currentAssetsType // 买了什么类型的
            // this.setAssetsValue  // 买了什么东西
            // this.setAssetsPrice // 多少钱买的
            if (
                isNaN(parseFloat(this.setAssetsPrice)) ||
                isNaN(parseFloat(this.setStockCount))
            ) {
                this.$message('您输入的不是一个正确的数值');
                return;
            }

            if (parseFloat(this.setAssetsPrice) <= 0) {
                this.$message('价格必须大于0');
                return;
            }

            let personAssets = [];
            let personIndex = 0;

            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].name === this.currentPerson) {
                    personAssets = this.users[i].assets;
                    personIndex = i;
                    break;
                }
            }

            if (this.users[personIndex].money < parseFloat(this.setAssetsPrice) * parseFloat(this.setStockCount)) {
                let finish = false;
                await this.$confirm(`现金不足，最多可买入金额：${this.currentMoney(this.currentPerson)}，是否将当前的现金全部买入?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.setStockCount = parseFloat(this.users[personIndex].money) / parseFloat(this.setAssetsPrice);
                }).catch(() => {
                    finish = true;
                });
                if(finish) {
                    return;
                }
            }

            this.beforeCache();
            let price = 0;
            for (let i = 0; i < this.assets.length; i++) {
                if(this.setAssetsValue === this.assets[i].name) {
                    price = parseFloat(this.setAssetsPrice);
                    this.assets[i].price = parseFloat(this.setAssetsPrice);
                }
            }

            
            let isHad = false; // 是否已有同类型的资产
            for (let i = 0; i < personAssets.length; i++) {
                if (personAssets[i].name === this.setAssetsValue) {
                    personAssets[i].count += parseFloat(this.setStockCount);
                    isHad = true;
                }
            }
            if (!isHad) {
                personAssets.push(
                    {
                        typeName: this.currentAssetsType,
                        name: this.setAssetsValue,
                        count: parseFloat(this.setStockCount)
                    }
                )
            }

            this.users[personIndex].assets = personAssets;

            // 现金减少

            this.users[personIndex].money -= parseFloat(this.setStockCount) * parseFloat(price)

            this.stockChangeVisible = false;
            this.cache();
        },
        async sell() {
            if (
                isNaN(parseFloat(this.setAssetsPrice)) ||
                isNaN(parseFloat(this.setStockCount))
            ) {
                this.$message('您输入的不是一个正确的数值');
                return;
            }

            let personAssets = [];
            let personIndex = 0;

            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].name === this.currentPerson) {
                    personAssets = this.users[i].assets;
                    personIndex = i;
                    break;
                }
            }

            let isHad = false; // 是否已有同类型的资产
            for (let i = 0; i < personAssets.length; i++) {
                if (personAssets[i].name === this.setAssetsValue) {
                    if (personAssets[i].count < parseFloat(this.setStockCount)) {
                        let finish = false;
                        await this.$confirm(`资产不足，最多可卖出数量：${this.maxSellCount(this.currentPerson, this.setAssetsValue)}，是否将当前的该资产全部卖出?`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.setStockCount = this.maxSellCount(this.currentPerson, this.setAssetsValue);
                            console.log(this.setStockCount);
                        }).catch(() => {
                            finish = true;
                        });
                        if(finish) {
                            return;
                        }
                    }
                    personAssets[i].count -= parseFloat(this.setStockCount);
                    isHad = true;
                }
            }
            if (!isHad) {
                this.$message('没有该资产，无法卖出');
                return;
            }

            this.beforeCache();

            let price = 0;
            for (let i = 0; i < this.assets.length; i++) {
                if(this.setAssetsValue === this.assets[i].name) {
                    price = parseFloat(this.setAssetsPrice);
                    this.assets[i].price = parseFloat(this.setAssetsPrice);
                }
            }

            this.users[personIndex].assets = personAssets;

            // 现金减少

            this.users[personIndex].money += parseFloat(this.setStockCount) * parseFloat(price)

            this.stockChangeVisible = false;
            this.cache();
        }
    }
}
</script>
<style lang="less" scoped>
.page {
    &.loading {
        position: relative;
        &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 22222222222222;
            top: 0;
            left: 0;
            background-color: white;
        }
    }
    padding: 0 20px;
    min-height: 100vh;
    background-color: #EBF1F6;
    .list {
        border-radius: 8px;
        background-color: #FFFFFF;
        box-shadow: 0px 4px 12px 0px #0020FF19;
        margin-bottom: 10px;
        padding: 20px;
        .el-col-sm-8 {
            display: flex;
            align-items: center;
        }
        .user-info {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
            img.avater {
                width: 60px;
                margin-right: 8px;
            }
            > div:last-child {
                img {
                    width: 20px;
                }
                > div:first-child {
                    display: flex;
                    align-items: center;
                    font-size: 18px;
                }
                > div:last-child {
                    font-size: 24px;
                }
            }
        }
        .el-row--flex {
            flex-wrap: wrap;
        }
        .hidden-sm-and-up {
            width: 100%;
            margin: 20px 0;
            border-bottom: 1px solid #C9DCEF;
        }
        .assets {
            .el-col-12 {
                flex: 0 0 50%;
                &:nth-child(1), 
                &:nth-child(2) {
                    margin-bottom: 20px;
                } 
            }
            .type {
                display: inline-flex;
                cursor: pointer;
                align-items: center;
                > div:last-child {
                    > div:first-child {
                        color: #5D69B8;
                        font-size: 14px;
                    }
                    > div:last-child {
                        font-size: 18px;
                    }
                }
                img {
                    width: 32px;
                    margin-right: 10px;
                }
            }
        }
    }
}
.title {
    display: flex;
    justify-content: space-between;
    height: 60px;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    padding-top: 20px;
    > div:first-child {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        > div:first-child {
            margin-right: 10px;
        }
    }
    .el-button--primary {
        background-color: #3030E0;
        border: none;
        width: 100%;
        max-width: 200px;
    }
}

.el-button--primary {
    background-color: #3030E0;
    border: none;
    width: 100%;
}

.assets-model {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    color: #5D69B8;
    font-size: 14px;
    padding-bottom: 20px;
    .el-select {
        width: 100%;
        margin-top: 10px;
    }
    .el-input {
        margin-top: 10px;
    }
    > div {
        margin-bottom: 20px;
    }
    .el-button {
        margin-top: 20px;
    }
}
.money-model {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    color: #5D69B8;
    font-size: 14px;
    padding-bottom: 20px;
    > div:first-child {
        text-align: center;
        > div:last-child {
            color: black;
            font-size: 24px;
            font-weight: bold;
        }
    }
    .set-money-type {
        display: flex;
        margin-top: 10px;
        > div {
            width: 80px;
            border: 1px solid transparent;
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 15px;
            cursor: pointer;
            &.active {
                border: 1px solid #3030E0;
            }
        }
    }
    .el-input {
        margin-top: 10px;
    }
    > div {
        margin-bottom: 20px;
    }
    .el-button {
        margin-top: 20px;
    }
}
.stock-model {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    color: #5D69B8;
    font-size: 14px;
    padding-bottom: 20px;
    .quik {
        display: flex;
        margin-top: 10px;
        > div {
            cursor: pointer;
            flex: 0 0 25%;
            text-align: center;
            height: 30px;
            line-height: 30px;
            border: 1px solid transparent;
            border-radius: 20px;
            &.active {
                color: white;
                background-color: #3030E0;
            }
        }
    }
    .tabs {
        display: flex;
        border-radius: 20px;
        overflow: hidden;
        > div {
            cursor: pointer;
            flex: 0 0 50%;
            text-align: center;
            height: 40px;
            line-height: 40px;
            color: white;
            opacity: 0.5;
            &.active {
                opacity: 1;
            }
            &:first-child {
                background-color: #17D2A5;
            }
            &:last-child {
                background-color: #DD643E;
            }
        }
    }
    .el-input {
        margin-top: 10px;
    }
    > div {
        margin-bottom: 20px;
    }
    .buy-btn {
        display: flex;
        justify-content: space-between;
        > .el-button--primary.buy {
            background-color: #17D2A5;
        }
        > .el-button--primary.sell {
            background-color: #DD643E;
        }
    }
    .el-select {
        width: 100%;
        margin-top: 10px;
    }
}

.total-assets-model {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    color: #5D69B8;
    font-size: 14px;
    padding-bottom: 20px;
    > div {
        margin-bottom: 15px;
        > div:first-child {
            font-size: 14px;
            text-align: center;
        }
        .money {
            font-size: 24px;
            color: #000;
            text-align: center;
            font-weight: bold;
            margin-top: 10px;
        }
        > div:not(.money):nth-child(2) {
            margin-top: 10px;
        }

        > div:not(.money):not(:nth-child(2)):not(:nth-child(1)) {
            color: #000;
        }
        
        > div:not(.money):not(:first-child) {
            display: flex;
            > div {
                flex: 0 0 25%;
                text-align: center;
                background-color: #F7F7F9;
                border-bottom: 1px solid #fff;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
}

.cache-model {
    text-align: center;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    img {
        width: 150px;
    }
    .cache-title {
        font-size: 24px;
        font-weight: bold;
        color: #000;
        margin: 30px 0 20px;
    }
    .cache-content {
        margin-bottom: 40px;
    }
    .cache-read {
        margin-bottom: 20px;
    }
    .cache-reload {
        background-color: #FFCFCF;
        color: #FF3D00;
    }
}
::v-deep {
    .el-dialog__title {
        font-weight: bold;
    }
    
}
</style>
<style lang="less">
.el-message-box__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}
.el-message-box {
    max-width: 100%;
}
</style>




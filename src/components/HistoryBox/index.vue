<template>
<div class="HistoryBox" id="HistoryBox">
    <div class="searchBox">
        <a-input v-model="searchKey" placeholder="Filter">
            <a-icon slot="prefix" type="search" />
        </a-input>
    </div>
    <div class="viewBox">
        <div class="rightResizeBar" id="rightResizeBar"></div>
        <a-tabs :animated="false">
            <a-tab-pane tab="History">
                <a-menu
                    :default-open-keys="[0]"
                    mode="inline"
                >
                    <a-sub-menu v-for="(value,key,idx) in filterHistory" :key="idx">
                        <span slot="title"><a-icon type="history" /><span>{{key}}</span></span>
                        <a-menu-item v-for="item of filterHistory[key]" :key="item._TIME" @click="readCondition(item)">
                            <a-tooltip placement="top" :overlayStyle="{maxWidth:'initial'}">
                                <template slot="title">
                                    <span>{{item.address}}</span>
                                </template>
                                <span><span class="method" :class="{[item.method]: true}">{{item.method}}</span>{{item.address}}</span>
                            </a-tooltip>
                            
                        </a-menu-item>
                    </a-sub-menu>
                    <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" v-if="!Object.keys(mapHistory).length || !Object.keys(filterHistory).length" :description="!Object.keys(mapHistory).length ? `You haven't send any requests` : `No results found for '${searchKey}'`"/>
                </a-menu>
            </a-tab-pane>
        </a-tabs>
    </div>
</div>
</template>

<script>
import moment from 'moment'
import { Empty } from 'ant-design-vue';
export default {
    data() {
        return {
            Empty,
            filterHistory: {},
            searchKey: undefined
        }
    },
    computed: {
        history() {
            return this.$store.state.history
        },
        mapHistory() {
            let re = {}
            let history = JSON.parse(JSON.stringify(this.history)).reverse()
            history.forEach(v=> {
                const TODAY = moment().clone().startOf('day');
                const YESTERDAY = moment().clone().subtract(1, 'days').startOf('day');
                const BEFOREYESTERDAY = moment().clone().subtract(2, 'days').startOf('day');
                if(moment(v._TIME).isSame(TODAY, 'd')) {
                    re['今天'] ? re['今天'].push(v) : re['今天'] = [v]
                }else if(moment(v._TIME).isSame(YESTERDAY, 'd')) {
                    re['昨天'] ? re['昨天'].push(v) : re['昨天'] = [v]
                }else if(moment(v._TIME).isSame(BEFOREYESTERDAY, 'd')) {
                    re['前天'] ? re['前天'].push(v) : re['前天'] = [v]
                }else {
                    let dateKey = moment(v._TIME).format('YYYY-MM-DD')
                    re[dateKey] ? re[dateKey].push(v) : re[dateKey] = [v]
                }
            })
            return re
        }
    },
    beforeMount() {
        this.filterHistory = this.mapHistory
    },
    watch: {
        searchKey(n) {
            if(!n) return this.filterHistory = this.mapHistory
            let re = {}, obj = this.mapHistory;
            for(let date in obj) {
                obj[date].forEach(v=>{
                    if(JSON.stringify(v).includes(n)){
                        re[date] ? re[date].push(v) : re[date] = [v]
                    } 
                })
            }
            this.filterHistory = re
        },
        mapHistory: {
            handler(){
                this.filterHistory = this.mapHistory
            },
            deep: true
        }
    },
    mounted() {
        this.addEventResize()
    },
    methods: {
        readCondition(item) {
            this.$emit('readCondition', item)
        },
        addEventResize() {
            // 1. 获取两个大小div
            var oPanel = document.getElementById('HistoryBox');
            var oDragIcon = document.getElementById('rightResizeBar');
    
            // 定义4个变量
            var disX = 0;//鼠标按下时光标的X值
            var disY = 0;//鼠标按下时光标的Y值
            var disW = 0; //拖拽前div的宽
            var disH = 0; // 拖拽前div的高
    
            //3. 给小div加点击事件
            oDragIcon.onmousedown = function (ev) {
                ev = ev || window.event;
                disX = ev.clientX; // 获取鼠标按下时光标x的值
                disY = ev.clientY; // 获取鼠标按下时光标Y的值
                disW = oPanel.offsetWidth; // 获取拖拽前div的宽
                disH = oPanel.offsetHeight; // 获取拖拽前div的高
    
                document.onmousemove = function (ev) {
                    ev = ev || window.event;
                    //拖拽时为了对宽和高 限制一下范围，定义两个变量
                    var W =  ev.clientX - disX + disW;
                    var H =  ev.clientY - disY + disH;
    
                    if(W<100){
                        W = 100;
                    }
                    if(W>800){
                        W =800;
                    }
                    if(H<100){
                        H = 100;
                    }
                    if(H>500){
                        H = 500;
                    }
                    oPanel.style.width = W +'px';// 拖拽后物体的宽
                    // oPanel.style.height = H +'px';// 拖拽后物体的高
                }
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }
        }
    }
}
</script>

<style lang='less' scoped>
.HistoryBox{
    width: 25%;
    border-right: 1px solid #e8e8e8;
    /deep/ .ant-tabs{
        .ant-tabs-nav-scroll{
            text-align: center;
        }
        .ant-menu{
            border-right: none;
        }
    }
    .searchBox{
        padding: 0 15px;
        padding-top: 10px;
        /deep/ .ant-input{
            border-radius: 16px;
            background: rgb(240,240,240);
            &:focus{
                background: #fff;
            }
        }
    }
    .viewBox{
        position: relative;
        .rightResizeBar{
            width: 3px;
            height: 100%;
            // background-color:red;
            cursor: ew-resize;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 2;
        }
        /deep/ .ant-tabs{
            user-select: none;
            .ant-tabs-content{
                height: calc(100vh - 102px);
                overflow-y: auto;
                .ant-menu{
                    li{
                        width: calc(100% - 1px);
                    }
                }
            }
        }
    }
    
}
</style>
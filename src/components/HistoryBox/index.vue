<template>
<div class="HistoryBox">
    <div class="searchBox">
        <a-input v-model="searchKey" placeholder="Filter">
            <a-icon slot="prefix" type="search" />
        </a-input>
    </div>
    <a-tabs :animated="false">
            <a-tab-pane tab="History">
                <a-menu
                    :default-open-keys="[0]"
                    mode="inline"
                >
                    <a-sub-menu v-for="(value,key,idx) in filterHistory" :key="idx">
                        <span slot="title"><a-icon type="history" /><span>{{key}}</span></span>
                        <a-menu-item v-for="item of filterHistory[key]" :key="item._TIME" @click="readCondition(item)">
                            <span class="method" :class="{[item.method]: true}">{{item.method}}</span>
                            {{item.address}}
                        </a-menu-item>
                    </a-sub-menu>
                    <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" v-if="!Object.keys(mapHistory).length || !Object.keys(filterHistory).length" :description="!Object.keys(mapHistory).length ? `You haven't send any requests` : `No results found for '${searchKey}'`"/>
                </a-menu>
            </a-tab-pane>
    </a-tabs>
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
            this.history.forEach(v=> {
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
        }
    },
    methods: {
        readCondition(item) {
            this.$emit('readCondition', item)
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
}
</style>
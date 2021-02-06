<template>
<div class="HistoryBox">
    <a-tabs :animated="false">
            <a-tab-pane tab="History">
                <a-menu
                    :default-open-keys="[0]"
                    mode="inline"
                >
                    <a-sub-menu v-for="(value,key,idx) in mapHistory" :key="idx">
                        <span slot="title"><a-icon type="history" /><span>{{key}}</span></span>
                        <a-menu-item v-for="item of mapHistory[key]" :key="item._TIME" @click="readCondition(item)">
                            <span class="method" :class="{[item.method]: true}">{{item.method}}</span>
                            {{item.address}}
                        </a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </a-tab-pane>
    </a-tabs>
</div>
</template>

<script>
import moment from 'moment'
export default {
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
}
</style>
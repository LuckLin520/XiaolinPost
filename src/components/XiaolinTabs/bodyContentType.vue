<template>
<div class="bodyContentType">
    <div class="contentType">
        <a-radio-group v-model="typeKey">
            <a-radio v-for="item of contentTypes" :key="item" :value="item">{{item}}</a-radio>
        </a-radio-group>
        <a-dropdown :trigger="['click']" v-if="typeKey === 'raw'">
            <span class="primary" style="cursor:pointer">{{rawKey}}<a-icon type="caret-down" /></span>
            <a-menu slot="overlay">
                <a-menu-item v-for="item of raws" :key="item.label" @click="rawKey = item.label">{{item.label}}</a-menu-item>
            </a-menu>
        </a-dropdown>
    </div>
    <a-divider style="margin: 14px 0"/>
    <div v-show="typeKey === 'none'" class="none">This request does not have a body</div>
    <KeyValueBodys v-show="typeKey === 'form-data'" key="0" v-model="json1" :typeKey="typeKey"/>
    <KeyValueBodys v-show="typeKey === 'x-www-form-urlencoded'" key="1" v-model="json2"/>
    <vue-json-editor
        v-show="typeKey === 'raw' && rawKey === 'JSON'"
        :show-btns="false"
        :value="rawData"
        :mode="'code'"
        lang="zh"
        @json-change="onJsonChange"
        key="editor0"
        >
    </vue-json-editor>
    <vue-json-editor
        v-show="typeKey === 'raw' && rawKey !== 'JSON'"
        :show-btns="false"
        :value="rawData"
        :mode="'text'"
        lang="zh"
        @json-change="onJsonChange"
        key="editor1"
        >
    </vue-json-editor>
</div>
</template>

<script>
import KeyValueBodys from './keyValueBodys'
import vueJsonEditor from 'vue-json-editor'
export default {
    components: {KeyValueBodys,vueJsonEditor},
    data() {
        return {
            typeKey: 'none',
            contentTypes: ['none','form-data','x-www-form-urlencoded','raw'],
            rawKey: 'JSON',
            raws: [{
                label: 'JSON',
                value: 'application/json'
            },{
                label: 'Text',
                value: 'text/plain'
            },{
                label: 'JavaScript',
                value: 'application/javascript'
            },{
                label: 'HTML',
                value: 'text/html'
            },{
                label: 'XML',
                value: 'application/xml'
            }],
            json1: {},
            json2: {},
            rawData: {}
        }
    },
    computed: {
        defaultHeaders() {
            return this.$store.state.defaultHeaders
        }
    },
    watch: {
        typeKey(n) {
            switch(n) {
                case 'none': {
                    this.$store.commit('save',{bodys: {}})
                    let item = this.defaultHeaders.find(v=>v.key === 'Content-Type' && v.isDefault)
                    item && (item.value = '')
                    break;
                }
                case 'form-data': {
                    this.$store.commit('save',{bodys: this.json1})
                    let item = this.defaultHeaders.find(v=>v.key === 'Content-Type' && v.isDefault)
                    if(!item) {
                        this.defaultHeaders.splice(0,0,{
                            key: 'Content-Type',
                            value: n,
                            isDefault: true
                        })
                    }else{
                        item.value = n
                    }
                    break;
                }
                case 'x-www-form-urlencoded': {
                    this.$store.commit('save',{bodys: this.json2})
                    let item = this.defaultHeaders.find(v=>v.key === 'Content-Type' && v.isDefault)
                    if(!item) {
                        this.defaultHeaders.splice(0,0,{
                            key: 'Content-Type',
                            value: n,
                            isDefault: true
                        })
                    }else{
                        item.value = n
                    }
                    break;
                }
                case 'raw':{
                    this.$store.commit('save',{bodys: this.rawData})
                    let type = this.raws.find(v=>v.label === this.rawKey).value
                    let item = this.defaultHeaders.find(v=>v.key === 'Content-Type' && v.isDefault)
                    if(!item) {
                        this.defaultHeaders.splice(0,0,{
                            key: 'Content-Type',
                            value: type,
                            isDefault: true
                        })
                    }else{
                        item.value = type
                    }
                    break;
                }
            }
            this.$store.commit('save', {defaultHeaders: this.defaultHeaders})
        },
        rawKey(n) {
            let type = this.raws.find(v=>v.label === n).value
            let item = this.defaultHeaders.find(v=>v.key === 'Content-Type' && v.isDefault)
            if(!item) {
                this.defaultHeaders.splice(0,0,{
                    key: 'Content-Type',
                    value: type,
                    isDefault: true
                })
            }else{
                item.value = type
            }
            this.$store.commit('save', {defaultHeaders: this.defaultHeaders})
        }
    },
    methods: {
        onJsonChange (value) {
            console.log('value:', value);
            this.rawData = value
            this.$store.commit('save',{bodys: this.rawData})
        }
    },
}
</script>

<style lang='less' scoped>
.bodyContentType{
    .contentType{
        .ant-radio-group{
            padding: 0 16px;
        }
        
    }
    .primary{
        color: @primary-color;
    }
    .none{
        text-align: center;
        color: rgb(175,175,175);
    }

}
</style>
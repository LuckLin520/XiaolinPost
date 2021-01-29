<template>
<div class="tabContent">
    <div class="formbox" ref="formbox">
        <a-input-group compact size='large'>
            <a-select style="width:100px" :getPopupContainer="()=>$refs.formbox" v-model="method">
                <a-select-option v-for="item in methodOption" :key="item" :value="item">{{item}}</a-select-option>
            </a-select>
            <a-input placeholder="Enter request URL" :value="allURL" @change="addressChange"/>
        </a-input-group>
        <a-switch checked-children="关闭代理" un-checked-children="启用代理" v-model="proxy"/>
        <a-button type="primary" icon="rocket" style="margin-left:14px;font-weight:600" size='large' @click="onSend">Send</a-button>
    </div>
    <div class="optionbox">
        <a-tabs :v-model="activeKey" :animated="false">
            <a-tab-pane key="Params">
                <div class="optionLabel">Query Params</div>
                <KeyValueParams @changeParams="changeParams" :currentParams="currentParams" :params="params" ref="KeyValueParams"/>
                <span slot="tab">
                    <a-badge :color="currentParams?'green':'transparent'">
                        <span>Params</span>
                    </a-badge>
                </span>
            </a-tab-pane>
            <a-tab-pane key="Headers" forceRender>
                <span slot="tab">Headers<span style="color:green;font-weight:400" v-if="Object.keys(headers).length"> ({{Object.keys(headers).length}})</span></span>
                <div class="optionLabel">
                    <span>Headers</span>
                    <span class="hid" @click="showHid = !showHid"><a-icon :type="showHid?'eye':'eye-invisible'"/>{{showHid?' Hide auto-generated headers': (' '+ len + ' Hidden')}}</span>
                </div>
                <KeyValueHeaders :showHid="showHid" :headers.sync="headers" ref="KeyValueHeaders"/>
            </a-tab-pane>
            <a-tab-pane key="Body" forceRender>
                <a-badge slot="tab" :color="isShowBodysDot?'green':'transparent'">
                    <span>Body</span>
                </a-badge>
                <BodyContentType :cttype="cttype" :cond="cond"/>
            </a-tab-pane>
        </a-tabs>
    </div>
</div>
</template>

<script>
import KeyValueParams from './keyValueParams'
import KeyValueHeaders from './keyValueHeaders'
import BodyContentType from './bodyContentType'
export default {
    components: {KeyValueParams,KeyValueHeaders,BodyContentType},
    props: {
        panes: Array,
        itemKey: Number
    },
    data() {
        const methodOption = {
            "GET": "GET",
            "POST": "POST",
            "PUT": "PUT",
            "PATCH": "PATCH",
            "DELETE": "DELETE",
            "COPY": "COPY",
            "HEAD": "HEAD",
            "OPTIONS": "OPTIONS",
            "LINK": "LINK",
            "UNLINK": "UNLINK",
            "PURGE": "PURGE",
            "LOCK": "LOCK",
            "UNLOCK": "UNLOCK",
            "PROPFIND": "PROPFIND",
            "VIEW": "VIEW"
        }
        return {
            methodOption,
            method: methodOption.GET,
            proxy: false,
            address: undefined,
            currentParams: '',
            params: {},
            cttype: '',
            cond: null,

            activeKey: 'Params',
            showHid: true,

            headers: {},
            len: this.$store.state.defaultHeaders.length
            
        }
    },
    computed: {
        allURL() {
            let allURL = (this.address || '') + (this.currentParams || '')
            return allURL
        },
        isShowBodysDot() {
            let bodys = this.$store.state.bodys
            if((bodys.__proto__.constructor === String && bodys.length) || (bodys.__proto__.constructor === Object && Object.keys(bodys).length)) return true
            return false
        }
    },
    watch: {
        allURL(n) {
            this.panes.forEach(v=> {
                if(v.key === this.itemKey) v.allURL = n
            })
            this.$emit('update:panes', JSON.parse(JSON.stringify(this.panes)))
        },
        "$store.state.defaultHeaders.length"(n){
            this.len = n
        },
        method(n) {
            this.panes.forEach(v=> {
                if(v.key === this.itemKey) v.method = n
            })
        }
    },
    mounted() {
        this.panes.forEach(v=> {
            console.log(v.condition)
            if(v.key === this.itemKey && v.condition) {
                v.method = v.condition.method
                this.proxy = v.condition.proxy
                this.address = v.condition.address
                this.params = v.condition.params
                if(Object.keys(v.condition.headers).length){
                    this.$refs['KeyValueHeaders'].onJsonChange(v.condition.headers)
                }
                if(v.condition.headers['Content-Type']) {
                    this.cttype = v.condition.headers['Content-Type'] === 'multipart/form-data' ? 'form-data' : v.condition.headers['Content-Type']
                    this.cond = v.condition.bodys
                }
            }
        })
    },
    methods: {
        onSend() {
            this.$emit('onSend', {
                method: this.method,
                address: this.address,
                params: this.$refs['KeyValueParams'].json,
                headers: this.headers,
                bodys: this.$store.state.bodys,
                proxy: this.proxy
            })
        },
        addressChange(e) {
            let val = e.target.value
            let idx = val.indexOf('?')
            if(idx === -1) {
                this.currentParams = ''
                this.address = val
            }else{
                let params = val.slice(idx)
                this.currentParams = params
                this.address = val.slice(0,idx)
            }
        },
        changeParams(str) {
            this.currentParams = str
        }
    }
}
</script>

<style lang='less' scoped>
.tabContent{
    .formbox{
        position: relative;
        display: flex;
        align-items: center;
        .ant-input-group{
            display: flex;
            flex: 1;
            margin-right: 15px;
            /deep/ .ant-select{
                .ant-select-selection{
                    background: rgb(240,240,240);
                }
                &.ant-select-open{
                    .ant-select-selection{
                         background: #fff;
                    }
                }
                .ant-select-selection__rendered{
                    line-height: 36px;
                }
            }
            .ant-input{
                flex: 1;
                background: rgb(240,240,240);
                &:focus{
                    background: #fff;
                }
            }
        }
        /deep/ .ant-select-dropdown{
            top: 42px!important;
            .ant-select-dropdown-menu{
                max-height: 500px;
            } 
        }
    }
    .optionbox{
        /deep/ .ant-tabs{
            .ant-tabs-nav-wrap{
                .ant-tabs-tab{
                    &:last-of-type{
                        font-weight: initial;
                        letter-spacing: initial;
                    }
                    &.ant-tabs-tab-active{
                        &::before{
                            display: none;
                        }
                    }
                }
                
            }
            .ant-tabs-tabpane{
                .optionLabel{
                    margin-bottom: 12px;
                    padding-left: 15px;
                    .hid{
                        background: rgb(247,247,247);
                        padding: 2px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                        cursor: pointer;
                        margin-left: 12px;
                    }
                }
            }
            .ant-tabs-bar{
                border-bottom: none;
                margin-bottom: 10px;
                margin-top: 5px;
            }
        }
    }
}
</style>
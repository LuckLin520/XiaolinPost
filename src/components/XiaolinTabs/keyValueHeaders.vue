<template>
<div class="keyValueHeaders">
    <a-table
      :columns="columns"
      :data-source="data"
      size="small"
      bordered
      :pagination="false"
      :rowKey="(v,i)=>i"
    >
        <div class="editCell" slot="KEY" slot-scope="record">
            <a-input v-if="record.isDefault" type="text" placeholder="Key" disabled :value="record.key"/>
            <a-input v-else type="text" placeholder="Key" v-model="record.key"/>
        </div>
        <div class="editCell" slot="VALUE" slot-scope="record">
            <a-input v-if="record.isDefault" type="text" placeholder="Key" disabled :value="record.value || '<calculated when request is sent>'"/>
            <a-input v-else type="text" placeholder="Value" v-model="record.value"/>
        </div>
        <div class="editCell" slot="DESCRIPTION" slot-scope="text,record,index">
            <a-input type="text" placeholder="Description" :disabled="record.isDefault"/>
            <a-icon type="close" v-if="index > defaultHeaders.length" @click="onDelete(index)"/>
        </div>
    </a-table>
    <vue-json-editor
        v-model="json" 
        :show-btns="false"
        :mode="'code'"
        lang="zh"
        @json-change="onJsonChange"
        >
    </vue-json-editor>
</div>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'
const columns = [
  {
    title: 'KEY',
    scopedSlots: { customRender: 'KEY' },
    width: '20%'
  },
  {
    title: 'VALUE',
    scopedSlots: { customRender: 'VALUE' },
  },
  {
    title: 'DESCRIPTION',
    scopedSlots: { customRender: 'DESCRIPTION' },
  }
];
export default {
    props: {
        showHid: Boolean,
        headers: Object
    },
    components: {vueJsonEditor},
    data() {
        return {
            data:[{
                key: undefined,
                value: undefined
            }],
            columns,
            json: {}
        };
    },
    computed: {
        defaultHeaders() {
            return this.$store.state.defaultHeaders
        }
    },
    watch: {
        showHid: {
            handler(n) {
                if(n) this.data = [...this.defaultHeaders, ...this.data]
                else this.data = this.data.filter(v=> !v.isDefault)
            },
            immediate: true
        },
        data: {
            handler(n) {
                let json = {}
                n.forEach(v=>{
                    if((v.key !== undefined || v.value !== undefined) && !v.isDefault) {
                        json[v.key] = v.value || json[v.key] || ''
                    }
                })
                let filter = n.filter(v=>!v.key && !v.value && !v.description)
                if(!filter.length) {
                    this.data.push({
                        key: undefined,
                        value: undefined
                    })
                }
                for(let key in json) {
                    if(/^\d+$/.test(json[key])) json[key] = Number(json[key])
                }
                this.json = json

                let dfJson = {}
                this.defaultHeaders.forEach(v=>{
                    dfJson[v.key] = v.value
                })
                this.$emit('update:headers', {...dfJson, ...json})
            },
            deep: true,
            immediate: true
        },
        defaultHeaders: {
            handler() {
                // this.data = JSON.parse(JSON.stringify(this.data))
                let added = this.data.filter(v=>!v.isDefault)
                if(this.showHid) this.data = [...this.defaultHeaders, ...added]
                else this.data = added
                
            },
            deep: true
        }
    },
    methods: {
        onDelete(index) {
            this.data.splice(index,1)
        },
        onJsonChange (value) {
            console.log('value:', value);
            let keys = Object.keys(value)
            let data = keys.map(v=>{
                return {
                    key: v,
                    value: value[v]
                }
            })
            if(this.showHid) {
                this.data = [...this.defaultHeaders,...data]
            }else{
                this.data = data
            }
        },
    },
}
</script>

<style lang='less' scoped>
.keyValueHeaders{
    /deep/ .ant-table-wrapper{
        .ant-table-content{
            .ant-table-body{
                margin: 0;
                tr{
                    &:hover{
                        td{
                            .editCell{
                                .anticon-close{
                                    display: initial;
                                }
                            }
                        }
                    }
                    td{
                        padding: 0;
                        .editCell{
                            position: relative;
                            .ant-input{
                                border: none;
                                background: transparent;
                                border-radius: 0;
                                border: 1px solid transparent;
                                &:focus{
                                    border-color: @primary-color;
                                }
                            }
                            .anticon{
                                position: absolute;
                                right: 8px;
                                top: 50%;
                                transform: translateY(-50%);
                                font-size: 20px;
                                cursor: pointer;
                                display: none;
                            }
                        }
                    }
                }
            }
        }
        
    }
}
</style>
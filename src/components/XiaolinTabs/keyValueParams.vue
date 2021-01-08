<template>
<div class="keyValueParams">
    <a-table
      :columns="columns"
      :data-source="data"
      size="small"
      bordered
      :pagination="false"
      :rowKey="(v,i)=>i"
    >
        <div class="editCell" slot="KEY" slot-scope="record">
            <a-input type="text" placeholder="Key" v-model="record.key"/>
        </div>
        <div class="editCell" slot="VALUE" slot-scope="record">
            <a-input type="text" placeholder="Value" v-model="record.value"/>
        </div>
        <div class="editCell" slot="DESCRIPTION" slot-scope="text,record,index">
            <a-input type="text" placeholder="Description" />
            <a-icon type="close" v-if="data.length > 1" @click="onDelete(index)"/>
        </div>
    </a-table>
    <vue-json-editor
        v-model="json" 
        :show-btns="false"
        :mode="'code'"
        lang="zh"
        @json-change="onJsonChange"
        @json-save="onJsonSave" 
        @has-error="onError">
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
      currentParams: {
          type: String
      }
  },
  components: {vueJsonEditor},
  data() {
    return {
      data: [{
          key: undefined,
          value: undefined,
          description: undefined
      }],
      columns,
    //   selectedRowKeys: [],
      json: {}
    };
  },
  watch:{
     data:{
         handler(n) {
             let str = ''
             let json = {}
             n.forEach((v,i)=>{
                 if(v.key !== undefined || v.value !== undefined) {
                     str += `${i ? '&' : '?'}${v.key || ''}=${v.value || ''}`
                     json[v.key] = v.value || json[v.key] || ''
                 }
             })
             let filter = n.filter(v=>!v.key && !v.value && !v.description)
             if(!filter.length) {
                 this.data.push({
                    key: undefined,
                    value: undefined,
                    description: undefined
                })
             }
             for(let key in json) {
                if(/^\d+$/.test(json[key])) json[key] = Number(json[key])
             }
             this.json = json
             this.$emit('changeParams', str)
         },
         deep: true
     },
     currentParams(n){
        if(n === '?' || !n) {
            this.data = [{
                key: undefined,
                value: undefined,
                description: undefined
            }]
            return
        }
         if(n) {
            let arr = n.slice(1).split('&')
            this.data = arr.map(v=>{
                let idx = v.indexOf('=')
                if(idx === -1) {
                    if(!v) {
                        return {
                            key: '',
                            value: ''
                        }
                    }else{
                        return {
                            key: v,
                            value: ''
                        }
                    }
                }else{
                    return {
                        key: v.slice(0,idx),
                        value: v.slice(idx+1)
                    }
                }
            })
         }
     }
  },
  methods: {
    // onSelectChange(selectedRowKeys) {
    //   console.log('selectedRowKeys changed: ', selectedRowKeys);
    //   this.selectedRowKeys = selectedRowKeys;
    // },
    onDelete(index) {
        this.data.splice(index,1)
    },
    onJsonChange (value) {
        console.log('value:', value);
        let keys = Object.keys(value)
        this.data = keys.map(v=>{
            return {
                key: v,
                value: value[v]
            }
        })
    },
    onJsonSave (value) {
        console.log('value:', value);
    },
    onError () {
    }
  },
};
</script>

<style lang='less' scoped>
.keyValueParams{
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
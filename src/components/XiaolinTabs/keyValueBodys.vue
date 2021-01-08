<template>
<div class="keyValueBodys">
    <a-table
      :columns="columns"
      :data-source="data"
      bordered
      :pagination="false"
      :rowKey="(v,i)=>i"
    >
        <div class="editCell" slot="KEY" slot-scope="record">
            <a-input type="text" placeholder="Key" v-model="record.key" style="padding-right:46px"/>
            <a-dropdown :trigger="['click']" v-if="typeKey === 'form-data'">
                <span>{{record.type}}<a-icon type="down"/></span>
                <a-menu slot="overlay">
                    <a-menu-item @click="record.type = 'Text'" key="Text">Text</a-menu-item>
                    <a-menu-item @click="record.type = 'File'" key="File">File</a-menu-item>
                </a-menu>
            </a-dropdown>
        </div>
        <div class="editCell" slot="VALUE" slot-scope="record">
            <a-input v-if="record.type === 'Text'" type="text" placeholder="Value" v-model="record.value"/>
            <template v-else>
                <span v-if="!record.files.length" class="selectFiles" @click="openFile(record)">Select Files</span>
                <template v-else>
                    <a-tag style="margin-left:5px" v-if="record.files.length === 1" closable @close="record.files = []">{{record.files[0].name}}</a-tag>
                    <a-tag style="margin-left:5px" v-else closable @close="record.files = []">{{record.files.length}} files selected</a-tag>
                </template>
            </template>
        </div>
        <div class="editCell" slot="DESCRIPTION" slot-scope="text,record,index">
            <a-input type="text" placeholder="Description" />
            <a-icon class="close" type="close" v-if="data.length > 1" @click="onDelete(index)"/>
        </div>
    </a-table>
    <a-input v-if="showFileInput" ref="fileInput" type="file" style="display:none" @change="fileChange" multiple/>
</div>
</template>

<script>
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
  props:['typeKey'],
  data() {
    return {
      data: [{
          key: undefined,
          value: undefined,
          type: 'Text',
          files: []
      }],
      columns,
      openFileItem: null,
      showFileInput: true
    };
  },
  watch:{
    data: {
        handler(n) {
            let json = {}
            n.forEach(v=>{
                if(v.key !== undefined || v.value !== undefined || v.files.length){
                    if(v.type === 'Text') json[v.key] = v.value || json[v.key] || ''
                    else json[v.key] = v.files
                }
            })
            let filter = n.filter(v=>!v.key && !v.value && !v.description)
            if(!filter.length) {
                this.data.push({
                    key: undefined,
                    value: undefined,
                    type: 'Text',
                    files: []
                })
            }
            for(let key in json) {
                if(/^\d+$/.test(json[key])) json[key] = Number(json[key])
            }
            this.$emit('input', json)
        },
        deep: true
    }
  },
  methods: {
    onDelete(index) {
        this.data.splice(index,1)
    },
    openFile(record) {
        this.openFileItem = record
        this.$refs['fileInput'].$el.click()
    },
    fileChange(e) {
        this.openFileItem.files = e.target.files
        this.showFileInput = false
        setTimeout(()=>{
            this.showFileInput = true
        },500)
    }
  },
};
</script>

<style lang='less' scoped>
.keyValueBodys{
    /deep/ .ant-table-wrapper{
        .ant-table-content{
            .ant-table-body{
                margin: 0;
                .ant-table-thead{
                    tr{
                        th{
                            padding: 8px;
                        }
                    }
                }
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
                            .close{
                                position: absolute;
                                right: 8px;
                                top: 50%;
                                transform: translateY(-50%);
                                font-size: 20px;
                                cursor: pointer;
                                display: none;
                            }
                            .ant-dropdown-trigger{
                                position: absolute;
                                right: 5px;
                                top: 50%;
                                transform: translateY(-50%);
                                cursor: pointer;
                            }
                            .selectFiles{
                                background: rgb(236,236,236);
                                border-radius: 4px;
                                padding: 1px 8px;
                                position: absolute;
                                left: 5px;
                                top: 50%;
                                transform: translateY(-50%);
                                cursor: pointer;
                                &:hover{
                                    background: rgb(216,216,216);
                                }
                            }
                        }
                    }
                }
            }
        }
        
    }
}
</style>
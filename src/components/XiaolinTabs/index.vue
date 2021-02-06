<template>
  <div class="XiaolinTabs">
    <a-tabs :activeKey="activeKey" type="editable-card" @change="onChange" @edit="onEdit" :animated="false">
      <a-tab-pane v-for="item of panes" :key="item.key" :tab="item.method?undefined:item.title" :closable="item.closable">
        <TabContent @onSend="onSend" :panes.sync="panes" :itemKey="item.key"/>
        <span class="myTabTitle" slot="tab">
          <span class="method" :class="{[item.method]: true}">{{item.method}} </span>
          <span v-if="item.allURL">{{item.allURL}}</span>
          <span v-else>Untitled Request</span>
        </span>
      </a-tab-pane>
      <a-tab-pane key="add" tab="➕" :closable="false"></a-tab-pane>
      <a-tab-pane key="more" :closable="false">
        <a-dropdown :trigger="['click']" slot="tab">
          <span style="padding:8px 16px">···</span>
          <a-menu slot="overlay">
            <a-menu-item key="0" @click="closeTab('current')">Close Current Tab</a-menu-item>
            <a-menu-item key="1" @click="closeTab('others')">Close Others Tabs</a-menu-item>
            <a-menu-item key="3" @click="closeTab('all')">Close All Tabs</a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-tab-pane>
    </a-tabs>
    <div class="picbox">
      <img src="/favicon.ico"/>
      <p class="desc">WELCOME TO XIAOLIN-POST REQUEST TOOL😘😘😘</p>
      <p>concat:ZhiLin Zhao qq:502763576 tell:15348298177</p>
    </div>
  </div>
</template>

<script>
import TabContent from './tabContent'
export default {
  components: {TabContent},
  data() {
    return {
      activeKey: 0,
      panes: [],
      newTabIndex: 0
    };
  },
  computed: {
      history() {
          return this.$store.state.history
      }
  },
  methods: {
    onChange(key) {
      if(key === 'add') this.add()
      else if(key === 'more') void(0);
      else this.activeKey = key
    },
    onEdit(targetKey, action) {
      this[action](targetKey);
    },
    add(condition) {
      const panes = this.panes;
      const activeKey = this.newTabIndex++;
      const obj = {
        title: 'Untitled Request',
        key: activeKey,
        method: 'GET',
        condition
      }
      panes.splice(panes.length,0,obj);
      this.panes = panes;
      this.activeKey = activeKey;
    },
    remove(targetKey) {
      let activeKey = this.activeKey;
      let lastIndex;
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const panes = this.panes.filter(pane => pane.key !== targetKey);
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key;
        } else {
          activeKey = panes[0].key;
        }
      }
      this.panes = panes;
      this.activeKey = activeKey;
    },
    closeTab(type) {
      let obj = {
        current(){
          this.remove(this.activeKey)
        },
        others(){
          this.panes.filter(v=>v.key !== this.activeKey).forEach(v=> this.remove(v.key))
        },
        all(){
          this.panes = []
        }
      }
      obj[type].bind(this)()
    },
    async onSend(params) {
      if(!params.address) return;
      params._TIME = Date.now()
      this.history.push(params)
      this.$store.commit('save', {history: this.history})

      ;/^https?:\/\//.test(params.address)
      let url = params.address || '/'
      url = /^https?:\/\//.test(params.address) ? params.address : 'http://'+params.address
      if(params.headers['Content-Type'] === 'multipart/form-data') {
        const formdata = new FormData();
        for(let key in params.bodys) {
          if(typeof params.bodys[key] === 'string') {
            formdata.append(key, params.bodys[key]);
          }else if(typeof params.bodys[key] === 'object') {
            params.bodys[key].forEach(v=>{
              formdata.append((!key || key === 'undefined')?"":key, v, v.name);
            })
          }
        }
        params.bodys = formdata
      }else if(params.headers['Content-Type'] === 'x-www-form-urlencoded') {
        const formdata = new URLSearchParams();
        for(let key in params.bodys) {
          formdata.append((!key || key === 'undefined')?"":key, params.bodys[key]);
        }
        params.bodys = formdata
      }
      let res = undefined
      if(params.proxy){
        res = await this.$axios({
          url: 'http://127.0.0.1:8888/XIAOLIN-POST',
          method: 'POST',
          data: {
            url,
            method: params.method,
            params: params.params,
            data: params.bodys,
            headers: params.headers
          }
        })
      }else{
        res = await this.$axios({
          url,
          method: params.method,
          params: params.params,
          data: params.bodys,
          headers: params.headers
        })
      }
      console.log(res)
    }
  }
}
</script>

<style scoped lang="less">
.XiaolinTabs{
    // background: rgb(250,250,250);
    flex: 1;
  >.ant-tabs{
    overflow: initial;
    background: #fff;
  }
  /deep/ .ant-tabs{
    .ant-tabs-nav-wrap{
      .ant-tabs-tab{
        &:last-of-type{
          font-weight: 900;
          letter-spacing: 2px;
          padding-left: 0;
          padding-right: 0;
        }
        .myTabTitle{
          font-size: 12px;
          font-weight: initial;
          
        }
        &.ant-tabs-tab-active{
          &::before{
            position: absolute;
            content: '';
            top: 0;
            width: 100%;
            height: 2px;
            background: @primary-color;
          }
        }
      }
    }
  }
  .picbox{
    text-align: center;
    padding-top: 50px;
    .desc{
      font-size: 18px;
      margin: 20px 0;
    }
  }
}
</style>

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {$axios} from './utils/request'
import {Button, Tabs, Input, Select, Table, Icon, Badge, Dropdown, Menu, Radio, Divider, Upload, Tag, Switch} from 'ant-design-vue'
Vue.use(Button).use(Tabs).use(Input).use(Select).use(Table).use(Icon).use(Badge).use(Dropdown).use(Menu).use(Radio).use(Divider).use(Upload).use(Tag).use(Switch)
// message.config({
//   top: '35%',
//   duration: 3,
//   maxCount: 1
// })
// Vue.prototype.$message = message
Vue.prototype.$axios = $axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    defaultHeaders: [{
      key: 'XiaolinPost-Token',
      value: '',
      isDefault: true
    },
    {
      key: 'Host',
      value: '',
      isDefault: true
    },
    {
      key: 'User-Agent',
      value: 'XiaolinPostRuntime/' + require('../../package.json').version,
      isDefault: true
    },
    {
      key: 'Accept',
      value: '*/*',
      isDefault: true
    },
    {
      key: 'Accept-Encoding',
      value: 'gzip, deflate, br',
      isDefault: true
    },
    {
      key: 'Connection',
      value: 'keep-alive',
      isDefault: true
    }],
    bodys: {}
  },
  mutations: {
    save(state, payload) {
      for (let key in payload) {
        state[key] = payload[key]
      }
    }
  },
  actions: {
  },
  modules: {
  }
})

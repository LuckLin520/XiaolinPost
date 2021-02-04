import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
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
      value: 'xiaolin-post/' + require('../../package.json').version,
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
    bodys: {},
    history: localStorage.history ? JSON.parse(localStorage.history) : [],
    loading: false
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
store.subscribe((mutation) => {
  if(mutation.payload.history) localStorage.history = JSON.stringify(mutation.payload.history)
})
export default store

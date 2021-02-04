// util.js
import axios from 'axios'
import store from '@/store'
export const $axios = axios.create({ // 自定义一个实例，用于timeout 等一些方法
  timeout: 60000,
})

// 拦截请求
$axios.interceptors.request.use(
  config => {
    store.commit('save',{loading: true})
    // console.log(config);
    // let t = cookies.get('t')
    // if (t) {
    //   config.headers.t = t
    // } else {
    //   router.replace({path: '/login'})
    // }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 拦截响应
$axios.interceptors.response.use(
  response => {
    // console.log(response)
    store.commit('save',{loading: false})
    return response
  },
  err => {
    console.log(err);
    // if (err.response) {
    //   switch (err.response.status) {
    //     case 401:
    //       // 这里写清除token的代码
    //       router.replace({
    //         path: 'login',
    //         query: {redirect: router.currentRoute.fullPath} // 登录成功后跳入浏览的当前页面
    //       })
    //   }
    // }
    store.commit('save',{loading: false})
    return Promise.reject(err)
  }
)


// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ELEMENT from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import MyBread from '@/components/cuscom/myBread.vue'

import MyHttpServer from '@/plugins/http.js'
import moment from 'moment'

import router from './router'
import '@/assets/css/index.css'
Vue.use(ELEMENT)
Vue.use(MyHttpServer)

Vue.config.productionTip = false

Vue.component(MyBread.name, MyBread)

Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

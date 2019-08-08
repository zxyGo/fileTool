import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

// 按需引用iView
import {
  Form,
  FormItem,
  Input,
  Button,
  Message,
  Upload,
  Icon,
  Checkbox,
  Modal,
  Progress
} from 'iview'
import 'iview/dist/styles/iview.css'
Vue.component('Form', Form)
Vue.component('FormItem', FormItem)
Vue.component('Input', Input)
Vue.component('Button', Button)
Vue.component('Upload', Upload)
Vue.component('Icon', Icon)
Vue.component('Checkbox', Checkbox)
Vue.component('Progress', Progress)
Vue.component('Modal', Modal)
Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

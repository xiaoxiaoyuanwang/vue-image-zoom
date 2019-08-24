import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'

import {
  Message,
  Loading,
  Dialog,
  MessageBox,
  Carousel,
  CarouselItem
} from 'element-ui'

Vue.use(Dialog)
Vue.use(Carousel)
Vue.use(CarouselItem)

Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$confirm = MessageBox.confirm

import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'

import Main from '../views/Main.vue'
import Video from '../views/Video.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Main },
    { path: '/rooms', component: Video }
  ]
})

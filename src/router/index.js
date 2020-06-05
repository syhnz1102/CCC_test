import Vue from 'vue'
import Router from 'vue-router'

import Main from '../views/Main.vue'
import Call from '../views/Call.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Main },
    { path: '/room/:id', component: Call }
  ]
})

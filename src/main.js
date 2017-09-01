import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import Notifications from './components/UIComponents/NotificationPlugin'
import SideBar from './components/UIComponents/SidebarPlugin'
import App from './App'

import cache from './service/cache'

// router setup
import routes from './routes/routes'

// library imports
import Chartist from 'chartist'
import 'bootstrap/dist/css/bootstrap.css'
import './assets/sass/paper-dashboard.scss'
import 'es6-promise/auto'
import plugins from './service/plugins'

// plugin setup
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(GlobalComponents)
Vue.use(GlobalDirectives)
Vue.use(Notifications)
Vue.use(SideBar)
Vue.use(plugins)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  mode: 'history',
  linkActiveClass: 'active'
})

router.beforeEach(function (to, from, next) {
  if (to.name !== 'login' && !cache.getItem('token')) {
    next('/login')
  } else {
    next()
  }
})

// global library setup
Object.defineProperty(Vue.prototype, '$Chartist', {
  get () {
    return this.$root.Chartist
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  data: {
    Chartist: Chartist
  }
})

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from './store';

import 'bootstrap/dist/css/bootstrap.css'

const EventBus = new Vue()
Vue.prototype.$eventBus = EventBus

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

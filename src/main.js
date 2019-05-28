import Vue from 'vue'
import App from './App.vue'
import timeSelect from "./components/vue-time-select.vue";

Vue.component('time-select', timeSelect)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

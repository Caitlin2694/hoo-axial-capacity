import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import VuePapaParse from 'vue-papa-parse';
import VueYouTubeEmbed from 'vue-youtube-embed'
import JsonExcel from 'vue-json-excel';
import JsonCsv from 'vue-json-csv';

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')

Vue.use(VuePapaParse)
Vue.use(VueYouTubeEmbed)
Vue.use(JsonExcel);
Vue.use(JsonCsv);
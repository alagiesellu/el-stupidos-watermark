import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

import plugin from '@serializedowen/vue-img-watermark';

Vue.use(plugin);

new Vue({
  render: h => h(App),
}).$mount('#app');

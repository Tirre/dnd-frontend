import { createApp } from 'vue';
import App from './App.vue';
import '@/assets/style.css';

import { Quasar } from 'quasar';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import '@quasar/extras/bootstrap-icons/bootstrap-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const app = createApp(App);
app.use(Quasar, { plugins: {} });

import axiosPlugin from '@/plugins/axios.js';
app.use(axiosPlugin);

import { createPinia } from 'pinia';
const pinia = createPinia();
app.use(pinia);

/* Globally available components */
import GlobalSpinner from '@/components/GlobalSpinner.vue';
import Modal from '@/components/Modal.vue';
import SlideOut from '@/components/SlideOut.vue';

app.component( 'GlobalSpinner', GlobalSpinner );
app.component( 'Modal', Modal );
app.component( 'SlideOut', SlideOut );

app.mount('#app');

/* This is to initialize monster data on app load */
import { useMobStore } from '@/stores/mobStore.js';
const mobStore = useMobStore();
mobStore.getMonstersLocal();
mobStore.getPlayersLocal();
mobStore.getMonstersAPI();
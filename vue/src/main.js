import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/index";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";
import myPlugin from "./assets/js/commPlugin";
// import materialStore from './store/material';



// SWEETALERT창
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';



const appInstance = createApp(App);
appInstance.use(VueSweetalert2);
appInstance.use(store);
//appInstance.use(materialStore);
appInstance.use(router);
appInstance.use(ArgonDashboard);
appInstance.use(myPlugin); // 커스텀 플러그인 사용 등록
appInstance.mount("#app");



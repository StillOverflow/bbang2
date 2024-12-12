import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Business from "../views/Business.vue"; //영업
import Produce from "../views/Produce.vue"; //생산
import Produce_ow from "../views/Produce_ow.vue"; //생산
import Equipment from '../views/Equipment.vue'; //설비
import Material from "../views/Material.vue"; //자재
import Quality from "../views/Quality.vue"; //품질
import Standard from "../views/Standard.vue"; //기준정보
import Statistics from "../views/Statistics.vue"; //통계
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";

const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/dashboard-default',
  },
  {
    path: '/dashboard-default',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    //영업
    path: '/business',
    name: 'Business',
    component: Business,
  },
  {
    //생산
    path: '/produce',
    name: 'produce',
    component: Produce,
  },
  { //생산지시 등록
    path: "/produce_ow",
    name: "produce_ow",
    component: Produce_ow,
  },
  { //설비
    path: '/equipment',
    name: 'Equipment',
    component: Equipment
  },
  {
    //자재
    path: '/material',
    name: 'Material',
    component: Material,
  },
  {
    //품질
    path: '/quality',
    name: 'Quality',
    component: Quality,
  },
  {
    //기준정보
    path: '/standard',
    name: 'Standard',
    component: Standard,
  },
  { //통계
    path: "/statistics",
    name: "Statistics",
    component: Statistics,
  },
  {
    path: '/tables',
    name: 'Tables',
    component: Tables,
  },
  {
    path: '/billing',
    name: 'Billing',
    component: Billing,
  },
  {
    path: '/virtual-reality',
    name: 'Virtual Reality',
    component: VirtualReality,
  },
  {
    path: '/rtl-page',
    name: 'RTL',
    component: RTL,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Signin,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
});

export default router;

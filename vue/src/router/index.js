import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";




////////////////////////////// 영업 //////////////////////////////
import Business from "../views/Business.vue";















////////////////////////////// 생산 //////////////////////////////
import Production from "../views/Production.vue";
import Production_ow from "../views/Production_ow.vue";















////////////////////////////// 설비 //////////////////////////////
import Equipment from '../views/Equipment.vue';














////////////////////////////// 자재 //////////////////////////////
import Material from "../views/Material.vue";













////////////////////////////// 품질 //////////////////////////////
import QualityStdAdd from "../views/QualityStdAdd.vue";













//////////////////////////// 기준정보 ////////////////////////////
import Standard from "../views/Standard.vue";
import Bom from "../views/Bom.vue";













//////////////////////////// 통계(미정) ////////////////////////////
import Statistics from "../views/Statistics.vue"; //통계





import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";



/////////////////////// 여기부터 라우트 등록 //////////////////////
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
  
////////////////////////////// 영업 //////////////////////////////
  {
    //영업
    path: '/business',
    name: 'Business',
    component: Business,
  },










































////////////////////////////// 생산 //////////////////////////////
  {
    //생산
    path: '/production',
    name: 'Production',
    component: Production,
  },
  { //생산지시 등록
    path: "/production_ow",
    name: "Production_ow",
    component: Production_ow,
  },
















































////////////////////////////// 설비 //////////////////////////////
  { //설비
    path: '/equipment',
    name: 'Equipment',
    component: Equipment
  },






























////////////////////////////// 자재 //////////////////////////////
  {
    //자재
    path: '/material',
    name: 'Material',
    component: Material,
  },




































////////////////////////////// 품질 //////////////////////////////
  {
    //품질
    path: '/Quality_stdAdd',
    name: 'QualityStdAdd',
    component: QualityStdAdd,
  },




































  //////////////////////////// 기준정보 ////////////////////////////
  {
    //기준정보
    path: '/standard',
    name: 'Standard',
    component: Standard,
  },
  { //BOM
    path: "/bom",
    name: "Bom",
    component: Bom,
  },




































/////////////////////////// 통계(미정) ///////////////////////////
  { //통계
    path: "/statistics",
    name: "Statistics",
    component: Statistics,
  },




























///////////////////////// 쓸모없는 거 //////////////////////////
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

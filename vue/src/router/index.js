import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';

////////////////////////////// 영업 //////////////////////////////
import Sales from '../views/sales/Sales.vue';
import Sales_OrderAdd from '../views/sales/Sales_OrderAdd.vue';
import Sales_OrderList from '../views/sales/Sales_OrderList.vue';

////////////////////////////// 생산 //////////////////////////////
import Produce from '../views/produce/Produce.vue';
import Produce_ow from '../views/produce/Produce_ow.vue';

////////////////////////////// 설비 //////////////////////////////
import Equipment from '../views/equipment/Equipment.vue';
import EquipmentMgmt from '../views/equipment/EquipmentMgmt.vue';

////////////////////////////// 자재 //////////////////////////////
import MaterialOrderList from '../views/material/MaterialsOrderList.vue';
import MaterialOrderManage from '../views/material/MaterialsOrderManage.vue';


////////////////////////////// 품질 //////////////////////////////
import QualityStdAdd from '../views/quality/QualityStdAdd.vue';

//////////////////////////// 기준정보 ////////////////////////////
import Standard from '../views/standard/Standard.vue';
import Bom from '../views/standard/Bom.vue';
// import ProcessFlow from '../views/standard/ProcessFlow.vue';

//////////////////////////// 통계(미정) ////////////////////////////
import Statistics from '../views/Statistics.vue'; //통계

import Tables from '../views/Tables.vue';
import Billing from '../views/Billing.vue';
import VirtualReality from '../views/VirtualReality.vue';
import RTL from '../views/Rtl.vue';
import Profile from '../views/Profile.vue';
import Signup from '../views/Signup.vue';
import Signin from '../views/Signin.vue';
import Grid from '../views/Grid.vue';

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
    path: '/slaes',
    name: 'sales',
    component: Sales,
  },
  {
    //주문서 등록
    path: '/sales_orderadd',
    name: 'sales_orderadd',
    component: Sales_OrderAdd,
  },
  {
    //주문서 목록
    path: '/sales_orderlist',
    name: 'sales_orderlist',
    component: Sales_OrderList,
  },

  ////////////////////////////// 생산 //////////////////////////////
  {
    //생산
    path: '/produce',
    name: 'produce',
    component: Produce,
  },
  {
    //생산지시 등록
    path: '/produce_ow',
    name: 'produce_ow',
    component: Produce_ow,
  },

  ////////////////////////////// 설비 //////////////////////////////
  {
    //설비
    path: '/equipment',
    name: 'equipment',
    component: Equipment,
  },
  {
    //설비관리
    path: '/equipment_Mgmt',
    name: 'Equipment_Mgmt',
    component: EquipmentMgmt,
  },

  ////////////////////////////// 자재 //////////////////////////////
  {
    //자재 발주서 조회
    path: '/materials/order/list',
    name: 'MaterialsOrderList',
    component: MaterialOrderList,
  },
  {
    //자재 발주서 관리
    path: '/materials/order/manage',
    name: 'MaterialsOrderManage',
    component: MaterialOrderManage,
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
  {
    //BOM
    path: '/Bom',
    name: 'Bom',
    component: Bom,
  },
  // {
  //   path: '/ProcessFlow',
  //   name: 'ProcessFlow',
  //   component: ProcessFlow,
  // },
  /////////////////////////// 통계(미정) ///////////////////////////
  {
    //통계
    path: '/statistics',
    name: 'Statistics',
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
  {
    path: '/grid',
    name: 'Grid',
    component: Grid,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
});

export default router;

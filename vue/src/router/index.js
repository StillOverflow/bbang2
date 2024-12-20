import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';

////////////////////////////// 영업 //////////////////////////////
import Sales from '../views/sales/Sales.vue';
import Sales_OrderAdd from '../views/sales/Sales_OrderAdd.vue';
import Sales_OrderList from '../views/sales/Sales_OrderList.vue';
import Sales_ProOutAdd from '../views/sales/Sales_ProOutAdd.vue';
import Sales_ProOutList from '../views/sales/Sales_ProOutList.vue';
import Sales_ResultAdd from '../views/sales/Sales_ResultAdd.vue';
import Sales_ResultList from '../views/sales/Sales_ResultList.vue';
import Sales_ProList from '../views/sales/Sales_ProList.vue';


////////////////////////////// 생산 //////////////////////////////
import Produce from '../views/produce/Produce.vue';
import Produce_PlanList from '../views/produce/Produce_PlanList.vue';
import Produce_InstAdd from '../views/produce/Produce_InstAdd.vue';
import Produce_InstAdd_test from '../views/produce/Produce_InstAdd_test.vue';

////////////////////////////// 설비 //////////////////////////////
import Equipment from '../views/equipment/Equipment.vue';
import EquipmentMgmt from '../views/equipment/EquipmentMgmt.vue';
import EquipmentAllList from '../views/equipment/EquipmentAllList.vue';

////////////////////////////// 자재 //////////////////////////////
import MaterialOrderList from '../views/material/MaterialsOrderList.vue';
import MaterialOrderManage from '../views/material/MaterialsOrderManage.vue';

////////////////////////////// 품질 //////////////////////////////
import QualityStdAdd from '../views/quality/QualityStdAdd.vue';

//////////////////////////// 기준정보 ////////////////////////////
import ProcessFlow from '../views/standard/ProcessFlow.vue';
import Bom from '../views/standard/Bom.vue';

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
  {
    //출고제품 등록
    path: '/sales_ProOutAdd',
    name: 'sales_ProOutAdd',
    component: Sales_ProOutAdd,
  },
  {
    //출고제품 목록
    path: '/sales_ProOutList',
    name: 'sales_ProOutList',
    component: Sales_ProOutList,
  },
  {
    //반품제품 등록
    path: '/sales_ResultAdd',
    name: 'sales_ResultAdd',
    component: Sales_ResultAdd,
  },
  {
    //반품제품 목록
    path: '/sales_ResultList',
    name: 'sales_ResultList',
    component: Sales_ResultList,
  },
  {
    //제품 목록
    path: '/sales_ProList',
    name: 'sales_ProList',
    component: Sales_ProList,
  },

  ////////////////////////////// 생산 //////////////////////////////
  {
    //생산
    path: '/produce',
    name: 'produce',
    component: Produce,
  },
  {
    //생산지시서 조회
    path: '/Produce_PlanList',
    name: 'Produce_PlanList',
    component: Produce_PlanList,
  },
  {
    //생산지시서 등록
    path: '/Produce_InstAdd',
    name: 'Produce_InstAdd',
    component: Produce_InstAdd,
  },
  {
    //생산지시서 등록
    path: '/Produce_InstAdd_test',
    name: 'Produce_InstAdd_test',
    component: Produce_InstAdd_test,
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
    path: '/Equipment_Mgmt',
    name: 'Equipment_Mgmt',
    component: EquipmentMgmt,
  },
  {
    //설비 전체 조회
    path: '/Equipment_AllList',
    name: 'Equipment_AllList',
    component: EquipmentAllList,
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
    path: '/ProcessFlow',
    name: 'ProcessFlow',
    component: ProcessFlow,
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

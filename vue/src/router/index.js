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
import Produce_PlanAdd from '../views/produce/Produce_PlanAdd.vue';
import Produce_InstList from '../views/produce/Produce_InstList.vue';
import Produce_InstAdd from '../views/produce/Produce_InstAdd.vue';
import Produce_Hell from '../views/produce/Produce_Hell.vue';





////////////////////////////// 설비 //////////////////////////////
import Equipment from '../views/equipment/Equipment.vue';
import EquipmentMgmt from '../views/equipment/EquipmentMgmt.vue';
import EquipmentAllList from '../views/equipment/EquipmentAllList.vue';
import EquipmentInspectionMgmt from '../views/equipment/EquipmentInspectionMgmt.vue';





////////////////////////////// 자재 //////////////////////////////
import MaterialOrderList from '../views/material/MaterialsOrderList.vue';
import MaterialsPlanStockList from '../views/material/ProductionPlanAndStock.vue';
import MaterialsOrderManage from '../views/material/MaterialsOrderManage.vue';





////////////////////////////// 품질 //////////////////////////////
import QualityStdAdd from '../views/quality/QualityStdAdd.vue';
import QualityTest from '../views/quality/QualityTest.vue';






//////////////////////////// 기준정보 ////////////////////////////
import Standard_ProcessFlow from '../views/standard/Standard_ProcessFlow.vue';
import Standard_Bom from '../views/standard/Standard_Bom.vue';
import Standard_MtlAdd from'../views/standard/Standard_MtlAdd.vue';
import Standard_ProductAdd from '../views/standard/Standard_ProductAdd.vue';
import Standard_ProcessAdd from '../views/standard/Standard_ProcessAdd.vue';






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
    //생산계획서 등록
    path: '/Produce_PlanAdd',
    name: 'Produce_PlanAdd',
    component: Produce_PlanAdd,
  },
  {
    //생산계획서 조회
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
    //생산계획서 조회
    path: '/Produce_InstList',
    name: 'Produce_InstList',
    component: Produce_InstList,
  },
  {
    //생산계획서 조회
    path: '/Produce_InstList',
    name: 'Produce_InstList',
    component: Produce_InstList,
  },
  {
    //생산공정관리
    path: '/Produce_Hell',
    name: 'Produce_Hell',
    component: Produce_Hell,
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

  {
    //설비 점검 관라
    path: '/Equipment_InspectionMgmt',
    name: 'Equipment_InspectionMgmt',
    component: EquipmentInspectionMgmt,
  },

  





















  



  
  ////////////////////////////// 자재 //////////////////////////////
  {
    // 자재 발주서 조회
    path: '/materials/order/list',
    name: 'MaterialsOrderList',
    component: MaterialOrderList,
  },
  {
    // 미지시 생산 계획서 조회 및 자재 재고 조회ㄱ
    path: '/materials/planStock/list',
    name: 'MaterialsPlanStockList',
    component: MaterialsPlanStockList,
  },
  {
    // 자재 발주서 관리
    path: '/materials/order/manage',
    name: 'MaterialsOrderManage',
    component: MaterialsOrderManage,
  },

























  
  ////////////////////////////// 품질 //////////////////////////////
  {
    // 품질기준 관리
    path: '/Quality_stdAdd',
    name: 'QualityStdAdd',
    component: QualityStdAdd,
  },
  {
    // 품질검사
    path: '/Quality_test',
    name: 'QualityTest',
    component: QualityTest,
  },
































  //////////////////////////// 기준정보 ////////////////////////////
  {
    //기준정보
    path: '/Standard_ProcessFlow',
    name: 'Standard_ProcessFlow',
    component: Standard_ProcessFlow,
  },
  {
    //BOM
    path: '/Standard_Bom',
    name: 'Standard_Bom',
    component: Standard_Bom,
  },
  {
    //자재추가
    path: '/Standard_MtlAdd',
    name: 'Standard_MtlAdd',
    component: Standard_MtlAdd,
  },
  {
    //제품추가
    path: '/Standard_ProductAdd',
    name: '/Standard_ProductAdd',
    component: Standard_ProductAdd,
  },
  {
    //공정추가
    path: '/Standard_ProcessAdd',
    name: '/Standard_ProcessAdd',
    component: Standard_ProcessAdd,
  },












































  
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

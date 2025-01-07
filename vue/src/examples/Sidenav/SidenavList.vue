<script setup>
// import { computed } from 'vue';
import { useRoute } from 'vue-router';
// import { useStore } from 'vuex';

import SidenavItem from './SidenavItem.vue';
import SidenavCard from './SidenavCard.vue';

// const store = useStore();
// const isRTL = computed(() => store.state.isRTL);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split('/');
  return routeArr[1];
};
</script>

<script>
export default {
  methods: {
    urlCompare(value) {
      const route = useRoute();
      const routeArr = route.path.split('/');
      const nowUrl = routeArr[1];
      if (nowUrl.includes(value)) {
        return true;
      }
    },
    showList(name) {
      const elements_head = document.querySelectorAll('.nav-item.head > a'); //1depth 메뉴 전체
      const elements_detail = document.querySelectorAll('.navbar-nav.detail'); //2depth 메뉴 전체
      const this_head = document.querySelector('#' + name + ' > a'); //선택한 1depth 메뉴
      const this_detail = document.querySelector('.' + name + '_list'); //선택한 2depth 메뉴

      this_head.classList.toggle('active'); //선택한 메뉴 toggle

      if (this_head.classList.contains('active')) {
        //활성화 되었다면

        //전체 1,2depth 메뉴 비활성화
        for (var i = 0; i < elements_head.length; i++) {
          elements_head[i].classList.remove('active');
        }
        for (var j = 0; j < elements_detail.length; j++) {
          elements_detail[j].classList.add('dnone');
        }
      }

      this_head.classList.toggle('active');
      this_detail.classList.toggle('dnone');
    },
  },
};
</script>
<template>
  <div>
    <div class="collapse navbar-collapse w-auto h-auto h-100" id="sidenav-collapse-main">
      <ul class="navbar-nav">
        <!-- 영업  -->
        <li class="nav-item head" id="Sales" @click="showList('Sales')">
          <a class="nav-link" :class="urlCompare('Sales') == true ? 'active' : ''">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-scroll text-success text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">영업</span>
          </a>
        </li>
        <ul class="navbar-nav detail Sales_list" :class="urlCompare('Sales') == true ? '' : 'dnone'">
          <li class="nav-item">
            <sidenav-item to="/Sales_OrderList" :class="getRoute() === 'Sales_OrderList' ? 'active' : ''"
              :navText="'주문서 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item" v-if="this.$session.get('user_ps') == 'H01' || this.$session.get('user_dpt') == 'DPT3' ">
            <sidenav-item to="/Sales_OrderAdd" :class="getRoute() === 'Sales_OrderAdd' ? 'active' : ''"
              :navText="'주문서 등록'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Sales_ProOutList" :class="getRoute() === 'Sales_ProOutList' ? 'active' : ''"
              :navText="'출고제품 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item" v-if="this.$session.get('user_ps') == 'H01' || this.$session.get('user_dpt') == 'DPT3' ">
            <sidenav-item to="/Sales_ProOutAdd" :class="getRoute() === 'Sales_ProOutAdd' ? 'active' : ''"
              :navText="'출고제품 등록'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Sales_ResultList" :class="getRoute() === 'Sales_ResultList' ? 'active' : ''"
              :navText="'반품제품 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item" v-if="this.$session.get('user_ps') == 'H01' || this.$session.get('user_dpt') == 'DPT3' ">
            <sidenav-item to="/Sales_ResultAdd" :class="getRoute() === 'Sales_ResultAdd' ? 'active' : ''"
              :navText="'반품제품 등록'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Sales_ProList" :class="getRoute() === 'Sales_ProList' ? 'active' : ''" :navText="'제품재고'">
            </sidenav-item>
          </li>
        </ul>



























        <!-- 생산  -->
        <li class="nav-item head" id="Produce" @click="showList('Produce')">
          <a class="nav-link" :class="urlCompare('Produce') == true ? 'active' : ''">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-desktop text-success text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">생산</span>
          </a>
        </li>
        <ul class="navbar-nav detail Produce_list" :class="urlCompare('Produce') == true ? '' : 'dnone'">
          <li class="nav-item">
            <sidenav-item to="/Produce_PlanList" :class="getRoute() === 'Produce_PlanList' ? 'active' : ''"
              :navText="'생산계획서 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item" v-if="this.$session.get('user_ps') == 'H01'">
            <sidenav-item to="/Produce_PlanAdd" :class="getRoute() === 'Produce_PlanAdd' ? 'active' : ''"
              :navText="'생산계획서 등록'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Produce_InstList" :class="getRoute() === 'Produce_InstList' ? 'active' : ''"
              :navText="'생산지시서 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item" v-if="this.$session.get('user_ps') == 'H01'">
            <sidenav-item to="/Produce_InstAdd" :class="getRoute() === 'Produce_InstAdd' ? 'active' : ''"
              :navText="'생산지시서 등록'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Produce_Hell" :class="getRoute() === 'Produce_Hell' ? 'active' : ''"
              :navText="'생산공정 관리'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Produce_Result" :class="getRoute() === 'Produce_Result' ? 'active' : ''"
              :navText="'생산실적 조회'">
            </sidenav-item>
          </li>
        </ul>


























        <!-- 자재관리  -->
        <li class="nav-item head" id="Material" @click="showList('Material')">
          <a class="nav-link" :class="urlCompare('Material') == true ? 'active' : ''">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-cart-shopping text-success text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">자재</span>
          </a>
        </li>
        <ul class="navbar-nav detail Material_list" :class="urlCompare('materials') == true ? '' : 'dnone'">
          
          <li class="nav-item">
            <sidenav-item to="/materials/order/list"
              :class="getRoute() === 'MaterialsOrderList' ? 'active' : ''"
              :navText="'자재 발주서 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/materials/planStock/list"
              :class="getRoute() === 'MaterialsPlanStockList' ? 'active' : ''"
              :navText="'미지시 계획서 자재 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/materials/order/manage" 
              :class="getRoute() === 'MaterialsOrderManage' ? 'active' : ''"
              :navText="'자재 발주서 관리'">
            </sidenav-item>
          </li>
          
          <li class="nav-item">
            <sidenav-item to="/materials/in/list" 
              :class="getRoute() === 'MaterialsInList' ? 'active' : ''"
              :navText="'자재 입고 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/materials/in/manage" 
              :class="getRoute() === 'MaterialsInManage' ? 'active' : ''"
              :navText="'자재 입고 관리'">
            </sidenav-item>
          </li>

          <li class="nav-item">
            <sidenav-item to="/materials/stock/list" 
              :class="getRoute() === 'MaterialsStockList' ? 'active' : ''"
              :navText="'자재 재고 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/materials/lotStock/list" 
              :class="getRoute() === 'MaterialsLotStockList' ? 'active' : ''"
              :navText="'자재 LOT별 재고 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/materials/out/list" 
              :class="getRoute() === 'MaterialsOutList' ? 'active' : ''"
              :navText="'자재 출고 조회'">
            </sidenav-item>
          </li>
<!--           
          <li class="nav-item">
            <sidenav-item to="/Material_list7" :class="getRoute() === 'Material_list7' ? 'active' : ''"
              :navText="'자재 재고 조정'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Material_list13" :class="getRoute() === 'Material_list13' ? 'active' : ''"
              :navText="'자재 반품  조회'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Material_list4" :class="getRoute() === 'Material_list4' ? 'active' : ''"
              :navText="'자재 반품 관리'">
            </sidenav-item>
          </li> -->
        </ul>






























        <!-- 설비  -->
        <li class="nav-item head" id="Equipment" @click="showList('Equipment')">
          <a class="nav-link" :class="urlCompare('Equipment') == true ? 'active' : ''">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-wrench text-success text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">설비</span>
          </a>
        </li>
        <ul class="navbar-nav detail Equipment_list" :class="urlCompare('Equipment') == true ? '' : 'dnone'">
          <li class="nav-item">
            <sidenav-item to="/Equipment_Stat" :class="getRoute() === 'Equipment_Stat' ? 'active' : ''"
              :navText="'설비 상태 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Equipment_List" :class="getRoute() === 'Equipment_List' ? 'active' : ''"
              :navText="'설비 정보 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Equipment_Mgmt" :class="getRoute() === 'Equipment_Mgmt' ? 'active' : ''"
              :navText="'설비 등록 관리'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Equipment_InspList" :class="getRoute() === 'Equipment_InspList' ? 'active' : ''"
              :navText="'설비 점검 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Equipment_InspMgmt" :class="getRoute() === 'Equipment_InspMgmt' ? 'active' : ''"
              :navText="'설비 점검 관리'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Equipment_RepairList" :class="getRoute() === 'Equipment_RepairList' ? 'active' : ''"
              :navText="'설비 수리 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Equipment_RepairMgmt" :class="getRoute() === 'Equipment_RepairMgmt' ? 'active' : ''"
              :navText="'설비 수리 관리'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Equipment_DownList" :class="getRoute() === 'Equipment_DownList' ? 'active' : ''"
              :navText="'설비 비가동 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Equipment_DownMgmt" :class="getRoute() === 'Equipment_DownMgmt' ? 'active' : ''"
              :navText="'설비 비가동 관리'">
            </sidenav-item>
          </li>
        </ul>




































        <!-- 품질  -->
        <li class="nav-item head" id="Quality" @click="showList('Quality')">
          <a class="nav-link" :class="urlCompare('Quality') == true ? 'active' : ''">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-vial-circle-check text-success text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">품질</span>
          </a>
        </li>
        <ul class="navbar-nav detail Quality_list" :class="urlCompare('Quality') == true ? '' : 'dnone'">
          <li class="nav-item">
            <sidenav-item to="/Quality_test" :class="getRoute() === 'Quality_test' ? 'active' : ''"
              :navText="'검사항목 관리'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Quality_standard" :class="getRoute() === 'Quality_standard' ? 'active' : ''"
              :navText="'품질기준 관리'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Quality_prdTest" :class="getRoute() === 'Quality_prdTest' ? 'active' : ''"
              :navText="'제품 품질검사'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Quality_matTest" :class="getRoute() === 'Quality_matTest' ? 'active' : ''"
              :navText="'자재 입고검사'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Quality_testRecList" :class="getRoute() === 'Quality_testRecList' ? 'active' : ''"
              :navText="'검사결과 조회'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Quality_DefManagement" :class="getRoute() === 'Quality_DefManagement' ? 'active' : ''"
              :navText="'미처리 불량관리'">
            </sidenav-item>
          </li>
        </ul>






















































        <!-- 기준관리  -->
        <li class="nav-item head" id="Standard" @click="showList('Standard')">
          <a class="nav-link" :class="urlCompare('Standard') == true ? 'active' : ''">
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="fa-solid fa-gear text-success text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">기준정보관리</span>
          </a>
        </li>
        <ul class="navbar-nav detail Standard_list" :class="urlCompare('Standard') == true ? '' : 'dnone'">
          <li class="nav-item" v-if="this.$session.get('user_ps') == 'H01'">
            <sidenav-item to="/Standard_memberManage" :class="getRoute() === 'Standard_memberManage' ? 'active' : ''"
              :navText="'사원관리'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Standard_AccountAdd" :class="getRoute() === 'Standard_AccountAdd' ? 'active' : ''"
              :navText="'거래처관리'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Standard_MtlAdd" :class="getRoute() === 'Standard_MtlAdd' ? 'active' : ''"
              :navText="'자재관리'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Standard_ProductAdd" :class="getRoute() === 'Standard_ProductAdd' ? 'active' : ''"
              :navText="'제품관리'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Standard_Bom" :class="getRoute() === 'Standard_Bom' ? 'active' : ''" :navText="'BOM관리'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Standard_ProcessAdd" :class="getRoute() === 'Standard_ProcessAdd' ? 'active' : ''"
              :navText="'공정관리'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Standard_ProcessFlow" :class="getRoute() === 'Standard_ProcessFlow' ? 'active' : ''"
              :navText="'공정흐름도관리'">
            </sidenav-item>
          </li>
          <li class="nav-item">
            <sidenav-item to="/Standard_Defect" :class="getRoute() === 'Standard_Defect' ? 'active' : ''"
              :navText="'불량관리'">
            </sidenav-item>
          </li>
        </ul>

        <!-- <li class="nav-item">
          <sidenav-item to="/grid" :class="getRoute() === 'grid' ? 'active' : ''" :navText="'💚그리드&버튼예시💨💨'">
            <template v-slot:icon>
              <i class="ni ni-credit-card text-success text-sm opacity-10"></i>
            </template>
          </sidenav-item>
        </li>

        <li class="nav-item">
          <sidenav-item to="/tables" :class="getRoute() === 'tables' ? 'active' : ''"
            :navText="isRTL ? 'الجداول' : 'Tables'">
            <template v-slot:icon>
              <i class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"></i>
            </template>
          </sidenav-item>
        </li>

        <li class="nav-item">
          <sidenav-item to="/billing" :class="getRoute() === 'billing' ? 'active' : ''"
            :navText="isRTL ? 'الفواتیر' : 'Billing'">
            <template v-slot:icon>
              <i class="ni ni-credit-card text-success text-sm opacity-10"></i>
            </template>
          </sidenav-item>
        </li> -->

        <!--
        <li class="nav-item">
          <sidenav-item to="/virtual-reality" :class="getRoute() === 'virtual-reality' ? 'active' : ''"
            :navText="isRTL ? 'الواقع الافتراضي' : 'Virtual Reality'">
            <template v-slot:icon>
              <i class="ni ni-app text-info text-sm opacity-10"></i>
            </template>
          </sidenav-item>
        </li>

        <li class="nav-item">
          <sidenav-item to="/rtl-page" :class="getRoute() === 'rtl-page' ? 'active' : ''" navText="RTL">
            <template v-slot:icon>
              <i class="ni ni-world-2 text-danger text-sm opacity-10"></i>
            </template>
          </sidenav-item>
        </li>

        <li class="mt-3 nav-item">
          <h6 v-if="isRTL" class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
            :class="isRTL ? 'me-4' : 'ms-2'">
            صفحات المرافق
          </h6>

          <h6 v-else class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6" :class="isRTL ? 'me-4' : 'ms-2'">
            ACCOUNT PAGES
          </h6>
        </li>

        <li class="nav-item">
          <sidenav-item to="/profile" :class="getRoute() === 'profile' ? 'active' : ''"
            :navText="isRTL ? 'حساب تعريفي' : 'Profile'">
            <template v-slot:icon>
              <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
            </template>
          </sidenav-item>
        </li>

        <li class="nav-item">
          <sidenav-item to="/signin" :class="getRoute() === 'signin' ? 'active' : ''"
            :navText="isRTL ? 'تسجيل الدخول' : 'Sign In'">
            <template v-slot:icon>
              <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
            </template>
          </sidenav-item>
        </li>

        <li class="nav-item">
          <sidenav-item to="/signup" :class="getRoute() === 'signup' ? 'active' : ''"
            :navText="isRTL ? 'اشتراك' : 'Sign Up'">
            <template v-slot:icon>
              <i class="ni ni-collection text-info text-sm opacity-10"></i>
            </template>
          </sidenav-item>
        </li>-->
      </ul>
    </div>

    <div class="pt-3 mx-3 mt-3 sidenav-footer">
      <sidenav-card :card="{
        title: 'Need Help?',
        description: 'Please check our docs',
        links: [
          {
            label: 'Documentation',
            route:
              'https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/',
            color: 'dark',
          },
          {
            label: 'Buy now',
            route:
              'https://www.creative-tim.com/product/vue-argon-dashboard-pro?ref=vadp',
            color: 'success',
          },
        ],
      }" />
    </div>
  </div>
</template>
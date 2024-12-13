<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import SidenavItem from './SidenavItem.vue';
import SidenavCard from './SidenavCard.vue';

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split('/');
  return routeArr[1];
};
</script>

<script>
export default {
    methods: {
        urlCompare(value){
          const route = useRoute();
          const routeArr = route.path.split("/");
          const nowUrl = routeArr[1];
          if (nowUrl.includes(value)) {
            return true;
          }          
        },
        showList(name){    
          const elements_head = document.querySelectorAll('.nav-item.head > a'); //1depth 메뉴 전체
          const elements_detail = document.querySelectorAll('.navbar-nav.detail'); //2depth 메뉴 전체
          const this_head = document.querySelector('#'+name+' > a'); //선택한 1depth 메뉴
          const this_detail = document.querySelector('.'+name+'_list'); //선택한 2depth 메뉴
          
          this_head.classList.toggle('active'); //선택한 메뉴 toggle
          
          if(this_head.classList.contains('active')){ //활성화 되었다면

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
        }
    }
}
</script>
<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">


      <!-- 영업  -->
      <li class="nav-item head" id="Sales" @click="showList('Sales')">
        <a class="nav-link" :class="urlCompare('Sales') == true ? 'active' : ''" >
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">영업</span>
        </a>
      </li>
      <ul class="navbar-nav detail Sales_list" :class="urlCompare('Sales') == true ? '' : 'dnone'">
        <li class="nav-item">
          <sidenav-item
          to="/Sales_list"
          :class="getRoute() === 'Sales_list' ? 'active' : ''"
          :navText="'주문서 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Sales_list1"
          :class="getRoute() === 'Sales_list1' ? 'active' : ''"
          :navText="'주문서 등록'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Sales_list2"
          :class="getRoute() === 'Sales_list2' ? 'active' : ''"
          :navText="'출고제품 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Sales_list3"
          :class="getRoute() === 'Sales_list3' ? 'active' : ''"
          :navText="'출고제품 등록'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Sales_list4"
          :class="getRoute() === 'Sales_list4' ? 'active' : ''"
          :navText="'반품제품 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Sales_list5"
          :class="getRoute() === 'Sales_list5' ? 'active' : ''"
          :navText="'반품제품 등록'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Sales_list6"
          :class="getRoute() === 'Sales_list6' ? 'active' : ''"
          :navText="'제품재고'">
          </sidenav-item>
        </li>
      </ul>
    






















      <!-- 생산  -->
      <li class="nav-item head" id="Produce" @click="showList('Produce')">
        <a class="nav-link" :class="urlCompare('Produce') == true ? 'active' : ''" >
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">생산</span>
        </a>
      </li>
      <ul class="navbar-nav detail Produce_list" :class="urlCompare('Produce') == true ? '' : 'dnone'">
        <li class="nav-item">
          <sidenav-item
          to="/Produce_list"
          :class="getRoute() === 'Produce_list' ? 'active' : ''"
          :navText="'생산계획서 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Produce_set"
          :class="getRoute() === 'Produce_set' ? 'active' : ''"
          :navText="'생산계획서 관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Produce_ol"
          :class="getRoute() === 'Produce_ol' ? 'active' : ''"
          :navText="'생산지시서 관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Produce_ow"
          :class="getRoute() === 'Produce_ow' ? 'active' : ''"
          :navText="'생산지시서 등록'">
          </sidenav-item>
        </li>
      </ul>






















      <!-- 자재관리  -->
      <li class="nav-item head" id="Material" @click="showList('Material')">
        <a class="nav-link" :class="urlCompare('Material') == true ? 'active' : ''" >
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">자재</span>
        </a>
      </li>
      <ul class="navbar-nav detail Material_list" :class="urlCompare('Material') == true ? '' : 'dnone'">
        <li class="nav-item">
          <sidenav-item
          to="/Material_list1"
          :class="getRoute() === 'Material_list1' ? 'active' : ''"
          :navText="'자재 발주 관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Material_list2"
          :class="getRoute() === 'Material_list2' ? 'active' : ''"
          :navText="'자재 입고 관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Material_list3"
          :class="getRoute() === 'Material_list3' ? 'active' : ''"
          :navText="'제품 입고 관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Material_list4"
          :class="getRoute() === 'Material_list4' ? 'active' : ''"
          :navText="'자재 반품 관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Material_list6"
          :class="getRoute() === 'Material_list6' ? 'active' : ''"
          :navText="'제품 입고 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Material_list7"
          :class="getRoute() === 'Material_list7' ? 'active' : ''"
          :navText="'자재 재고 조정'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Material_list8"
          :class="getRoute() === 'Material_list8' ? 'active' : ''"
          :navText="'자재 재고 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Material_list9"
          :class="getRoute() === 'Material_list9' ? 'active' : ''"
          :navText="'자재 LOT별 재고 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Material_list10"
          :class="getRoute() === 'Material_list10' ? 'active' : ''"
          :navText="'자재 출고 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Material_list11"
          :class="getRoute() === 'Material_list11' ? 'active' : ''"
          :navText="'자재 발주 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Material_list12"
          :class="getRoute() === 'Material_list12' ? 'active' : ''"
          :navText="'자재 입고 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Material_list13"
          :class="getRoute() === 'Material_list13' ? 'active' : ''"
          :navText="'자재 반품  조회'">
          </sidenav-item>
        </li>
      </ul>






















      
      <!-- 설비  -->
      <li class="nav-item head" id="Equipment" @click="showList('Equipment')">
        <a class="nav-link" :class="urlCompare('Equipment') == true ? 'active' : ''" >
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">설비</span>
        </a>
      </li>
      <ul class="navbar-nav detail Equipment_list" :class="urlCompare('Equipment') == true ? '' : 'dnone'">
        <li class="nav-item">
          <sidenav-item
          to="/Equipment_list1"
          :class="getRoute() === 'Equipment_list1' ? 'active' : ''"
          :navText="'설비 상태 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Equipment_list2"
          :class="getRoute() === 'Equipment_list2' ? 'active' : ''"
          :navText="'설비 정보 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Equipment_list3"
          :class="getRoute() === 'Equipment_list3' ? 'active' : ''"
          :navText="'설비 등록 관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Equipment_list4"
          :class="getRoute() === 'Equipment_list4' ? 'active' : ''"
          :navText="'설비 점검 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Equipment_list5"
          :class="getRoute() === 'Equipment_list5' ? 'active' : ''"
          :navText="'설비 점검 관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Equipment_list6"
          :class="getRoute() === 'Equipment_list6' ? 'active' : ''"
          :navText="'설비 수리 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Equipment_list7"
          :class="getRoute() === 'Equipment_list7' ? 'active' : ''"
          :navText="'설비 수리 관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Equipment_list8"
          :class="getRoute() === 'Equipment_list8' ? 'active' : ''"
          :navText="'설비 비가동 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Equipment_list9"
          :class="getRoute() === 'Equipment_list9' ? 'active' : ''"
          :navText="'설비 비가동 관리'">
          </sidenav-item>
        </li>
      </ul>






















      
      <!-- 품질  -->
      <li class="nav-item head" id="Quality" @click="showList('Quality')">
        <a class="nav-link" :class="urlCompare('Quality') == true ? 'active' : ''" >
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">품질</span>
        </a>
      </li>
      <ul class="navbar-nav detail Quality_list" :class="urlCompare('Quality') == true ? '' : 'dnone'">
        <li class="nav-item">
          <sidenav-item
          to="/Quality_list1"
          :class="getRoute() === 'Quality_list1' ? 'active' : ''"
          :navText="'검사항목 관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Quality_stdAdd"
          :class="getRoute() === 'Quality_stdAdd' ? 'active' : ''"
          :navText="'품질기준 등록'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Quality_list3"
          :class="getRoute() === 'Quality_list3' ? 'active' : ''"
          :navText="'품질기준 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Quality_list4"
          :class="getRoute() === 'Quality_list4' ? 'active' : ''"
          :navText="'공정별 품질검사'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Quality_list5"
          :class="getRoute() === 'Quality_list5' ? 'active' : ''"
          :navText="'자재 품질검사'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Quality_list6"
          :class="getRoute() === 'Quality_list6' ? 'active' : ''"
          :navText="'불량관리'">
          </sidenav-item>
        </li>
      </ul>






















      
      <!-- 기준관리  -->
      <li class="nav-item head" id="Standard" @click="showList('Standard')">
        <a class="nav-link" :class="urlCompare('Standard') == true ? 'active' : ''" >
            <div class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center">
              <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
            </div>
            <span class="nav-link-text ms-1">기준정보관리</span>
        </a>
      </li>
      <ul class="navbar-nav detail Standard_list" :class="urlCompare('Standard') == true ? '' : 'dnone'">
        <li class="nav-item">
          <sidenav-item
          to="/Standard_list1"
          :class="getRoute() === 'Standard_list1' ? 'active' : ''"
          :navText="'사원관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Standard_list2"
          :class="getRoute() === 'Standard_list2' ? 'active' : ''"
          :navText="'거래처관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Standard_list3"
          :class="getRoute() === 'Standard_list3' ? 'active' : ''"
          :navText="'자재관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Standard_list4"
          :class="getRoute() === 'Standard_list4' ? 'active' : ''"
          :navText="'제품관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Bom"
          :class="getRoute() === 'Bom' ? 'active' : ''"
          :navText="'BOM관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Standard_list6"
          :class="getRoute() === 'Standard_list6' ? 'active' : ''"
          :navText="'공정관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Standard_list7"
          :class="getRoute() === 'Standard_list7' ? 'active' : ''"
          :navText="'공정흐름도관리'">
          </sidenav-item>
        </li>
        <li class="nav-item">
          <sidenav-item
          to="/Standard_list8"
          :class="getRoute() === 'Standard_list8' ? 'active' : ''"
          :navText="'불량관리'">
          </sidenav-item>
        </li>
      </ul>

      






















      
      <li class="nav-item">
        <sidenav-item
          to="/tables"
          :class="getRoute() === 'tables' ? 'active' : ''"
          :navText="isRTL ? 'الجداول' : 'Tables'"
        >
          <template v-slot:icon>
            <i
              class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/grid"
          :class="getRoute() === 'grid' ? 'active' : ''"
          :navText="isRTL ? 'grid' : 'grid'"
        >
          <template v-slot:icon>
            <i class="ni ni-credit-card text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/billing"
          :class="getRoute() === 'billing' ? 'active' : ''"
          :navText="isRTL ? 'الفواتیر' : 'Billing'"
        >
          <template v-slot:icon>
            <i class="ni ni-credit-card text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/virtual-reality"
          :class="getRoute() === 'virtual-reality' ? 'active' : ''"
          :navText="isRTL ? 'الواقع الافتراضي' : 'Virtual Reality'"
        >
          <template v-slot:icon>
            <i class="ni ni-app text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/rtl-page"
          :class="getRoute() === 'rtl-page' ? 'active' : ''"
          navText="RTL"
        >
          <template v-slot:icon>
            <i class="ni ni-world-2 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="mt-3 nav-item">
        <h6
          v-if="isRTL"
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          صفحات المرافق
        </h6>

        <h6
          v-else
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          ACCOUNT PAGES
        </h6>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="isRTL ? 'حساب تعريفي' : 'Profile'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/signin"
          :class="getRoute() === 'signin' ? 'active' : ''"
          :navText="isRTL ? 'تسجيل الدخول' : 'Sign In'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/signup"
          :class="getRoute() === 'signup' ? 'active' : ''"
          :navText="isRTL ? 'اشتراك' : 'Sign Up'"
        >
          <template v-slot:icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>

  <div class="pt-3 mx-3 mt-3 sidenav-footer">
    <sidenav-card
      :card="{
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
      }"
    />
  </div>
</template>

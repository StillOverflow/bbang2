<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SidenavItem from "./SidenavItem.vue";
import SidenavCard from "./SidenavCard.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
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
      <li class="nav-item head">
        <sidenav-item
          to="/dashboard"
          :class="urlCompare('dashboard') == true ? 'nav-link active' : ''"
          :navText="isRTL ? 'dashboard' : '대시보드'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <ul class="navbar-nav">
        <li class="nav-item detail">
          <sidenav-item
          to="/dashboard_write"
          :class="getRoute() === 'dashboard_write' ? 'active' : ''"
          :navText="isRTL ? 'Business Write' : '영업조회'">
          </sidenav-item>
        </li>
        <li class="nav-item detail">
          <sidenav-item
          to="/dashboard_list"
          :class="getRoute() === 'dashboard_list' ? 'active' : ''"
          :navText="isRTL ? 'Business List' : '영업관리'">
          </sidenav-item>
        </li>
      </ul>

<!-- 영업  -->
      <li class="nav-item">
        <sidenav-item
          to="/business"
          :class="getRoute() === 'business' ? 'active' : ''"
          :navText="isRTL ? 'Business' : '영업'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
<!-- 생산  -->
      <li class="nav-item head">
        <sidenav-item
          to="/produce"
          :class="urlCompare('produce') == true ? 'nav-link active' : ''"
          :navText="'생산'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <ul class="navbar-nav">
        <li class="nav-item detail">
          <sidenav-item
          to="/produce_list"
          :class="getRoute() === 'produce_list' ? 'active' : ''"
          :navText="'생산계획서 조회'">
          </sidenav-item>
        </li>
        <li class="nav-item detail">
          <sidenav-item
          to="/produce_set"
          :class="getRoute() === 'produce_set' ? 'active' : ''"
          :navText="'생산계획서 관리'">
          </sidenav-item>
        </li>
        <li class="nav-item detail">
          <sidenav-item
          to="/produce_od"
          :class="getRoute() === 'produce_od' ? 'active' : ''"
          :navText="'생산지시서 관리'">
          </sidenav-item>
        </li>
        <li class="nav-item detail">
          <sidenav-item
          to="/produce_odset"
          :class="getRoute() === 'produce_odset' ? 'active' : ''"
          :navText="'생산지시서 등록'">
          </sidenav-item>
        </li>
        <li class="nav-item detail">
          <sidenav-item
          to="/produce_play"
          :class="getRoute() === 'produce_play' ? 'active' : ''"
          :navText="'생산 관리'">
          </sidenav-item>
        </li>
        <li class="nav-item detail">
          <sidenav-item
          to="/produce_result"
          :class="getRoute() === 'produce_result' ? 'active' : ''"
          :navText="'공장실적조회'">
          </sidenav-item>
        </li>
      </ul>
<!-- 설비  -->
      <li class="nav-item">
        <sidenav-item
          to="/facility"
          :class="getRoute() === 'facility' ? 'active' : ''"
          :navText="isRTL ? 'Facility' : '설비'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
<!-- 자재  -->
      <li class="nav-item">
        <sidenav-item
          to="/material"
          :class="getRoute() === 'material' ? 'active' : ''"
          :navText="isRTL ? 'Material' : '자재'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
<!-- 품질  -->
      <li class="nav-item">
        <sidenav-item
          to="/quality"
          :class="getRoute() === 'quality' ? 'active' : ''"
          :navText="isRTL ? 'Quality' : '품질'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
<!-- 기준정보  -->
      <li class="nav-item">
        <sidenav-item
          to="/standard"
          :class="getRoute() === 'standard' ? 'active' : ''"
          :navText="isRTL ? 'Standard' : '기준정보'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
<!-- 통계  -->
      <li class="nav-item">
        <sidenav-item
          to="/statistics"
          :class="getRoute() === 'statistics' ? 'active' : ''"
          :navText="isRTL ? 'Statistics' : '통계'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

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

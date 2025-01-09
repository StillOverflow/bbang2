<script setup>
import axios from 'axios';
import { shallowRef, onBeforeMount } from 'vue';

import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";
import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";

const dptData = shallowRef([]);
const topInfoArr = shallowRef([]);

onBeforeMount(() => {
  dateFormat();
  topInfo();
  dptList();
});

const dateFormat = (value) => {
    let date = value == null ? new Date() : new Date(value);

    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);

    let result = year + '-' + month + '-' + day;
    return result;
  };

// 상단 갯수
const topInfo = async () => {
  try {
    let obj = {
      TODAY : dateFormat()
    }
    const result = await axios.get('/api/comm/dashboard/top', {params:obj});
    
    topInfoArr.value = result.data[0];
    console.log( topInfoArr.value);

  } catch (err) {
    console.log(err);
  }
}

// 부서
const dptList = async () => {
  try {
    const result = await axios.get('/api/comm/dashboard/dpt');
    dptData.value = result.data || [];

  } catch (err) {
    console.log(err);
  }
}

</script>
<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="금일 주문량"
              v-model="topInfoArr.ORDER_QTY"
              value=""
              description="<span
                class='text-sm font-weight-bolder text-success'
                >+55%</span> since yesterday"
              :icon="{
                component: 'ni ni-money-coins',
                background: 'bg-gradient-primary',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="금일 생산량"
              v-model="topInfoArr.PRD_IN_QTY"
              value=""
              description="<span
                class='text-sm font-weight-bolder text-success'
                >+3%</span> since last week"
              :icon="{
                component: 'ni ni-world',
                background: 'bg-gradient-danger',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="가동중인 공정"
              v-model="topInfoArr.PROD_QTY"
              value="+3,462"
              description="<span
                class='text-sm font-weight-bolder text-danger'
                >-2%</span> since last quarter"
              :icon="{
                component: 'ni ni-paper-diploma',
                background: 'bg-gradient-success',
                shape: 'rounded-circle',
              }"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <mini-statistics-card
              title="금일 출고제품양"
              v-model="topInfoArr.PRD_OUT_QTY"
              value=""
              description="<span
                class='text-sm font-weight-bolder text-success'
                >+5%</span> than last month"
              :icon="{
                component: 'ni ni-cart',
                background: 'bg-gradient-warning',
                shape: 'rounded-circle',
              }"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-7 mb-lg">
            <!-- line chart -->
            <div class="card z-index-2">
              <gradient-line-chart
                id="chart-line"
                title="월간 생산량"
                description="<i class='fa fa-arrow-up text-success'></i>
      <span class='font-weight-bold'>4% more</span> in 2025"
                :chart="{
                  labels: [
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ],
                  datasets: [
                    {
                      label: 'Mobile Apps',
                      data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
                    },
                  ],
                }"
              />
            </div>
          </div>
          <div class="col-lg-5 mb-lg-0 mb-4">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h6 class="mb-2">부서별 사원수</h6>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table align-items-center">
                  <tbody>
                    <tr v-for="(val, index) in dptData" :key="index">
                      <td class="w-30">
                        <div class="px-2 py-1 d-flex align-items-center">
                          <div class="ms-4">
                            <p class="mb-0 text-xs font-weight-bold">
                              부서명:
                            </p>
                            <h6 class="mb-0 text-sm">{{ val.DPT_NM }}</h6>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold">부서코드:</p>
                          <h6 class="mb-0 text-sm">{{ val.DPT_CD }}</h6>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold">부서장:</p>
                          <h6 class="mb-0 text-sm">{{ val.MGR_NM }}</h6>
                        </div>
                      </td>
                      <td>
                        <div class="text-center">
                          <p class="mb-0 text-xs font-weight-bold">사원수:</p>
                          <h6 class="mb-0 text-sm">{{ val.MEM_CNT }}</h6>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

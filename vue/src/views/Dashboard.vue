<script setup>
import axios from 'axios';
import { shallowRef, onBeforeMount } from 'vue';

import GradientLineChart from "@/examples/Charts/GradientLineChart.vue";

const dptData = shallowRef([]);
const topInfoArr = shallowRef([]);
const monthArr = shallowRef(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ]);
const prdData = shallowRef([]);

onBeforeMount(() => {
  getCurrency();
  dateFormat();
  topInfo();
  dptList();
  monthProd();
});

const getCurrency = (num) => {
  if (!num) return '0';
  return Number(num).toLocaleString();
};

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
      TODAY: dateFormat()
    }
    const result = await axios.get('/api/comm/dashboard/top', { params: obj });

    topInfoArr.value = result.data[0];

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

// 월간 생산량
const monthProd = async () => {
  try {
    const result = await axios.get('/api/comm/dashboard/stats');
    for(let i=0; i<12; i++){
      if(result.data[i].TOTAL_QTY > 0) prdData.value.push(result.data[i].TOTAL_QTY);
      else prdData.value.push(0);
    }; 
    console.log(prdData.value);
    

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
            <div class="mb-3 card" modelvalue="1">
              <div class="p-3 card-body">
                <div class="d-flex flex-row-reverse justify-content-between">
                  <div class="text-center shadow icon icon-shape bg-gradient-success rounded-circle"><i
                      class="text-lg opacity-10 ni ni-paper-diploma" aria-hidden="true"></i></div>
                  <div class="">
                    <div class="numbers">
                      <p class="mb-0 text-sm text-uppercase font-weight-bold">금일 주문량</p>
                      <h5 class="mb-0 font-weight-bolder undefined">{{getCurrency(topInfoArr.ORDER_QTY)}}건<span
                          class="text-sm font-weight-bolder text-success"></span></h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <div class="mb-3 card" modelvalue="1">
              <div class="p-3 card-body">
                <div class="d-flex flex-row-reverse justify-content-between">
                  <div class="text-center shadow icon icon-shape bg-gradient-success rounded-circle"><i
                      class="text-lg opacity-10 ni ni-paper-diploma" aria-hidden="true"></i></div>
                  <div class="">
                    <div class="numbers">
                      <p class="mb-0 text-sm text-uppercase font-weight-bold">금일생산량</p>
                      <h5 class="mb-0 font-weight-bolder undefined">{{getCurrency(topInfoArr.PRD_IN_QTY)}}건<span
                          class="text-sm font-weight-bolder text-success"></span></h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <div class="mb-3 card" modelvalue="1">
              <div class="p-3 card-body">
                <div class="d-flex flex-row-reverse justify-content-between">
                  <div class="text-center shadow icon icon-shape bg-gradient-success rounded-circle"><i
                      class="text-lg opacity-10 ni ni-paper-diploma" aria-hidden="true"></i></div>
                  <div class="">
                    <div class="numbers">
                      <p class="mb-0 text-sm text-uppercase font-weight-bold">금일 출고제품양</p>
                      <h5 class="mb-0 font-weight-bolder undefined">{{getCurrency(topInfoArr.PRD_OUT_QTY)}}건<span
                          class="text-sm font-weight-bolder text-success"></span></h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 col-12">
            <div class="mb-3 card" modelvalue="1">
              <div class="p-3 card-body">
                <div class="d-flex flex-row-reverse justify-content-between">
                  <div class="text-center shadow icon icon-shape bg-gradient-success rounded-circle"><i
                      class="text-lg opacity-10 ni ni-paper-diploma" aria-hidden="true"></i></div>
                  <div class="">
                    <div class="numbers">
                      <p class="mb-0 text-sm text-uppercase font-weight-bold">가동중인 공정</p>
                      <h5 class="mb-0 font-weight-bolder undefined">{{getCurrency(topInfoArr.PROD_QTY)}}건<span
                          class="text-sm font-weight-bolder text-success"></span></h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-7 mb-lg">
            <!-- line chart -->
            <div class="card z-index-2">
              <gradient-line-chart id="chart-line" title="월간 생산량" :chart="{
                    labels: monthArr,
                    datasets: [
                      {
                        label: 'Mobile Apps',
                        data: [200, 300, 400, 200, 150, 570, 150, 468, 266, 756, 541, 341],
                      },
                    ],
                  }" />
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

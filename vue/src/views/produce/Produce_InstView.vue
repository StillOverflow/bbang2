<template>
  <div class="py-4 container-fluid" @keydown.esc="modalCloseFunc">
    <div class="card">      
      <div class="card-header bg-light ps-5 ps-md-4">

        <!--기본정보-->
        <p class="text-uppercase text-lg font-weight-bolder">기본정보</p>
        
        <p for="example-text-input" class="text-sm font-weight-bolder">생산계획코드</p>
        <input class="form-control w-30 mb-3" type="text" v-model="plan_cd" readonly/>

        <p for="example-text-input" class="text-sm font-weight-bolder">작업일자</p>
        <input class="form-control w-30" type="date" v-model="work_dt" readonly/>
      </div>

      <div class="card-body">
        <div class="row">

          <!--생산제품 목록-->
          <div class="col-md-6">
            <p class="text-uppercase text-lg font-weight-bolder">생산제품 목록</p>
            <div class="table-responsive">
              <table class="table">
                <thead class="table-secondary">
                  <tr>
                    <th class="text-center text-uppercase text-ser opacity-7" width="10%"></th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="10%"> 제품코드 </th>
                    <th class="text-center text-uppercase text-ser opacity-7"> 제품명 </th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="20%"> 계획수량</th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="20%"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="i" v-for="(Dtl, i) in planDtlData" class="text-center align-middle planDtl" :id="Dtl.prd_cd+'_dtl'">
                    <td>
                      <div class="form-check">
                        <input class="form-check-input" :class="'sub_'+Dtl.prd_cd" type="checkbox" v-model="Dtl.prd_cd" :value="Dtl" disabled>
                      </div>
                    </td>
                    <td>{{ Dtl.prd_cd }}</td>
                    <td>{{ Dtl.prd_nm }}</td>
                    <td>{{ Dtl.order_qty }}</td>
                    <td><button @click="prdClicked(Dtl.prd_cd)" class="btn btn-sm btn-warning">SELECT</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!--공정설정-->
          <div class="col-md-6">

            <p class="text-uppercase text-lg font-weight-bolder">공정설정</p>
            <div class="table-responsive">
              <table class="table">
                <thead class="table-secondary">
                  <tr>
                    <th class="text-center text-uppercase text-ser opacity-7" width="10%"></th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="10%">순번</th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="10%"> 공정코드 </th>
                    <th class="text-center text-uppercase text-ser opacity-7">공정명</th>
                    <th class="text-center text-uppercase text-ser opacity-7">공정설명</th>
                  </tr>
                </thead>   
                <tbody>
                  <template v-if="planFlowCount >0">
                    <tr class="text-center align-middle"
                      v-for="Flow in planFlowData"
                      :key="Flow.PROC_FLOW_CD">
                      <td>
                        <div class="form-check col-4 col-md-2">
                          <input class="form-check-input" :class="'sub_'+Flow.PROC_FLOW_CD" type="checkbox" v-model="Flow.PROC_FLOW_CD" :value="Flow" disabled> 
                        </div>
                      </td>
                      <td>{{Flow.PROC_SEQ}}</td>
                      <td>{{ Flow.PROC_FLOW_CD }}</td>
                      <td>{{ Flow.PROC_NM }}</td>
                      <td>{{ Flow.NOTE }}</td>
                    </tr>
                  </template>
                  <tr v-else>
                    <td colspan="5">
                      <div class="list-nodata">생산제품을 선택해주세요.</div>
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
</template>

<script>
import axios from 'axios';

export default {
  created() {
    this.$store.dispatch('breadCrumb', { title: '생산지시서 상세보기' });

    let selectNo = this.$route.query.inst_cd;
    if(selectNo){
        //수정
        this.selectNo = selectNo;
        this.getInstInfo(selectNo); 
        this.isUpdated = true;      
    }
  },
  computed : {
    planFlowCount(){
        return this.planFlowData.length;
    }
  },
  data() {
    return {
      plan_cd : "", //검색어
      flowArr: [],
      prdArr: [],
      planDtlData: [],
      planFlowData: [],
      prd_cd: "",
      instInfo: [],
    };
  },

  methods: {

    //지시서 조회
    async getInstInfo(selectNo) {
      let result = await axios.get(`/api/inst/${selectNo}`)
                              .catch(err => console.log(err));
      this.instInfo = result.data;
      this.plan_cd = this.instInfo.PROD_PLAN_CD;
      this.work_dt = this.$comm.getMyDay(this.instInfo.WORK_DT);

      this.getPlanDtlList(this.plan_cd);
    },

    //계획서 제품 리스트
    async getPlanDtlList(plan_cd) {
      let result = await axios.get(`/api/plan/${plan_cd}/dtl`)
                              .catch(err => console.log(err));                              
      this.planDtlData = result.data;

      let result2 = await axios.get(`/api/inst/dtl/${this.selectNo}`)
                              .catch(err => console.log(err)); 
      this.prdArr = result2.data;
      this.prdArr.forEach((obj) => {
        const checkboxes = document.querySelector('.sub_'+obj.PRD_CD); 
        checkboxes.checked = true;
      });
      
    },

    //계획서 제품 리스트 선택
    prdClicked(prd_cd) {
      this.prd_cd = prd_cd;
      this.getPlanFlowList(prd_cd); //공정 및 자재설정 리스트 노출

      //선택된 생산제품 색깔표기[S]
      const elements = document.querySelectorAll('.planDtl');
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('table-warning');
      }
      document.getElementById(prd_cd+'_dtl').classList.add('table-warning');
      //선택된 생산제품 색깔표기[E]
    },    

    //제품별 공정 리스트
    async getPlanFlowList(prd_cd) {
      let result = await axios.get(`/api/inst/${prd_cd}/flow`)
                              .catch(err => console.log(err));                              
      this.planFlowData = result.data;

      let obj = {
        INST_CD : this.selectNo,
        PRD_CD : prd_cd
      }
      let result2 = await axios.get('/api/progress/result', {params:obj})
                              .catch(err => console.log(err));
      this.flowArr = result2.data;

      this.flowArr.forEach((obj) => {
        const checkboxes2 = document.querySelector('.sub_'+obj.PROC_FLOW_CD);   
        checkboxes2.checked = true;
      });
    },

  }
};
</script>
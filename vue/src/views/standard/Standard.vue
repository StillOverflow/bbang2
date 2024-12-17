<!-- 기준정보 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
  
      <div class="card-header bg-light ps-5 ps-md-4">
        <!-- 대상분류 자재/제품/공정 -->
        <div class="row mb-3">
          <div class="col-12 col-md-1 text-center me-5 mb-2 fw-bolder" :style="t_overflow">대상분류</div>
          <div class="form-check col-4 col-md-2" v-for="(opt, idx) in radios" :key="idx">
            <input class="form-check-input" type="radio" v-model="selected_radio" :value="opt.item" :id="'radio' + opt.item"
              @change="getDivs">
            <label class="form-check-label" :for="'radio' + opt.item">
              {{opt.name}}
            </label>
          </div>
        </div>
    
        <!-- 구분/카테고리/모달 조회조건 선택 -->
        <div class="row">
          <div class="col-6 col-lg-1 text-center mb-2 fw-bolder" :style="t_overflow">구분</div>
          <div class="col-6 col-lg-2 mb-2">
            <select class="form-select" v-model="selected_div">
              <option v-for="(opt, idx) in divs" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
          <div class="col-6 col-lg-1 text-center mb-2 fw-bolder" :style="t_overflow">카테고리</div>
          <div class="col-6 col-lg-2 mb-2">
            <select class="form-select" v-model="selected_cate" :disabled="noCate">
              <option v-for="(opt, idx) in cates" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
        </div>
  
      </div>
  
      <!-- 제품/공정흐름도 -->
      <div class="card-body">
        <div class="row">
          <div class="col-7">
            <h4 class="ms-3">제품</h4>
          </div>
          <div class="col-5">
            <div class="row">
              <div class="col-5">
                <h4 class="ms-3" :style="t_break">공정흐름도</h4>
              </div>
              <div class="col-7 text-end">
                <button class="btn btn-secondary" :style="t_break">위로</button>
                <button class="btn btn-secondary" :style="t_break">아래로</button>
                <button class="btn btn-success" :style="t_break">공정추가</button>
                <button class="btn btn-danger" :style="t_break">삭제</button>
              </div>
            </div>
          </div>
        </div>
  
        <div class="row mb-4">
          <div class="col-5">
            <!-- 제품 목록 -->
            <ag-grid-vue
              class="ag-theme-alpine pt-6"
              style="width: 100%; height: 300px;"
              :columnDefs="productDefs"
              :rowData="productData"
              :pagination="true"
              :paginationAutoPageSize="true"
              :cellValueChanged ="cellValueChanged"
              @rowClicked="prodClicked"> <!--행선택시 bom데이터 조회-->
            </ag-grid-vue>
          </div>

          <div class="col-5">
            <!-- 공정 흐름도 -->
            <ag-grid-vue
              class="ag-theme-alpine"
              style="width: 100%; height: 300px;"
              :columnDefs="procFlowDefs"
              :rowData="procFlowData"
              :rowSelection="multiple"
              :pagination="true"
              :cellValueChanged ="cellValueChanged"
              @gridReady="onProcFlowGridReady">
            </ag-grid-vue>
          </div>
        </div>
      </div>

      <!-- bom내역/ 공정코드 -->
      <div class="card-body">
        <div class="row">
          <div class="col-7">
            <h4 class="ms-3">BOM내역</h4>
          </div>
         
          <div class="col-5">
            <div class="row">
              <div class="col-5">
                <h4 class="ms-3" :style="t_break">공정별 자재</h4>
              </div>
              <div class="col-7 text-end">
                <button class="btn btn-info" :style="t_break">저장</button>
                <button class="btn btn-danger" :style="t_break">삭제</button>
              </div>
            </div>
          </div>
        </div>
  
        <div class="row mb-4">
          <div class="col-5">
            <!-- BOM 목록 -->
            <ag-grid-vue
              class="ag-theme-alpine"
              style="width: 100%; height: 300px;"
              :columnDefs="bomDefs"
              :rowData="bomData"
              :pagination="true"
              :rowSelection="multiple"
              overlayNoRowsTemplate="제품에 대한 bom정보가 없습니다."
              @gridReady="onBomGridReady"> 
            </ag-grid-vue>
          </div>
          <div class="col-5">
            <!-- 공정별 자재 흐름도 -->
            <ag-grid-vue
              class="ag-theme-alpine"
              style="width: 100%; height: 300px;"
              :columnDefs="procFlowMtlDefs"
              :rowData="procFlowMtlData"
              :rowSelection="multiple"
              :pagination="true"
              :cellValueChanged ="cellValueChanged"
              @gridReady="onProcFlowMtlGridReady">
            </ag-grid-vue>
          </div>
        </div>
      </div>
  
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';

export default {
  components: {AgGridVue},
  created(){
    this.$store.dispatch('breadCrumb', { title: '공정흐름도 관리' });
    this.bringProFlow();
  },
  data(){
    return{
    //공정흐름도
    procFlowDefs:[
      { headerName: '순서', field: 'proc_seq', sortale:true},
      { headerName: '공정코드', field: 'proc_cd', sortale:true},
      { headerName: '공정명', field: 'proc_nm', sortale:true},
    ],
    procFlowData: [],
    
    //bom조회
    bomDefs: [
      
    ],  
    bomData: [],
  }
  },

  methods:{
    //공정흐름도 조회
    async bringProFlow(prdCd){
      let result = await axios.get(`/api/standard/flow/${prdCd}`)
                              .catch(err=>console.log(err));
      this.procFlowData = result.data;
    }
  },


  name: 'Standard',
  // 컴포넌트 로직
};
</script>
<!-- 기준정보 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <div class="card-header bg-light ps-5 ps-md-4">
        <!-- 대상분류 자재/제품/공정 -->
        <div class="row mb-3">
          <div class="col-12 col-md-1 text-center me-5 mb-2 fw-bolder" :style="t_overflow">제품검색</div>
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
      <!-- 제품목록/공정흐름도 -->
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
                <button class="btn btn-info" :style="t_break">자재추가</button>
              </div>
            </div>
          </div>
        </div>
  
        <div class="row mb-4">
          <div class="col-5">
            <ag-grid-vue class="ag-theme-alpine w-100" style="height: 300px;" :columnDefs="myDefs" :rowData="myData" @grid-ready="gridFit" :gridOptions="gridOptions"/>
          </div>
          <div class="col-2 p-lg-5 p-xxl-6">
            
          </div>
          <div class="col-5">
            <ag-grid-vue class="ag-theme-alpine w-100 h-100" :columnDefs="yetDefs" :rowData="yetData" @grid-ready="gridFit" :gridOptions="gridOptions"/>
          </div>
        </div>
  
       
      </div>
  
      <!-- bom내역/공정코드 -->
      <div class="card-body">
        <div class="row">
          <div class="col-7">
            <h4 class="ms-3">BOM 내역</h4>
          </div>
          <div class="col-5">
            <div class="row">
              <div class="col-5">
                <h4 class="ms-3" :style="t_break">공정별 자재</h4>
              </div>
              <div class="col-7 text-end">
                <button class="btn btn-success" :style="t_overflow">추가</button>
                <button class="btn btn-danger" :style="t_overflow">삭제</button>
              </div>
            </div>
          </div>
        </div>
  
        <div class="row mb-4">
          <div class="col-5">
            <ag-grid-vue class="ag-theme-alpine w-100" style="height: 300px;" :columnDefs="myDefs" :rowData="myData" @grid-ready="gridFit" :gridOptions="gridOptions"/>
          </div>
          <div class="col-2 p-lg-5 p-xxl-6">
            
          </div>
          <div class="col-5">
            <ag-grid-vue class="ag-theme-alpine w-100 h-100" :columnDefs="yetDefs" :rowData="yetData" @grid-ready="gridFit" :gridOptions="gridOptions"/>
          </div>
        </div>
  
        <div class="row">
          
        </div>
      </div>
  
    </div>
  </div>
</template>

<script>
export default {
  name: 'Standard',
  // 컴포넌트 로직
};
</script>
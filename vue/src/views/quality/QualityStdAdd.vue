<!-- 품질 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
  
      <div class="card-header bg-light ps-5 ps-md-4">
        <!-- 대상분류 자재/제품/공정 -->
        <div class="row mb-3">
          <div class="col-12 col-md-1 text-center me-5 mb-2" :style="t_overflow">대상분류</div>
          <div class="form-check col-4 col-md-2" v-for="(opt, idx) in radios" :key="idx">
            <input class="form-check-input" type="radio" v-model="selected_radio" :value="opt.item" :id="'radio' + opt.item">
            <label class="form-check-label" :for="'radio' + opt.item">
              {{opt.name}}
            </label>
          </div>
        </div>
    
        <!-- 구분/카테고리/모달 조회조건 선택 -->
        <div class="row">
          <div class="col-6 col-lg-1 text-center mb-2" :style="t_overflow">구분</div>
          <div class="col-6 col-lg-2 mb-2">
            <select class="form-select" v-model="selected_div">
              <option v-for="(opt, idx) in divs" :key="idx" :value="opt.item">{{opt.item}}</option>
            </select>
          </div>
          <div class="col-6 col-lg-1 text-center mb-2" :style="t_overflow">카테고리</div>
          <div class="col-6 col-lg-2 mb-2">
            <select class="form-select" v-model="selected_cate">
              <option v-for="(opt, idx) in cates" :key="idx" :value="opt.item">{{opt.item}}</option>
            </select>
          </div>
          <div class="col-6 col-lg-1 text-center mb-2" :style="t_overflow">ㅇㅇ선택</div>
          <div class="col-6 col-lg-2 mb-2">
            <input type="text" class="form-control" :value="modal_val" readonly>
          </div>
          <div class="col-6 col-lg-1 text-center mb-2" :style="t_overflow">ㅇㅇ명</div>
          <div class="col-6 col-lg-2 mb-2">
            <input type="text" class="form-control" :value="modal_val" readonly>
          </div>
        </div>
  
      </div>
  
      <!-- 검사항목 추가/삭제 -->
      <div class="card-body">
        <div class="row">
          <div class="col-7">
            <h4 class="ms-3">선택된 항목</h4>
          </div>
          <div class="col-5">
            <div class="row">
              <div class="col-5">
                <h4 class="ms-3" :style="t_break">적용 가능 항목</h4>
              </div>
              <div class="col-7 text-end">
                <button class="btn btn-info" :style="t_break">검사항목 불러오기</button>
              </div>
            </div>
          </div>
        </div>
  
        <div class="row">
          <div class="col-5">
            <ag-grid-vue class="ag-theme-alpine" :columnDefs="myDefs" :rowData="myData"/>
          </div>
          <div class="col-2 p-lg-6">
            <div class="row">
              <button class="btn btn-success" :style="t_overflow">추가</button>
            </div>
            <div class="row">
              <button class="btn btn-danger" :style="t_overflow">삭제</button>
            </div>
          </div>
          <div class="col-5">
            <ag-grid-vue class="ag-theme-alpine" :columnDefs="yetDefs" :rowData="yetData"/>
          </div>
        </div>
  
        <div class="row">
          <div class="col-2 col-md-1 text-center" :style="t_overflow">
            등록일자
          </div>
          <div class="col-5 col-md-3 col-xxl-2">
            <input type="text" class="form-control" :value="date_val" readonly>
          </div>
          <div class="col-5 col-md-4 text-end text-md-start">
            <button class="btn btn-primary me-3" :style="t_overflow">저장</button>
            <button class="btn btn-secondary" :style="t_overflow">초기화</button>
          </div>
        </div>
      </div>
  
    </div>
  </div>
</template>

<script>
  import { AgGridVue } from "ag-grid-vue3";

  export default {
    name: 'QualityStdAdd',
    data() {
      return {
        // 스타일 바인딩
        t_overflow: {whiteSpace: 'nowrap'},
        t_break: {wordBreak: 'keep-all'},
        
        // 검색조건 전용 값
        selected_radio: 'A',
        radios: [
          { item: 'A', name: 'Option A' },
          { item: 'B', name: 'Option B' },
          { item: 'C', name: 'Option C' }
        ],
        selected_div: 'A',
        divs: [
          { item: 'A', name: 'Option A' },
          { item: 'B', name: 'Option B' },
          { item: 'C', name: 'Option C' }
        ],
        selected_cate: 'A',
        cates: [
          { item: 'A', name: 'Option A' },
          { item: 'B', name: 'Option B' },
          { item: 'C', name: 'Option C' }
        ],
        modal_val: '...',
        date_val: '',

        // grid API 테이블 데이터 (Defs: thead 구성, Data: tbody 구성)
        myDefs: null,
        myData: null,
        yetDefs: null,
        yetData: null
      }
    },
    components: { // grid API
        AgGridVue
    },
    created(){ // 페이지 제목 저장
      this.$store.dispatch('breadCrumb', {title: '품질기준 등록'});
    },
    beforeMount(){ // grid API 테이블에 넣을 값
      this.myDefs = [
      { field: 'make' },
            { field: 'model' },
            { field: 'price' }
      ];
      this.myData = [
      { make: 'Toyota', model: 'Celica', price: 35000 },
            { make: 'Ford', model: 'Mondeo', price: 32000 },
            { make: 'JoJang', model: 'Boxter', price: 72000 }

      ];
      this.yetDefs = [

      ];
      this.yetData = [

      ];
    }
  };
</script>
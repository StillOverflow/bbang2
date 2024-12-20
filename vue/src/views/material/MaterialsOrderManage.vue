<template>
   <div class="py-4 container-fluid">
      <div class="row">
         <div class="col-12">
            <div class="card p-3">
               <div class="card-action mb-2">미지시 계획서 조회</div>
               <div class="card-content">
                  <div class="table-responsive">
                     <ag-grid-vue
                        class="ag-theme-alpine"
                        style="width: 100%; height: 300px;"
                        :rowData="prodPlanListData"
                        :pagination="true"
                        :gridOptions="planOptions"
                        @rowClicked="rowClicked"
                        @grid-ready="gridReady">
                     </ag-grid-vue>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div class="mt-4 row">
         <div class="col-12">
            <div class="card p-3">
               <div class="card-action mb-2">{{ prodPlanCode }} 대한 자재조회</div>
               <div class="card-content">
                  <div class="table-responsive">
                     <ag-grid-vue
                        class="ag-theme-alpine"
                        style="width: 100%; height: 500px;"
                        :rowData="planToMaterialStk"
                        :pagination="true"
                        :gridOptions="materialOptions"
                        @grid-ready="gridReady"
                        @first-data-rendered="materialReady">
                     </ag-grid-vue>
                  </div>
               </div>
            </div>
            <div class="text-center">
               <button class="mt-3 btn btn-primary" @click="orderFormClickFunc">SUBMIT</button>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { AgGridVue } from 'ag-grid-vue3';
   import axios from 'axios';
   import { shallowRef, onBeforeMount, ref, watch } from 'vue';
   import { useStore } from 'vuex';
   import Swal from 'sweetalert2';
   
// ^ ---------------------------------------- Vue Hook ----------------------------------------
   // Vuex store 사용
   const store = useStore();

   // 미지시 계획 데이터 선언
   const prodPlanListData = shallowRef([]);
   const planToMaterialStk = shallowRef([]);

   // created와 비슷~~
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '미지시 계획서 자재 조회' });
      getPlanHeaderList();
      planToMaterialStkStock();
   });
   
   // 감시자
   watch(planToMaterialStk, () => {
      const api = materialOptions.api; // 자재 그리드 감시
      if(api) {
         api.sizeColumnsToFit();
      }
   });

// ^ ---------------------------------------- 공통 함수 ----------------------------------------
   // 날짜포맷
   const dateFormat = (value) => {
      let date = value == null ? new Date() : new Date(value);

      let year = date.getFullYear();
      let month = ('0' + (date.getMonth() + 1)).slice(-2);
      let day = ('0' + date.getDate()).slice(-2);

      let result = year + '-' + month + '-' + day;
      return result;
   };

   // 숫자 포맷
   // const numberFormatter = (params) => {
   //    if (!params.value || isNaN(params.value)) return '0';
   //    return Number(params.value).toLocaleString()
   // };

// ^ ---------------------------------------- 그리드 이벤트 ----------------------------------------
   // 그리드 준비
   const gridReady = (params) => {
      params.api.sizeColumnsToFit(); // 그리드 열을 컨테이너 크기에 맞춤
   };

   // 선택한 행 저장
   const materialGrid = ref([]); 
   const materialReady = (params) => {
      materialGrid.value = params.api
   };

   // 미지시 생산 계획서 클릭 시 자재 정보 넘기기
   const rowClicked = (params) => {
      prodPlanCode.value= params.data.prod_plan_cd;
      planToMaterialStkStock(prodPlanCode.value);
   };

   // SUBMIT 버튼 클릭 시
   const orderFormClickFunc = () => {
      // 그리드에 전체선택된 값을 가져옴
      const materials = materialGrid.value.getSelectedRows();
      console.log("selectedNodes.value : ", materialGrid.value);
      console.log("materials =? ", materials);
      if (materials.length > 0) {
         store.commit("materialStore/setMaterial", materials);
      } else {
         Swal.fire({
            icon: 'warning',
            title: '선택된 데이터가 없습니다.',
         });
      }
   };

    // 
   const handleInputEvent = (params) => (event) => {
      // 이벤트 타입이 blur이거나 이벤트 타입이 keydown && 키가 엔터일 때 실행 ~~
      if (event.type === 'blur' || (event.type === 'keydown' && event.key === 'Enter')) {
         let value = event.target.value;
         
         if(typeof value !== 'number') {
            if(isNaN(value) || value == '') {
               value = 0; // 기본값 설정
            }
         }

         // rowData 업데이트
         const rowNode = params.node;
         rowNode.setDataValue(params.colDef.field, value);

      }
   };

   // Custom CellRenderer 정의
   const customCellRenderer = (params) => {
      const input = document.createElement('input');  // input 태그 생성
      input.type = 'number';
      input.value = params.value || ''; // 초기 값 설정
      input.style.width = '70%';                // 너비
      input.style.height = '30px';              // 높이
      input.style.border = '1px solid #b5b5b5'; // input테두리
      input.style.borderRadius = '5%';          

      // 이벤트 핸들러 추가
      const handler = handleInputEvent(params);
      input.addEventListener('blur', handler); // 포커스 아웃 이벤트
      input.addEventListener('keydown', handler); // 키 입력 이벤트

      return input;
   };
   
// ^ ------------------------------ 미지시 계획서 조회 그리드 ------------------------------
   // 그리드 컬럼명
   const planOptions = {
      columnDefs : [
         { headerName: '계획서코드', field: 'prod_plan_cd', sortable: true,  },
         { 
            headerName: '시작예정일', 
            field: 'start_dt', 
            sortable: true, 
            valueFormatter: (params) => dateFormat(params.value),
         },
         { 
            headerName: '종료예정일', 
            field: 'end_dt', 
            sortable: true,
            valueFormatter: (params) => dateFormat(params.value),
         },
         { headerName: '담당자번호', field: 'id', sortable: true },
         { headerName: '담당자', field: 'name', sortable: true },
      ],
      overlayNoRowsTemplate: "미지시 생산계획서가 없습니다.", // 데이터 없을 때 메시지
   };

   // 데이터 조회 함수
   let prodPlanCode = ref('');
   const getPlanHeaderList = async () => {
      try {
         const response = await axios.get('/api/material/planList');
         prodPlanListData.value = response.data || [];
      } catch (err) {
         prodPlanListData.value = [];
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

// ^ ------------------------------ 자재 재고 조회 그리드 ------------------------------
   // 계획서에 대한 자재 재고 컬럼명
   const materialOptions = {
      columnDefs : [
         //{ headerName: '계획서상세코드', field: 'prod_plan_dtl_cd', sortable: true },
         { headerName: '자재코드', field: 'mat_cd', sortable: true },
         { headerName: '자재명', field: 'mat_nm', sortable: true },
         { headerName: '자재구분', field: 'type', sortable: true },
         {
            headerName: '필요수량',
            field: 'require_qty',
            sortable: true,
         },
         { 
            headerName: '재고수량', 
            field: 'stock_qty', 
            sortable: true,
         },
         { 
            headerName: '부족수량', 
            field: 'lack_qty', 
            sortable: true, 
         },
         {
            headerName: "발주 수량",
            field: "orderingQty",
            cellRenderer: customCellRenderer,
         },
      ],
      rowSelection: {
         mode: "multiRow", // 체크박스 다중선택
      },

      overlayNoRowsTemplate: "데이터가 없습니다.", // 데이터 없을 때 메시지
   };

   // 계획서에 대한 자재 재고 조회
   const planToMaterialStkStock = async (plan_cd) => {
      try {
         const response = await axios.get(`/api/material/matStockList/${plan_cd}`);
         planToMaterialStk.value = response.data;
      } catch (err) {
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

// ------------------------------------------------------------------------------------------
   
</script>
<style>
   input[type=number]::-webkit-inner-spin-button,
   input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;             
      margin: 0;
      border: 1px solid #b5b5b5;  
   }
   .lack-quantity {
      background-color: lightcoral !important; /* 셀 색상 */
   }
</style>
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
                        @grid-ready="gridFit"
                        overlayNoRowsTemplate="미지시 생산계획서가 없습니다.">
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
                        @grid-ready="gridFit"
                        overlayNoRowsTemplate="Loding중~~">
                     </ag-grid-vue>
                  </div>
               </div>
            </div>
            <div class="text-center">
               <button class="mt-3 btn btn-primary">SUBMIT</button>
            </div>
         </div>
      </div>
  </div>

</template>

<script setup>
   import { AgGridVue } from 'ag-grid-vue3';
   import axios from 'axios';
   import { shallowRef, onBeforeMount, ref } from 'vue';
   import { useStore } from 'vuex';
   
// ------------------------------------------------------------------------------------------
   // Vuex store 사용
   const store = useStore();

   // 미지시 계획 데이터 선언
   const prodPlanListData = shallowRef([]);
   const planToMaterialStk = shallowRef([]);

   // onBeforeMount 훅
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '미지시 계획서 자재 조회' });
      getPlanHeaderList();
      planToMaterialStkStock();
   });
   
   
// ------------------------------------------------------------------------------------------
   // 날짜포맷
   const dateFormat = (value) => {
      let date = value == null ? new Date() : new Date(value);

      let year = date.getFullYear();
      let month = ('0' + (date.getMonth() + 1)).slice(-2);
      let day = ('0' + date.getDate()).slice(-2);

      let result = year + '-' + month + '-' + day;
      return result;
   };

// ------------------------------------------------------------------------------------------
   const gridFit = (params) => {
      params.api.sizeColumnsToFit(); // 그리드 열을 컨테이너 크기에 맞춤
   };

// ------------------------------------------------------------------------------------------
   // ~ 미지시 생산계획서 조회
   // 그리드 컬럼명
   const planOptions = {
      columnDefs : [
         { headerName: '계획서코드', field: 'prod_plan_cd', sortable: true },
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
         {
            headerName: "발주 수량",
            field: "orderingQty",
            cellRenderer: (params) => {
               const input = document.createElement('input');
               input.type = 'text';
               input.value = params.value || ''; // Set the initial value
               input.style.width = '100%';
               input.style.boxSizing = 'border-box';

               return input;
            },
         },
      ],

      // defaultColDef: {
      //    flex: 1,
      //    minWidth: 100,
      // },

   };

   // 데이터 조회 함수
   let prodPlanCode = ref('');
   const getPlanHeaderList = async () => {
      try {
         const response = await axios.get('/api/material/planList');
         prodPlanListData.value = response.data;
      } catch (err) {
         this.$swal({
            icon: "error",
            title: "API 요청 오류:",
            text : err
         });
      }
   };
   
// ------------------------------------------------------------------------------------------
   // 미지시 생산 계획서 클릭 시 ~~
 //  let plan_cd = null;
   const rowClicked = (params) => {
      prodPlanCode.value= params.data.prod_plan_cd;
      planToMaterialStkStock(prodPlanCode.value);
   };

   // watch(plan_cd, (plan_cd) => {
   //    prodPlanCode.value = plan_cd;
   // });

// ------------------------------------------------------------------------------------------
   // 계획서에 대한 자재 재고 컬럼명
   const materialOptions = {
      columnDefs : [
         { headerName: '계획서상세코드', field: 'prod_plan_dtl_cd', sortable: true },
         { headerName: '자재코드', field: 'mat_cd', sortable: true },
         { headerName: '자재명', field: 'mat_nm', sortable: true },
         { headerName: '자재구분', field: 'comm_dtl_nm', sortable: true },
         { headerName: 'bom양', field: 'usage', sortable: true },
         { headerName: '필요수량', field: 'require_qty', sortable: true },
         { headerName: '재고수량', field: 'stock_qty', sortable: true },
         { headerName: '부족수량', field: 'lack_qty', sortable: true },
      ],

      // 체크박스 다중선택
      rowSelection: {
         mode: "multiRow",
      },
   }

   // 계획서에 대한 자재 재고 조회
   const planToMaterialStkStock = async (plan_cd) => {
      try {
         const result = await axios.get(`/api/material/matStockList/${plan_cd}`)
                                    .catch((err) => console.log(err));
         planToMaterialStk.value = result.data;
      } catch (err) {
         this.$swal({
            icon: "error",
            title: "API 요청 오류:",
            text : err
         });
      }
   };
</script>

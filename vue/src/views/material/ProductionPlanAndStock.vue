<template>
   <div class="py-4 container-fluid">
      <div class="row">
         <div class="col-12">
            <div class="card p-3">
               <div class="card-header bg-light mb-4">  
                  <div class="d-flex justify-content-center align-items-center text-center">
                     <div class="col-lg-1 text-center mb-2 mt-2 fw-bolder">계획 일자</div>
                     <div class="col-lg-4">
                        <input class="form-control" type="date" :max="endDt" v-model="startDt" />
                     </div>
                     <div class="col-lg-1 text-center fw-bolder">~</div>
                     <div class="col-lg-4">
                        <input class="form-control" type="date" :min="startDt" v-model="endDt" />
                     </div>
                  </div>
                  <div class="d-flex justify-content-center align-items-center mt-3 text-center">
                     <button type="button" class="btn btn-warning m-2" @click="searchForm">
                        <i class="fa-solid fa-magnifying-glass"></i>
                     </button>
                     <button type="button" class="btn btn-secondary m-2" @click="resetBtn">
                        <i class="fa-solid fa-rotate"></i>
                     </button>
                  </div>
               </div>
               <div class="card-action mb-2">
                  <h5>미지시 계획서 조회</h5>
               </div>
               <div class="card-content">
                  <div class="table-responsive">
                     <ag-grid-vue
                        class="ag-theme-alpine"
                        style="width: 100%; height: 300px;"
                        :rowData="prodPlanListData"
                        :pagination="true"
                        :gridOptions="planOptions"
                        @rowClicked="rowClicked"
                        @grid-ready="gridReady"
                        @first-data-rendered="planListGrid">
                     </ag-grid-vue>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div class="mt-4 row">
         <div class="col-12">
            <div class="card p-3">
               <div class="card-action mb-2">
                  <h5>{{ prodPlanCode }} 대한 자재조회</h5>
               </div>
               <div class="card-content">
                  <div class="table-responsive">
                     <ag-grid-vue
                        class="ag-theme-alpine"
                        style="width: 100%; height: 500px;"
                        :rowData="planToMaterialStk"
                        :pagination="true"
                        :gridOptions="materialOptions"
                        @grid-ready="gridReady"
                        @first-data-rendered="materialReady"
                        @cellEditingStopped="cellEditingStoppedEvent"
                     />
                     
                  </div>
               </div>
               <div class="text-center">
                  <button class="mt-3 btn btn-primary btn-lg" @click="orderFormClickFunc">발주하기</button>
               </div>
            </div>
            
         </div>
      </div>
   </div>
</template>

<script setup>
   import { AgGridVue } from 'ag-grid-vue3';
   import axios from 'axios';
   import Swal from 'sweetalert2';

   import { shallowRef, onBeforeMount, ref, watch } from 'vue';
   import { useStore } from 'vuex';
   import { useRouter } from 'vue-router';

// ^ ---------------------------------------- 데이터 정의 ----------------------------------------
   // Vuex store 사용
   const store = useStore();

   // Router 사용
   const router = useRouter()
   
   // 날짜 검색 선언
   let startDt = shallowRef('');
   let endDt = shallowRef('');

   // 미지시 계획 데이터 선언
   const prodPlanListData = shallowRef([]);
   const planToMaterialStk = shallowRef([]);

   // 자재 그리드 선언
   const planListGrid = ref([]);
   const materialGrid = ref([]);

//! ---------------------------------------- Vue Hook ----------------------------------------
   // created와 비슷~~
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '미지시 계획서 자재 조회' });  // 페이지 제목 설정
      getPlanHeaderList(); // 미지시 생산 계획서 조회
   });
   
   // 자재 재고 조회 감시자
   watch(planToMaterialStk, () => {
      const api = materialOptions.api; // 자재 그리드 감시
      if(api) {
         api.sizeColumnsToFit();
      }
   });

   // 계획서 데이터 감시자
   watch(prodPlanListData, () => {
      const api = materialOptions.api; // 미지시 계획서 그리드 감시
      if(api) {
         api.sizeColumnsToFit();
      }
   });

//! ---------------------------------------- 공통 함수 ----------------------------------------
   // 날짜포맷
   const dateFormat = (value) => {
      let date = value == null ? new Date() : new Date(value);

      let year = date.getFullYear();
      let month = ('0' + (date.getMonth() + 1)).slice(-2);
      let day = ('0' + date.getDate()).slice(-2);

      let result = year + '-' + month + '-' + day;
      return result;
   };

   const searchForm = async () => {       
      if(startDt.value == '' && endDt.value == '') {
         getPlanHeaderList();
      }

      // 시작 날짜가 종료 날짜보다 큰 경우 처리
      if (new Date(startDt.value) > new Date(endDt.value)) {
         Swal.fire({
            icon: 'warning',
            title: '시작 날짜는 종료 날짜보다 클 수 없습니다.',
            confirmButtonColor: '#f5bbd0',
         });
         return;
      }

      const searchDt = { startDt: startDt.value, endDt: endDt.value };
      
      try {
         const result = await axios.get('/api/material/planList/search/', { params: searchDt });
         if (result.data && result.data.length > 0) {
            prodPlanListData.value = result.data;

            if (planListGrid.value.api) {
                planListGrid.value.api.hideOverlay(); // "데이터 없음" 메시지 숨김
            }
            let prodPlanCode = result.data[0].prod_plan_cd

            if(prodPlanCode != null && prodPlanCode != '') {
               planToMaterialStkStock(result.data[0].prod_plan_cd);
            } else {
               planToMaterialStkStock(null);
            }
         } else {
            prodPlanListData.value = []; // 미지시 계획서 그리드 초기화

            if (planListGrid.value.api) {
               planListGrid.value.api.showNoRowsOverlay(); // "데이터 없음" 메시지 표시
            }
         }
      } catch (err) {
         prodPlanListData.value = []; // 미지시 계획서 그리드 초기화
         planToMaterialStk.value = [] // 자재 재고 그리드 초기화

         if (planListGrid.value.api) {
            planListGrid.value.api.showNoRowsOverlay(); // 에러가 난 상황에도 "데이터 없음" 표시
         }

         Swal.fire({
            icon: 'error',
            title: '데이터 로드 실패',
            text: err,
         });
      }
      resetBtn();
      planToMaterialStk.value = []; // 자재 재고 그리드 초기화
   };

   // 날짜 초기화 함수
   const resetBtn = () => {
      startDt.value = '';
      endDt.value = '';
   }

//! ---------------------------------------- 그리드 이벤트 ----------------------------------------
   // 그리드 준비
   const gridReady = (params) => {
      if (params.api) {
         params.api.sizeColumnsToFit(); // 그리드 크기에 자동 맞춤
      }
   };

   // 선택한 행 저장
   const materialReady = (params) => {
      materialGrid.value = params.api
      params.api.sizeColumnsToFit();
   };

   // 미지시 생산 계획서 클릭 시 자재 정보 넘기기
   const rowClicked = (params) => {
      prodPlanCode.value= params.data.prod_plan_cd;
      planToMaterialStkStock(params.data.prod_plan_cd);
   };

   const orderFormClickFunc = () => {
      // 그리드에서 선택된 행 데이터 가져오기
      const materials = materialGrid.value.getSelectedRows();
      
      materials.forEach((data) => {
         if(!data.mat_qty) {
            Swal.fire({
               icon: 'warning',
               title: '발주 수량을 입력하세요.',
            });
         }
         return;
      });

      if(materials.mat_qty < 0) {
         Swal.fire({
            icon: 'warning',
            title: '발주 수량을 확인하세요.',
         });
         return;
      }

      if (materials.length > 0) {         
         // Vuex에 데이터 커밋
         store.commit("materialStore/setMaterial", materials);

         // 페이지 이동
         router.replace({ name: 'MaterialsOrderManage' });
      } else {
         // 선택된 데이터가 없을 때 경고
         Swal.fire({
            icon: 'warning',
            title: '선택된 데이터가 없습니다.',
         });
      }
   };
   
//! ------------------------------ 미지시 계획서 조회 그리드 ------------------------------
   // 그리드 컬럼명
   const planOptions = {
      columnDefs : [
         { 
            headerName: '계획서코드', 
            field: 'prod_plan_cd', 
            sortable: true,
            cellClass: "text-center",
         },
         { 
            headerName: '시작예정일', 
            field: 'start_dt', 
            sortable: true, 
            cellClass: "text-center",
            valueFormatter: (params) => dateFormat(params.value),
         },
         { 
            headerName: '종료예정일', 
            field: 'end_dt', 
            sortable: true,
            cellClass: "text-center",
            valueFormatter: (params) => dateFormat(params.value),
         },
         { 
            headerName: '담당자번호', 
            field: 'id', 
            sortable: true,
            cellClass: "text-center",
            cellRenderer: () => {
               return '담당자 번호 없음';
            },
         },
         { 
            headerName: '담당자', 
            field: 'name', 
            sortable: true,
            cellClass: "text-center",
            cellRenderer: () => {
               return '담당자 없음';
            },
         },
      ],
      overlayNoRowsTemplate: `<span class="text-danger">데이터가 없습니다.</span>`, // 데이터 없음 메시지
   };

   // 데이터 조회 함수
   let prodPlanCode = ref('');
   const getPlanHeaderList = async () => {
      try {
         const response = await axios.get('/api/material/planList');
         prodPlanListData.value = response.data || [];
         
         if (prodPlanListData.value.length > 0) {
            prodPlanCode.value = prodPlanListData.value[0].prod_plan_cd;
            planToMaterialStkStock(prodPlanListData.value[0].prod_plan_cd); // 데이터 로드
         } else {
            prodPlanCode.value = ''; // 데이터가 없을 경우 초기화
         }
         
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
         { 
            headerName: '자재코드', 
            field: 'mat_cd', 
            sortable: true,
            cellClass: "text-center", 
         },
         { 
            headerName: '자재명', 
            field: 'mat_nm', 
            sortable: true,
            filter: 'agSetColumnFilter',
            cellClass: "text-center",
         },
         { 
            headerName: '자재구분', 
            field: 'type', 
            sortable: true,
            cellClass: "text-center",
         },
         { 
            headerName: '재고수량', 
            field: 'stock_qty', 
            sortable: true,
            cellClass: "text-right",
            cellRenderer: (params) => {
               return parseInt(params.value).toLocaleString();
            },
         },
         { 
            headerName: '필요수량', 
            field: 'require_qty', 
            sortable: true,
            cellClass: "text-right",
            valueFormatter: (params) => {
               if (params.value == null) return ""; // 값이 없으면 빈 문자열 반환
               return params.value.toLocaleString(); // 숫자에 쉼표 추가
            },
         },
         { 
            headerName: '안전재고', 
            field: 'safe_stk', 
            sortable: true,
            cellClass: "text-right",
            valueFormatter: (params) => {
               if (params.value == null) return ""; // 값이 없으면 빈 문자열 반환
               return params.value.toLocaleString(); // 숫자에 쉼표 추가
            },
         },
         { 
            headerName: '부족수량', 
            field: 'lack_qty', 
            sortable: true, 
            cellClass: "text-right",
            valueFormatter: (params) => {
               if (params.value == null) return ""; // 값이 없으면 빈 문자열 반환
               return params.value.toLocaleString(); // 숫자에 쉼표 추가
            },
         },
         { 
            headerName: '단위', 
            field: 'unit', 
            sortable: true, 
            cellClass: "text-right",
         },
         { 
            headerName: "발주 수량", 
            field: "mat_qty", 
            editable: true,   // 편집 가능
            cellClass: "text-right",
            valueFormatter: params => params.data.number, // 숫자타입으로 포맷 지정
            valueSetter: (params) => { // 입력한 값 그리드 값에 세팅하기
               const newValue = parseInt(params.newValue, 10);
               if (isNaN(newValue) || newValue < 0) {
                  return false; // 유효하지 않은 값
               }
               params.data.mat_qty = newValue; // 데이터 업데이트
               return true; // 변경 성공
            },
            cellRenderer: (params) => {
               // 값이 없으면 'Double Click!' 표시
               if (!params.value) {
                  return `<span style="color: #c1c1c1; text-align: right;">Double Click!</span>`;
               }
               // 값이 있으면 숫자 표시
               return `<span style="color: #000;">${Number(params.value)}</span>`;
            },
         },
      ],
      rowSelection: {
         mode: "multiRow", // 체크박스 다중선택
      },

      overlayNoRowsTemplate: `<span class="text-danger">데이터가 없습니다.</span>`, // 데이터 없을 때 메시지

      // row에 규칙추가
      rowClassRules: {
         'rowRedStyle': (params) => {
            if (params.data.lack_qty) { // 부족 수량이 있으면 ~~ 
               const quantity = parseInt(params.data.lack_qty); // 부족수량에서 -10000ml -> -10000만 추출하기

               return quantity <= 0; // 부족수량이 0 이하일 때 조건 적용하기!
            }
            return false;
         },
      },
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
   
   .rowRedStyle {
      background-color: rgb(253, 211, 211) !important; /* 셀 배경 빨간색 */
      color: rgb(59, 59, 59) !important; /* 텍스트 흰색으로 변경 */
   }

   .text-center {
      text-align: center;
   }
   .text-right {
      text-align: right;
   }
</style>
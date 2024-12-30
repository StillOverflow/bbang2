
<template>
   <div class="py-4 container-fluid" @keydown.esc="modalCloseFunc">
      <div class="card">      
         <div class="card-header bg-light">
            
         </div><!-- 거래처조회 모달[S]-->
         <Layout :modalCheck="isAccountModal">
            <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
               <h5 class="modal-title">거래처 조회</h5>
               <button type="button" aria-label="Close" class="close" @click="accountModalOpen">×</button>
            </template>
            <template v-slot:default>
               <ag-grid-vue
                  class="ag-theme-alpine"
                  style="width: 100%; height: 500px;"
                  :rowData="accountModalData"
                  :pagination="true"
                  :gridOptions="accountModalGridOptions"
                  @grid-ready="(params) => gridReady(params, 'account')"
                  @first-data-rendered="accountModalGrid">
               </ag-grid-vue>
            </template>
            <template v-slot:footer>
               <div class="mx-auto">
                  <button type="button" class="btn btn-success m-1" @click="accountModalOpen">Save</button>
                  <button type="button" class="btn btn-secondary m-1" @click="accountModalOpen">Cancel</button>
               </div>
            </template>
         </Layout>

         <Layout :modalCheck="isOrderModal">
            <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
               <h5 class="modal-title">발주서 조회</h5>
               <button type="button" aria-label="Close" class="close" @click="orderModalOpen">×</button>
            </template>
            <template v-slot:default>
               <ag-grid-vue
                  class="ag-theme-alpine"
                  style="width: 100%; height: 500px;"
                  :rowData="orderModalData"
                  :pagination="true"
                  :gridOptions="orderModalGridOptions"
                  @grid-ready="(params) => gridReady(params, 'orderList')"
                  @first-data-rendered="orderModalGrid">
               </ag-grid-vue>
            </template>
            <template v-slot:footer>
               <div class="mx-auto">
                  <button type="button" class="btn btn-success m-1" @click="materialModalOpen">Save</button>
                  <button type="button" class="btn btn-secondary m-1" @click="orderModalOpen">Cancel</button>
               </div>
            </template>
         </Layout>

         <Layout :modalCheck="isMatModal">
            <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
               <h5 class="modal-title">자재 조회</h5>
               <button type="button" aria-label="Close" class="close" @click="materialModalOpen">×</button>
            </template>
            <template v-slot:default>
               <ag-grid-vue
                  class="ag-theme-alpine"
                  style="width: 100%; height: 300px; margin: auto;"
                  :rowData="materialModalData"
                  :pagination="true"
                  :gridOptions="materialModalGridOptions"
                  @grid-ready="materialGridReady">
               </ag-grid-vue>
            </template>
            <template v-slot:footer>
               <div class="mx-auto">
                  
                  <button type="button" class="btn btn-secondary m-1" @click="materialModalOpen">Cancel</button>
               </div>
            </template>
         </Layout>

         <div class="row">
            <div class="col-12">
               <div class="card p-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                     <div class="card-action text-center">
                        <h5 class="m-0">자재 발주서 관리</h5>
                     </div>
                     <div class="d-flex justify-content-end align-items-center">
                        <button type="button" class="btn btn-warning btn-sm m-0 m-1" @click="orderModalOpen">
                           <i class="fa-regular fa-file me-1"></i>
                           발주서조회
                        </button>
                        <button class="btn btn-outline-primary btn-sm m-0 mx-1" @click="addRow">
                           <i class="fa-solid fa-plus"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm m-0 mx-1" @click="removeRow">
                           <i class="fa-solid fa-minus"></i>
                        </button>
                     </div>
                  </div>
                  
                  <div class="card-content">
                     <div class="table-responsive">
                        <ag-grid-vue
                           class="ag-theme-alpine"
                           style="width: 100%; height: 700px;"
                           :rowData="orderFormData"
                           :pagination="true"
                           :gridOptions="orderFormOptions"
                           @cellEditingStarted="cellEditingStartedEvent"
                           @cellEditingStopped="cellEditingStoppedEvent"
                           @rowClicked="rowClicked"
                           @grid-ready="(params) => gridReady(params, 'orderForm')"
                           @first-data-rendered="orderFormGrid">
                        </ag-grid-vue>
                     </div>
                  </div>
                  <div class="text-center mtp30">
                     <button class="btn btn-primary">SAVE</button>
                     <button class="btn btn-secondary mlp10">RESET</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
   import axios from 'axios';
   import Swal from 'sweetalert2';
   
   import { AgGridVue } from 'ag-grid-vue3';

   import { ref, onBeforeMount, shallowRef, watch } from 'vue'; //
   import { useStore } from 'vuex';
   import { getCurrentInstance } from 'vue'; // 플러그인을 사용하는 경우 이것을 이용해서 접근해야함

   import Layout from '../components/modalLayout.vue';   // modal Layout 불러오기
   import CustomDropdownEditor from '../components/CustomDropdownEditor.vue';
   import AccountDropdownEditor from '../components/AccountDropdownEditor.vue'; 

   const store = useStore();  // vuex
   const instance = getCurrentInstance(); // Vue 인스턴스 가져오기

//^ ----------------------------------------- 데이터 정의 -----------------------------------------   
   /*모달 [S]*/
   let isAccountModal = ref(false);          // 거래처 모달 열림여부
   let isOrderModal = ref(false);            // 주문서 모달 열림여부
   let isMatModal = ref(false);              // 자재 검색 모달 열림여부

   const accountModalGrid = ref(null);       // 거래처 모달 그리드 참조
   const accountModalData = shallowRef([]);  // 거래처 모달 데이터

   const orderModalGrid = ref(null);         // 발주서 내역 조회 모달 그리드 참조
   const orderModalData = shallowRef([]);    // 발주서 내역 조회 모달 데이터
   
   const orderFormGrid = ref(null);          // 발주서 그리드
   const orderFormData = shallowRef([]);     // 발주서 관리 데이터

   const materialGridReady = ref(null);      // 자재 모달 그리드
   const materialModalData = ref([]);        // 자재 모달 데이터

//^ ----------------------------------------- 공통 함수 -----------------------------------------   
   // 오늘 날짜
   const getToday = () => {
      let date = new Date();

      let year = date.getFullYear();
      let month = ('0' + (date.getMonth() + 1)).slice(-2);
      let day = ('0' + date.getDate()).slice(-2);

      let result = year + '-' + month + '-' + day;
      return result;
   }

//^ ----------------------------------------- Vue Hook -----------------------------------------
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '자재 발주서 관리' }); // 페이지 제목 설정
      getAccountList(); // 거래처 리스트
      orderFormData.value = store.getters["materialStore/getMaterials"]; // vuex정보 불러오기

      const userNm = instance?.proxy.$session.get('user_nm'); // 현재 세션값 불러오깅~~
      console.log(userNm);
   });

//^ ----------------------------------------- Vue Method -----------------------------------------
   watch(accountModalGrid, (newValue) => {
      if (newValue && newValue.api) {
         newValue.api.sizeColumnsToFit();
      }
   });

   watch(orderModalGrid, (newValue) => {
      if (newValue && newValue.api) {
         newValue.api.sizeColumnsToFit();
      }
   });

   watch(orderFormGrid, (newValue) => {
      if (newValue && newValue.api) {
         newValue.api.sizeColumnsToFit();
      }
   });

// ^ ---------------------------------------- axios 서버통신 ----------------------------------------
   // 거래처 리스트
   const getAccountList = async (keyword) => {
      try {
         const result = await axios.get('/api/comm/account', { params : { 'act_type' : 'E01', 'act_nm' : String(keyword).trim() } });
         accountModalData.value = result.data || [];
      } catch (err) {
         accountModalData.value = [];
         
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

   // 자재 리스트
   const getMaterial = async (keyword) => {
      try {
         const result = await axios.get('/api/comm/material', { params : { mat_nm : String(keyword).trim() } });
         materialModalData.value = result.data;
      } catch (err) {
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

   // 발주서 리스트
   const getOrderList = async () => {
      try {
         const result = await axios.get('/api/material/orderList');
         orderModalData.value = result.data || [];
      } catch (err) {
         orderModalData.value = [];

         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

//^ ------------------------------------------- Modal -------------------------------------------   
   // 거래처 검색 모달'
   const accountModalOpen = (keyword) => {
      isAccountModal.value = !isAccountModal.value;
      getAccountList(keyword);

      if (accountModalGrid.value) {
         accountModalGrid.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };

   // 주문서 검색 모달
   const orderModalOpen = () => {
      isOrderModal.value = !isOrderModal.value;
      getOrderList();

      if (orderModalGrid.value) {
         orderModalGrid.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };

   // 자재 검색 모달
   const materialModalOpen = (keyword) => {
      isMatModal.value = !isMatModal.value;
      
      getMaterial(keyword);

      if (materialGridReady.value) {
         materialGridReady.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };

   // esc 누르면 모달 닫기
   const modalCloseFunc = (e) => {
      if (e.key === "Escape") {
         if(isAccountModal.value) {
            isAccountModal.value = !isAccountModal.value
         }
         if(isOrderModal.value) {
            isOrderModal.value = !isOrderModal.value
         }
         if(isMatModal.value) {
            isMatModal.value = !isMatModal.value
         }
      }
   }

   // 행 추가
   const addRow = () => {
      let newObj = {};

      orderFormOptions.columnDefs.forEach((data) => {
         newObj[data.field] = '';   // 필드 초기화
      });

      orderFormGrid.value.applyTransaction( { add: [newObj] } );
   };

   // 행 삭제
   const removeRow = () => {
      const selRows = orderFormGrid.value.getSelectedRows();

      orderFormGrid.value.applyTransaction( { remove: selRows } );
   }

// ^ ---------------------------------------- 그리드 이벤트 ----------------------------------------
   const gridReady = (params, gridType) => {
      if (params.api) {
         if (gridType === 'account') {
            accountModalGrid.value = params.api; // 거래처 모달 그리드 API 저장
         }
         if (gridType === 'orderList') {
            orderModalGrid.value = params.api; // 주문서 모달 그리드 API 저장
         }
         if (gridType === 'orderForm') {
            orderFormGrid.value = params.api; // 발주서 관리 그리드 API 저장
         }
         params.api.sizeColumnsToFit();
      }
   };

   // 편집이 시작될 때 자동 포커스 잡기(포커스 인 시점)
   const cellEditingStartedEvent = (params) => {
      params.api.setFocusedCell(params.rowIndex, params.column.colId);
   }

   // 편집이 끝날 때 (포커스 아웃 시점)
   const cellEditingStoppedEvent = (params) => {
      if(!params.newValue) return; // 값이 없을 때 편집이 종료되면 return;
      
      if(params.colDef.field == 'mat_nm' && params.newValue.matCode != null) {
         let newValue = params.newValue;

         params.node.setDataValue("mat_cd", newValue.matCode);
         params.node.setDataValue("mat_nm", newValue.matName);
      }
      if(params.colDef.field == 'act_nm' && params.newValue.actCode != null) {
         let actValue = params.newValue;

         params.node.setDataValue("act_cd", actValue.actCode);
         params.node.setDataValue("act_nm", actValue.actName);
      }
   }

// ^ ----------------------------------- 그리드 데이터 정의 및 바인딩 -----------------------------------
   // 주문서 그리드 option
   const orderModalGridOptions = {
      columnDefs : [
         { headerName: '발주서 코드', field: 'mat_order_cd', sortable: true },
         { headerName: '발주상태', field: 'status', sortable: true  },
         { headerName: '담당자', field: 'id', sortable: true  },
         { headerName: '거래처명', field: 'act_cd', sortable: true, },
      ],
      rowSelection: {
         mode: "multiRow", // 체크박스 다중선택
      },
      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
   };

   // 거래처 검색 모달 옵션
   const accountModalGridOptions = {
      columnDefs : [
         { headerName: '거래처코드', field: 'act_cd', sortable: true },
         { headerName: '자재구분', field: 'act_nm', sortable: true  },
         { headerName: '구분', field: 'act_type', sortable: true  },
         { headerName: '담당자', field: 'mgr_nm', sortable: true, },
         { headerName: '담당자번호', field: 'mgr_tel', sortable: true, },
      ],
      rowSelection: {
         mode: "multiRow", // 체크박스 다중선택
      },
      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
   }

   const materialModalGridOptions = {
      columnDefs : [
         { 
            headerName: '자재코드', 
            field: 'mat_cd',
         },
         {
            headerName: '자재명',
            field: 'mat_nm',
         },
      ],
      onRowClicked : (event) => {
         console.log("이벤트 => ", event);
         
         console.log("orderFormOptions => ", orderFormOptions)
         orderFormOptions.columnDefs.setDataValue("mat_cd", event.data.mat_cd);
         //console.log(orderFormOptions.columnDefs.mat_cd)
      }
   }
   let rowIndex = ref(0);
   const orderFormRowClick = (event) => {
      rowIndex.value = event.rowIndex;
   }

   // no, 발주코드, 자재명, 수량, 거래처코드, 거래처명, 납기일
   // 발주서 입력 그리드 
   const orderFormOptions = {
      rowSelection: {
         mode: "multiRow", // 체크박스 다중선택
      },
      columnDefs : [
         { 
            headerName: '발주서 코드', 
            field: 'mat_order_cd', 
            sortable: true,
            editable: false,  // 편집 비활성화
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size; 9px">자동 입력</span>`;
            },
         },
         { 
            headerName: '자재코드', 
            field: 'mat_cd', 
            sortable: true, 
            editable: false,  // 편집 비활성화
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size; 9px">자동 입력</span>`;
            },
         },
         {
            headerName: '자재명',
            field: 'mat_nm',
            editable: true,   // 편집 가능
            cellEditor : CustomDropdownEditor,  // 커스텀 드롭다운 셀 에디터
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size; 9px">자재명 입력</span>`;
            },
            cellEditorParams: {
               isModal: {
                  openModal: materialModalOpen, // 컴포넌트로 함수 전달
               },
            },
         },
         { 
            headerName: '발주 수량', 
            field: 'mat_qty', 
            sortable: true, 
            editable: true, // 편집 가능
            cellDataType: "number", // 숫자 데이터 타입
            cellEditorParams: {
               min: 0,     // 최소값
            },
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size; 9px">숫자를 입력하세요</span>`;
            },
         },
         { 
            headerName: '거래처코드', 
            field: 'act_cd', 
            sortable: true, 
            editable: false, 
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size; 9px">자동 입력</span>`;
            },
         },
         { 
            headerName: '거래처명', 
            field: 'act_nm', 
            sortable: true,
            editable: true,   // 편집 가능
            cellEditor : AccountDropdownEditor,  // 커스텀 드롭다운 셀 에디터
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size; 9px">거래처명 입력</span>`;
            },
            cellEditorParams: {
               isModal: {
                  openModal: accountModalOpen, // 컴포넌트로 함수 전달
               },
            },
         },
         { 
            headerName: '납기 요청일', 
            field: 'delivery_dt', 
            sortable: true, 
            editable: true,
            cellDataType: "date",   // Date 타입
            cellEditor: "agDateCellEditor",
            cellEditorParams: {
               min: getToday(),     // 오늘부터 선택 가능
            }
         },
      ],
      onRowClicked: orderFormRowClick,
      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
   }
</script>

<style lang="scss" scoped>
   .ag-theme-alpine {
      position: relative;
      z-index: 1 !important; /* 필요에 따라 값을 낮게 조정 */
   }
</style>
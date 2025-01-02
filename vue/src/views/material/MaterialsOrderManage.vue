
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
                  @grid-ready="accountModalGrid"
                  @first-data-rendered="accountModalGridRendered"
               />
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
                  @grid-ready="orderModalGrid"
                  @first-data-rendered="orderModalGridRendered"
               />
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
                  @grid-ready="materialGrid"
                  @first-data-rendered="materialGridRendered"
               />
            </template>
            <template v-slot:footer>
               <div class="mx-auto">
                  
                  <button type="button" class="btn btn-secondary m-1" @click="materialModalOpen">Cancel</button>
               </div>
            </template>
         </Layout>

         <Layout :modalCheck="isMemberModal">
            <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
               <h5 class="modal-title">사원 조회</h5>
               <button type="button" aria-label="Close" class="close" @click="memberModalOpen">×</button>
            </template>
            <template v-slot:default>
               <ag-grid-vue
                  class="ag-theme-alpine"
                  style="width: 100%; height: 500px;"
                  :rowData="memberModalData"
                  :pagination="true"
                  :gridOptions="memberModalGridOptions"
                  @grid-ready="memberModalGrid"
                  @first-data-rendered="memberModalGridRendered"
               />
            </template>
            <template v-slot:footer>
               <div class="mx-auto">
                  <button type="button" class="btn btn-success m-1" @click="memberModalOpen">Save</button>
                  <button type="button" class="btn btn-secondary m-1" @click="memberModalOpen">Cancel</button>
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
                           @grid-ready="orderFormGrid"
                           @first-data-rendered="orderFormGridRendered"
                        />
                     </div>
                  </div>
                  <div class="text-center mtp30">
                     <button class="btn btn-primary">SAVE</button>
                     <button class="btn btn-secondary mlp10" @click="resetFunc">RESET</button>
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
   let isMemberModal = ref(false);           // 자재 담당자 검색

   const accountModalGrid = ref(null);       // 거래처 모달 그리드 참조
   const orderModalGrid = ref(null);         // 주문서 조회 모달
   const orderFormGrid = ref(null);          // 주문서 등록 그리드
   const materialGrid = ref(null);           // 자재 조회 그리드
   const memberModalGrid = ref(null);        // 사원조회 그리드

   const accountModalData = shallowRef([]);  // 거래처 모달 데이터
   const orderModalData = shallowRef([]);    // 발주서 내역 조회 모달 데이터
   const orderFormData = shallowRef([]);     // 발주서 관리 데이터
   const materialModalData = ref([]);        // 자재 모달 데이터
   const memberModalData = ref([]);        // 자재 모달 데이터

//! ----------------------------------------- Vue Hook -----------------------------------------
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '자재 발주서 관리' }); // 페이지 제목 설정
      getAccountList(); // 거래처 리스트
      orderFormData.value = store.getters["materialStore/getMaterials"]; // vuex정보 불러오기

      const userNm = instance?.proxy.$session.get('user_nm'); // 현재 세션값 불러오깅~~
      console.log(userNm);
   });

//! ----------------------------------------- Vue Method -----------------------------------------
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

   watch(orderModalGrid, (newValue) => {
      if (newValue && newValue.api) {
         newValue.api.sizeColumnsToFit();
      }
   });

//! ----------------------------------------- 공통 함수 -----------------------------------------   
   // 오늘 날짜
   const getToday = () => {
      let date = new Date();

      let year = date.getFullYear();
      let month = ('0' + (date.getMonth() + 1)).slice(-2);
      let day = ('0' + date.getDate()).slice(-2);

      let result = year + '-' + month + '-' + day;
      return result;
   }

//! ----------------------------------------- Click Event -----------------------------------------   
   // 행 추가
   const addRow = () => {
      let newObj = {};

      orderFormOptions.columnDefs.forEach((data) => {
         newObj[data.field] = '';   // 필드 초기화
      });

      orderFormGridRendered.api.applyTransaction( { add : [newObj] } );
   };

   // 행 삭제
   const removeRow = () => {
      if (!orderFormGrid.value) {
         Swal.fire({
            icon: "error",
            title: "그리드 초기화 오류",
            text: "그리드가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.",
         });
         return;
      };

      const selRows = orderFormGrid.value.getSelectedRows();

      if(selRows.length > 0 ) {
         orderFormGrid.value.applyTransaction( { remove : selRows } );
      } else {
         Swal.fire({
            icon: "warning",
            title: "선택된 행이 없습니다.",
         });
      }
   };

   // 그리드 데이터 초기화
   const resetFunc = () => {
      orderFormData.value = [];
   }

//! ---------------------------------------- axios 서버통신 ----------------------------------------
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
         const result = await axios.get('/api/comm/material', { params : { 'mat_nm' : String(keyword).trim() } });
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

   // 발주서 리스트
   const getOrderDetailList = async (code) => {
      try {
         const result = await axios.get(`/api/material/orderDetailList/${code}`);
         orderFormData.value = result.data || [];
      } catch (err) {
         orderFormData.value = [];

         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

   const getMember = async () => {
      try {
         const result = await axios.get(`/comm/member/DPT5`)
         memberModalData.value = result.data || [];
         console.log("adf -> ",memberModalData.value)
      } catch (err) {
         memberModalData.value = [];
         
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   }

//^ ------------------------------------------- Modal -------------------------------------------   
   // 거래처 검색 모달'
   const accountModalOpen = (keyword) => {
      isAccountModal.value = !isAccountModal.value;
      getAccountList(keyword);   // 거래처 리스트 

      if (accountModalGrid.value) {
         accountModalGrid.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };

   // 주문서 검색 모달
   const orderModalOpen = () => {
      isOrderModal.value = !isOrderModal.value;
      getOrderList();   // 주문서 리스트

      if (orderModalGrid.value) {
         orderModalGrid.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };

   // 자재 검색 모달
   const materialModalOpen = (keyword) => {
      isMatModal.value = !isMatModal.value;
      
      getMaterial(keyword);   // 자재 리스트

      if (materialGrid.value) {
         materialGrid.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };

   const isMemberModalOpen = (keyword) => {
      isMemberModal.value = !isMemberModal.value;

      getMember(keyword);

      if (memberModalGrid.value) {
         memberModalGrid.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   }

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

// ^ ---------------------------------------- 그리드 이벤트 ----------------------------------------
   // 발주서 모달 행 클릭시
   const orderModalRowClicked = (params) => {
      getOrderDetailList(params.data.mat_order_cd);   // 발주서 헤더에 대한 디테일 정보 조회
      orderModalOpen(); // 발주서 모달 닫기
   }

   // 편집이 시작될 때 자동 포커스 잡기(포커스 인 시점)
   const cellEditingStartedEvent = (params) => {
      params.api.setFocusedCell(params.rowIndex, params.column.colId);  // setFocusedCell -> 자동으로 포커스 잡아줌
   }

   // 편집이 끝날 때 (포커스 아웃 시점)
   const cellEditingStoppedEvent = (params) => {
      if(!params.newValue) return; // 값이 없을 때 편집이 종료되면 return;
      
      if(params.colDef.field == 'mat_nm' && params.newValue.matCode != null) {
         params.node.setDataValue("mat_cd", params.newValue.matCode);
         params.node.setDataValue("mat_nm", params.newValue.matName);
         params.node.setDataValue("unit", params.newValue.matUnit);
      }

      if(params.colDef.field == 'act_nm' && params.newValue.actCode != null) {
         let actValue = params.newValue;
         
         params.node.setDataValue("act_cd", actValue.actCode);
         params.node.setDataValue("act_nm", actValue.actName);
      }

      if(matObj.value && matObj.value.mat_cd && matObj.value.mat_nm) {
         params.node.setDataValue("mat_cd", matObj.value.mat_cd);
         params.node.setDataValue("mat_nm", matObj.value.mat_nm);
         params.node.setDataValue("unit", matObj.value.unit);
         matObj.value = {};
      }

      if(actObj.value && actObj.value.act_cd && actObj.value.act_nm) {
         params.node.setDataValue("act_cd", actObj.value.act_cd);
         params.node.setDataValue("act_nm", actObj.value.act_nm);
         actObj.value = {};
      }
   }
   const orderFormGridRendered = (params) =>{
      params.api.sizeColumnsToFit();
   };
   const memberModalGridRendered = (params) =>{
      params.api.sizeColumnsToFit();
   };
   const materialGridRendered = (params) =>{
      params.api.sizeColumnsToFit();
   };
   const orderModalGridRendered = (params) =>{
      params.api.sizeColumnsToFit(); // 열 크기 조정
   };
   const accountModalGridRendered = (params) =>{
      params.api.sizeColumnsToFit();
   };
// ^ ----------------------------------- 그리드 데이터 정의 및 바인딩 -----------------------------------
   // 주문서 그리드 option
   const orderModalGridOptions = {
      columnDefs : [
         { headerName: '발주서 코드', field: 'mat_order_cd', sortable: true },
         { headerName: '발주상태', field: 'status', sortable: true  },
         { headerName: '담당자', field: 'id', sortable: true  },
         { headerName: '거래처명', field: 'act_cd', sortable: true, },
      ],

      onRowClicked : orderModalRowClicked,
      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
   };

   let actObj = ref({});
   // 거래처 검색 모달 옵션
   const accountModalGridOptions = {
      columnDefs : [
         { headerName: '거래처코드', field: 'act_cd', sortable: true },
         { headerName: '거래처명', field: 'act_nm', sortable: true  },
         { headerName: '거래처 구분', field: 'act_type', sortable: true  },
         { headerName: '담당자', field: 'mgr_nm', sortable: true, },
         { headerName: '담당자번호', field: 'mgr_tel', sortable: true, },
      ],

      onRowClicked : (event) => {
         if (!clickedGrid.value || !clickedGrid.value.data) {
            Swal.fire({
               icon: "warning",
               title: "grid가 정의되지 않았습니다.",
            });

            return;
         }

         if (!event.data) {
            Swal.fire({
               icon: "warning",
               title: "data가 정의되지 않았습니다.",
            });
            return;
         }

         actObj.value = { 'act_cd' : event.data.act_cd, 'act_nm' : event.data.act_nm };
         orderFormGrid.value.stopEditing();  // 편집 종료
         accountModalOpen();  // 거래처 조회 모달
      },

      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지

   }

   let matObj = ref({});

   // 자재 모달 데이터
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
         {
            headerName: '단위',
            field: 'unit',
         },
      ],
      onRowClicked : (event) => {
         if (!clickedGrid.value || !clickedGrid.value.data) {
            Swal.fire({
               icon: "warning",
               title: "grid가 정의되지 않았습니다.",
            });

            return;
         }

         if (!event.data) {
            Swal.fire({
               icon: "warning",
               title: "data가 정의되지 않았습니다.",
            });
            return;
         }

         matObj.value = { 'mat_cd' : event.data.mat_cd, 'mat_nm' : event.data.mat_nm, 'unit' : event.data.unit };
         orderFormGrid.value.stopEditing();  // 편집 종료
         materialModalOpen(); // 자재조회 모달
      }
   }

   const memberModalGridOptions = {
      columnDefs : [
         { 
            headerName: '사원코드', 
            field: 'mat_order_cd', 
            sortable: true,
            editable: false,  // 편집 비활성화
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">자동 입력</span>`;
            },
         },
         { 
            headerName: '사원명', 
            field: 'mat_cd', 
            sortable: true, 
            editable: false,  // 편집 비활성화
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">자동 입력</span>`;
            },
         },
         {
            headerName: '부서코드',
            field: 'mat_nm',
            editable: true,   // 편집 가능
            cellClass: "text-center",
            cellEditor : CustomDropdownEditor,  // 커스텀 드롭다운 셀 에디터
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">자재명 입력</span>`;
            },
            cellEditorParams: {
               isModal: {
                  openModal: materialModalOpen, // 컴포넌트로 함수 전달
               },
            },
         },
         { 
            headerName: '부서명', 
            field: 'mat_qty', 
            sortable: true, 
            cellClass: "text-right",
            editable: true, // 편집 가능
            cellDataType: "number", // 숫자 데이터 타입
            cellEditorParams: {
               min: 0,     // 최소값
            },
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               if (params.value == '') {
                  return params.value ? params.value : `<span style="color: #cacaca; text-align: right; font-size: 11px">숫자를 입력하세요</span>`;
               } else {
                  return params.value.toLocaleString()
               }
            },
         },
         
      ],
   }
   
   let clickedGrid = ref(null);
   const orderFormRowClick = (event) => {
     clickedGrid.value = event; // RowNode만 저장
   };

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
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">자동 입력</span>`;
            },
         },
         { 
            headerName: '자재코드', 
            field: 'mat_cd', 
            sortable: true, 
            editable: false,  // 편집 비활성화
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">자동 입력</span>`;
            },
         },
         {
            headerName: '자재명',
            field: 'mat_nm',
            editable: true,   // 편집 가능
            cellClass: "text-center",
            cellEditor : CustomDropdownEditor,  // 커스텀 드롭다운 셀 에디터
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">자재명 입력</span>`;
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
            cellClass: "text-right",
            editable: true, // 편집 가능
            cellDataType: "number", // 숫자 데이터 타입
            cellEditorParams: {
               min: 0,     // 최소값
            },
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               if (params.value == '') {
                  return params.value ? params.value : `<span style="color: #cacaca; text-align: right; font-size: 11px">숫자를 입력하세요</span>`;
               } else {
                  return params.value.toLocaleString()
               }
            },
         },
         { 
            headerName: '단위', 
            field: 'unit', 
            sortable: true, 
            cellClass: "text-center",
            editable: false, // 편집 가능
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">단위</span>`;
            },
         },
         { 
            headerName: '거래처코드', 
            field: 'act_cd', 
            sortable: true, 
            cellClass: "text-center",
            editable: false, 
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">자동 입력</span>`;
            },
         },
         { 
            headerName: '거래처명', 
            field: 'act_nm', 
            sortable: true,
            cellClass: "text-center",
            editable: true,   // 편집 가능
            cellEditor : AccountDropdownEditor,  // 커스텀 드롭다운 셀 에디터
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">거래처명 입력</span>`;
            },
            cellEditorParams: {
               isModal: {
                  openModal: accountModalOpen, // 컴포넌트로 함수 전달
               },
            },
         },
         { 
            headerName: '담당자', 
            field: 'id', 
            sortable: true,
            cellClass: "text-center",
            editable: true,   // 편집 가능
            cellEditor : AccountDropdownEditor,  // 커스텀 드롭다운 셀 에디터
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">거래처명 입력</span>`;
            },
            cellEditorParams: {
               isModal: {
                  openModal: isMemberModalOpen, // 컴포넌트로 함수 전달
               },
            },
         },
         { 
            headerName: '납기 요청일', 
            field: 'delivery_dt', 
            sortable: true,
            cellClass: "text-center",
            editable: true,
            cellDataType: "date",   // Date 타입
            cellEditor: "agDateCellEditor",
            cellEditorParams: {
               min: getToday(),     // 오늘부터 선택 가능
            },
            cellRenderer: (params) => {
               if (!params.value) {
                  const span = document.createElement("span");
                  span.style.color = "#cacaca";
                  span.style.fontSize = "11px";
                  span.textContent = "날짜 선택";
                  return span; // DOM 노드 반환
               }
               
               const date = new Date(params.value);
               const formattedDate = date.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
               });

               const span = document.createElement("span");
               span.textContent = formattedDate;
               return span; // DOM 노드 반환
            },
         },
      ],
      onRowClicked: orderFormRowClick,
      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
   }
</script>

<style>

   .text-center {
      text-align: center;
   }
   .text-right {
      text-align: right;
   }
</style>
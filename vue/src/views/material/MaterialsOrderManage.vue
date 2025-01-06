
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
                  :gridOptions="accountModalGridOptions"
                  @grid-ready="accountModalGrid"
                  @first-data-rendered="accountModalGridRendered"
                  @grid-size-changed="onGridSizeChanged"
               />
            </template>
            <template v-slot:footer>
               <div class="mx-auto">
                  <button type="button" class="btn btn-secondary m-1" @click="accountModalOpen">닫기</button>
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
                  :gridOptions="orderModalGridOptions"
                  @grid-ready="orderModalGrid"
                  @first-data-rendered="orderModalGridRendered"
                  @grid-size-changed="onGridSizeChanged"
               />
            </template>
            <template v-slot:footer>
               <div class="mx-auto">
                  <button type="button" class="btn btn-secondary m-1" @click="orderModalOpen">닫기</button>
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
                  style="width: 100%; height: 500px; margin: auto;"
                  :rowData="materialModalData"
                  :gridOptions="materialModalGridOptions"
                  @grid-ready="materialGrid"
                  @first-data-rendered="materialGridRendered"
                  @grid-size-changed="onGridSizeChanged"
               />
            </template>
            <template v-slot:footer>
               <div class="mx-auto">
                  <button type="button" class="btn btn-secondary m-1" @click="materialModalOpen">닫기</button>
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
                  :gridOptions="memberModalGridOptions"
                  @grid-ready="memberModalGrid"
                  @first-data-rendered="memberModalGridRendered"
                  @grid-size-changed="onGridSizeChanged"
               />
            </template>
            <template v-slot:footer>
               <div class="mx-auto">
                  <button type="button" class="btn btn-secondary m-1" @click="memberModalOpen">닫기</button>
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
                        <button class="btn btn-success btn-sm m-0 mx-1" @click="addRow">
                           <i class="fa-solid fa-plus"></i>
                        </button>
                        <!-- <button class="btn btn-outline-danger btn-sm m-0 mx-1" @click="removeRow">
                           <i class="fa-solid fa-minus"></i>
                        </button> -->
                     </div>
                  </div>
                  
                  <div class="card-content">
                     <div class="table-responsive">
                        <ag-grid-vue
                           class="ag-theme-alpine"
                           style="width: 100%; height: 700px;"
                           :rowData="orderFormData"
                           :gridOptions="orderFormOptions"
                           @cellEditingStarted="cellEditingStartedEvent"
                           @cellEditingStopped="cellEditingStoppedEvent"
                           @grid-ready="orderFormGrid"
                           @first-data-rendered="orderFormGridRendered"
                           @grid-size-changed="onGridSizeChanged"
                        />
                     </div>
                  </div>
                  <div class="text-center mtp30">
                     <button class="btn btn-primary btn-lg" @click="orderSaveBtnFunc">저장</button>
                     <button class="btn btn-secondary btn-lg mlp10" @click="resetFunc">초기화</button>
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
   import MemberDropdownEditor from '../components/MemberDropdownEditor.vue';  

   const store = useStore();  // vuex
   const instance = getCurrentInstance(); // Vue 인스턴스 가져오기

//^ ----------------------------------------- 데이터 정의 -----------------------------------------   
   /*모달 [S]*/
   let isAccountModal = ref(false);          // 거래처 모달 열림여부
   let isOrderModal = ref(false);            // 주문서 모달 열림여부
   let isMatModal = ref(false);              // 자재 검색 모달 열림여부
   let isMemberModal = ref(false);           // 자재 담당자 검색

   let accountModalGridRendered = ref(null);       // 거래처 모달 그리드 참조
   let orderModalGridRendered = ref(null);         // 주문서 조회 모달
   let orderFormGridRendered = ref(null);          // 주문서 등록 그리드
   let materialGridRendered = ref(null);           // 자재 조회 그리드
   let memberModalGridRendered = ref(null);        // 사원조회 그리드

   const accountModalData = shallowRef([]);  // 거래처 모달 데이터
   const orderModalData = shallowRef([]);    // 발주서 내역 조회 모달 데이터
   const orderFormData = shallowRef([]);     // 발주서 관리 데이터
   const materialModalData = ref([]);        // 자재 모달 데이터
   const memberModalData = ref([]);          // 자재 모달 데이터

   let vuexData = ref([]);

//! ----------------------------------------- Vue Hook -----------------------------------------
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '자재 발주서 관리' }); // 페이지 제목 설정
      getAccountList(); // 거래처 리스트
      vuexData.value = store.getters["materialStore/getMaterials"];

      getVueDataSetOrderFormData();
   });

       // Vuex 데이터를 가져와 풀어서 orderFormData에 직접 할당
   const getVueDataSetOrderFormData = () => {
      let vuexData = store.getters["materialStore/getMaterials"]; // Vuex 데이터 가져오기
      if (!vuexData) {
         return;
      };

      // orderFormData.value를 Vuex 데이터로 매핑
      orderFormData.value = vuexData.map((data) => {
         // 필요한 필드만 추출
         return {
            mat_cd: data.mat_cd || "", // 기본값 처리
            mat_nm: data.mat_nm || "",
            mat_qty: data.mat_qty || 0, // 숫자 기본값
            unit: data.unit || "",
         };
      });
   };

//! ----------------------------------------- Vue Method -----------------------------------------
   watch(accountModalGridRendered, (newValue) => {
      if (newValue && newValue.api) {
         newValue.api.sizeColumnsToFit();
      }
   });

   watch(orderModalGridRendered, (newValue) => {
      if (newValue && newValue.api) {
         newValue.api.sizeColumnsToFit();
      }
   });

   watch(orderModalGridRendered, (newValue) => {
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
   
   const orderFormGrid = (params) => {
      orderFormGridRendered.value = params.api; // API 객체 저장
      
      params.api.sizeColumnsToFit();
   };

   const memberModalGrid = (params) => {
      memberModalGridRendered.value = params.api; // API 객체 저장

      params.api.sizeColumnsToFit();
   };

   const materialGrid = (params) =>{
      materialGridRendered.value = params.api; // API 객체 저장

      params.api.sizeColumnsToFit();
   };

   const orderModalGrid = (params) =>{
      orderModalGridRendered.value = params.api; // API 객체 저장

      params.api.sizeColumnsToFit(); // 열 크기 조정
   };

   const accountModalGrid = (params) =>{
      accountModalGridRendered.value = params.api; // API 객체 저장

      params.api.sizeColumnsToFit();
   };

   const onGridSizeChanged = (params) => {
      params.api.sizeColumnsToFit
   }
//! ----------------------------------------- Click Event -----------------------------------------   
   // 행 추가
   const addRow = () => {
      let newObj = {};

      orderFormOptions.columnDefs.forEach((data) => {
         newObj[data.field] = '';   // 필드 초기화
      });

      orderFormGridRendered.value.applyTransaction( { add : [newObj] } );
   };

   const orderSaveBtnFunc = () => {
      const groupedData = new Map();

      // orderFormGrid 데이터 전체를 들고와서 그리드 api 내장함수인 forEachNode를 사용
      orderFormGridRendered.value.forEachNode(item => {
         const key = item.data.act_cd; // 거래처 코드 기준으로 그룹화=
         if (!groupedData.has(key)) {
            groupedData.set(key, {
               header: {
                  act_cd: item.data.act_cd,
               },
               details: []
            });
         }
         // 디테일 데이터 추가
         groupedData.get(key).details.push({
            mat_cd: item.data.mat_cd,
            mat_nm: item.data.mat_nm,
            delivery_dt: item.data.delivery_dt || "defaultDate",
            mat_qty: item.data.mat_qty || "defaultQty", // NULL 처리
            unit: item.data.unit
         });
      });
   }

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

   const getMember = async (keyword) => {
      try {
         const result = await axios.get(`/api/comm/member`, { params : {'dpt_cd' : 'DPT5', 'name' : String(keyword).trim() } })
         memberModalData.value = result.data || [];
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

      if (accountModalGridRendered.value) {
         accountModalGridRendered.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };

   // 주문서 검색 모달
   const orderModalOpen = () => {
      isOrderModal.value = !isOrderModal.value;
      getOrderList();   // 주문서 리스트

      if (orderModalGridRendered.value) {
         orderModalGridRendered.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };

   // 자재 검색 모달
   const materialModalOpen = (keyword) => {
      isMatModal.value = !isMatModal.value;
      
      getMaterial(keyword);   // 자재 리스트

      if (materialGridRendered.value) {
         materialGridRendered.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };
   // 담당자 모달
   const memberModalOpen = (keyword) => {
      isMemberModal.value = !isMemberModal.value;

      getMember(keyword);

      if (memberModalGridRendered.value) {
         memberModalGridRendered.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
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
         if(isMemberModal.value) {
            isMemberModal.value = !isMemberModal.value
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
      
      // 커스텀한 셀 편집기에서 값 가져와서 셀에 뿌려주기
      if(params.colDef.field == 'mat_nm' && params.newValue.matCode != null) {
         params.node.setDataValue("mat_cd", params.newValue.matCode);
         params.node.setDataValue("mat_nm", params.newValue.matName);
         params.node.setDataValue("unit", params.newValue.matUnit);
      }

      // 커스텀한 셀 편집기에서 거래처 정보 가져와서 셀에 뿌려주기
      if(params.colDef.field == 'act_nm' && params.newValue.actCode != null) {
         params.node.setDataValue("act_cd", params.newValue.actCode);
         params.node.setDataValue("act_nm", params.newValue.actName);
      }

      // 커스텀한 셀 편집기에서 값 가져와서 셀에 뿌려주기
      if(params.colDef.field == 'id' && params.newValue.name != null) {
         
         params.node.setDataValue("id", params.newValue.name);
      }

      // 모달 -> 자재 코드, 자재명을 편집이 종료되는 시점에 셀에 뿌려주기
      if(matObj.value && matObj.value.mat_cd && matObj.value.mat_nm) {
         params.node.setDataValue("mat_cd", matObj.value.mat_cd);
         params.node.setDataValue("mat_nm", matObj.value.mat_nm);
         params.node.setDataValue("unit", matObj.value.unit);
         matObj.value = {};
      }

      // 모달 -> 거래처 코드, 거래처명을 편집이 종료되는 시점에 셀에 뿌려주기
      if(actObj.value && actObj.value.act_cd && actObj.value.act_nm) {
         params.node.setDataValue("act_cd", actObj.value.act_cd);
         params.node.setDataValue("act_nm", actObj.value.act_nm);
         actObj.value = {};
      }
      
      // 모달 -> 사원 정보를 편집이 종료되는 시점에 셀에 뿌려주기
      if(member_name.value) {
         params.node.setDataValue("id", member_name.value);
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
      
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      animateRows: false,
      defaultColDef: {
         filter: false,
         flex: 1,
         minWidth: 10,
      },
      
      suppressMovableColumns: true, // 컬럼 드래그 이동 방지

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
      
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      animateRows: false,
      defaultColDef: {
         filter: false,
         flex: 1,
         minWidth: 10,
      },
      
      suppressMovableColumns: true, // 컬럼 드래그 이동 방지

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
         orderFormGridRendered.value.stopEditing();  // 편집 종료
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

      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      animateRows: false,
      defaultColDef: {
         filter: false,
         flex: 1,
         minWidth: 10,
      },

      suppressMovableColumns: true, // 컬럼 드래그 이동 방지
      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
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
         orderFormGridRendered.value.stopEditing();  // 편집 종료
         materialModalOpen(); // 자재조회 모달
      }
      
   }

   // member 모달에 row클릭 시 
   let member_name = ref('');
   const memberModalGridOptions = {
      columnDefs : [
         { 
            headerName: '사원코드', 
            field: 'mem_cd', 
            sortable: true,
            editable: false,  // 편집 비활성화
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">사원코드</span>`;
            },
         },
         { 
            headerName: '사원명', 
            field: 'name', 
            sortable: true, 
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">사원이름</span>`;
            },
         },
         { 
            headerName: '부서명', 
            field: 'dpt_cd', 
            sortable: true, 
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">부서명</span>`;
            },
         },
      ],

      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      animateRows: false,
      defaultColDef: {
         filter: false,
         flex: 1,
         minWidth: 10,
      },
      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
      suppressMovableColumns: true, // 컬럼 드래그 이동 방지

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

         member_name.value = event.data.name;
         memberModalGridRendered.value.stopEditing();  // 편집 종료
         memberModalOpen();  // 거래처 조회 모달
      },
   }
   
   let clickedGrid = ref(null);
   const orderFormRowClick = (event) => {
     clickedGrid.value = event; // RowNode만 저장
   };

   // no, 발주코드, 자재명, 수량, 거래처코드, 거래처명, 납기일
   // 발주서 입력 그리드 
   const orderFormOptions = {
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
                  return params.value;
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
               return params.value ?  `<span style="color: #000; font-size: 12px">${params.value}</span>` : `<span style="color: #cacaca; font-size: 11px">거래처명 입력</span>`;
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
            cellEditor : MemberDropdownEditor,  // 커스텀 드롭다운 셀 에디터
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? `<span style="color: #000; font-size: 13px">${params.value}</span>` : instance.proxy.$session.get('user_nm');
            },
            cellEditorParams: {
               isModal: {
                  openModal: memberModalOpen, // 컴포넌트로 함수 전달
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
         {
            headerName: '삭제' ,
            field: 'x', 
            cellStyle: { textAlign: "center" },
            cellRenderer: (params) => {
               const button = document.createElement('button');
               button.innerText = 'X';
               button.className = 'btn btn-outline-danger btn-sm';
               button.addEventListener('click', () => {
                  // 현재 행 데이터 가져오기
                  const rowNode = params.node;

                  // 그리드 데이터에서 행 제거
                  params.api.applyTransaction({ remove: [rowNode.data] });
               });
               return button;
            }
         },
      ],
      
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      animateRows: false,
      defaultColDef: {
         filter: false,
         flex: 1,
         minWidth: 10,
      },
      
      suppressMovableColumns: true, // 컬럼 드래그 이동 방지
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
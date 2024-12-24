<template>
   <div class="py-4 container-fluid" @keydown.esc="modalCloseFunc">
      <div class="card">      
         <div class="card-header bg-light ,">
            
         </div>

         <!-- 거래처조회 모달[S]-->
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
                  @grid-ready="gridReady"
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
               <h5 class="modal-title">주문서 조회</h5>
               <button type="button" aria-label="Close" class="close" @click="orderModalOpen">×</button>
            </template>
            <template v-slot:default>
               <ag-grid-vue
                  class="ag-theme-alpine"
                  style="width: 100%; height: 500px;"
                  :rowData="orderModalData"
                  :pagination="true"
                  :gridOptions="orderModalGridOptions"
                  @rowClicked="accountRowClicked"
                  @grid-ready="gridReady"
                  @first-data-rendered="orderModalGrid">
               </ag-grid-vue>
            </template>
            <template v-slot:footer>
               <div class="mx-auto">
                  <button type="button" class="btn btn-success m-1" @click="orderModalOpen">Save</button>
                  <button type="button" class="btn btn-secondary m-1" @click="orderModalOpen">Cancel</button>
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
                        <button type="button" class="btn btn-warning btn-sm m-0 m-1" @click="accountModalOpen">
                           <i class="fa-regular fa-file me-1"></i>
                           거래처조회
                        </button>
                        <button type="button" class="btn btn-warning btn-sm m-0 m-1" @click="orderModalOpen">
                           <i class="fa-regular fa-file me-1"></i>
                           발주서조회
                        </button>
                        <button class="btn btn-outline-primary btn-sm m-0 mx-1" @click="onAddRow">
                           <i class="fa-solid fa-plus"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm m-0 mx-1">
                           <i class="fa-solid fa-minus"></i>
                        </button>
                     </div>
                  </div>
                  
                  <div class="card-content">
                     <div class="table-responsive">
                        <ag-grid-vue
                           class="ag-theme-alpine"
                           style="width: 100%; height: 300px;"
                           :rowData="orderFormData"
                           :pagination="true"
                           :gridOptions="orderFormOptions"
                           @rowClicked="rowClicked"
                           @grid-ready="gridReady"
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
   import { AgGridVue } from 'ag-grid-vue3';
   import axios from 'axios';
   import { ref, onBeforeMount, shallowRef, watch } from 'vue'; //
   import { useStore } from 'vuex';
   import Swal from 'sweetalert2';
   import Layout from '../components/modalLayout.vue'; // modal Layout 불러오기

   const store = useStore();  // vuex
//^ ----------------------------------------- 데이터 정의 -----------------------------------------   
   /*모달 [S]*/
   let isAccountModal = ref(false);  // 거래처 모달
   let isOrderModal = ref(false);  // 주문서 모달

   const accountModalGrid = ref(null);
   const accountModalData = shallowRef([]); // 모달 거래처 데이터

   const orderModalGrid = ref(null);
   const orderModalData = shallowRef([]);  // 주문서
   
   const orderFormGrid = shallowRef(null);
   const orderFormData = ref([]);
//^ ----------------------------------------- Vue Hook -----------------------------------------
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '자재 발주서 관리' }); // 페이지 제목 설정
      getAccountList(); 
   });

//^ ----------------------------------------- Vue Method -----------------------------------------
   // const autoResizeGrid = (grid) => {
   //    watch(grid, () => {
   //       const api = grid.api;
   //       if (api) {
   //          api.sizeColumnsToFit();
   //       }
   //    });
   // };

   // autoResizeGrid(orderModalGrid);
   // autoResizeGrid(orderFormGrid);

   watch(orderModalGrid, (newValue) => {
      if (newValue && newValue.api) {
         newValue.api.sizeColumnsToFit();
      }
   });

//^ ------------------------------------------- Modal -------------------------------------------   
   // 거래처 검색 모달
   const accountModalOpen = () => {
      isAccountModal.value = !isAccountModal.value;
      getAccountList();
   };

   // 주문서 검색 모달
   const orderModalOpen = () => {
      isOrderModal.value = !isOrderModal.value;
      getOrderList();
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
      }
   }
// ^ ---------------------------------------- 그리드 이벤트 ----------------------------------------
   const gridReady = (params) => {
      if (params.api) {
         params.api.sizeColumnsToFit(); // 그리드 크기에 자동 맞춤
      }
   };

   // 주문서 정보 클릭시 상세보기 ~~
   const accountRowClicked = (params) => {
      console.log(params);
   };

// ^ ---------------------------------------- axios 서버통신 ----------------------------------------
   // 거래처 조회
   const getAccountList = async () => {
      try {
         const result = await axios.get('/api/comm/account', { params : { 'act_type' : 'E01' } });
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

   // 발주서 조회
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
      overlayNoRowsTemplate: `<span class="text-danger">데이터가 없습니다.</span>`, // 데이터 없음 메시지
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
      overlayNoRowsTemplate: `<span class="text-danger">데이터가 없습니다.</span>`, // 데이터 없음 메시지
   }
   // no, 발주코드, 자재명, 수량, 거래처코드, 거래처명, 납기일
   const orderFormOptions = {
      rowSelection: {
         mode: "multiRow", // 체크박스 다중선택
      },
      columnDefs : [
         { headerName: '발주코드', field: 'act_nm', sortable: true  },
         { headerName: '자재코드', field: 'act_type', sortable: true  },
         { headerName: '자재명', field: 'act_type', sortable: true  },
         { headerName: '수량', field: 'mgr_nm', sortable: true, },
         { headerName: '거래처코드', field: 'mgr_tel', sortable: true, },
         { headerName: '거래처명', field: 'mgr_tel', sortable: true, },
         { headerName: '납기일', field: 'mgr_tel', sortable: true, },
      ]
   }
</script>

<style lang="scss" scoped>

</style>
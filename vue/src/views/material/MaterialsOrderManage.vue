<template>
   <div class="py-4 container-fluid">
      <div class="card">      
         <div class="card-header bg-light ,">
            <div class="d-flex justify-content-end align-items-center">
               <button type="button" class="btn btn-warning m-0 m-1" @click="orderModalOpen">
                  <i class="fa-regular fa-file me-1"></i>
               </button>
               <button class="btn btn-outline-primary m-0 mx-1">
                  <i class="fa-solid fa-plus"></i>
               </button>
               <button class="btn btn-outline-danger m-0 mx-1">
                  <i class="fa-solid fa-minus"></i>
               </button>
            </div>
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
                  @first-data-rendered="accountModalGridData">
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
               <h5 class="modal-title">거래처 조회</h5>
               <button type="button" aria-label="Close" class="close" @click="orderModalOpen">×</button>
            </template>
            <template v-slot:default>
               <ag-grid-vue
                  class="ag-theme-alpine"
                  style="width: 100%; height: 500px;"
                  :rowData="orderModalData"
                  :pagination="true"
                  :gridOptions="orderModalGridOptions"
                  @grid-ready="gridReady"
                  @first-data-rendered="orderModalGridData">
               </ag-grid-vue>
            </template>
            <template v-slot:footer>
               <div class="mx-auto">
                  <button type="button" class="btn btn-success m-1" @click="orderModalOpen">Save</button>
                  <button type="button" class="btn btn-secondary m-1" @click="orderModalOpen">Cancel</button>
               </div>
               
            </template>
         </Layout>

         <div class="card-body">
            <div class="row">
               <div class="col-md-6">
                  <ag-grid-vue
                     class="ag-theme-alpine"
                     style="width: 100%; height: 300px;"
                     :rowData="orderFormData"
                     :pagination="true"
                     :gridOptions="orderFormOptions"
                     @rowClicked="rowClicked"
                     @grid-ready="orderFormGridReady"
                     @first-data-rendered="orderFormGridEvent">
                  </ag-grid-vue>
               </div>
            </div>
            <div class="center mtp30">
               <button class="btn btn-primary" @click="instInsert">SAVE</button>
               <button class="btn btn-secondary mlp10">RESET</button>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { AgGridVue } from 'ag-grid-vue3';
   //import axios from 'axios';
   import { ref, onBeforeMount, watch, shallowRef } from 'vue'; //
   import { useStore } from 'vuex';
   //import Swal from 'sweetalert2';
   import Layout from '../components/modalLayout.vue'; // modal Layout 불러오기

   const store = useStore();  // vuex
//^ ----------------------------------------- 데이터 정의 -----------------------------------------   
   /*모달 [S]*/
   let isAccountModal = ref(false);  // 거래처 모달
   let isOrderModal = ref(false);  // 주문서 모달

   const accountModalData = shallowRef([]); // 거래처
   const orderModalData = shallowRef([]);  // 주문서

//^ ----------------------------------------- Vue Hook -----------------------------------------
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '자재 발주서 관리' });  // 페이지 제목 설정
   });

//^ ----------------------------------------- Vue Method -----------------------------------------
   // 거래처 검색 그리드
   watch(accountModalData, () => {
      const api = gridReady.api; // 거래처 검색 그리드
      if(api) {
         api.sizeColumnsToFit();
      }
   });

//^ ------------------------------------------- Modal -------------------------------------------   
   // 주문서 검색 모달
   const orderModalOpen = () => {
      isOrderModal.value = !isOrderModal.value;
   };

   // 거래처 검색 모달
   const accountModalOpen = () => {
      isAccountModal.value = !isAccountModal.value;
   };

// ^ ------------------------------------ 거래처 검색 모달 옵션 ------------------------------------
   // 거래처 검색 모달 옵션
   const accountModalGridOptions = {
      overlayNoRowsTemplate: `<span class="text-danger">데이터가 없습니다.</span>`, // 데이터 없음 메시지
   };

// ^ ---------------------------------------- 그리드 이벤트 ----------------------------------------
   // 그리드 준비
   const gridReady = (params) => {
      params.api.sizeColumnsToFit(); // 그리드 열을 컨테이너 크기에 맞춤
   };
   // const modalClicked = (params) => {
   //    console.log(params)
   //    // getOrderDtlList(params.data.order_cd);
   //    // this.order_cd= params.data.order_cd;
   //    // this.isModal = !this.isModal;
   // };


</script>

<style lang="scss" scoped>

</style>
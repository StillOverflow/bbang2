<template>
   <div class="py-4 container-fluid">
      <div class="row" @keydown="keyEventHandler($event)">
         <div class="col-12">
         <div class="card">
            <div class="card-header bg-light ps-5 ps-md-4">

               <!-- //& 검색 박스 ~~ -->
               <div class="d-flex justify-content-center align-items-center mb-3">
                  <div class="col-lg-1 text-left fw-bolder">LOT 코드</div>
                  <div class="col-lg-7">
                     <input class="form-control " type="text" v-model="search"/>        
                  </div>
               </div>
               
               <!-- //& 거래처명으로 검색하기 -->
               <div class="d-flex justify-content-center align-items-center mb-3">
                  <div class="col-lg-1 text-left fw-bolder">거래처명</div>
                  <div class="col-lg-7 searchInputBox">
                     <!-- 입력 필드 -->
                     <div class="input-group">
                        <input type="text" class="form-control" v-model="accKeyword" autocomplete="off" @input="inputChange" placeholder="자재명을 입력하세요"/>
                        <button type="button" id="button-addon3" @click="materialModalOpen" class="btn btn-warning">
                           <i class="fa-solid fa-magnifying-glass"></i>
                        </button>
                     </div>

                     <!-- 드롭다운 리스트 -->
                     <div v-if="!isHidden" class="dropdownBox">
                        <div v-if="accountArr.length">
                           <button 
                              v-for="(item, index) in materialArr" 
                              :key="index" 
                              class="dropdown-item materialBtn" 
                              :class="{ active: index === selectedIndex }" 
                              :data-matCode="item.mat_cd"
                              @click="onClickMatNm(item.mat_cd, item.mat_nm)"
                           >
                              {{ item.mat_nm }}
                           </button>
                        </div>
                        <div v-else class="dropdown-item text-left fw-bolder" style="color: #2bce89">결과 없음</div>
                     </div>
                  </div>
               </div>
               
               <!-- //& 자재명으로 검색하기 -->
               <div class="d-flex justify-content-center align-items-center mb-3" style="width: 100%;">
                  <div class="col-lg-1 text-left fw-bolder">자재명</div>
                  <div class="col-lg-7 searchInputBox">
                     <!-- 입력 필드 -->
                     <div class="input-group">
                        <input type="text" class="form-control" v-model="matKeyword" autocomplete="off" @input="inputChange" placeholder="자재명을 입력하세요"/>
                        <button type="button" id="button-addon3" @click="materialModalOpen" class="btn btn-warning">
                           <i class="fa-solid fa-magnifying-glass"></i>
                        </button>
                     </div>

                     <!-- 드롭다운 리스트 -->
                     <div v-if="!isHidden" class="dropdownBox">
                        <div v-if="materialArr.length">
                           <button 
                              v-for="(item, index) in materialArr" 
                              :key="index" 
                              class="dropdown-item materialBtn" 
                              :class="{ active: index === selectedIndex }" 
                              :data-matCode="item.mat_cd"
                              @click="onClickMatNm(item.mat_cd, item.mat_nm)"
                           >
                              {{ item.mat_nm }}
                           </button>
                        </div>
                        <div v-else class="dropdown-item text-left fw-bolder" style="color: #2bce89">결과 없음</div>
                     </div>
                  </div>
               </div>
               
               <div class="d-flex justify-content-center align-items-center mb-3">
                  <div class="col-lg-1 text-left fw-bolder">유통기한</div>
                  <div class="col-6 col-lg-3">
                     <input class="form-control" type="date" :max="lastDt" v-model="startDt" />
                  </div>
                  <div class="col-6 col-lg-1 text-center fw-bolder">~</div>
                  <div class="col-6 col-lg-3">
                     <input class="form-control" type="date" :min="startDt" v-model="lastDt" />
                  </div>
               </div>

               <div class="d-flex justify-content-center align-items-center mb-3">
                  <div class="col-lg-1 text-left fw-bolder">입고날짜</div>
                  <div class="col-6 col-lg-3">
                     <input class="form-control" type="date" :max="in_lastDt" v-model="in_startDt" />
                  </div>
                  <div class="col-6 col-lg-1 text-center fw-bolder" :style="t_overflow">~</div>
                  <div class="col-6 col-lg-3">
                     <input class="form-control" type="date" :min="in_startDt" v-model="in_lastDt" />
                  </div>
               </div>
               
               <!-- 자재구분 -->
               <div class="d-flex justify-content-center align-items-center mb-3">
                  <div class="col-lg-1 text-left fw-bolder font_15px">자재구분</div>
                  <div class="col-lg-7 form-check d-flex justify-content-between align-items-center">
                     <div class="col-lg-1">
                        <input 
                           class="form-check-input text-left"
                           type="radio"
                           :name="materialType"
                           value=""
                           v-model="selectedType"
                           @change="radioMaterialChange"
                           checked="checked"
                        />
                        <label class="form-check-label m-0 text-start font_13px">전체</label>
                     </div>
                     <div class="col-lg-1" v-for="(data, idx) in materialType" :key="idx">
                        <input 
                           class="form-check-input text-left" 
                           type="radio" 
                           :name="materialType"
                           :value="data.comm_dtl_cd"                                        
                           v-model="selectedType"
                           @change="radioMaterialChange"
                        />
                        <label class="form-check-label m-0 text-start font_13px" :for="'radio' + data.comm_dtl_cd">
                           {{ data.comm_dtl_nm }}
                        </label>
                     </div>
                  </div>
               </div>
               
               <!-- 카테고리 -->
               <div class="d-flex justify-content-center align-items-center mb-3">
                  <div class="col-lg-1 text-left fw-bolder font_15px">카테고리</div>
                  <div class="col-lg-7 form-check d-flex justify-content-between align-items-center">
                     <div class="col-lg-1">
                        <input 
                           class="form-check-input text-left" 
                           type="radio"
                           :name="materialCategory"
                           value=""
                           v-model="selectedCategory"
                           @change="radioMaterialChange"
                           checked="checked"
                        >
                        <label class="form-check-label text-start font_13px m-0">전체</label>
                     </div>
                     <div style="width: 14%;" v-for="(data, idx) in materialCategory" :key="idx">
                        <input 
                           class="form-check-input text-left" 
                           type="radio" 
                           :name="materialCategory"
                           :value="data.comm_dtl_cd" 
                           v-model="selectedCategory"                                        
                           @change="radioMaterialChange"
                        >
                        <label class="form-check-label text-start m-0 font_13px" :for="'radioCategory' + data.comm_dtl_cd">
                           {{ data.comm_dtl_nm }}
                        </label> 
                     </div>
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

            <div class="card-body px-0 pt-0 pb-2">
               <!-- //& 거래처 모달창 -->
               <Layout :modalCheck="isAccountModal">
                  <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
                     <h5 class="modal-title">거래처 조회</h5>
                     <button type="button" aria-label="Close" class="close" @click="materialModalOpen">×</button>
                  </template>
                  <template v-slot:default>
                     <ag-grid-vue
                        class="ag-theme-alpine"
                        style="width: 100%; height: 300px;"
                        :rowData="accountModalData"
                        :pagination="true"
                        :gridOptions="accountGridOptions"
                        @grid-ready="accountGrid"
                        @firstDataRendered="accountGridRendered"
                     />
                  </template>
                  <template v-slot:footer>
                     <div class="mx-auto">
                        <button type="button" class="btn btn-secondary m-1" @click="materialModalOpen">닫기</button>
                     </div>
                  </template>
               </Layout>

               <!-- //& 자재 모달창 -->
               <Layout :modalCheck="isMatModal">
                  <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
                     <h5 class="modal-title">자재 조회</h5>
                     <button type="button" aria-label="Close" class="close" @click="materialModalOpen">×</button>
                  </template>
                  <template v-slot:default>
                     <ag-grid-vue
                        class="ag-theme-alpine"
                        style="width: 100%; height: 300px;"
                        :rowData="materialModalData"
                        :pagination="true"
                        :gridOptions="materialGridOptions"
                        @grid-ready="materialGrid"
                        @firstDataRendered="materialGridRendered"
                     />
                  </template>
                  <template v-slot:footer>
                     <div class="mx-auto">
                        <button type="button" class="btn btn-secondary m-1" @click="materialModalOpen">닫기</button>
                     </div>
                  </template>
               </Layout>

               <ag-grid-vue
                  class="ag-theme-alpine"
                  style="width: 100%; height: 700px;"
                  :rowData="materialStockData"
                  :pagination="true"
                  :gridOptions="materialStockOptions"
                  @grid-ready="materialStockGrid"
                  @firstDataRendered="materialStockGridRendered"
               />
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
   import { useStore } from 'vuex';
   import { onBeforeMount, shallowRef, ref } from 'vue';

   import Layout from '../components/modalLayout.vue';   // modal Layout 불러오기
//! ---------------------------------------- 데이터 정의 ----------------------------------------
   // Vuex store 사용
   const store = useStore();

   // 동적 검색 조건 
   const materialType = shallowRef([]);     // 자재 구분
   const materialCategory = shallowRef([]); // 자재 카테고리
   let startDt = ref('');                   // 시작 날짜
   let lastDt = ref('');                    // 종료 날짜
   let in_startDt = ref('');                // 시작 날짜
   let in_lastDt = ref('');                 // 종료 날짜
   let accKeyword = ref('');                // 거래처명
   let matKeyword = ref('');                // 자재명

   let selectedType = ref('');              // 선택된 자재 구분
   let selectedCategory = ref('');          // 선택된 카테고리

   const materialArr = ref([]);             // 자재결과

   let isHidden = ref(true);                // 드롭다운 표시 여부 (true: 숨김, false: 표시)
   let isMatModal = ref(false);             // 모달 표시 여부 (true : 숨김, false : 표시)
   let isAccModal = ref(false);             // 모달 표시 여부 (true : 숨김, false : 표시)

   // 그리드 관련 ~
   let accountModalData = shallowRef([]);   // 거래처 검색 모달
   let materialModalData = shallowRef([]);  // 자재 검색 모달
   let accountGridRendered = ref(null);     // 거래처 그리드
   let materialGridRendered = ref(null);    // 자재 그리드

//! ---------------------------------------- Vue Hook ----------------------------------------
   // created와 비슷~~
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '자재별 재고 조회' });  // 페이지 제목 설정
      getCategory();  // 카테고리
      getType();      // 자재유형 
      resetBtnFunc();
   });
   
//! ---------------------------------------- axios 서버통신 ----------------------------------------
   // 카테고리 목록 조회
   const getCategory = async () => {
      try {
         const result = await axios.get('/api/comm/codeList/MC');
         materialCategory.value = result.data || [];
      } catch (err) {
         materialCategory.value = [];

         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   }

   // 자재 구분 목록 조회
   const getType = async () => {
      try {
         const result = await axios.get('/api/comm/codeList/MA');
         materialType.value = result.data || [];
      } catch (err) {
         materialType.value = [];

         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   }

   // 자재 목록 조회
   const getMaterial = async () => {
      try {
         const result = await axios.get('/api/comm/material', { params : { 'mat_nm' : String(matKeyword.value).trim(), } });
         materialModalData.value = result.data || [];

      } catch (err) {
         materialArr.value = [];

         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

   // 거래처 리스트
   const getAccountList = async () => {
      try {
         const result = await axios.get('/api/comm/account', { params : { 'act_type' : 'E01', 'act_nm' : String(accKeyword.value).trim() } });
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

//! ---------------------------------------- Modal ----------------------------------------
   // 자재 검색 모달
   const materialModalOpen = () => {
      isMatModal.value = !isMatModal.value;
      
      getMaterial();   // 자재 리스트

      if (materialGridRendered.value) {
         materialGridRendered.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };

   // 거래처 검색 모달
   const accountModalOpen = () => {
      isAccModal.value = !isAccModal.value;
      
      getAccountList();   // 자재 리스트

      if (accountGridRendered.value) {
         accountGridRendered.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };

//! ----------------------------------- Event Handler -----------------------------------
   // 드롭다운 박스에 버튼 클릭 시 input에 입력 & 모달창 자재 클릭시 검색창에 입력
   const onClickMatNm = (params, code, name, ) => {
      isHidden.value = true;       // 드롭다운 숨김

      if(params != null) {
         keyword.value = params.data.mat_nm;
         materialModalOpen(); // 자재조회 모달
      }

      if(code || name) {
         keyword.value = name;   // 자재명
      }

      getMaterialOutForProduction();
   };

   // 아래, 위 방향키 및 엔터 이벤트 핸들러
   let selectedIndex = ref( -1 );
   const keyEventHandler = (event) => {
      let elementBtns = document.querySelectorAll(".materialBtn");
      if(isHidden.value && !isMatModal.value) return;

      switch (event.key) {
         case 'ArrowDown' :
            if(event.isComposing) return; // 한글 끝부분 2개씩 입력막기
            event.preventDefault();       // 스크롤 이벤트 막기

            if (elementBtns.length > 0) {
               selectedIndex.value = (selectedIndex.value + 1) % elementBtns.length; // 드롭박스 순환
               elementBtns[selectedIndex.value].focus();
            }
         break;

         case "ArrowUp" :
            if(event.isComposing) return; // 한글 끝부분 2개씩 입력막기
            event.preventDefault();       // 스크롤 이벤트 막기

            if (elementBtns.length > 0 && document.activeElement) {
               if(selectedIndex.value !== 0) {
                  selectedIndex.value = (selectedIndex.value - 1) % elementBtns.length; // 드롭박스 순환
               } else {
                  selectedIndex.value = elementBtns.length -1;
               }
               elementBtns[selectedIndex.value].focus(); // 포커스 잡기
            }
         break;
         
         case "Escape" :
            if (isMatModal.value) {
               isMatModal.value = false; // 모달을 닫기
            }

            if (!isHidden.value) {
               isHidden.value = true; // 드롭다운 닫기
            }
         break;
         
         case "Enter" : {
            if (document.activeElement) {
               accKeyword.value = document.activeElement.innerText;
            }
            break;
         }
      }
   };

   const resetBtnFunc = () => {
      console.log("❗️초기화 ")
   }  

//! ---------------------------------------- Ag Grid ----------------------------------------   

   const accountGrid = (params) =>{
      accountGridRendered.value = params.api; // API 객체 저장

      params.api.sizeColumnsToFit();
   };

   const materialGrid = (params) =>{
      materialGridRendered.value = params.api; // API 객체 저장

      params.api.sizeColumnsToFit();
   };

   // 거래처 검색 모달 옵션
   const accountGridOptions = {
      columnDefs : [
         { headerName: '거래처코드', field: 'act_cd', sortable: true },
         { headerName: '거래처명', field: 'act_nm', sortable: true  },
         { headerName: '거래처 구분', field: 'act_type', sortable: true  },
         { headerName: '담당자', field: 'mgr_nm', sortable: true, },
         { headerName: '담당자번호', field: 'mgr_tel', sortable: true, },
      ],

      onRowClicked : (event) => {
         console.log("거래처 모달 데이터 클릭 -> ", event)
         accountModalOpen();  // 거래처 조회 모달
      },

      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
   }

   // 자재 모달 데이터
   const materialGridOptions = {
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
         if (!event.data) {
            Swal.fire({
               icon: "warning",
               title: "data가 정의되지 않았습니다.",
            });
            return;
         }

         materialModalOpen(); // 자재조회 모달
      }
   }
</script>

<style lang="scss" scoped>

</style>
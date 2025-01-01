<template>
   <div class="py-4 container-fluid">
      <div class="row">
         <div class="col-12">
            <div class="card">

               <Layout :modalCheck="isMatModal">
                  <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
                     <h5 class="modal-title">자재 조회</h5>
                     <button type="button" aria-label="Close" class="close" @click="materialModalOpen">×</button>
                  </template>
                  <template v-slot:default>
                     <ag-grid-vue
                        class="ag-theme-alpine"
                        style="width: 100%; height: 500px; margin: auto;"
                        :rowData="materialArr"
                        :pagination="true"
                        :gridOptions="materialModalOptions"
                        @grid-ready="materialGrid">
                     </ag-grid-vue>
                  </template>
                  <template v-slot:footer>
                     <div class="mx-auto">
                        
                        <button type="button" class="btn btn-secondary m-1" @click="materialModalOpen">Cancel</button>
                     </div>
                  </template>
               </Layout>

               <div class="card-header bg-light">
                  <div id="searchBox" class="mx-auto">
                     
                     <div class="d-block w-100 mx-auto">
                        <div class="row">
                           <div class="d-flex justify-content-left align-items-center text-left mb-3">
                              <div class="col-lg-1 text-center fw-bolder">출고 일자</div>
                              <div class="col-lg-3">
                                 <input class="form-control" type="date" :max="endDt" v-model="startDt" />
                              </div>
                              <div class="w-3 text-center fw-bolder">~</div>
                              <div class="col-lg-3">
                                 <input class="form-control" type="date" :min="startDt" v-model="endDt" />
                              </div>
                           </div>
                        </div>
                        
                        <div class="row">
                           <div class="d-flex justify-content-left align-items-center mb-3">
                              <div class="col-lg-1 text-center fw-bolder">자재명</div>
                              <div class="col-lg-6 searchInputBox" @keydown="keyEventHandler($event)">
                                 <!-- 입력 필드 -->
                                 <div class="input-group">
                                    <input type="text" class="form-control" v-model="keyword" @input="inputChange" placeholder="자재명을 입력하세요" />
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
                                          @click="onClickMatNm(item.mat_cd, item.mat_nm)"
                                       >
                                          {{ item.mat_nm }}
                                       </button>
                                    </div>
                                    <div v-else class="dropdown-item text-center text-muted">결과 없음</div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <!-- 자재구분 -->
                        <div class="row">
                           <div class="d-flex justify-content-left align-items-center text-left mb-3">
                              <div class="col-lg-1 text-center fw-bolder">자재구분</div>
                              <div class="form-check form-check-inline w-40 d-flex justify-content-between align-items-center">
                                 <div class="w-15">
                                    <input 
                                       class="form-check-input me-1" 
                                       type="radio"
                                       :id="typeAll"
                                       :name="materialType"
                                    />
                                    <label class="form-check-label text-start">전체</label>
                                 </div>
                                 <div class="w-15" v-for="(data, idx) in materialType" :key="idx">
                                    <input 
                                       class="form-check-input me-1" 
                                       type="radio" 
                                       :id="'type' + data.comm_dtl_cd" 
                                       :name="materialType"
                                       :value="data.comm_dtl_cd" 
                                       v-model="selectedType"
                                    />
                                    <label class="form-check-label text-start" :for="'radio' + data.comm_dtl_cd">
                                       {{ data.comm_dtl_nm }}
                                    </label>
                                 </div>
                              </div>
                           </div>
                        </div>
                        
                        <div class="row">
                           <div class="col-12 d-flex justify-content-left align-items-center text-left mb-3">
                              <div class="col-lg-1 text-center fw-bolder">카테고리</div>
                                 
                              <div class="form-check w-50 d-flex justify-content-between align-items-center">
                                 <div class="w-15">
                                    <input 
                                       class="form-check-input me-1" 
                                       type="radio"
                                       :id="categoryAll"
                                       :name="materialCategory"
                                    >
                                    <label class="form-check-label text-start">전체</label>
                                 </div>
                                 <div class="w-15" v-for="(data, idx) in materialCategory" :key="idx">
                                    <input 
                                       class="form-check-input me-1" 
                                       type="radio" 
                                       :id="'category' + data.comm_dtl_cd" 
                                       :name="materialCategory"
                                       :value="data.comm_dtl_cd" 
                                       v-model="selectedCategory" 
                                    >
                                    <label class="form-check-label text-start" :for="'radioCategory' + data.comm_dtl_cd">
                                       {{ data.comm_dtl_nm }}
                                    </label>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div class="row">
                        <div class="col-12 d-flex justify-content-center">
                           <button type="button" class="btn btn-warning m-2" @click="getSearchResultDatas">
                              <i class="fa-solid fa-magnifying-glass"></i>
                           </button>
                           <button type="button" class="btn btn-secondary m-2" @click="resetBtn">
                              <i class="fa-solid fa-rotate"></i>
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="card-body">
                  <div class="row">
                     <ag-grid-vue
                        class="ag-theme-alpine"
                        style="width: 100%; height: 500px;"
                        :rowData="instructionsData"
                        :pagination="true"
                        :gridOptions="instructionsOptions"
                        @grid-ready="instructionsGrid"
                     />
                  </div>

                  <div class="center">
                     <button class="btn btn-primary mtp30" @click="planInsert">SUBMIT</button>
                     <button class="btn btn-secondary mlp10 mtp30" @click="resetForm">RESET</button>
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
   import Swal from 'sweetalert2';
   import { useStore } from 'vuex';
   import { onBeforeMount, shallowRef, ref } from 'vue';
   
   //import { , onBeforeMount, ref, watch } from 'vue';
   import Layout from '../components/modalLayout.vue';   // modal Layout 불러오기
//! ---------------------------------------- 데이터 정의 ----------------------------------------
   // Vuex store 사용
   const store = useStore();

   // 동적 검색 조건 
   const materialType = shallowRef([]);     // 자재 구분
   const materialCategory = shallowRef([]); // 자재 카테고리
   const materialArr = ref([]);             // 자재결과
   

   // const selectedMaterialType = ref('');
   // const selectedCategory = ref('');
   let startDt = ref('');                 // 시작 날짜
   let endDt = ref('');                   // 종료 날짜
   let keyword = ref('');                 // 검색어
   let isHidden = ref(true);              // 드롭다운 표시 여부 (true: 숨김, false: 표시)
   
   let isMatModal = ref(false);            // 모달 표시 여부 (true : 표시, false : 숨김)
   const materialGrid = ref(null);        // 자재 모달 그리드
   //const materialModalData = ref([]);     // 자재 모달 데이터
//! ---------------------------------------- Vue Hook ----------------------------------------
   // created와 비슷~~
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '자재 출고 조회' });  // 페이지 제목 설정
      getCategory(); // 카테고리
      getType();     // 자재유형 
   });

//! ---------------------------------------- Modal ----------------------------------------
   // 자재 검색 모달
   const materialModalOpen = () => {
      isMatModal.value = !isMatModal.value;
      
      getMaterial(keyword.value);   // 자재 리스트

      if (materialGrid.value) {
         materialGrid.value.api.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };

//! ---------------------------------------- axios 서버통신 ----------------------------------------
   // 카테고리 목록 조회
   const getCategory = async () => {
      try {
         const result = await axios.get('/api/comm/codeList/MC');
         materialCategory.value = result.data;
      } catch (err) {
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
         materialType.value = result.data;
      } catch (err) {
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   }
   // 자재 목록 조회
   const getMaterial = async (keyword) => {
      try {
         const result = await axios.get('/api/comm/material', { params : { 'mat_nm' : String(keyword).trim() } });
         materialArr.value = result.data;
      } catch (err) {
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

//! ---------------------------------------- 이벤트 함수 ----------------------------------------
   // 검색
   const inputChange = () => {
      if (!keyword.value.trim()) {
         isHidden.value = true; // 검색어가 비어있을 경우 드롭박스 숨기기
         return;
      }
      isHidden.value = false; // 검색어가 있으면 드롭박스 표시
      getMaterial(keyword.value);
   };

   // 드롭다운 박스에 버튼 클릭 시 input에 입력
   const onClickMatNm = (code, name) => {
      isHidden.value = true;       // 드롭다운 숨김

      //matCode.value = code; // 자재 코드
      keyword.value = name; // 자재명
   };

   // 아래, 위 방향키 및 엔터 이벤트 핸들러
   let selectedIndex = ref(-1);
   const keyEventHandler = (event) => {
      let elementBtns = document.querySelectorAll(".materialBtn");
      if(isHidden.value || elementBtns.length == 0) return;

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

         case "Enter" :
            if (document.activeElement) {
               keyword.value = document.activeElement.innerText;
            }
         break;
      }
   }

//! ---------------------------------------- 이벤트 함수 ----------------------------------------
   const materialModalOptions = {
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
      // onRowClicked : (event) => {
      //    if (!clickedGrid.value || !clickedGrid.value.data) {
      //       Swal.fire({
      //          icon: "warning",
      //          title: "grid가 정의되지 않았습니다.",
      //       });

      //       return;
      //    }

      //    if (!event.data) {
      //       Swal.fire({
      //          icon: "warning",
      //          title: "data가 정의되지 않았습니다.",
      //       });
      //       return;
      //    }
      //    materialModalOpen(); // 자재조회 모달
      // }
   }

</script>

<style scoped>
   .searchInputBox {
      position: relative;
      width: 53%;
      z-index: 1050;
   }

   .dropdown-input {
      width: 70%;
      padding: 5px;
      box-sizing: border-box;
   }

   .dropdownBox {
      position: absolute;
      top: 100%; 
      left: 0;
      width: 100%;
      background: #fff;
      border: 1px solid #ccc;
      max-height: 300px;
      overflow-y: auto;
      z-index: 1100;
      padding: 5px;
      border-radius: 5px;
   }

   .smallText {
      all: unset;
      display: block;
      font-size: 12px;
      color: #999999;
      cursor: pointer;
      border: none;
      background-color: none;
   }

   .smallText:hover {
      color: #7c4758;
      font-weight: 600;
   }

   .dropdown-item.active {
      background-color: #b2f4d8;
      color: #2d2d2d;
   }
</style>
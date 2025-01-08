<template>
   <div class="py-4 container-fluid">
      <div class="row" @keydown="keyEventHandler($event)">
         <div class="col-12">
         <div class="card">
            <div class="card-header bg-light p-5">
               
               <!-- //& 거래처명으로 검색하기 -->
               <div class="d-flex justify-content-center align-items-center mb-3">
                  <div class="col-lg-1 text-left fw-bolder">거래처명</div>
                  <div class="col-lg-7 searchInputBox">
                     <!-- 입력 필드 -->
                     <div class="input-group">
                        <input type="text" class="form-control" v-model="actKeyword" autocomplete="off" @input="inputChange" placeholder="거래처명을 입력하세요"/>
                        <button type="button" id="button-addon3" @click="accountModalOpen" class="btn btn-warning">
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
                  <div class="col-lg-1 text-left fw-bolder">입고일자</div>
                  <div class="col-6 col-lg-3">
                     <input class="form-control" type="date" :max="lastDt" v-model="startDt" />
                  </div>
                  <div class="col-6 col-lg-1 text-center fw-bolder">~</div>
                  <div class="col-6 col-lg-3">
                     <input class="form-control" type="date" :min="startDt" v-model="lastDt" />
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
                           :value="data.comm_dtl_nm"                                        
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
                           checked="checked"
                        >
                        <label class="form-check-label text-start font_13px m-0">전체</label>
                     </div>
                     <div style="width: 14%;" v-for="(data, idx) in materialCategory" :key="idx">
                        <input 
                           class="form-check-input text-left" 
                           type="radio" 
                           :name="materialCategory"
                           :value="data.comm_dtl_nm" 
                           v-model="selectedCategory"
                        >
                        <label class="form-check-label text-start m-0 font_13px" :for="'radioCategory' + data.comm_dtl_cd">
                           {{ data.comm_dtl_nm }}
                        </label> 
                     </div>
                  </div>
               </div>

               <div class="d-flex justify-content-center align-items-center mt-3 text-center">
                  <button type="button" class="btn btn-warning m-2" @click="searchFilterFunc">
                     <i class="fa-solid fa-magnifying-glass"></i>
                  </button>
                  <button type="button" class="btn btn-secondary m-2" @click="resetBtnFunc">
                     <i class="fa-solid fa-rotate"></i>
                  </button>
               </div>
               
            </div>

            <div class="card-body p-4">
               <!-- <div class="alert alert-warning" role="alert">
                  A simple warning alert—check it out!
               </div> -->
               
               <!-- //& 거래처 모달창 -->
               <Layout :modalCheck="isAccModal">
                  <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
                     <h5 class="modal-title">거래처 조회</h5>
                     <button type="button" aria-label="Close" class="close" @click="accountModalOpen">×</button>
                  </template>
                  <template v-slot:default>
                     <ag-grid-vue
                        class="ag-theme-alpine"
                        style="width: 100%; height: 500px;"
                        :rowData="accountModalData"
                        :gridOptions="accountGridOptions"
                        @grid-ready="accountGrid"
                        @firstDataRendered="accountGridRendered"
                     />
                  </template>
                  <template v-slot:footer>
                     <div class="mx-auto">
                        <button type="button" class="btn btn-secondary m-1" @click="accountModalOpen">닫기</button>
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
                        style="width: 100%; height: 500px;"
                        :rowData="materialModalData"
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
                  :rowData="filterRowData"
                  :gridOptions="materialInOptions"
                  @grid-ready="materialInGrid"
                  @firstDataRendered="materialInGridRendered"
                  @grid-size-changed="onGridSizeChanged"
               />
               <div class="text-center mt-3 mb-2">
                  <button class="btn btn-outline-success" @click="excelDownload"><i class="fa-regular fa-file-excel"></i> EXCEL</button>
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

   import * as XLSX from 'xlsx'; // 엑셀
   import Layout from '../components/modalLayout.vue';   // modal Layout 불러오기
//! ---------------------------------------- 데이터 정의 ----------------------------------------
   // Vuex store 사용
   const store = useStore();

   const materialType = shallowRef([]);     // 자재 구분
   const materialCategory = shallowRef([]); // 자재 카테고리
   const materialArr = ref([]);             // 자재결과

   let isHidden = ref(true);                // 드롭다운 표시 여부 (true: 숨김, false: 표시)
   let isMatModal = ref(false);             // 모달 표시 여부 (true : 숨김, false : 표시)
   let isAccModal = ref(false);             // 모달 표시 여부 (true : 숨김, false : 표시)

   // 그리드 관련 ~
   let accountModalData = shallowRef([]);   // 거래처 검색 모달
   let materialModalData = shallowRef([]);  // 자재 검색 모달
   let materialInData = shallowRef([]);

   let accountGridRendered = ref(null);     // 거래처 그리드
   let materialGridRendered = ref(null);    // 자재 그리드
   let materialInGridRendered = ref(null);

//! ---------------------------------------- Vue Hook ----------------------------------------
   // created와 비슷~~
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '자재 입고 조회' });  // 페이지 제목 설정
      getCategory();  // 카테고리
      getType();      // 자재유형 

      getMaterialInList(); // 자재 재고 조회
   });
   
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
      
      getAccountList();   // 거래처 리스트

      if (accountGridRendered.value) {
         accountGridRendered.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };

//! ----------------------------------- Event Handler -----------------------------------
   // 드롭다운 박스에 버튼 클릭 시 input에 입력 & 모달창 자재 클릭시 검색창에 입력
   const onClickMatNm = (params, code, name, ) => {
      isHidden.value = true;       // 드롭다운 숨김

      if(params != null) {
         actKeyword.value = params.data.mat_nm;
         materialModalOpen(); // 자재조회 모달
      }

      if(code || name) {
         actKeyword.value = name;   // 자재명
      }
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
               elementBtns[selectedIndex.value].focus(); // 지금 선택된 배열에 포커스잡기
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
               actKeyword.value = document.activeElement.innerText;
            }
            break;
         }
      }
   };

   // 동적 검색 조건 
   let selectedType = ref('');              // 선택된 자재 구분
   let selectedCategory = ref('');          // 선택된 카테고리

   let startDt = ref('');                   // 시작 날짜
   let lastDt = ref('');                    // 종료 날짜
   let actKeyword = ref('');                // 거래처명
   let matKeyword = ref('');                // 자재명

   let filterRowData = ref([]);            // 필터한 데이터 담을곳

   const searchFilterFunc = () => {
      let start_dt =  new Date(startDt.value).setHours(0, 0, 0, 0);
      let last_dt =  new Date(lastDt.value).setHours(0, 0, 0, 0);
      console.log(selectedType.value)
      filterRowData.value = materialInData.value.filter((data) => {
         let newDate =  new Date(data.mat_int_dt).setHours(0, 0, 0, 0);
         
         return (
            data.act_nm &&(!actKeyword.value || data.act_nm.includes(actKeyword.value)) &&
            data.mat_cd && (!matKeyword.value || data.mat_cd.includes(matKeyword.value)) &&
            (!start_dt || newDate >= start_dt) && (!last_dt || newDate <= last_dt) &&
            (!selectedType.value || data.type == selectedType.value) && 
            (!selectedCategory.value || data.category == selectedCategory.value)
         )

      });
   }

   const resetBtnFunc = () => {
      startDt.value = ''      // 시작 날짜
      lastDt.value = ''       // 종료 날짜
      actKeyword.value = ''   // 거래처명
      matKeyword.value = ''   // 자재명

      filterRowData.value = materialInData.value;
   } 
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
         const result = await axios.get('/api/comm/material');
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
         const result = await axios.get('/api/comm/account', { params : { 'act_type' : String('E01').trim() } });// TODO 매입처 조건 추가하기
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

   // 자재 재고조회
   const getMaterialInList = async () => {
      try {
         const result = await axios.get('/api/material/in' );
         materialInData.value = result.data || [];
         filterRowData.value = materialInData.value
         
      } catch (err) {
         materialInData.value = [];
         
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

//! ---------------------------------------- Ag Grid ----------------------------------------   
   // 거래처 그리드
   const accountGrid = (params) =>{
      accountGridRendered.value = params.api; // API 객체 저장

      params.api.sizeColumnsToFit();
   };
   // 자재 그리드
   const materialGrid = (params) =>{
      materialGridRendered.value = params.api; // API 객체 저장

      params.api.sizeColumnsToFit();
   };
   // 자재 입고조회 그리드
   const materialInGrid = (params) =>{
      materialInGridRendered.value = params.api; // API 객체 저장

      params.api.sizeColumnsToFit();
   };
   // 창이 변할 때 그리드 크기도 변함
   const onGridSizeChanged = (params) => {
      params.api.sizeColumnsToFit
   }

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
         if (!event.data) {
            Swal.fire({
               icon: "warning",
               title: "data가 정의되지 않았습니다.",
            });
            return;
         }
         actKeyword.value = event.data.act_nm
         accountModalOpen(); // 자재조회 모달
      },
      
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
   }

   // 자재 데이터
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
         matKeyword.value = event.data.mat_nm
         materialModalOpen(); // 자재조회 모달
      },
      
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
   }

   // 자재 입고 데이터
   const materialInOptions = {
      columnDefs : [
         {
            headerName: '발주서코드',
            field: 'mat_order_cd',
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
            },
         },
         { 
            headerName: '자재명', 
            field: 'mat_cd',
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
            },
         },
         {
            headerName: '발주 수량',
            field: 'ord_mat_qty',
            cellClass: "text-right",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
            },
         },
         {
            headerName: '입고 수량',
            field: 'mat_qty',
            cellClass: "text-right",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
            },
         },
         {
            headerName: '단위',
            field: 'unit',
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
            },
         },
         {
            headerName: '자재구분',
            field: 'type',
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
            },
         },
         {
            headerName: '카테고리',
            field: 'category',
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
            },
         },
         {
            headerName: '유통기한',
            field: 'exp_dt',
            cellClass: "text-center",
            cellRenderer: (params) => {
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
            headerName: '입고일자',
            field: 'mat_int_dt',
            cellClass: "text-center",
            cellRenderer: (params) => {
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
            headerName: '거래처명',
            field: 'act_nm',
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? params.value : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
            },
         },
      ],
      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
      // row에 규칙추가
      rowClassRules: {
         'rowRedStyle': (params) => {
            if (params.data.mat_qty) { // 부족 수량이 있으면 ~~
               return params.data.ord_mat_qty > params.data.mat_qty; // 부족수량이 0 이하일 때 조건 적용하기!
            }
            return false;
         },
      },

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
   }

   const excelDownload = () => {

      const header = materialInOptions.columnDefs.map((col) => col.headerName);
      const data = filterRowData.value.map((row) =>
         materialInOptions.columnDefs.map((col) => {
            return row[col.field] || '데이터없음';
         })
      );

      // WorkSheet 생성
      const workSheet = XLSX.utils.aoa_to_sheet([header, ...data]);

      // WorkBook 생성
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, '자재 데이터');

      // 엑셀 파일 다운로드
      XLSX.writeFile(workBook, `자재_입고_${new Date().toISOString().slice(0, 10)}.xlsx`);
   };
</script>

<style lang="scss" scoped>
   .text-center {
      text-align: center;
   }
   .text-right {
      text-align: right;
   }

   .rowRedStyle {
      background-color: rgb(253, 211, 211) !important; /* 셀 배경 빨간색 */
      color: rgb(59, 59, 59) !important; /* 텍스트 흰색으로 변경 */
   }
</style>
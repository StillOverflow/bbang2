<template>
   <div id="page-inner" class="mx-auto">
      <div class="container-fluid">
         <div class="card">
            <!-- //! 생산 완료된 지시서 조회 -->
            <div class="card-body p-4">
               <div class="row" @keydown="keyEventHandler($event)">
                  <div class="col-3">
                     <div class="row">
                        <div class="text-left mb-4">
                           <h5 class="mb-0">생산 중 & 완료된 지시서 조회</h5>
                        </div>
                     </div>
                     
                     <div class="row">
                        <div style="margin-bottom: 65px" class="d-flex justify-content-left align-items-center" >
                           <div style="width: 200%" class="text-left fw-bolder font_15px">작업일자</div>
                           <div style="width: 80%" class="d-flex justify-content-left align-items-center text-left">
                              <div style="width: 45%">
                                 <input class="form-control" type="datetime-local" :max="endDt" v-model="startDt" @change="onChangeSearchDate"/>
                              </div>
                              <div style="width: 10%" class="text-center fw-bolder">~</div>
                              <div style="width: 45%">
                                 <input class="form-control" type="datetime-local" :min="startDt" v-model="endDt" @change="onChangeSearchDate"/>
                              </div>
                           </div>
                        </div>
                        <div class="col">
                           <div class="d-flex justify-content-left align-items-center mb-3">
                              <div class="text-left fw-bolder font_15px" style="width: 20%;">진행상태</div>
                              <div class="form-check d-flex justify-content-between align-items-center" style="width: 80%;">
                                 <div style="width: 25%;">
                                    <input 
                                       class="form-check-input text-left"
                                       type="radio"
                                       name="produceStatus"
                                       value=""
                                       v-model="selectedStatus"
                                       @change="radioStatusChange($event)"
                                       checked="checked"
                                    />
                                    <label class="form-check-label m-0 text-start font_13px">전체</label>
                                 </div>
                                 <div style="width: 25%;" v-for="(data, idx) in produceStatus" :key="idx">
                                    <input 
                                       class="form-check-input text-left" 
                                       type="radio"
                                       name="produceStatus"
                                       :value="data.comm_dtl_cd" 
                                       v-model="selectedStatus"
                                       @change="radioStatusChange($event)"
                                    />
                                    <label class="form-check-label m-0 text-start font_13px" :for="'radio' + data.comm_dtl_cd">
                                       {{ data.comm_dtl_nm }}
                                    </label>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <ag-grid-vue 
                        class="ag-theme-alpine " 
                        style="width: 100%; height: 700px;"  
                        :rowData="instructionsData"
                        :gridOptions="instructionsOptions"
                        @grid-ready="instructionsGrid"
                        @firstDataRendered="instructionsGridRendered"
                     />
                  </div>
                  <div class="col-1 text-center">
                     <button class="btn btn-secondary btn-sm mt-7" @click="resetBtnFunc">초기화</button>
                  </div>

                  <!-- //! 자재 출고 내역 조회 Layout -->
                  <div class="col-8">
                     <Layout :modalCheck="isMatModal">
                        <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
                           <h5 class="modal-title">자재 조회</h5>
                           <button type="button" aria-label="Close" class="close" @click="materialModalOpen">×</button>
                        </template>
                        <template v-slot:default>
                           <ag-grid-vue
                              class="ag-theme-alpine"
                              style="width: 100%; height: 300px;"
                              :rowData="materialArr"
                              :gridOptions="materialModalOptions"
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

                     <div class="row">
                        <!-- 검색 박스 -->
                        <div class="row">
                           <div class="d-flex justify-content-between align-items-center mb-4">
                              <h5 class="mb-0 fw-bolder">지시서에 대한 자재 출고 내역</h5>
                              <small><span class="fw-bolder">"{{ instCode }}"</span>에 대한 자재 출고 내역</small>
                           </div>
                           <div class="d-flex justify-content-left align-items-center mb-3" style="width: 100%;">
                              <div class="text-left fw-bolder font_15px" style="width: 13%;">자재명</div>
                              <div class="searchInputBox" style="width: 87%;">
                                 <!-- 입력 필드 -->
                                 <div class="input-group">
                                    <input type="text" class="form-control" v-model="keyword" autocomplete="off" @input="inputChange" placeholder="자재명을 입력하세요"/>
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
                                          class="dropdown-item materialBtn font_15px" 
                                          :class="{ active: index === selectedIndex }" 
                                          :data-matCode="item.mat_cd"
                                          @click="onClickMatNm(null, item.mat_cd, item.mat_nm)"
                                       >
                                          {{ item.mat_nm }}
                                       </button>
                                    </div>
                                    <div v-else class="dropdown-item text-left fw-bolder" style="color: #2bce89">결과 없음</div>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <!-- 자재구분 -->
                        <div class="row">
                           <div class="d-flex justify-content-left align-items-center mb-3" style="width: 100%;">
                              <div class="text-left fw-bolder font_15px" style="width: 13%;">자재구분</div>
                              <div class="form-check d-flex justify-content-left align-items-center" style="width: 88%;">
                                 <div style="width: 14%;">
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
                                 <div style="width: 14%;" v-for="(data, idx) in materialType" :key="idx">
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
                        </div>
                           
                        <div class="row">
                           <div class="d-flex justify-content-left align-items-center text-left mb-3">
                              <div class="text-left fw-bolder font_15px" style="width: 13%;">카테고리</div>
                              <div class="form-check d-flex justify-content-left align-items-center" style="width: 88%;">
                                 <div style="width: 14%;">
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
                        </div>
                        
                        <ag-grid-vue
                           class="ag-theme-alpine"
                           style="width: 100%; height: 700px;"
                           :rowData="materialOutData"
                           :gridOptions="materialOutOptions"
                           @grid-ready="materialOutGrid"
                           @firstDataRendered="materialOutGridRendered"
                        />
                        <div class="mx-auto right">
                           <button class="btn btn-outline-success mlp10 mtp30" @click="excelDownload()"><i class="fa-regular fa-file-excel"></i> EXCEL</button>
                        </div>
                     </div>
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
   import Layout from '../components/modalLayout.vue';
   //import * as XLSX from 'xlsx';   // modal Layout 불러오기
   
//! ---------------------------------------- 데이터 정의 ----------------------------------------
   // Vuex store 사용
   const store = useStore();

   // 동적 검색 조건 
   const materialType = shallowRef([]);     // 자재 구분
   const materialCategory = shallowRef([]); // 자재 카테고리
   const materialArr = ref([]);             // 자재결과
   const produceStatus = ref([]);           // 생산 지시 진행여부

   let startDt = ref('');                   // 시작 날짜
   let endDt = ref('');                     // 종료 날짜
   let keyword = ref('');                   // 검색어

   let isHidden = ref(true);                // 드롭다운 표시 여부 (true: 숨김, false: 표시)
   let isMatModal = ref(false);             // 모달 표시 여부 (true : 표시, false : 숨김)

   let instCode = ref('');                  // 지시서 코드 저장
   
   let selectedType = ref('');              // 선택된 자재 구분
   let selectedCategory = ref('');          // 선택된 카테고리
   let selectedStatus = ref('');            // 선태된 진행상태

   const instructionsData = shallowRef([]);// 생산중 이거나 생산 완료된 지시서
   const materialOutData = shallowRef([]); // 출고 내역
//! ---------------------------------------- Vue Hook ----------------------------------------
   // created와 비슷~~
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '자재 출고 조회' });  // 페이지 제목 설정
      getCategory(); // 카테고리
      getType();     // 자재유형 
      getStatus();   // 생산지시 진행여부

      getProduceInstruction(); // 생산중 이거나 완료된 지시서 조회
      
   });

//! ---------------------------------------- Modal ----------------------------------------
   // 자재 검색 모달
   const materialModalOpen = () => {
      isMatModal.value = !isMatModal.value;
      
      getMaterial(keyword.value);   // 자재 리스트
   };

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

   // 진행상태 조회
   const getStatus = async () => {
      try {
         const result = await axios.get('/api/comm/codeList/PS');
         
         produceStatus.value = result.data.filter((data) => data.comm_dtl_nm != "진행전" && data.comm_dtl_cd != 'Z01' );
      } catch (err) {
         produceStatus.value = [];

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
         const result = await axios.get('/api/comm/material', { params : { 'mat_nm' : String(keyword).trim(), } });
         materialArr.value = result.data || [];
      } catch (err) {
         materialArr.value = [];

         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

   // 생산중 이거나 완료된 지시서 조회 instructionsOptions
   const getProduceInstruction = async () => {
      try {
         const result = await axios.get(`/api/material/produceInstruction`, { params : { 'startDt' : startDt.value, 'endDt' : endDt.value, 'status' : selectedStatus.value } });
         instructionsData.value = result.data || [];

         if(result.data.length > 0) {
            instCode.value = result.data[0].inst_cd || "";
            getMaterialOutForProduction(instCode.value);
         } else {
            instCode.value = "";
            getMaterialOutForProduction(instCode.value);
         }
         
      } catch (err) {
         instructionsData.value = [];
         
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   }

   // 지시건에 대한 자재 출고 내역
   const getMaterialOutForProduction = async (inst_cd) => {
      try {
         const result = await axios.get('/api/material/out', { params : { 'inst_cd' : String(instCode.value).trim() || inst_cd, 'category' : selectedCategory.value, 'type' : selectedType.value, 'mat_nm' : keyword.value } } )
         if(result.data.length > 0) {
            materialOutData.value = result.data;
         } else {
            materialOutData.value = [];
         }
      } catch (err) {
         materialOutData.value = [];
         
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   }
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

   // 날짜 검색
   const onChangeSearchDate = () => {
      if(startDt.value != '' && endDt.value != '') {
         getProduceInstruction();
      };
   }

   // radio Change 생산지시 상태
   const radioStatusChange = () => {
      getProduceInstruction();
   };
   // radio Change 자재 재고조회
   const radioMaterialChange = () => {
      getMaterialOutForProduction();
   };

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
   
   // 지시서 row 클릭 시
   const onClickInstructionsRow = (params) => {
      instCode.value = params.data.inst_cd || '';
      getMaterialOutForProduction();
   } 

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
               keyword.value = document.activeElement.innerText;
            }
            getMaterialOutForProduction();
            break;
         }
      }
   };

   const resetBtnFunc = () => {

   }

//! ---------------------------------------- Ag Grid ----------------------------------------
   const materialGridRendered = (params) => {
      params.api.sizeColumnsToFit();
   }
   const materialGrid = (params) => {
      params.api.sizeColumnsToFit();
   }
   
   const materialModalOptions = {
      columnDefs : [
         { 
            headerName: '자재코드', 
            field: 'mat_cd',
            cellClass: "text-center",
         },
         {
            headerName: '자재명',
            field: 'mat_nm',
            cellClass: "text-center",
         },
         {
            headerName: '단위',
            field: 'unit',
            cellClass: "text-center",
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

      onRowClicked : onClickMatNm,
      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
   }

   const instructionsGridRendered = (params) => {
      params.api.sizeColumnsToFit();
   }
   const instructionsGrid = (params) => {
      params.api.sizeColumnsToFit();
   }

   const instructionsOptions = {
      columnDefs : [
         { 
            headerName: '지시서 코드', 
            field: 'inst_cd',
            cellClass: "text-center",
         },
         {
            headerName: '작업일자',
            field: 'work_dt',
            cellClass: "text-center",
            cellRenderer: (params) => {
               const date = new Date(params.value);

               const formattedDate = date.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
               });

               return formattedDate; // DOM 노드 반환
            },
         },
         {
            headerName: '진행상태',
            field: 'statusName',
            cellClass: "text-center",
         },
      ],

      rowSelection: {
         mode:"singleRow",
         checkboxes: false,
         enableClickSelection: true,
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
      onRowClicked : onClickInstructionsRow,
      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
   }

   const materialOutGridRendered = (params) => {
      params.api.autoSizeAllColumns();
   };

   const materialOutOptions = {
      suppressRowTransform: true,   // 행 끄기 -> 이것을 해줘야 병합을 할 수 있음
      columnDefs : [
         { 
            headerName: '지시서 상세 코드', 
            field: 'inst_dtl_cd',
            cellClass: "text-center",
            rowSpan: (params) => {
               let rowSpanCache = {};
               const rowIndex = params.node.rowIndex;
               const instDtlCode = params.data.inst_dtl_cd;

               // 캐시에 값이 있으면 반환
               if (rowSpanCache[rowIndex] !== undefined) {
                  return rowSpanCache[rowIndex];
               }

               if (rowIndex > 0 && params.api.getDisplayedRowAtIndex(rowIndex - 1).data.inst_dtl_cd === instDtlCode) {
                  return 0; // 병합 내부 셀
               }

               let span = 1;
               for (let i = rowIndex + 1; i <= params.api.getLastDisplayedRowIndex(); i++) {
                  const nextRowNode = params.api.getDisplayedRowAtIndex(i);

                  if (nextRowNode && nextRowNode.data.inst_dtl_cd === instDtlCode) {
                        span++;
                  } else {
                        break;
                  }
               }
               rowSpanCache[rowIndex] = span;
               return span;
            },
            cellClassRules: {
               "cell-span": (params) => {
                  if (!params) {
                     return false;
                  }
                  return params.value !== undefined;
               },
            },
         },
         { 
            headerName: '공정 코드', 
            field: 'proc_cd',
            hide: true,
            cellClass: "text-center",
         },
         { 
            headerName: '공정명', 
            field: 'proc_nm',
            cellClass: "text-center",
         },
         { 
            headerName: '자재 코드', 
            field: 'mat_cd',
            cellClass: "text-center",
         },
         { 
            headerName: '자재명', 
            field: 'mat_nm',
            cellClass: "text-center",
         },
         { 
            headerName: '출고량', 
            field: 'mat_out_qty',
            cellClass: "text-right",
            cellRenderer: (params) => {
               return params.value ? params.value.toLocaleString() : "0";
            },
         },
         { 
            headerName: '단위', 
            field: 'unit',
            cellClass: "text-center",
         },
         {
            headerName: '출고날짜',
            field: 'mat_out_dt',
            cellClass: "text-center",
            cellRenderer: (params) => {
               if (!params.value) return "-"; // 값이 없을 경우 대체 값 표시

               const date = new Date(params.value);
               if (isNaN(date)) return "-"; // 날짜가 유효하지 않을 경우 대체 값 표시

               const formattedDate = date.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
               });

               return formattedDate; // DOM 노드 반환
            },
         },
         { 
            headerName: '카테고리', 
            field: 'category',
            hide : true,
            cellClass: "text-center",
         },
         { 
            headerName: '구분', 
            field: 'type',
            hide : true,
            cellClass: "text-center",
         },
         { 
            headerName: '자재 LOT', 
            field: 'mat_lot_cd',
            cellClass: "text-center",
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
      rowModelType: 'clientSide',
      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
   };

   // const excelDownload = () => {
   //    const formattedToday = dateFormatter(today.value);

   //    let selected = myApi.getSelectedNodes();
   //    const selectedData = selected.map(item => ({
   //       '계획서코드': item.data.PROD_PLAN_CD,
   //       '생산시작일': item.data.START_DT,
   //       '생산종료일': item.data.END_DT,
   //       '제품수량': item.data.DTL_QTY,
   //       '등록일': item.data.CREATE_DT
   //    }));

   //    const workBook = XLSX.utils.book_new();
   //    const workSheet = XLSX.utils.json_to_sheet(selectedData);
   //    XLSX.utils.book_append_sheet(workBook, workSheet, 'example');
   //    XLSX.writeFile(workBook, `생산계획서_${formattedToday}.xlsx`);
   // };

   // const searchOrder = async () => {
   //    const obj = {
   //    PROD_PLAN_CD: plan_cd.value,
   //    STATUS: selected_radio.value
   //    };
   //    try {
   //    const result = await axios.get('/api/plan', { params: obj });
   //    planData.value = result.data;
   //    } catch (err) {
   //    console.log(err);
   //    }
   // };
</script>

<style lang="scss">
   * {
      box-sizing: border-box;
   }
   .font_13px {
      font-size: 13px;
   }

   .font_15px {
      font-size: 15px;
   }

   .text-center {
      text-align: center;
   }
   .text-right {
      text-align: right;
   }
   .ag-header {
      .ag-header-cell-label {
         place-content: center;
      }
   }

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
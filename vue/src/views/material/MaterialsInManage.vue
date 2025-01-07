<template>
   <div class="py-4 container-fluid">
      <div class="row" @keydown="keyEventHandler($event)">
         <div class="col-12">
            <div class="card">
               <div class="card-header bg-light p-5">

                  <!-- //& 사원조회 모달창 -->
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

                  <!-- //& 자재명으로 검색하기 -->
                  <div class="d-flex justify-content-center align-items-center mb-3" style="width: 100%;">
                     <div class="col-lg-1 text-left fw-bolder">자재명</div>
                     <div class="col-lg-7 searchInputBox">
                        <!-- 입력 필드 -->
                        <div class="input-group">
                           <input type="text" class="form-control" v-model="searchKeyword" autocomplete="off" @input="onChange($event)" placeholder="자재명을 입력하세요"/>
                           <button type="button" id="button-addon3" @click="materialModalOpen" class="btn btn-warning">
                              <i class="fa-solid fa-magnifying-glass"></i>
                           </button>
                        </div>

                        <!-- 드롭다운 리스트 -->
                        <div v-if="!isHidden" class="dropdownBox">
                           <div v-if="searchResults.length">
                              <button 
                                 v-for="(item, index) in searchResults" 
                                 :key="index" 
                                 class="dropdown-item matResultList" 
                                 :class="{ active: index === selectedIndex }" 
                                 @click="onClickMatNm(item.mat_nm)"
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

                  <!-- 버튼박스 -->
                  <div class="d-flex justify-content-center align-items-center mt-4 text-center">
                     <button type="button" class="btn btn-warning me-2" @click="searchFilterFunc">
                        <i class="fa-solid fa-magnifying-glass"></i>
                     </button>
                     <button type="button" class="btn btn-secondary me-2" @click="resetBtnFunc">
                        <i class="fa-solid fa-rotate"></i>
                     </button>
                  </div>
               </div>
               <div class="card-body p-4">
                  <div class="alert alert-info" role="alert">
                     <i class="fa-solid fa-circle-info me-2"></i>
                     담당자는 더블클릭 시 수정이 가능합니다.
                  </div>
                  <ag-grid-vue
                     class="ag-theme-alpine"
                     style="width: 100%; height: 500px;"
                     :rowData="filterRowData"
                     :pagination="true"
                     :gridOptions="beforeInOptions"
                     @cellEditingStarted="cellEditingStartedEvent"
                     @cellEditingStopped="cellEditingStoppedEvent"
                     @grid-ready="beforeInGrid"
                     @first-data-rendered="beforeInGridRendered"
                     @grid-size-changed="onGridSizeChanged"
                  />
                  <div class="mt-4 mx-auto center">
                     <button type="button" class="btn btn-success btn-lg mx-auto" @click="saveBtnFunc">저장</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div class="mt-4 row">
         <div class="col-12">
         <p>ag grid들어가면댐 ~~</p>
         </div>
      </div>
   </div>
   
</template>

<script setup>
import { AgGridVue } from 'ag-grid-vue3';
   import axios from 'axios';
   import Swal from 'sweetalert2';

   import { useStore } from 'vuex';
   import { getCurrentInstance } from 'vue'; // 플러그인을 사용하는 경우 이것을 이용해서 접근해야함

   import { onBeforeMount, shallowRef, ref } from 'vue';

   import Layout from '../components/modalLayout.vue';   // modal Layout 불러오기
   import MemberDropdownEditor from '../components/MemberDropdownEditor.vue';

//! ---------------------------------------- 데이터 정의 ----------------------------------------
   // Vuex store 사용
   const store = useStore();
   const instance = getCurrentInstance();    // Vue 인스턴스 가져오기
   const userName = ref('');

   let isMemberModal = ref(false);           // 담당자 모달 (true: 숨김, false: 표시)
   let isMatModal = ref(false);              // 자재 검색 모달 열림여부

   // 그리드 관련 ~
   const beforeInData = shallowRef([]);      // 입고 대기목록 데이터 
   let beforeInGridRendered = ref(null);     // 입고 대기목록 그리드

   const memberModalData = shallowRef([]);   // 자재 모달 데이터
   let memberModalGridRendered = ref(null);  // 사원조회 그리드

   const materialModalData = shallowRef([]); // 자재 조회 모달
   let materialGridRendered = ref(null);     // 자재 조회 그리드

   // 검색~~
   let searchKeyword = ref('');  // 검색 키워드
   let isHidden = ref(true);     // 드롭다운 표시 여부 (true: 숨김, false: 표시)
   let searchResults = ref([]);  // 드롭다운 박스에 나타날 데이터(자재 검색 결과)
   let matName = ref('');        // 자재명

   let filterRowData = ref([]);            // 필터한 데이터 담을곳
   let startDt = ref('');                   // 시작 날짜
   let lastDt = ref('');                    // 종료 날짜
   const searchFilterFunc = () => {
      let start_dt =  new Date(startDt.value).setHours(0, 0, 0, 0);
      let last_dt =  new Date(lastDt.value).setHours(0, 0, 0, 0);

      filterRowData.value = beforeInData.value.filter((data) => {
         let newDate =  new Date(data.mat_int_dt).setHours(0, 0, 0, 0);
         
         return (
            data.mat_nm &&(!searchKeyword.value || data.mat_nm.includes(searchKeyword.value)) &&
            (!start_dt || newDate >= start_dt) && (!last_dt || newDate <= last_dt)
         )

      });
   }

   const resetBtnFunc = () => {
      startDt.value = ''      // 시작 날짜
      lastDt.value = ''       // 종료 날짜
      searchKeyword.value = ''   // 자재명

      filterRowData.value = beforeInData.value;
   } 

//! ---------------------------------------- Vue Hook ----------------------------------------
   // created와 비슷~~
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '자재 입고 관리' });  // 페이지 제목 설정

      getMaterialBeforeIn();  // 입고 대기목록 함수 실행
      userName.value = instance.proxy.$session.get('user_nm') || '';
   });

//! ---------------------------------------- axios 서버통신 ----------------------------------------
   // 입고 대기목록 
   const getMaterialBeforeIn = async () => {
      try {
         const result = await axios.get('/api/material/beforeIn');
         beforeInData.value = result.data || [];
         filterRowData.value = beforeInData.value;

      } catch (err) {
         beforeInData.value = [];

         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   }
   // 사원조회
   const getMember = async () => {
      try {
         const result = await axios.get(`/api/comm/member`, { params : {'dpt_cd' : 'DPT5' } })
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

    // 자재정보 가져오는 axios
   const getMaterial = async (keyword) => {
      try {
         const result = await axios.get('/api/comm/material', { params : { 'mat_nm' : String(keyword).trim() } });
         materialModalData.value = result.data;
         searchResults.value = result.data;

      } catch (err) {
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

   // 자재 입고 등록
   const insertMaterial = async (materialArr) => {
      try {
         // 서버에 데이터 전송
         const result = await axios.post('/api/material/in', materialArr);
         
         if(result.data.insertResults.length > 0) {
            Swal.fire({
               icon: 'success',
               title: '등록 성공',
               text: '자재 정보가 성공적으로 등록되었습니다.',
            });

            getMaterialBeforeIn();
         }
         // 요청 성공 처리
      } catch (err) {
         // 요청 실패 처리
         Swal.fire({
            icon: 'error',
            title: '등록 실패',
            text: '입고 처리 중 문제가 발생했습니다.',
         });
      }
   }

//! ------------------------------------------- Event Handler -------------------------------------------
   // 자재명 input값이 변할 때
   const onChange = () => {
      getMaterial(searchKeyword.value);
   };

   // 검색창 드롭다운박스 클릭시 input에 값 입력
   const onClickMatNm = (name) => {
      searchKeyword.value = name;  // 클릭한 항목의 이름을 검색어 필드에 설정
      isHidden.value = false;       // 드롭다운 숨김

      matName.value = name; // 자재명
   };

   // 날짜타입변환
   const convertDatetime = (isoString) => {
      const date = new Date(isoString);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
      const dd = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      const ss = String(date.getSeconds()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
   };

   const saveBtnFunc = () => {
      const materials = beforeInGridRendered.value.getSelectedRows();
      
      for (const data of materials) {
         if (!data.exp_dt) {
            Swal.fire({
               icon: 'warning',
               title: '유통기한을 입력하세요.',
            });
            return; // 함수 종료
         }
      }
      
      const newData = materials.map((item) => {
         let newDate = convertDatetime(item.exp_dt)
         return {
            exp_dt: newDate,
            id: item.id,
            mat_qty: item.pass_qty,
            mat_stock: item.pass_qty, // mat_stock에 pass_qty 값을 추가
            mat_order_cd: item.refer_cd, // refer_cd -> mat_order_cd
            mat_cd: item.target_cd, // target_cd -> mat_cd
            test_rec_cd: item.test_rec_cd,
         };
      });

      if(materials.length > 0) {
         insertMaterial(newData); // 자재 입고잡기

      } else {
         Swal.fire({
            icon: 'warning',
            title: '선택된 행이 없습니다.',
         });
      }
      
   }

   let selectedIndex = ref(-1);
   // keydown & keyup 이벤트 : 방향키 위, 아래 및 엔터
   const keyEventHandler = (event) => {
      let elementBtns = document.querySelectorAll(".matResultList");
      if(isHidden.value) return;
      switch (event.key) {
         case 'ArrowDown' :
            if(event.isComposing) return; // 한글 끝부분 2개씩 입력막기
            event.preventDefault();       // 스크롤 이벤트 막기

            if (elementBtns.length > 0) {
               selectedIndex.value = (selectedIndex.value + 1) % elementBtns.length; // 순환
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
            if (!isHidden.value) {
               isHidden.value = true; // 드롭다운 닫기
            }

            if(isMemberModal.value) {
               isMemberModal.value = !isMemberModal.value
            }

            if(isMatModal.value) {
               isMatModal.value = !isMatModal.value
            }
         break;

         case "Enter" :
            if (document.activeElement) {
               matName.value = document.activeElement.innerText;
            }
         break;
      }
   }

//! ------------------------------------------- Modal -------------------------------------------
   const memberModalOpen = (keyword) => {
      isMemberModal.value = !isMemberModal.value;

      getMember(keyword);

      if (memberModalGridRendered.value) {
         memberModalGridRendered.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   }

   // 자재 검색 모달
   const materialModalOpen = () => {
      isMatModal.value = !isMatModal.value;
      
      getMaterial(searchKeyword.value);   // 자재 리스트

      if (materialGridRendered.value) {
         materialGridRendered.value.sizeColumnsToFit(); // 저장된 API로 크기 조정
      }
   };

//! ---------------------------------------- Ag Grid ----------------------------------------
   const memberModalGrid = (params) => {
      memberModalGridRendered.value = params.api; // API 객체 저장

      params.api.sizeColumnsToFit();
   };

   const materialGrid = (params) =>{
      materialGridRendered.value = params.api; // API 객체 저장

      params.api.sizeColumnsToFit();
   };

   // 입고 대기목록
   const beforeInGrid = (params) =>{
      beforeInGridRendered.value = params.api; // API 객체 저장

      params.api.sizeColumnsToFit();
   };

   // 창이 변할 때 그리드 크기도 변함
   const onGridSizeChanged = (params) => {
      params.api.sizeColumnsToFit
   }

   // 편집이 시작될 때 자동 포커스 잡기(포커스 인 시점)
   const cellEditingStartedEvent = (params) => {
      params.api.setFocusedCell(params.rowIndex, params.column.colId);  // setFocusedCell -> 자동으로 포커스 잡아줌
   }

   // 편집이 끝날 때 (포커스 아웃 시점)
   const cellEditingStoppedEvent = (params) => {
      if(!params.newValue) return; // 값이 없을 때 편집이 종료되면 return;

      // 커스텀한 셀 편집기에서 사원정보 가져와서 셀에 뿌려주기
      if(params.colDef.field == 'id' && params.newValue.name != null) {
         
         params.node.setDataValue("id", params.newValue.name);
      }
      
      // 모달 -> 사원 정보를 편집이 종료되는 시점에 셀에 뿌려주기
      if(member_name.value) {
         params.node.setDataValue("id", member_name.value);
      }
   }

   // ? 사원정보 그리드 Options
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
         beforeInGridRendered.value.stopEditing();  // 편집 종료
         memberModalOpen();  // 거래처 조회 모달
      },
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

         searchKeyword.value = event.data.mat_nm;
         materialModalOpen(); // 자재조회 모달
      },
      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
   }

   let clickedGrid = ref(null);
   const beforeInGridRowClick = (event) => {
     clickedGrid.value = event; // RowNode만 저장
   };
   
   // ? 자재 대기목록 그리드 Options
   const beforeInOptions = {
      columnDefs : [
         { 
            headerName: '검사내역코드', 
            field: 'test_rec_cd',
            cellClass: "text-center",
            hide: true,
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? `<span style="color: #000; font-size: 17px">${params.value}</span>` : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
            },
         },
         { 
            headerName: '발주서 번호', 
            field: 'refer_cd',
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? `<span style="color: #000; font-size: 14px">${params.value}</span>` : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
            },
         },
         {
            headerName: '자재코드',
            field: 'target_cd',
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? `<span style="color: #000; font-size: 14px">${params.value}</span>` : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
            },
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
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? `<span style="color: #000; font-size: 14px">${params.value}</span>` : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
            },
         },
         {
            headerName: '구분',
            field: 'type',
            cellClass: "text-center",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               return params.value ? `<span style="color: #000; font-size: 14px">${params.value}</span>` : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
            },
         },
         {
            headerName: '수량',
            field: 'pass_qty',
            cellClass: "text-right",
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               if(params.value) {
                  const number = params.value;

                  const formattedNumber = new Intl.NumberFormat("ko-KR", {
                     style: "decimal",
                     maximumFractionDigits: 2, // 최대 소수점 2자리
                  }).format(number);

                  return formattedNumber; // DOM 노드 반환
               } else {
                  return params.value ? `<span style="color: #000; font-size: 14px">${params.value}</span>` : `<span style="color: #cacaca; font-size: 11px">데이터없음</span>`;
               }
            },
         },
         { 
            headerName: '유통기한', 
            field: 'exp_dt', 
            sortable: true,
            cellClass: "text-center",
            editable: true,   // 편집 가능
            cellDataType: "date",   // Date 타입
            cellEditor: "agDateCellEditor",
            cellEditorParams: {
               min: new Date(),     // 오늘부터 선택 가능
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
            headerName: '담당자', 
            field: 'id', 
            sortable: true,
            cellClass: "text-center",
            editable: true,   // 편집 가능
            cellEditor : MemberDropdownEditor,  // 커스텀 드롭다운 셀 에디터
            cellEditorParams: {
               isModal: {
                  openModal: memberModalOpen, // 컴포넌트로 함수 전달
               },
            },
            cellRenderer: (params) => {
               // 렌더링 시 값이 없을 경우 표시
               if(params.value != undefined && params.value != '') {
                  return `<span style="color: #000; font-size: 13px">${params.value}</span>`
               } else {
                  return `<span style="color: #000; font-size: 13px">${userName.value}</span>`;
               }
            },
            valueSetter: (params) => {
               const newValue = params.newValue || instance.proxy.$session.get('user_nm'); // 세션 값을 기본값으로 설정
               if (newValue) {
                  params.data.id = newValue; // 값 설정

                  return true; // 성공 반환
               }
               return false; // 변경 실패
            },
         },
      ],
      overlayNoRowsTemplate: `<div style="color: red; text-align: center; font-size: 13px;">데이터가 없습니다.</div>`, // 데이터 없음 메시지
      // row에 규칙추가
      
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      animateRows: false,
      defaultColDef: {
         filter: false,
         flex: 1,
         minWidth: 10,
      },
      rowSelection: {
         mode: "multiRow", // 체크박스 다중선택
      },
      suppressMovableColumns: true, // 컬럼 드래그 이동 방지
      onRowClicked: beforeInGridRowClick,
   }

</script>

<style lang="scss" scoped>
</style>
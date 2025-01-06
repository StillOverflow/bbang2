<template>
    <div>
        <!-- 조회대상 자재/제품/공정 -->
        <div class="row mb-3">
          <h6 class="col-2 col-xxl-1 mb-2 d-flex justify-content-center" :style="t_overflow">대상유형</h6>
          <div class="form-check col-10 d-flex">
            <div>
              <input class="form-check-input ms-1" type="radio" v-model="selected_radio" :value="null" :id="'radioNull'"
                @change="changeDivs()">
              <label class="form-check-label ms-1 me-3 text-start" :for="'radioNull'">
                전체
              </label>
            </div>
            <div v-for="(opt, idx) in radios" :key="idx">
              <input class="form-check-input ms-1" type="radio" v-model="selected_radio" :value="opt.item" :id="'radio' + opt.item"
               @change="changeDivs()">
              <label class="form-check-label ms-1 me-3 text-start" :for="'radio' + opt.item">
                {{opt.name}}
              </label>
            </div>
          </div>
        </div>
    
        <!-- 구분/카테고리/모달 조회조건 선택 -->
        <div class="row">
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">대상분류</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <select class="form-select" v-model="selected_div" :disabled="noCate">
              <option :value="null">전체</option>
              <option v-for="(opt, idx) in divs" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">카테고리</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <select class="form-select" v-model="selected_cate" :disabled="noCate">
              <option :value="null">전체</option>
              <option v-for="(opt, idx) in cates" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">대상선택</h6>
          <div class="col-10 col-lg-4 col-xxl-2 d-flex">
            <div class="input-group">
              <input type="search" class="form-control" v-model="modal_val.nm" style="height: 41px;">
              <button class="btn btn-warning mb-2" @click="modalToggle"><i class="fa-solid fa-magnifying-glass"></i></button>
            </div>
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">대상코드</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <input type="text" class="form-control" v-model="modal_val.cd" readonly>
          </div>
        </div>

        <ModalLayout :modalCheck="isModal">
            <template v-slot:header>
            <h5>{{ modalTitle }}</h5>
            <button type="button" aria-label="Close" class="close" @click="modalToggle">×</button>
            </template>
            <template v-slot:default>
            <ag-grid-vue class="ag-theme-alpine" :style="g_height" :columnDefs="modalDefs" :rowData="modalData" 
                :gridOptions="gridOptions" :rowSelection="false" @rowClicked="modalSelect"/>
            </template>
            <template v-slot:footer> <!-- 아무것도 안 넣으면 기본 버튼이 표시됨. -->
            <button type="button" class="btn btn-secondary" @click="modalToggle">닫기</button>
            </template>
        </ModalLayout>
    </div>
</template>

<script>
  import { AgGridVue } from "ag-grid-vue3";
  import axios from "axios";
  import ModalLayout from "../../views/components/modalLayout.vue";

  export default {
    name: 'SelectTarget',
    props: {
      modalDefs: Array, // SEARCH 버튼 클릭했을 때 모달에 띄울 컬럼 지정
      modalTitle: String // 모달의 제목 지정
    },
    components: { 
      AgGridVue, // grid API
      ModalLayout
    },
    data() {
      return {
        // 스타일 바인딩
        t_overflow: {whiteSpace: 'nowrap'},
        t_break: {wordBreak: 'keep-all'},
        g_height: {height: '520px'},

        // 검색조건 전용 값
        selected_radio: null,
        radios: [],
        selected_div: null,
        divs: [],
        noCate: false, // 공정은 카테고리가 없으므로 비활성화용
        selected_cate: null,
        cates: [],

        // 모달 내부 grid API 데이터 (Defs: thead 구성, Data: tbody 구성)
        isModal: false, // 토글기능
        
        // modalDefs: [ // 컴포넌트로 빼기 위해 props로 이동했음.
        //   { headerName: '유형', field: 'type', width: 70 },
        //   { headerName: '구분', field: 'cate_type', width: 80 },
        //   { headerName: '카테고리', field: 'category', width: 90 },
        //   { headerName: '코드', field: 'cd', width: 80 },
        //   { headerName: '이름', field: 'nm', width: 126 },
        //   { headerName: '등록현황', 
        //     field: 'has_std', 
        //     cellClassRules: {
        //       'textRed': params => params.value == '미등록',
        //       'textGreen': params => params.value == '등록완료'
        //     },
        //     width: 100 },
        //   { headerName: '마지막 등록일', field: 'std_date', width: 120, valueFormatter: this.$comm.dateFormatter_returnNull}
        // ],
        modalData: [],
        modal_val: { // 선택된 값
          nm: null,
          cd: null
        },

        gridOptions: {
          defaultColDef: {
            cellClass: 'text-overflow'
          },
          pagination: true,
          paginationAutoPageSize: true,
          overlayNoRowsTemplate: '표시할 항목이 없습니다.', // 표시할 행이 없을 때 적용할 메세지
          suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        },
      }
    },
    
    created(){
      this.getCondition('QT', 'radio');
    },
    
    methods: {
      // 공통코드 기반으로 검색조건 표시하기
      async getCondition(cd, type){ 
        let types = [this.radios, this.divs, this.cates]; // 검색조건으로 들어갈 각각의 input을 배열로 임시저장
        let typesNo = null;
        let arr = await this.$comm.getComm(cd); // 공통코드 axios.get

        switch(type){
          case 'radio' : typesNo = 0; break;
          case 'divs' : typesNo = 1; break;
          case 'cate' : typesNo = 2; break;
        };
        
        types[typesNo].length = 0; // 실행할 때마다 값이 중복되지 않게 비우고 push
        for(let i = 0; i < arr.length; i++){
          types[typesNo].push({
            item : arr[i].comm_dtl_cd, // 공통코드
            name : arr[i].comm_dtl_nm // 표시할 한글명
          });
        };
      },

      // 대상구분 변경될 때 동작
      async changeDivs(modal){ // 모달에서 실행한 경우 매개변수를 넘겨받음 (선택된 값 초기화 방지)      
        await this.$emit('changeDivsMore');
        this.modal_val.cd = null;
        
        if(!modal){ // 매개변수가 없이 실행되면 선택된 div, cate도 모두 null로 초기화
          this.selected_div = null;
          this.selected_cate = null;
        }

        // 구분 및 카테고리 재호출
        switch(this.selected_radio){
          case 'P01' : // 자재 선택한 경우
            this.getCondition('MA', 'divs');
            this.getCondition('MC', 'cate'); 
            this.noCate = false; 
            break;
          case 'P02' :  // 공정중 선택한 경우
            this.noCate = true; // 구분 선택이 아예 없음.
            break;
          case 'P03' : // 제품 선택한 경우
            this.divs.length = 0;
            this.divs[0] = {item : 'I01', name : '완제품'};
            this.getCondition('PC', 'cate'); 
            this.noCate = false; 
            break;
        }
      },
      
      // ------------ 모달 메소드 ------------
      modalToggle(){
        this.isModal = !this.isModal;
        this.getModalList();
      },

      async getModalList(){
        // 조회대상(radio) 미선택 시 => 전체 조회
        // 조회대상(radio) 선택 시 => 선택한 대상 내에서 카테고리 조건 넣어 조회
        // ** 이름을 입력하면 유사한(LIKE) 이름으로 조회
        let params = { 
          type: this.selected_radio,
          cate_type: this.selected_div,
          cate: this.selected_cate,
          nm: this.modal_val.nm 
        };

        let result = await axios.get('/api/quality/targetAll', {params: params})
                                .catch(err => console.log(err));
        this.modalData = result.data;
        await this.$emit('getModalListMore');
      },
      
      async modalSelect(params){ // @rowClicked
        let selected = params.data;
        if(!this.selected_radio){ // 이름으로 검색만 하고 radio 선택 안 되어있으면 선택해줌
        let type = null;
        switch(selected.type){
          case '자재' : type = 'P01'; break;
          case '공정' : type = 'P02'; break;
          case '제품' : type = 'P03'; break;
        }
        this.selected_radio = type;
        await this.changeDivs('modal');
        }
        this.selected_div = selected.cate_type_cd;
        this.selected_cate = selected.category_cd;

        this.modal_val.cd = selected.cd;
        this.modal_val.nm = selected.nm;
        await this.$emit('modalSelectMore', selected);
        this.modalToggle();
      },
      // ---------- 모달 메소드 끝 -----------
    }
  }
</script>

<style>
  .text-overflow {
    white-space: nowrap;
    overflow: hidden;
  }
</style>
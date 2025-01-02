<!-- 품질 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card p-2 mb-3">
      <div class="card-header p-1 fw-bold text-center bg-success text-white fs-4">입고대기 내역</div>
      <div class="row justify-content-end me-2 mt-2">
        <h6 class="col-2 mb-2 d-flex align-items-center justify-content-end" :style="t_overflow">거래처명</h6>
        <div class="col-3 col-md-2 mb-2">
          <input type="text" class="form-control" v-model="actNm" readonly>
        </div>
        <button class="col-5 col-md-3 col-xxl-2 btn btn-warning h-75" @click="modalToggle">미입고 거래처 조회</button>
      </div>
      
      <!-- 목록 -->
      <ag-grid-vue class="ag-theme-alpine"  :columnDefs="defs" :rowData="rowData" style="height: 320px;"
        @grid-ready="gridFit" :gridOptions="gridOptions" :getRowStyle="getRowStyle" @rowClicked="selectTarget"/>
    </div>
    
    <div class="card">
      <div class="card-header bg-success p-1 text-white fw-bold text-center fs-4">검사결과 등록</div>
      <div class="card-body text-center" v-show="!isRowClicked">선택된 내역이 없습니다.</div>
      <div class="card-body pb-1 pe-0 pe-md-4" v-show="isRowClicked">
        <quality-test-box :isWaitList="true" :isMatTest="true" :selectedTarget="selectedTarget" ref="testBox" @afterInsert="afterInsert" />
      </div>
    </div>

    <!-- 거래처 선택 모달 -->
    <ModalLayout :modalCheck="isModal">
        <template v-slot:header>
        <h5>거래처 선택</h5>
        <button type="button" aria-label="Close" class="close" @click="modalToggle">×</button>
        </template>
        <template v-slot:default>
        <ag-grid-vue class="ag-theme-alpine" style="height: 320px" :columnDefs="modalDefs" :rowData="modalData" 
            :gridOptions="gridOptions" @rowClicked="modalSelect"/>
        </template>
        <template v-slot:footer> <!-- 아무것도 안 넣으면 기본 버튼이 표시됨. -->
        <button type="button" class="btn btn-secondary" @click="modalToggle">CLOSE</button>
        </template>
    </ModalLayout>

  </div>
</template>

<script>
  import { AgGridVue } from "ag-grid-vue3";
  import axios from "axios";
  import QualityTestBox from "../../components/quality/QualityTestBox.vue";
  import ModalLayout from "../components/modalLayout.vue";

  export default {
    name: 'QualityMatTest',
    data() {
      return {
        // 스타일 바인딩
        t_overflow: {whiteSpace: 'nowrap'},

        // 모달 내부 grid API 데이터 (Defs: thead 구성, Data: tbody 구성)
        isModal: false, // 토글기능
        
        modalDefs: [
          { headerName: '코드', field: 'act_cd', width: 80 },
          { headerName: '거래처명', field: 'act_nm', width: 166 },
          { headerName: '대표', field: 'ceo_nm', width: 80 },
          { headerName: '연락처', field: 'act_tel', width: 120 },
          { headerName: '담당자', field: 'mgr_nm', width: 80 },
          { headerName: '담당자 연락처', field: 'mgr_tel', width: 140 }
        ],
        modalData: [],
        actNm: null,
        actCd: null,

        // 일반 grid API 데이터
        defs: [
          { headerName: '발주번호', field: 'refer_cd' },
          { headerName: '발주일자', field: 'create_dt', 
            valueFormatter: this.$comm.dateFormatter,
            minWidth: 145
          },
          { headerName: '발주번호', field: 'refer_cd' },
          { headerName: '발주담당자', field: 'name' },
          { headerName: '자재명', field: 'target_nm' },
          { headerName: '총발주량', field: 'order_qty', valueFormatter: this.$comm.currencyFormatter },
          { headerName: '미입고량', field: 'yet_qty', valueFormatter: this.$comm.currencyFormatter }
        ],
        rowData: [],

        gridOptions: {
          pagination: true,
          paginationAutoPageSize: true,
          overlayNoRowsTemplate: '표시할 항목이 없습니다.', // 표시할 행이 없을 때 적용할 메세지
          suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        },

        // 검사결과 입력에 필요한 데이터
        isRowClicked: false, // 기본값 false (표시 안 함)
        selectedTarget: {}, // 목록에서 선택한 대상
      }
    },

    components: { 
        AgGridVue, // grid API
        QualityTestBox,
        ModalLayout
    },

    created(){ 
      // 페이지 제목 저장
      this.$store.dispatch('breadCrumb', {title: '자재 입고검사'});

      this.getActList();
    },
    
    methods: {     
      gridFit(params){ // ag-grid @grid-ready 이벤트 발생 시마다 params로 접근해 가로스크롤 삭제
        params.api.sizeColumnsToFit();
      },

      // 미입고 거래처내역 불러오기
      async getActList(){
        let actResult = await axios.get('/api/quality/rec/wait/act')
                                    .catch(err => console.log(err));
        this.modalData = actResult.data;
      },

      // ------------ 모달 메소드 ------------
      modalToggle(){
        this.isModal = !this.isModal;
      },
      
      async modalSelect(params){ // @rowClicked
        this.actCd = params.data.act_cd;
        this.actNm = params.data.act_nm;
        await this.getWaitList(); // 모달에서 선택함과 동시에 거래처별 입고대기목록 불러오기
        this.isRowClicked = false;
        this.modalToggle();
      },
      // ---------- 모달 메소드 끝 -----------

      // 입고대기목록 불러오기
      async getWaitList(){
        let waitResult = await axios.get('/api/quality/rec/wait/mat/' + this.actCd)
                                    .catch(err => console.log(err));
        this.rowData = waitResult.data;
      },

      // 목록에서 타겟 선택 시 검사결과란에 정보 불러오기
      async selectTarget(params){
        let clicked = params.data;
        this.selectedTarget = clicked;
        params.api.redrawRows(); // 그리드 강제 새로고침 (getRowStyle()에서 적용한 행 스타일 즉시 반영)

        await this.$refs.testBox.loadTarget(clicked);
        
        this.isRowClicked = true; // 검사결과 창 open
      },
      
      // 그리드 속성으로 선택된 행 색깔 변경
      getRowStyle(params){
        if((params.data.mat_order_dtl_cd == this.selectedTarget.mat_order_dtl_cd)){
          return {backgroundColor: '#d6d6d6'}
        }
      },

      // qualityTestBox의 recInsert 메소드 성공 시 후처리
      afterInsert(target){
        // 입력완료한 내역은 목록에서 사라져야 함.
        // filter 메소드로 현재 입력한 것을 제외한 내역만 남김
        let newArr = this.rowData.filter(obj => obj.mat_order_dtl_cd != target.mat_order_dtl_cd);
        this.rowData = newArr; // 변경한 배열로 반영
        this.isRowClicked = false; // 결과 창 닫기
      }

    }
  };
</script>
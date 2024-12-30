<!-- 품질 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card p-2 mb-3">
      <div class="card-header p-1 fw-bold text-center bg-success text-white fs-4">검사대기 내역</div>

      <!-- 목록 -->
      <ag-grid-vue class="ag-theme-alpine"  :columnDefs="defs" :rowData="rowData" style="height: 320px;"
        @grid-ready="gridFit" :gridOptions="gridOptions" :getRowStyle="getRowStyle" @rowClicked="selectTarget"/>
    </div>
    
    <div class="card">
      <div class="card-header bg-success p-1 text-white fw-bold text-center fs-4">검사결과 등록</div>
      <div class="card-body text-center" v-show="!isRowClicked">선택된 내역이 없습니다.</div>
      <div class="card-body pb-1 pe-0 pe-md-4" v-show="isRowClicked">
        <quality-test-box :isWaitList="true" :selectedTarget="selectedTarget" ref="testBox" @afterInsert="afterInsert" />
      </div>
    </div>
  </div>
</template>

<script>
  import { AgGridVue } from "ag-grid-vue3";
  import axios from "axios";
  import QualityTestBox from "../../components/quality/QualityTestBox.vue";

  export default {
    name: 'QualityTest',
    data() {
      return {
        // 일반 grid API 데이터
        defs: [ // 그리드 표시 컬럼 변경
          { headerName: '생산번호', field: 'refer_cd' }, // 생산실적 번호
          { headerName: '생산일시', field: 'end_time', 
            valueFormatter: this.$comm.datetimeFormatter,
            minWidth: 145
          }, // 공정 완료된 일시
          { headerName: '제품코드', field: 'target_cd' },
          { headerName: '제품명', field: 'target_nm' },
          { headerName: '공정코드', field: 'proc_cd' },
          { headerName: '공정명', field: 'proc_nm' },
          { headerName: '생산량', field: 'total_qty', valueFormatter: this.$comm.currencyFormatter }
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
        QualityTestBox
    },

    created(){ 
      // 페이지 제목 저장
      this.$store.dispatch('breadCrumb', {title: '제품 품질검사'});

      this.getWaitList();
      this.isRowClicked = false;
    },
    
    methods: {     
      gridFit(params){ // ag-grid @grid-ready 이벤트 발생 시마다 params로 접근해 가로스크롤 삭제
        params.api.sizeColumnsToFit();
      },

      // 검사대기목록 불러오기
      async getWaitList(){
        let waitResult = await axios.get('/api/quality/rec/wait')
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
        if((params.data.refer_cd == this.selectedTarget.refer_cd)){
          return {backgroundColor: '#d6d6d6'}
        }
      },

      // qualityTestBox의 recInsert 메소드 성공 시 후처리
      afterInsert(target){
        // 입력완료한 내역은 목록에서 사라져야 함.
        // filter 메소드로 현재 입력한 것을 제외한 내역만 남김
        let newArr = this.rowData.filter(obj => obj.refer_cd != target.refer_cd);
        this.rowData = newArr; // 변경한 배열로 반영
        this.isRowClicked = false; // 결과 창 닫기
      }

    }
  };
</script>
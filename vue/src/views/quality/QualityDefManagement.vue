<!-- 품질 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card p-2 mb-3">
      <div class="card-header p-1 fw-bold text-center bg-success text-white fs-4">미처리 불량내역</div>

      <!-- 목록 -->
      <ag-grid-vue class="ag-theme-alpine"  :columnDefs="defs" :rowData="rowData" style="height: 320px;"
        @grid-ready="gridFit" :gridOptions="gridOptions" :getRowStyle="getRowStyle" @rowClicked="selectTarget"/>
    </div>

    <div class="card mb-3">
      <div class="card-header bg-success p-1 text-white fw-bold text-center fs-4">불량처리</div>
      <div class="card-body text-center" v-show="!isRowClicked">선택된 내역이 없습니다.</div>
      <div class="row card-body" v-show="isRowClicked">

        <h6 class="col-4 col-md-1 mb-2 d-flex align-items-center justify-content-center g-0" :style="t_break">처리방법</h6>
        <div class="form-check col-8 col-md-3 d-flex align-items-center justify-content-start">
          <input class="form-check-input ms-1 ms-xl-3" type="radio" v-model="def_status" value="재투입" id="defRepeat">
          <label class="form-check-label ms-2 me-xl-4 mt-2 text-start" for="defRepeat" :style="t_overflow">
            재투입
          </label>
          <input class="form-check-input ms-3" type="radio" v-model="def_status" value="폐기" id="defDispose">
          <label class="form-check-label ms-2 mt-2 text-start" for="defDispose" :style="t_overflow">
            폐기
          </label>
        </div>

        <h6 class="col-4 col-md-1 mb-2 d-flex align-items-center justify-content-center" :style="t_break">처리일시</h6>
        <div class="col-8 col-md-2 mb-2">
          <input type="datetime-local" class="form-control" v-model="complete_dt">
        </div>

        <h6 class="col-4 col-md-1 mb-2 d-flex align-items-center justify-content-center" :style="t_break">담당자</h6>
        <div class="col-5 col-md-2 mb-2">
          <select class="form-select" v-model="complete_id">
            <option :value="null" disabled hidden>선택</option>
            <option v-for="(mem) in members" :key="mem.id" :value="mem.id">{{ mem.name }}</option>
          </select>
        </div>

        <div class="col-3 col-md-2 text-end">
          <button class="btn btn-success" :style="t_overflow" @click="defUpdate">SAVE</button>
        </div>

      </div>
    </div>

    <div class="card" v-show="isRowClicked">
      <div class="card-header bg-success p-1 text-white fw-bold text-center fs-4">검사결과 조회</div>
      <div class="card-body pb-1 pe-0 pe-md-4">
        <quality-test-box :isWaitList="false" :selectedTarget="selectedTarget" ref="testBox"/>
      </div>
    </div>

  </div>
</template>

<script>
  import { AgGridVue } from "ag-grid-vue3";
  import axios from "axios";
  import QualityTestBox from "../../components/quality/QualityTestBox.vue";

  export default {
    name: 'QualityDefManagement',
    data() {
      return {
        // 일반 grid API 데이터
        defs: [ // 그리드 표시 컬럼 변경
          { headerName: '검사번호', field: 'test_rec_cd' },
          { headerName: '검사일시', field: 'test_dt', 
            valueFormatter: this.$comm.datetimeFormatter,
            minWidth: 145
          },
          { headerName: '참조번호', field: 'refer_cd' },
          { headerName: '제품명', field: 'target_nm' },
          { headerName: '공정명', field: 'proc_nm' },
          { headerName: '생산량', field: 'total_qty', valueFormatter: this.$comm.currencyFormatter },
          { headerName: '합격량', field: 'pass_qty', valueFormatter: this.$comm.currencyFormatter },
          { headerName: '불량양', field: 'def_qty', valueFormatter: this.$comm.currencyFormatter },
          { headerName: '불량명', field: 'def_nm' },
          { headerName: '담당자', field: 'name' }, // id => 이름으로 바꿔 조회한 결과
        ],
        rowData: [],

        gridOptions: {
          pagination: true,
          paginationAutoPageSize: true,
          overlayNoRowsTemplate: '표시할 항목이 없습니다.', // 표시할 행이 없을 때 적용할 메세지
          suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        },

        isRowClicked: false, // 기본값 false (표시 안 함)
        selectedTarget: {}, // 목록에서 선택한 대상
        members: [],

        // 불량 처리 입력에 필요한 데이터
        def_status: null,
        complete_dt: null,
        complete_id: null,
      }
    },

    components: { 
        AgGridVue, // grid API
        QualityTestBox
    },

    created(){ 
      // 페이지 제목 저장
      this.$store.dispatch('breadCrumb', {title: '미처리 불량관리'});

      this.getMembers();
      this.getDefList();
      this.isRowClicked = false;
    },
    
    methods: {     
      gridFit(params){ // ag-grid @grid-ready 이벤트 발생 시마다 params로 접근해 가로스크롤 삭제
        params.api.sizeColumnsToFit();
      },

      // 품질부서 사원목록 불러오기
      async getMembers(){
        this.members = await this.$comm.getMembers('DPT2');
      },

      // 미처리 불량내역 불러오기
      async getDefList(){
        let DefResult = await axios.get('/api/quality/rec', {params: {yetDefect: true}})
                                    .catch(err => console.log(err));
        this.rowData = DefResult.data;
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

      // 불량 처리 SAVE 버튼 동작
      async defUpdate(){
        ////////////// 입력값 유효성검사 해야함. 재투입 어떻게 처리할지 해야함.
        if(!this.def_status){
          this.$swal(
            '처리방법 미선택',
            `불량 처리방법이 선택되지 않았습니다.`,
            'warning'
          );
          return;
        } else if(!this.complete_dt){
          this.$swal(
            '처리일시 미입력',
            `처리일시가 입력되지 않았습니다.`,
            'warning'
          );
          return;
        } else if(!this.complete_id){
          this.$swal(
            '담당자 미선택',
            `검사 담당자가 선택되지 않았습니다.`,
            'warning'
          );
          return;
        }
        
        let valueObj = {
          def_status: this.def_status,
          complete_id: this.complete_id,
          complete_dt: this.complete_dt.replace('T', ' ') // DB 형식으로 맞춤
        };

        let result = await axios.put('/api/quality/rec/' + this.selectedTarget.test_rec_cd, valueObj)
                                .catch(err => console.log(err));

        if(result.data == 'success'){
          this.$swal(
            '등록완료',
            '불량내역이 처리되었습니다.',
            'success'
          );
          // 처리한 내역은 목록에서 사라져야 함.
          // filter 메소드로 현재 입력한 것을 제외한 내역만 남김
          let newArr = this.rowData.filter(obj => obj.test_rec_cd != this.selectedTarget.test_rec_cd);
          this.rowData = newArr; // 변경한 배열로 반영
          this.isRowClicked = false; // 결과 창 닫기
        } else {
          this.$swal(
            '오류발생',
            '불량내역을 처리하지 못했습니다.',
            'error'
          );
        }
      }

    }
  };
</script>
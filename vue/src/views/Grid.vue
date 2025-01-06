<!--ag-grid 테스트 뷰-->
<template>
  <div class="py-4 container-fluid">
    <div class="bg-white p-4">
      <div>
        <h4>그리드 사용법</h4>
        <div>
          <ag-grid-vue style="width:600px; height: 500px;" class="ag-theme-alpine" :columnDefs="columnDefs"
            :rowData="rowData" :gridOptions="gridOptions" @grid-ready="myGrid" @rowClicked="rowClicked">
          </ag-grid-vue>
          <button type="button" class="btn btn-light m-3" @click="getGridVal">선택된 값 콘솔로 확인하기</button>
        </div>
      </div>

      <hr>

      <h4>버튼 예시</h4>
      <button class="btn btn-primary">등록</button> <!-- 등록 -->
      <button class="btn btn-success mlp10">수정</button> <!-- 수정 -->
      <button class="btn btn-danger mlp10">삭제</button>
      <button class="btn btn-secondary mlp10">초기화</button>
      <button class="btn btn-outline-success mlp10" @click="excelDownload()"><i class="fa-regular fa-file-excel"></i> EXCEL</button>
      <div class="input-group mb-3 w-30">
        <input type="search" class="form-control" placeholder="코드를 검색해주세요" aria-label="코드를 검색해주세요" aria-describedby="button-addon2" style="height: 41px;">
        <button class="btn btn-warning" type="button" id="button-addon2">조회</button>
      </div>
      <div class="input-group mb-3 w-30">
        <input type="text" class="form-control" placeholder="코드를 검색해주세요" aria-label="Recipient's username" aria-describedby="button-addon2" style="height: 41px;">
        <button class="btn btn-warning" type="button" id="button-addon3">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      <!-----------------------경고창[S]------------------------->
      <!--안내-->
      <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
        <symbol id="check-circle-fill" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </symbol>
      </svg>    
      <div class="alert alert-primary d-flex align-items-center" role="alert">
        <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Info:"><use xlink:href="#info-fill"/></svg>
        <div>An example alert with an icon</div>
      </div>

      <!--체크-->
      <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
        <symbol id="info-fill" viewBox="0 0 16 16">
          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
        </symbol>
      </svg>
      <div class="alert alert-success d-flex align-items-center" role="alert">
        <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
        <div>An example success alert with an icon</div>
      </div>

      <!--주의-->
      <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
        <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </symbol>
      </svg>
      <div class="alert alert-warning d-flex align-items-center" role="alert">
        <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill"/></svg>
        <div>An example warning alert with an icon</div>
      </div>
      
      <!--경고/알림-->
      <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
        <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </symbol>
      </svg>
      <div class="alert alert-danger d-flex align-items-center" role="alert">
        <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
        <div>An example danger alert with an icon</div>
      </div>      
      <!-----------------------경고창[E]------------------------->

    </div>
  </div>
</template>

<script>
// 그리드 사용법
// AG-Grid 공식문서 : https://www.ag-grid.com/javascript-data-grid/row-selection-multi-row/
import { AgGridVue } from "ag-grid-vue3";
import * as XLSX from 'xlsx';

export default {
  name: 'App',
  data() {
    return {
      columnDefs: null,
      rowData: null,
      myApi: null,
      myColApi: null,

      gridOptions: {
        defaultColDef: {
          cellClass: 'text-overflow'
        },
        pagination: true,
        // paginationPageSize: 10, // 몇 행까지 표시할지 지정하고 싶은 경우
        // paginationPageSizeSelector: false,
        paginationAutoPageSize: true, // 표시할 수 있는 행을 자동으로 조절함.
        overlayNoRowsTemplate: '표시할 값이 없습니다.', // 표시할 행이 없을 때 적용할 메세지'
        suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        rowSelection: {
          mode: 'multiRow', // 하나만 선택하게 할 때는 singleRow
          // enableClickSelection: true // (행을 클릭하는 것만으로 singleRow 선택 가능.)
        },
      }
    }
  },
  components: {
    AgGridVue
  },
  beforeMount() {
    this.columnDefs = [
      { headerName: '품번', field: 'no' }, 
      { headerName: '이름', field: 'name', minWidth: 200},  // minWidth 옵션으로 각 열의 최소 너비 지정 가능
      { headerName: '가격', 
        field: 'price', 
        valueFormatter: this.$comm.currencyFormatter, // valueFormatter 천단위 콤마 포맷 함수
        cellClassRules: {
          'textGreen': params => params.value >= 30000
        },
      }, 
      { headerName: '등록일', field: 'date', valueFormatter: this.$comm.dateFormatter } // 날짜 포맷 함수
    ];

    this.rowData = [
      { no: 'MIL021', name: '신선한 Milk', price: 3500, date: this.$comm.getMyDay() },
      { no: 'MAC133', name: '맥모닝 세트', price: 8000, date: '2024-12-02' },
      { no: 'FRU452', name: '금사과', price: 72000, date: '2024-12-03' },
      { no: 'DOM56', name: '도미노 피자', price: 32000, date: '2024-12-04' }
    ];
  },
  methods: {
    myGrid(params) { // 매개변수 속성으로 자동 접근
      console.log(params); // params를 확인해보면 grid에서 쓸 수 있는 모든 메소드가 나옴. (유료버전 포함..)
      params.api.sizeColumnsToFit(); // 가로스크롤 삭제
      this.myApi = params.api; // 다중선택값 가져올 시 필요
      this.myColApi = params.columnApi; // api, columnApi 둘 다 꼭 있어야 함
    },
    getGridVal() {
      const val = this.myApi.getSelectedNodes();
      console.log(val);
      if (val.length != 0) { // data 속성에 접근할 시, 선택된 값이 없으면 오류남
        val.forEach((each => console.log(each.data)));
      }
    },
    rowClicked(params){ // 매개변수 속성으로 자동 접근
      this.$swal( // SweetAlert
        '클릭!',
        `행이 클릭되었습니다.
        <br>${params.data.name}를 클릭하셨네요.`,
        'info'
      );
      // this.myApi.exportDataAsCsv();
    },
    excelDownload() {
      var today = new Date();
      today = this.$comm.dateFormatter(today);
      let selected = null;

      selected = this.myApi.getSelectedNodes();
      const selectedData = selected.map(item => ({
            '품번': item.data.no,
            '이름': item.data.name,
            '가격': item.data.price,
            '등록일': item.data.date
        }));

        const workBook = XLSX.utils.book_new()
        const workSheet = XLSX.utils.json_to_sheet(selectedData)
        XLSX.utils.book_append_sheet(workBook, workSheet, 'example')
        XLSX.writeFile(workBook, `엑셀예시_${today}.xlsx`); 
    }
  }
}
</script>

<style lang="scss">
//그리드 사용시 아래 스타일 임포트 해야하고 경로 확인이 필요함
@import"../../node_modules/ag-grid-community/styles/ag-grid.css";
@import"../../node_modules/ag-grid-community/styles/ag-theme-alpine.css"
</style>

<style>
  .textGreen {
    color : rgb(13, 184, 13);
    font-weight: bold;
    text-align: left;
  }
  .text-overflow {
    white-space: nowrap;
    overflow: hidden;
  }
</style>
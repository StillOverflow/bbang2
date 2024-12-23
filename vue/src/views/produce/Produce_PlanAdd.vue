<!-- 생산 -->
<style>
.modal-container { width:700px; }
</style>

<template>
  <div class="py-4 container-fluid">
    <div class="card">      
      <div class="card-header bg-light ps-5 ps-md-4">
        <p class="text-uppercase text-lg font-weight-bolder">기본정보</p>
        <p for="example-text-input" class="text-sm font-weight-bolder">주문코드</p>
        <div class="row">
          <div class="input-group w-30">
            <input class="form-control" type="text" v-model="order_cd" placeholder="주문코드를 검색해주세요" style="height: 41px;">
            <button class="btn btn-warning" type="button" @click="modalOpen">SEARCH</button>
          </div>
        </div>

        <p for="example-text-input" class="text-sm font-weight-bolder">생산기간</p>
        <div class="row">
          <div class="col col-lg-2">
            <input class="form-control" type="date" v-model="START_DT">
          </div>
          <div class="col col-sm-1 text-center mt-2 fw-bolder" :style="t_overflow">~</div>         
          <div class="col col-lg-2">
            <input class="form-control" type="date" v-model="END_DT">
          </div>
        </div>
      </div>

       <!--검색모달[S]-->
        <Layout :modalCheck="isModal">
          <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
            <h5 class="modal-title">주문코드 검색</h5>
            <button type="button" aria-label="Close" class="close" @click="modalOpen">×</button>
          </template>
          <template v-slot:default>
            <ag-grid-vue class="ag-theme-alpine" 
            style="width: 100%; height: 400px;" 
            :columnDefs="orderDefs"
            :rowData="orderData" 
            @rowClicked="modalClicked" 
            @grid-ready="gridFit"
            overlayNoRowsTemplate="주문내역이 없습니다.">
            </ag-grid-vue>
          </template>
          <template v-slot:footer>
            <button type="button" class="btn btn-secondary" @click="modalOpen">Cancel</button>
            <button type="button" class="btn btn-primary" @click="modalOpen">OK</button>
          </template>
        </Layout>
      <!--검색모달[E]-->

      <div class="card-body">
        <div class="row">
          <div class="col-7 col-xl-6">
            <h4>제품목록</h4>
          </div>
          <div class="col-5 col-xl-6">
            <div class="row">
              <div class="col-12 col-md-7 col-xl-9">
                <h4>주문서 제품목록</h4>
              </div>
            </div>
          </div>
        </div>
  
        <div class="row mb-4">
          <div class="col-5">
            <ag-grid-vue class="ag-theme-alpine w-100" 
            style="width: 100%; height: 400px;"  
            :columnDefs="productDefs" 
            :rowData="productData" 
            :pagination="true" 
             @grid-ready="productGrid" 
             :gridOptions="gridOptions"
             overlayNoRowsTemplate="주문내역이 없습니다."/>
          </div>
          <div class="col-2 col-xl-1 d-flex flex-column align-items-center justify-content-center">
            <button class="btn btn-outline-primary"  @click="getSelected('plus')">
              <i class="fa-solid fa-plus" style="color: #0951ce;"></i>
            </button>
            <button class="btn btn-outline-danger" @click="getSelected()">
              <i class="fa-solid fa-minus" style="color: #fa0000;"></i>
            </button>
          </div>
          <div class="col-5 col-xl-6">
            
            <ag-grid-vue class="ag-theme-alpine w-100"  
            style="width: 100%; height: 400px;" 
            :columnDefs="orderDtlDefs" 
            :rowData="orderDtlData" 
            @grid-ready="orderDtlGrid" 
            :gridOptions="gridOptions"
            overlayNoRowsTemplate="주문내역이 없습니다."/>
          </div>
        </div>
  
        <div class="center mtp30">
          <button class="btn btn-primary" @click="planInsert">SUBMIT</button>
          <button class="btn btn-secondary mlp10" @click="resetForm">RESET</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
import Layout from '../components/modalLayout.vue';

export default {
  components: { 
    AgGridVue, 
    Layout
  },
  created() {
    this.$store.dispatch('breadCrumb', { title: '생산계획서 관리' });
  },
  computed : {
      orderDtlCount(){
          return this.orderDtlData.length;
      },

  },
  data() {
    return {
      isModal: false,

      //모달 계획서 목록 
      orderDefs: [
        { headerName: '주문서코드', field: 'order_cd', sortable: true, width: 120 },
        { headerName: '거래처코드', field: 'act_cd', sortable: true, width: 150  },
        { headerName: '거래처이름', field: 'act_nm', sortable: true, width: 150 },
        { headerName: '담당자', field: 'name', sortable: true, width: 100},
        { headerName: '주문일자', field: 'order_dt', valueFormatter: this.$comm.dateFormatter, width: 150 }
      ],
      orderData: [],

      //제품목록
      productDefs:[
        { headerName: '제품코드', field: 'PRD_CD', sortable: true, width:150 },
        { headerName: '제품명', field: 'PRD_NM', sortable: true },
        { headerName: '금액', field: 'PRICE', sortable: true, valueFormatter:this.$comm.currencyFormatter },
        { headerName: '현재고', field: 'IN_CNT', sortable: true, valueFormatter:this.$comm.currencyFormatter},
      ],
      productData:[],
      productApi: null,
      productColApi: null,

      //주문서 제품목록
      orderDtlDefs: [
        {headerName: '제품 코드', field: 'PRD_CD', width:150},
        {headerName: '제품 이름', field: 'PRD_NM'},
        {
            headerName: '제품 수량', 
            field: 'ORDER_QTY', 
            editable: true, 
            cellDataType: 'number',
            valueFormatter: (params) => {
                if (params.value == null || params.value === '') return '';
                return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
            },
            cellRenderer: this.placeholderRenderer, // Placeholder 기능 추가
        },
        {headerName: '현 재고', field: 'IN_CNT', valueFormatter:this.$comm.currencyFormatter},
      ],
      orderDtlData: [],
      orderDtlApi: null,
      orderDtlColApi: null,

      gridOptions: {
        pagination: true,
        paginationAutoPageSize: true, // 표시할 수 있는 행을 자동으로 조절함.
        suppressMovableColumns: true, // 컬럼 드래그 이동 방지
        rowSelection: { 
            mode: 'multiRow', // 하나만 선택하게 할 때는 singleRow
        }                                                  
      }

    };
  },
  mounted() {
    //제품목록
    axios.get('/api/product')
        .then(response =>{
            this.productData = response.data;
        })
        .catch(err => console.log("실패",err));           
  },  
  methods: {
    productGrid(params){ // '선택목록' @grid-ready 시 매개변수 속성으로 자동 접근
      params.api.sizeColumnsToFit();
      this.productApi = params.api;
      this.productColApi = params.columnApi;
    },
    orderDtlGrid(params){ // '적용가능목록' @grid-ready 시 매개변수 속성으로 자동 접근
      params.api.sizeColumnsToFit();
      this.orderDtlApi = params.api;
      this.orderDtlColApi = params.columnApi;
    },
      
    /*모달 [S]*/
    modalOpen() {
      this.isModal = !this.isModal;
      this.getOrderList();
    },
    modalClicked(params) {
      this.getOrderDtlList(params.data.order_cd);
      this.order_cd= params.data.order_cd;
      this.isModal = !this.isModal;
    },

    //주문서 리스트
     async getOrderList() {
      let result = await axios.get('/api/sales')
                              .catch(err => console.log(err));
      this.orderData = result.data;    
    },
    /*모달 [E]*/   
   

    //주문서 제품 리스트
    async getOrderDtlList(order_cd) {
      let result = await axios.get(`/api/product/${order_cd}/order`)
                              .catch(err => console.log(err));                              
      this.orderDtlData = result.data;
    },

    getSelected(type){ // 추가(+) / 삭제(-) 버튼 동작
      let selected = null;
      if(type == 'plus') selected = this.productApi.getSelectedNodes(); // 추가버튼일 시
      else selected = this.productApi.getSelectedNodes(); // 삭제버튼일 시

      if(selected.length != 0){ // 선택된 값이 있을 경우에만 실행
        // grid는 참조형식이라 개별값을 직접 조작할 수 없으므로 가상의 배열 선언
        let addArr = [];
        let changeArr = null;
        if(type == 'plus') changeArr = this.orderDtlData;
        else changeArr = this.productData;
        
        selected.forEach((val) => { // 선택된 값을 순회, 비교하며 배열에서 추가/삭제 실행
          addArr.push(val.data);
          changeArr = changeArr.filter(obj => obj.PRD_CD != val.data.PRD_CD); // 선택되지 않은 것만 남김
        });
        
        // 수정된 배열로 반영하기
        if(type == 'plus'){
          //this.productData = changeArr;
          this.orderDtlData = [...this.orderDtlData, ...addArr]; // 펼침연산자로 기존의 값에 추가함
        } else {
          this.orderDtlData = changeArr;
          this.productData = [...this.productData, ...addArr];
        }
      }
    },
    //지시서 등록
    async planInsert() {
      let rowQty = this.orderDtlData.filter(row => !row.ORDER_QTY || row.ORDER_QTY <= 0);
      
      if (!this.START_DT || !this.END_DT) {
          this.$swal({
              icon: "error",
              title: "시작일과 종료일을 입력하세요"
          });
          return;
      }else if (rowQty.length > 0) {
        this.$swal({
            icon: "error",
            title: "주문 수량을 입력하세요",
            text: "입력 후 엔터를 쳐주세요",
        });
        return;
      }
      let insertPlan = []; //생산지시서
      insertPlan.push({
        ORDER_CD: this.order_cd, 
        STATUS: 'Z01',
        START_DT: this.START_DT,
        END_DT: this.END_DT
      });
      let insertPrd = [];  //생산지시서 제품
      
      this.orderDtlData.forEach((obj) => {
        insertPrd.push({
          PRD_CD: obj.PRD_CD,
          PROD_PLAN_QTY: obj.ORDER_QTY
        });
      });

      let insertArr = [...insertPlan, insertPrd];

      let result = await axios.post('/api/plan', insertArr)
                 .catch(err => console.log(err));

      if(result.data == 'success'){
          this.$swal({
              icon: "success",
              title: "등록에 성공 하였습니다.",
              text: "등록한 계획서는 목록에서 확인 해주세요.",
          })
          .then(() => {
              this.resetForm();   //등록 후 값 초기화
          });          
      }
      return result;
    },
    //폼 초기화
    resetForm() {
      this.order_cd = '';
      this.START_DT = '';
      this.END_DT = '';
      this.productData = [];
      this.orderDtlData = [];      
    },

  }
  
};

</script>
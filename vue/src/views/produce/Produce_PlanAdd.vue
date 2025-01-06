<!-- 생산 -->
<template>
  <div class="py-4 container-fluid" @keydown.esc="modalCloseFunc">
    <div class="card">      
      <div class="card-header bg-light ps-5 ps-md-4">
        <p class="text-uppercase text-lg font-weight-bolder">기본정보</p>
        <p for="example-text-input" class="text-sm font-weight-bolder">주문코드</p>
        <div class="row">
          <div class="input-group w-30">
            <input class="form-control" type="text" v-model="order_cd" placeholder="주문코드를 검색해주세요" style="height: 41px;" readonly>
            <button class="btn btn-warning mb-3" type="button" @click="modalOpen"><i class="fa-solid fa-magnifying-glass"></i></button>
          </div>
        </div>

        <p for="example-text-input" class="text-sm font-weight-bolder">생산기간 <em class="point-red">*</em></p>
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
            <button type="button" class="btn btn-secondary" @click="modalOpen">닫기</button>
          </template>
        </Layout>
      <!--검색모달[E]-->

      <div class="card-body">
  
        <div class="row">
          <div class="col-5 half">
            <p class="text-uppercase text-lg font-weight-bolder">전체제품 목록</p>
            <ag-grid-vue class="ag-theme-alpine " 
            style="width: 100%; height: 400px;"  
            :columnDefs="productDefs" 
            :rowData="productData" 
            :pagination="true" 
             @grid-ready="productGrid" 
             :gridOptions="gridOptions"
             overlayNoRowsTemplate="주문내역이 없습니다."/>
          </div>
          <div class="col-1 d-flex flex-column align-items-center justify-content-center">
            <button class="btn btn-outline-primary mb-3"  @click="getSelected('plus')">
              <i class="fa-solid fa-plus" style="color: #0951ce;"></i>
            </button>
            <button class="btn btn-outline-danger" @click="getSelected()">
              <i class="fa-solid fa-minus" style="color: #fa0000;"></i>
            </button>
          </div>
          <div class="col-5 half">
            <p class="text-uppercase text-lg font-weight-bolder">주문제품 목록</p>
            <ag-grid-vue class="ag-theme-alpine"  
            style="width: 100%; height: 400px;" 
            :columnDefs="orderDtlDefs" 
            :rowData="orderDtlData" 
            @grid-ready="orderDtlGrid" 
            :gridOptions="gridOptions"
            overlayNoRowsTemplate="주문내역이 없습니다."/>
          </div>
        </div>
        <div class="center" v-if="this.$session.get('user_ps') == 'H01'">
          <button class="btn mtp30" :class="isUpdated ? 'btn-success' : 'btn-primary'" @click="planInsert"> {{ isUpdated ? "수정" : "등록" }}</button>
          <button class="btn btn-secondary mlp10 mtp30" @click="resetForm" v-if="!isUpdated">초기화</button>
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

    let selectNo = this.$route.query.plan_cd;
    this.selectNo = selectNo;
    
    if(selectNo){
        //수정
        this.getPlanInfo(selectNo);     
        this.isUpdated = true;      
    }
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
        { headerName: '주문서코드', field: 'order_cd', sortable: true, width: 110, cellStyle: {textAlign: "center"} },
        { headerName: '거래처코드', field: 'act_cd', sortable: true, width: 110, cellStyle: {textAlign: "center"} },
        { headerName: '거래처이름', field: 'act_nm', sortable: true, width: 150, cellStyle: {textAlign: "center"} },
        { headerName: '담당자', field: 'name', sortable: true, width: 80, cellStyle: {textAlign: "center"}},
        { headerName: '제품종류', field: 'prd_cnt', sortable: true, width: 100, cellStyle: {textAlign: "center"}},
        { headerName: '총 주문건수', field: 'order_cnt', sortable: true, width: 110, cellStyle: {textAlign: "center"}},
        { headerName: '주문일자', field: 'order_dt', valueFormatter: this.$comm.dateFormatter, width: 110, cellStyle: {textAlign: "center"} }
      ],
      orderData: [],

      //제품목록
      productDefs:[
        { headerName: '제품코드', field: 'prd_cd', sortable: true, width:150, cellStyle: {textAlign: "center"}},
        { headerName: '제품명', field: 'prd_nm', sortable: true, cellStyle: {textAlign: "center"}},
        { headerName: '금액', field: 'price', sortable: true, valueFormatter:this.$comm.currencyFormatter, cellStyle: {textAlign: "center"} },
        { headerName: '현재고', field: 'in_cnt', sortable: true, valueFormatter:this.$comm.currencyFormatter, cellStyle: {textAlign: "center"}},
      ],
      productData:[],
      productApi: null,
      productColApi: null,

      //주문서 제품목록
      orderDtlDefs: [
        {headerName: '제품 코드', field: 'prd_cd', width:150, cellStyle: {textAlign: "center"}},
        {headerName: '제품 이름', field: 'prd_nm', cellStyle: {textAlign: "center"}},
        {
            headerName: '제품 수량', 
            field: 'order_qty', 
            editable: true, 
            cellDataType: 'number',
            valueFormatter: (params) => {
                if (params.value == null || params.value === '') return '';
                return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
            },
            cellStyle: {textAlign: "center"},
            cellRenderer: this.placeholderRenderer, // Placeholder 기능 추가
        },
        {headerName: '현 재고', field: 'in_cnt', valueFormatter:this.$comm.currencyFormatter, cellStyle: {textAlign: "center"}}
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
    axios.get('/api/comm/product')
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

    modalCloseFunc() {
      this.isModal = !this.isModal;
    },
    /*모달 [E]*/   
   
    //주문서 제품 리스트
    async getOrderDtlList(order_cd) {
      let result = await axios.get(`/api/comm/order/dtl/${order_cd}`)
                              .catch(err => console.log(err));   
      this.orderDtlData = result.data;
    },

    //계획서 조회
    async getPlanInfo(selectNo) {
      let obj = {
        PROD_PLAN_CD : selectNo,
      }
      let result = await axios.get('/api/plan', {params:obj})
                              .catch(err => console.log(err));
      this.planInfo = result.data[0];
      this.order_cd = this.planInfo.ORDER_CD; 
      this.START_DT = this.$comm.getMyDay(this.planInfo.START_DT);
      this.END_DT =  this.$comm.getMyDay(this.planInfo.END_DT);

      this.getPlanDtlList(selectNo);
    },

    //계획서 제품 리스트
    async getPlanDtlList(selectNo) {
      let result = await axios.get(`/api/plan/${selectNo}/dtl`)
                              .catch(err => console.log(err));    
      this.orderDtlData = result.data;
    },

    getSelected(type){ // 추가(+) / 삭제(-) 버튼 동작
      let selected = null;
      if(type == 'plus') selected = this.productApi.getSelectedNodes(); // 추가버튼일 시
      else selected = this.orderDtlApi.getSelectedNodes(); // 삭제버튼일 시
      
      if(selected.length != 0){ // 선택된 값이 있을 경우에만 실행
        // grid는 참조형식이라 개별값을 직접 조작할 수 없으므로 가상의 배열 선언
        let addArr = [];
        let changeArr = null;
        if(type == 'plus') changeArr = this.productData;
        else changeArr = this.orderDtlData;
        
        selected.forEach((val) => { // 선택된 값을 순회, 비교하며 배열에서 추가/삭제 실행

          changeArr = changeArr.filter(obj => obj.prd_cd != val.data.prd_cd); // 선택되지 않은 것만 남김
          
          if(type == 'plus'){
            if ( this.orderDtlData.some((obj) => obj.prd_cd === val.data.prd_cd)){ //이미 추가된 제품일 경우
              this.$swal({
                icon: "error",
                title: "존재하는 자재가 있습니다.",
                text: "다시 선택해주세요",
              });
            }else{
              addArr.push(val.data);
            }
            val.setSelected(false); //갑 넣고 체크 해제
          }
          
        });        
      
        // 수정된 배열로 반영하기
        if(type == 'plus'){
          this.orderDtlData = [...this.orderDtlData, ...addArr]; // 펼침연산자로 기존의 값에 추가함
        } else {
          this.orderDtlData = changeArr;
        }
      }
    },

    //계획서 등록
    async planInsert() {
      let rowQty = this.orderDtlData.filter(row => !row.order_qty || row.order_qty <= 0);
      
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
          PRD_CD: obj.prd_cd,
          PROD_PLAN_QTY: obj.order_qty
        });
      });

      let insertArr = [...insertPlan, insertPrd];


      if(this.isUpdated == true){
        
        if(this.planInfo.ACT_TYPE == '진행전'){
          let result = await axios.put(`/api/plan/${this.selectNo}`, insertArr)
                                .catch(err => console.log(err));

          if(result.data == 'success'){
            this.$swal({
                icon: "success",
                title: "수정완료",
            })    
          }
        }else{
          this.$swal({
              icon: "error",
              title: "수정불가",
              text: "지시서가 등록된 계획서는 수정/삭제할 수 없습니다.",
          });          
        }
      }else{
        let result = await axios.post('/api/plan', insertArr)
                                .catch(err => console.log(err));

        if(result.data == 'success'){
          this.$swal({
              icon: "success",
              title: "등록완료",
              text: "등록한 계획서는 목록에서 확인 해주세요.",
          })
          .then(() => {
              this.resetForm();   //등록 후 값 초기화
          });          
        }
      }
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
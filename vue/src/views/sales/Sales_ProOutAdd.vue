<!-- 출고제품등록 -->

<style>
.form-control[readonly] {
    background-color: rgb(236, 236, 236);
}
</style>

<template>
  <div class="py-4 container-fluid">
      <div class="card">

          <!-- 출고 테이블 부분 -->
          <div class="card-header bg-light ps-5 ps-md-4">
              <div class="row">
                  <div class="col-6 col-lg-2"></div>
                  
                  <div class="col-6 col-lg-1 text-center mb-3 mt-2 fw-bolder" :style="t_overflow">주문서 코드</div> 
                  <div class="input-group mb-2 w-25">
                      <input type="text" class="form-control" v-model="order_code" aria-label="Recipient's username" aria-describedby="button-addon2" 
                      style="height: 41px; background-color: rgb(236, 236, 236);"  readonly />
                      <button class="btn btn-warning" type="button" id="button-addon2" @click="modalOpen">SEARCH</button>
                  </div>
              
              </div>
              <div class="row">
                  <div class="col-6 col-lg-2 "></div>
                  <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">거래처 명</div> 
                  <div class="col-6 col-lg-2 mb-3">
                      <input class="form-control" type="text" id="acc_name" value="" readonly />
                  </div>
                  <div class="col-6 col-lg-1"></div>
                  <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">거래처 코드</div> 
                  <div class="col-6 col-lg-2 mb-3">
                      <input class="form-control" type="text" id="acc_code" value="" readonly />
                  </div>
              </div>

              <div class="row">
                  <div class="col-6 col-lg-2"></div>                    
                  <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">주문일자</div> 
                  <div class="col-6 col-lg-2 mb-3">
                      <input class="form-control" type="date" v-model="order_date" readonly />
                  </div>
                  <div class="col-6 col-lg-1"></div>
                  <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">납기일자</div> 
                  <div class="col-6 col-lg-2 mb-3">
                      <input class="form-control" type="date" v-model="due_date" readonly />
                  </div>
              </div>

              <div class="row">
                  <div class="col-6 col-lg-2"></div>
                  <div class="col-6 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">담당자 명</div> 
                  <div class="input-group w-25">
                      <input type="text" class="form-control" id="mem_name" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px; background-color: rgb(236, 236, 236);" readonly />
                      <button class="btn btn-warning" type="button" id="button-addon2" @click="modalOpen2">SEARCH</button>
                  </div>
                  <div class="col-6 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">담당자 ID</div> 
                  <div class="col-6 col-lg-2">
                      <input class="form-control" type="text" id="mem_id" value="" readonly />
                  </div>
              </div>
          </div>

          <!-- 출고디테일 테이블 부분 -->
          <div class="card-body">
              <div class="row">
                  <div class="col-md-6">
                      <p></p>
                      <ag-grid-vue style="width:100%; height: 350px;"
                      class="ag-theme-alpine"
                      :columnDefs="OLDefs"
                      :rowData="OLData"
                      :gridOptions="gridOptions"
                      @grid-ready="gridFit"
                      overlayNoRowsTemplate="주문서를 조회 하여주세요.">
                      </ag-grid-vue>
                  </div>
                  <div class="col-md-6">
                      <p></p>
                      <ag-grid-vue style="width:100%; height: 350px;"
                      class="ag-theme-alpine"
                      :columnDefs="colDefs"
                      :rowData="nrowData"
                      :gridOptions="gridOptions"
                      @grid-ready="gridFit"
                      overlayNoRowsTemplate="제품 조회 버튼을 이용하여 제품을 추가 해주세요.">
                      </ag-grid-vue>
                  </div>
              </div>
              <div class="row">
                  <div class="col-6 col-lg-6"></div>
                  <div class="col-6 col-lg-1 mt-2">
                      <button class="btn btn-primary " @click="ordInsert()">등록</button>
                  </div>
              </div>
          </div>
      </div>
  </div>

  <!-- 주문서 조회 모달 -->
  <Layout :modalCheck="asModal">
      <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
          <h5 class="modal-title">주문서 조회</h5>
          <button type="button" aria-label="Close" class="close" @click="modalOpen">×</button>
      </template>
      <template v-slot:default>
          <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px;" :columnDefs="ordDefs"
          :rowData="ordData" :pagination="true" @rowClicked="modalClicked" @grid-ready="gridFit"
          overlayNoRowsTemplate="등록된 주문서가 없습니다.">
          </ag-grid-vue>
      </template>
      <template v-slot:footer>
          <button v-show="hidden" type="button" class="btn btn-secondary" @click="modalOpen">Cancel</button>
          <!-- v-show="hidden" 이거 적은 이유는 그냥 지워도 footer가 나와서 그냥 숨겼단 -->
          <button v-show="hidden" type="button" class="btn btn-primary" @click="modalOpen">OK</button>
      </template>
  </Layout>

  <!-- 담당자 조회 모달 -->
  <Layout :modalCheck="msModal">
      <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
          <h5 class="modal-title">담당자 조회</h5>
          <button type="button" aria-label="Close" class="close" @click="modalOpen2">×</button>
      </template>
      <template v-slot:default>
          <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px;" :columnDefs="memDefs"
          :rowData="memData" :pagination="true" @rowClicked="modalClicked2" @grid-ready="gridFit"
          overlayNoRowsTemplate="등록된 담당자가 없습니다.">
          </ag-grid-vue>
      </template>
      <template v-slot:footer>
          <button v-show="hidden" type="button" class="btn btn-secondary" @click="modalOpen2">Cancel</button>
          <button v-show="hidden" type="button" class="btn btn-primary" @click="modalOpen2">OK</button>
      </template>
  </Layout>

  <!-- 제품 조회 모달 -->
  <Layout :modalCheck="psModal">
      <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
          <h5 class="modal-title">제품 조회</h5>
          <button type="button" aria-label="Close" class="close" @click="modalOpen3">×</button>
      </template>
      <template v-slot:default>
          <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px;" :columnDefs="proDefs"
          :rowData="proData" :pagination="true" @rowClicked="modalClicked3" @grid-ready="gridFit"
          overlayNoRowsTemplate="등록된 제품이 없습니다.">
          </ag-grid-vue>
      </template>
      <template v-slot:footer>
          <button v-show="hidden" type="button" class="btn btn-secondary" @click="modalOpen3">Cancel</button>
          <button v-show="hidden" type="button" class="btn btn-primary" @click="modalOpen3">OK</button>
      </template>
  </Layout>
</template>

<script>
//그리드 사용법
import { AgGridVue } from "ag-grid-vue3";
import axios from 'axios';
import Layout from '../components/modalLayout.vue';

export default {
    name: 'App',
    data() {
        return {
            OLDefs: [
                {headerName: '제품 코드', field: 'prd_cd'},
                {headerName: '제품 이름', field: 'prd_nm'},
                {headerName: '주문 수량', field: 'order_qty'},
                {headerName: '기출고수량', field: 'prd_ed'},
                {headerName: '미출고수량', field: 'no_qty'},
                {
                    headerName: '출고 수량', 
                    field: 'prd_out_qty', 
                    editable: true, 
                    cellDataType: 'number',
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                    cellRenderer: this.placeholderRenderer, // Placeholder 기능 추가
                },
                {
                    headerName: 'LOT보기' ,
                    field: 'delete',
                    cellRenderer: (params) => {
                        const button = document.createElement('button');
                        button.innerText = 'CHECK';
                        button.className = 'btn btn-warning';
                        button.addEventListener('click', () => {
                            this.rowData = this.rowData.filter(row => row !== params.data);
                        });
                        return button;
                    }
                 },
            ],
            OLData: [ ],

            ordDefs: [
                {headerName: '주문서 코드', field: 'order_cd', filter: 'agTextColumnFilter' },
                {headerName: '거래처 명', field: 'act_nm', filter: 'agTextColumnFilter' },
                {headerName: '거래처 코드', field: 'act_cd', filter: 'agTextColumnFilter' },
                {headerName: '주문 일자', field: 'order_dt', valueFormatter: this.$comm.dateFormatter},
                {headerName: '납기 일자', field: 'due_dt', valueFormatter: this.$comm.dateFormatter},
            ],
            ordData: [],
            memDefs: [
                {headerName: '담당자 ID', field: 'ID'},
                {headerName: '담당자 명', field: 'name'},
                {headerName: '부서', field: 'dpt_nm'},
            ],
            memData: [],
            proDefs: [
                {headerName: '제품 코드', field: 'prd_cd'},
                {headerName: '제품 이름', field: 'prd_nm'},
                {headerName: '제품 수량', field: 'stock'},
            ],
            proData: [],

            columnDefs: [],
            rowData: [ ],

            asModal: false,
            msModal: false,
            psModal: false,

        }
    },
    components: {
        AgGridVue,
        Layout
    },
    
    created() {
        this.$store.dispatch('breadCrumb', { title: '출고 제품 등록' });

        this.getOrdList();
        this.getMemList();
        this.getProList();
    },
    methods: {
        modalOpen() {
            this.asModal = !this.asModal;
        },
        modalOpen2() {
            this.msModal = !this.msModal;
        },
        modalOpen3() {
            this.psModal = !this.psModal;
        },
        modalClicked(params) {
            this.order_code = params.data.order_cd;
            document.getElementById('acc_code').value = params.data.act_cd;
            document.getElementById('acc_name').value = params.data.act_nm;
            // v-model로 설정 해서 값을 넘겨받는 방식(this.$comm.dateFormatter을 사용해서 날짜 포맷을 맞춰야 값이 들어간다) 
            this.order_date = this.$comm.dateFormatter(params.data.order_dt);         
            this.due_date = this.$comm.dateFormatter(params.data.due_dt);

            //모달에서 주문서 코드 선택시 제품조회 메소드가 실행 되므로 여기서 실행
            this.getOutOrdList();

            this.asModal = !this.asModal;
        },
        modalClicked2(params) {
            document.getElementById('mem_id').value = params.data.ID;
            document.getElementById('mem_name').value = params.data.name;
            this.msModal = !this.msModal;
        },
        modalClicked3(params) {
            // 선택한 제품 rowData에 추가
            const newRowData = {
                prd_cd: params.data.prd_cd, 
                prd_nm: params.data.prd_nm, 
                order_qty: '', 
                note: '',  
                delete: 'delete', 
            };

            this.rowData = [...this.rowData, newRowData]; // 기존 데이터 유지하면서 새 데이터 추가
            this.psModal = !this.psModal;
        },
        placeholderRenderer(params) {
            // 주문 수량 값이 없으면 placeholder 텍스트 표시
            if (!params.value) {
                return `<span style="color: gray; font-style: italic;">숫자만 입력하세요.</span>`;
            }
            return params.value.toLocaleString ? params.value.toLocaleString() : params.value; // 값이 있으면 그대로 표시
        },

        //주문서 코드를 따라 나오는 제품들
        async getOutOrdList() { 
            //console.log(`/api/sales/${this.order_code}`); 변수에 담아서 넘기는게 아니라 바로 값을 넘김
            let result = await axios.get(`/api/sales/${this.order_code}`)
                                    .catch(err => console.log("axiosError",err));
            this.OLData = result.data;
        },

        async getOrdList() {
            let result = await axios.get('/api/moord')
                                    .catch(err => console.log(err));
            this.ordData = result.data; 
        },
        async getMemList() {
            let result = await axios.get('/api/momem')
                                    .catch(err => console.log(err));
            this.memData = result.data; 
        },
        async getProList() {
            let result = await axios.get('/api/mopro')
                                    .catch(err => console.log(err));
            this.proData = result.data;
        },

        async ordInsert() {

            // 필수값 입력 알람
            let dueDt = document.getElementById('due_date').value;
            let ordDt = document.getElementById('order_date').value;
            let accCode = document.getElementById('acc_code').value;
            let memId = document.getElementById('mem_id').value;
            let rowQty = this.rowData.filter(row => !row.order_qty || row.order_qty <= 0);

            if (!accCode || !memId) {
                this.$swal({
                    icon: "error",
                    title: "거래처와 담당자를 조회 하세요",
                    text: "거래처와 담당자를 선택해야 주문을 등록할 수 있습니다.",
                });
                return;
            }
            if (!this.rowData || this.rowData.length === 0) {
                this.$swal({
                    icon: "error",
                    title: "제품을 선택하세요",
                    text: "최소 한 개 이상의 제품을 선택해야 주문을 등록할 수 있습니다.",
                });
                return;
            }
            if (rowQty.length > 0) {
                this.$swal({
                    icon: "error",
                    title: "주문 수량을 입력하세요",
                    text: "입력 후 엔터를 쳐주세요",
                });
                return;
            }
            if (!dueDt || !ordDt) {
                this.$swal({
                    icon: "error",
                    title: "납기일자와 주문일자를 입력하세요",
                    text: "확인을 다시 하여주세요",
                });
                return;
            }

            //주문서 등록
            let insertOrd = [];
            let insertOrdDtl = [];

            this.rowData.forEach((obj) => {
                    insertOrdDtl.push({prd_cd: obj.prd_cd, 
                    prd_nm: obj.prd_nm, 
                    order_qty: obj.order_qty, 
                    note: obj.note,});
            });
            console.log(insertOrdDtl);
            insertOrd.push({
                mem_id : document.getElementById('mem_id').value,
                act_cd : document.getElementById('acc_code').value,
                due_dt : document.getElementById('due_date').value,
                order_dt : document.getElementById('order_date').value
            });
            console.log(insertOrd);

            let insertOrdArr = [...insertOrd, insertOrdDtl ];   //첫번째가 헤드, 두번째가 디테일
            console.log(insertOrdArr);

            let result = await axios.post('/api/sales/ord', insertOrdArr)   //배열은 , 붙여서 보냄(객체가 + 붙여서 넘김)
                                .catch(err => console.log("axios에러",err));
            console.log(result.data.result);
            console.log(result.data);

            if(result.data.result == 'success'){
                this.$swal({
                    icon: "success",
                    title: "등록에 성공 하였습니다.",
                    text: "등록한 주문서는 목록에서 확인 해주세요.",
                })
                .then(() => {
                    this.resetForm();   //등록 후 값 초기화
                });
                // .then(() => {    
                //     window.location.reload();    //페이지 새로고침
                // });               
            }
            return result;

        },
        // 등록 후 초기화 기능
        resetForm() {
            document.getElementById('acc_name').value = "";
            document.getElementById('acc_code').value = "";
            document.getElementById('mem_name').value = "";
            document.getElementById('mem_id').value = "";
            document.getElementById('due_date').value = "";
            document.getElementById('order_date').value = "";
            this.rowData = [];         
        },

        gridFit(params){ // 매개변수 속성으로 자동 접근하여 sizeColumnsToFit() 실행함. (가로스크롤 삭제)
            params.api.sizeColumnsToFit();
        }
    }

}
</script>
  
<style lang="scss">
//그리드 사용시 아래 스타일 임포트 해야하고 경로 확인이 필요하다 
@import"../../../node_modules/ag-grid-community/styles/ag-grid.css";
@import"../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css"


</style>

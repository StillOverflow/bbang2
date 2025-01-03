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
                      <button class="btn btn-warning" type="button" v-if="this.isdetail == false" @click="modalOpen"><i class="fa-solid fa-magnifying-glass"></i></button>
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
                      <input class="form-control" style="background-color: rgb(236, 236, 236);" type="date" v-model="order_date" readonly />
                  </div>
                  <div class="col-6 col-lg-1"></div>
                  <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">납기일자</div> 
                  <div class="col-6 col-lg-2 mb-3">
                      <input class="form-control" style="background-color: rgb(236, 236, 236);" type="date" v-model="due_date" readonly />
                  </div>
              </div>

              <div class="row">
                  <div class="col-6 col-lg-2"></div>
                  <div class="col-6 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">담당자 명</div> 
                  <div class="input-group w-25 mb-3">
                      <input type="text" class="form-control" id="mem_name" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px; background-color: rgb(236, 236, 236);" readonly />
                      <button class="btn btn-warning" type="button" v-if="this.isdetail == false" @click="modalOpen2"><i class="fa-solid fa-magnifying-glass"></i></button>
                  </div>
                  <div class="col-6 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">담당자 ID</div> 
                  <div class="col-6 col-lg-2">
                      <input class="form-control" type="text" id="mem_id" value="" readonly />
                  </div>
              </div>
              <div class="row" v-if="this.isdetail == true &&  this.prdEndStatusJ03 == false" >
                <div class="col-6 col-lg-2"></div>
                <div class="col-6 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">
                출고구분
                </div>
                <div class="col-6 col-lg-2">
                    <select class="form-select" v-model="selected2" >
                        <option v-for="(opt, idx) in selectList" :key="idx" :value="opt.value">
                        {{ opt.name }}
                        </option>
                    </select>
                </div>
              </div>
          </div>

            <div class="alert alert-light alert-dismissible fade show" v-if="this.isdetail == true">
                <strong>출고완료 선택 후 UPDATE 하면 출고완료가 되며 수정/삭제 불가합니다.</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
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
                        @grid-ready="gridFit"
                        overlayNoRowsTemplate="주문서를 조회 하여주세요.">
                        </ag-grid-vue>
                    </div>
                    <div class="col-md-6">
                        <p></p>
                        <ag-grid-vue style="width:100%; height: 350px;"
                        class="ag-theme-alpine"
                        :columnDefs="proOutDefs"
                        :rowData="proOutData"
                        @grid-ready="gridFit"
                        overlayNoRowsTemplate="제품의 LOT를 선택해주세요.">
                        </ag-grid-vue>
                    </div>
                </div>
               
                <div class="center " v-if="this.isdetail == false"> <!--등록페이지-->
                    <button class="btn btn-primary mtp30" @click="prdOutInsert">SUBMIT</button>
                    <button class="btn btn-secondary mlp10 mtp30" @click="resetForm">RESET</button>
                </div>
                <div class="center " v-if="this.isdetail == true"> <!--상세페이지-->
                    <div v-if="this.prdEndStatusJ03 == false">
                        <button class="btn btn-primary mtp30" @click="prdOutUpdate">UPDATE</button>
                        <button class="btn btn-secondary mlp10 mtp30" @click="prdOutDelete">DELETE</button>
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

  <!-- LOT 조회 모달 -->
  <Layout :modalCheck="psModal">
      <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
          <h5 class="modal-title">LOT를 선택 해주세요.</h5>
          <button type="button" aria-label="Close" class="close" @click="modalOpen3">×</button>
      </template>
      <template v-slot:default>
          <ag-grid-vue class="ag-theme-alpine" 
          ref="lotGrid"
          style="width: 100%; height: 400px;" 
          :columnDefs="proDefs"
          :rowData="proData" 
          :pagination="true" 
          :gridOptions="gridOptions"
          rowClicked="multiple" 
          @grid-ready="gridFit"
          overlayNoRowsTemplate="등록된 제품이 없습니다.">
          </ag-grid-vue>
      </template>
      <template v-slot:footer>
          <button  type="button" class="btn btn-secondary" @click="modalOpen3">Cancel</button>
          <button  type="button" class="btn btn-primary" @click="modalClicked3">OK</button>
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
            //상세,수정,삭제
            isdetail: false,
            //출고완료후
            prdEndStatusJ03: '',

            //상세 헤드부분에 넣을 데이터 
            POHead: {
                act_cd: '',
                act_nm: '',
                id: '',
                name: '',
                order_cd: '',
                order_dt: '',
                due_dt: '',
            },
            //input박스에 값 넣기 위해 선언
            due_date: '',
            order_date: '',
            order_code: '',

            //셀렉트박스
            selected2: "",
            selectList: [
                { name: "출고지시.", value: "" },
                { name: "출고완료", value: "prdOutEnd" },
            ],



            prd_out_dtl_cd: '',
            prd_lot_cd: '',
            prd_out_qty: '',

            odtCd: '',
            
            OLDefs: [
                {headerName: '주문상세코드', field: 'order_dtl_cd', cellStyle: { textAlign: "center" }, hide: true},
                {headerName: '제품 코드', field: 'prd_cd', cellStyle: { textAlign: "center" }},
                {headerName: '제품 이름', field: 'prd_nm', cellStyle: { textAlign: "center" }},
                {
                    headerName: '주문 수량', 
                    field: 'order_qty', 
                    cellStyle: { textAlign: "center" },
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                },
                {
                    headerName: '기출고수량', 
                    field: 'prd_out_qty', 
                    cellStyle: { textAlign: "center" },
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                },
                {
                    headerName: '미출고수량', 
                    field: 'no_qty', 
                    cellStyle: { textAlign: "center" },
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                },
                {
                    headerName: 'LOT보기' ,
                    field: 'lotlist', 
                    cellStyle: { textAlign: "center" },
                    cellRenderer: (params) => {
                        const button = document.createElement('button');
                        button.innerText = 'SEARCH';
                        button.className = 'btn btn-warning btn-xsm';
                        button.addEventListener('click', () => {
                            if(this.prdEndStatusJ03 == false){
                                this.modalOpen3(); //LOT모달 오픈
                                this.prd_cd = params.data.prd_cd //선택한 행에 제품명 담기
                                this.getOutLotList(); //단건조회로 보내기

                                this.odtCd = params.data.order_dtl_cd //등록할 때 필요한 코드 변수에 담기
                            }
                        });
                        return button;
                    }
                 },
            ],
            OLData: [ ],

            proDefs: [
                {headerName: '제품 코드', field: 'prd_cd', cellStyle: { textAlign: "center" }, hide: true},
                {headerName: '제품 이름', field: 'prd_nm', cellStyle: { textAlign: "center" }},
                {
                    headerName: '제품 수량', 
                    field: 'stock', 
                    cellStyle: { textAlign: "center" },
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                },
                {headerName: 'LOT', field: 'prd_lot_cd', cellStyle: { textAlign: "center" }},
                {headerName: '유통기한', field: 'exp_dt', cellStyle: { textAlign: "center" }, valueFormatter: this.$comm.dateFormatter},
            ],
            lotMo: "",
            proData: [],
            
            gridOptions: {
                rowSelection: { mode: "multiRow" },
                suppressMovableColumns: true,
            },

            proOutDefs: [
                {headerName: '출고상세코드', field: 'prd_out_dtl_cd', cellStyle: { textAlign: "center" }, hide: true},
                {headerName: '주문상세코드', field: 'order_dtl_cd', cellStyle: { textAlign: "center" }, hide: true},
                {headerName: 'LOT', field: 'prd_lot_cd', cellStyle: { textAlign: "center" }},
                {headerName: '제품코드', field: 'prd_cd', cellStyle: { textAlign: "center" }, hide: true},
                {headerName: '제품 이름', field: 'prd_nm', cellStyle: { textAlign: "center" }},
                {headerName: '유통기한', field: 'exp_dt', cellStyle: { textAlign: "center" }, valueFormatter: this.$comm.dateFormatter},
                {
                    headerName: '제품 수량', 
                    field: 'stock', 
                    cellStyle: { textAlign: "center" },
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                },
                {
                    headerName: '출고 수량', 
                    field: 'prd_out_qty', 
                    editable: true, 
                    cellStyle: { textAlign: "center" }, 
                    cellDataType: 'number',
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                    cellRenderer: this.placeholderRenderer, // Placeholder 기능 추가
                },
                {headerName: '비고', field: 'note', editable: true, cellStyle: { textAlign: "center" }},
                {
                    headerName: '삭제' ,
                    field: 'delete', 
                    cellStyle: { textAlign: "center" },
                    cellRenderer: (params) => {
                        const button = document.createElement('button');
                        button.innerText = 'DELETE';
                        button.className = 'btn btn-danger btn-xsm';
                        button.addEventListener('click', () => {
                            // 상세 페이지 일떄
                            if(this.isdetail == true){
                                if(this.prdEndStatusJ03 == false){ //상세 페이지에서 출고완료가 안되었을때
                                    //한 행에 관한 단건 딜리트 메소드
                                    this.prd_out_dtl_cd = params.data.prd_out_dtl_cd;
                                    this.prd_lot_cd = params.data.prd_lot_cd;
                                    this.prd_out_qty = params.data.prd_out_qty;
                                    this.prdOutListDelete();

                                    this.proOutData = this.proOutData.filter(row => row !== params.data);
                                }
                            }else{// 상세 페이지가 아니라 등록 페이지 일때
                                this.proOutData = this.proOutData.filter(row => row !== params.data);
                            }
                        });
                        return button;
                    }
                },
            ],
            proOutData: [],

            ordDefs: [
                {headerName: '주문서 코드', field: 'order_cd', cellStyle: { textAlign: "center" }, filter: 'agTextColumnFilter' },
                {headerName: '거래처 명', field: 'act_nm', cellStyle: { textAlign: "center" }, filter: 'agTextColumnFilter' },
                {headerName: '거래처 코드', field: 'act_cd', cellStyle: { textAlign: "center" }, filter: 'agTextColumnFilter' },
                {headerName: '주문 일자', field: 'order_dt', cellStyle: { textAlign: "center" }, valueFormatter: this.$comm.dateFormatter},
                {headerName: '납기 일자', field: 'due_dt', cellStyle: { textAlign: "center" }, valueFormatter: this.$comm.dateFormatter},
            ],
            ordData: [],
            memDefs: [
                {headerName: '담당자 ID', field: 'ID', cellStyle: { textAlign: "center" }},
                {headerName: '담당자 명', field: 'name', cellStyle: { textAlign: "center" }, filter: 'agTextColumnFilter'},
                {headerName: '부서', field: 'dpt_nm', cellStyle: { textAlign: "center" }, filter: 'agTextColumnFilter'},
            ],
            memData: [],
            

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

        let selectNo = this.$route.query.bno;
        this.selectNo = this.$route.query.bno; //this.으로 저장해야 created()밖에서도 사용 가능
        
        if(selectNo != null){
            //수정    
            this.isdetail = true;     

            //페이지 이름
            this.$store.dispatch('breadCrumb', { title: '출고 제품 상세' });
            //상세조회(헤드)
            this.prdOutDtlList(selectNo)




        }else{
            //등록
            // this.boardInfo.created_date = this.getToday();  
        }

        this.getOrdList();
        this.getMemList();
        

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
        modalClicked3() {
            
            const selectedRows = this.$refs.lotGrid.api.getSelectedRows();

            const newRowData = selectedRows.map(row => ({
                
                order_dtl_cd: this.odtCd, //행 선택할 때 담은 변수 코드 여기서 넣어주기
                prd_lot_cd: row.prd_lot_cd,
                prd_cd: row.prd_cd,
                prd_nm: row.prd_nm,
                exp_dt: row.exp_dt,
                stock: row.stock, 
                order_qty: '', 
                note: '',  
                delete: 'delete', 
            }));
            

            this.proOutData = [...this.proOutData, ...newRowData]; // 기존 데이터 유지하면서 새 데이터 추가
            
            this.psModal = !this.psModal;
        },
        placeholderRenderer(params) {
            // 주문 수량 값이 없으면 placeholder 텍스트 표시
            if (!params.value) {
                return `<span style="color: gray; font-style: italic;">숫자만 입력하세요.</span>`;
            }
            return params.value.toLocaleString ? params.value.toLocaleString() : params.value; // 값이 있으면 그대로 표시
        },

        //출고완료인지 확인
        async prdOutEndStatus() {
            let result = await axios.get(`/api/sales/prdOutEndStatus/${this.order_code}`)
                                    .catch(err => console.log("출고확인",err));
            if(result.data[0].status == 'J03'){
                console.log("드디어")
                this.prdEndStatusJ03 = true;
            }else{
                this.prdEndStatusJ03 = false;
            }
        },

        //상세조회 출고제품 헤드부분
        async prdOutDtlList(selectNo) {
            let result = await axios.get(`/api/sales/prdOutDtlList/${selectNo}`)
                                    .catch(err => console.log("PODListError",err));
            this.POHead = result.data;

            this.prdOutHeadList();
            //주문서코드 따라 나오는 주문서목록은 등록이나 상세나 똑같기 때문에 여기서도 선언
            this.getOutOrdList();
            //상세조회 디테일(lot)
            this.prdOutDtlLotList(selectNo);

            //출고완료체크
            this.prdOutEndStatus();
        },
        prdOutHeadList(){
            document.getElementById('acc_name').value = this.POHead[0].act_nm;
            document.getElementById('acc_code').value = this.POHead[0].act_cd;
            document.getElementById('mem_name').value = this.POHead[0].name;
            document.getElementById('mem_id').value = this.POHead[0].id;
            this.due_date = this.POHead[0].due_dt.slice(0, 10); //길이가 안맞아서 안나옴 그래서 뒤에 시간부분 자름
            this.order_date = this.POHead[0].order_dt.slice(0, 10);
            this.order_code = this.POHead[0].order_cd;
        },

        //상세조회 출고제품 디테일부분(LOT)
        async prdOutDtlLotList(selectNo) {
            let result = await axios.get(`/api/sales/prdOutDtlLotList/${selectNo}`)
                                    .catch(err => console.log("prdRTDError",err));
            this.proOutData = result.data;

        },

        //주문서 코드를 따라 나오는 제품들
        async getOutOrdList() { 
            //console.log(`/api/sales/${this.order_code}`); 변수에 담아서 넘기는게 아니라 바로 값을 넘김
            let result = await axios.get(`/api/sales/ordList/${this.order_code}`)
                                    .catch(err => console.log(err));
            this.OLData = result.data;
        },

        //제품의 이름을 따라서 나오는 LOT조회(모달창)
        async getOutLotList() {
            let result = await axios.get(`/api/sales/lot/${this.prd_cd}`) 
                                    .catch(err => console.log("axiosERROR",err));
            this.proData = result.data;
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
        // async getProList() {
        //     let result = await axios.get('/api/mopro')
        //                             .catch(err => console.log(err));
        //     this.proData = result.data;
        // },


        async prdOutInsert() {

            // 필수값 입력 알람
            let accCode = document.getElementById('acc_code').value;
            let memId = document.getElementById('mem_id').value;
            let rowQty = this.proOutData.filter(row => !row.prd_out_qty || row.prd_out_qty <= 0);

            if (!accCode) {
                this.$swal({
                    icon: "error",
                    title: "주문서 코드를 선택 해주세요.",
                    text: "검색 후 선택 해주세요.",
                });
                return;
            }
            if (!memId) {
                this.$swal({
                    icon: "error",
                    title: "담당자를 선택 해주세요.",
                    text: "검색 후 선택 해주세요.",
                });
                return;
            }
            if (!this.proOutData || this.proOutData.length === 0) {
                this.$swal({
                    icon: "error",
                    title: "제품의 LOT를 선택하세요",
                    text: "최소 한 개 이상의 LOT를 선택해야 출고를 등록할 수 있습니다.",
                });
                return;
            }
            if (rowQty.length > 0) {
                this.$swal({
                    icon: "error",
                    title: "출고 수량을 입력하세요",
                    text: "입력 후 엔터를 쳐주세요",
                });
                return;
            }
            

            //출고 등록
            let insertPrdOut = [];
            let insertPrdOutDtl = [];
            //let updatePrdOutQty = [];

            // this.proOutData.forEach((obj) => {
            //     updatePrdOutQty.push({
            //             prd_lot_cd: obj.prd_lot_cd,
            //             prd_out_qty: obj.prd_out_qty
            //         });
            // });
            // console.log("업데이트조건",updatePrdOutQty)

            this.proOutData.forEach((obj) => {
                insertPrdOutDtl.push({
                        order_dtl_cd: obj.order_dtl_cd,
                        prd_cd: obj.prd_cd, 
                        prd_out_qty: obj.prd_out_qty, 
                        prd_lot_cd: obj.prd_lot_cd,
                        note: obj.note,
                    });
            });
            
            console.log("출고디테일",insertPrdOutDtl);

            insertPrdOut.push({
                order_cd: this.order_code,
                act_cd: document.getElementById('acc_code').value,
                ID: document.getElementById('mem_id').value,

            });
            console.log("출고테이블",insertPrdOut);

            let insertPrdOutArr = [...insertPrdOut, insertPrdOutDtl ];   //첫번째가 헤드, 두번째가 디테일, 세번째 업데이트
            console.log("합친거",insertPrdOutArr);

            let result = await axios.post('/api/sales/prdOut', insertPrdOutArr)   //배열은 , 붙여서 보냄(객체가 + 붙여서 넘김)
                                .catch(err => console.log("axios에러",err));
            console.log(result.data.result);
            console.log(result.data);

            if(result.data.result == 'success'){
                this.$swal({
                    icon: "success",
                    title: "등록에 성공 하였습니다.",
                    text: "출고 제품 목록으로 이동합니다.",
                })
                .then(() => {
                    this.resetForm();   //등록 후 값 초기화
                    this.$router.push({name:'Sales_ProOutList'}) //OK누르면 목록으로 이동
                });              
            }
            return result;

        },
        // 등록 후 초기화 기능
        resetForm() {
            document.getElementById('acc_name').value = "";
            document.getElementById('acc_code').value = "";
            document.getElementById('mem_name').value = "";
            document.getElementById('mem_id').value = "";
            this.due_date = "";
            this.order_date = "";
            this.order_code = "";
            this.OLData = [];
            this.proOutData = [];         
        },

        //출고 수정
        async prdOutUpdate() {
            let updateResult 
            let updateStatus
            let upObj = [];
            let upRow = '';
            //뒷단에서 업데이트랑 인서트 한번에 하게 할려고 필요한 값들 한번에 보내기
            for(let i = 0; i < this.proOutData.length; i++){
                upRow = this.proOutData[i];
                upObj.push({
                    prd_out_dtl_cd : upRow.prd_out_dtl_cd,
                    prd_out_cd: this.selectNo,
                    order_dtl_cd: upRow.order_dtl_cd, 
                    prd_cd : upRow.prd_cd,
                    prd_out_qty: upRow.prd_out_qty,
                    prd_lot_cd: upRow.prd_lot_cd,
                    note: upRow.note,
                    stock: upRow.stock,
                    order_cd: this.POHead[0].order_cd
                })
            };
            updateResult = await axios.put(`/api/sales/prdOutUpdates`,upObj)
                                        .catch(err => console.log("updateAxiosError",err));       
            if(updateResult.data.result == 'success'){

                if(this.selected2 == 'prdOutEnd') {
                    console.log("출고")
                    updateStatus = await axios.put(`/api/sales/prdOutEndUpdates`,upObj)
                                        .catch(err => console.log("updateAxiosError",err));
                    if(updateStatus.data.result == 'success') {
                        this.$swal({
                        title: "Update!",
                        text: "GO to ProductOut List",
                        icon: "success"
                        }).then(result =>{
                            if(result){
                                this.$router.push({name:'Sales_ProOutList'}) //OK누르면 목록으로 이동
                            }
                        });
                    };
                };

                this.$swal({
                title: "Update!",
                text: "GO to ProductOut List",
                icon: "success"
                }).then(result =>{
                    if(result){
                        this.$router.push({name:'Sales_ProOutList'}) //OK누르면 목록으로 이동
                    }
                });     
            };
        },

        //출고 삭제(제품수량 업데이트 후)
        async prdOutDelete() {
            // let updateResult
            // let upObj = [];
            // let upRow = '';
            
            // for(let i = 0; i < this.proOutData.length; i++){
            //     upRow = this.proOutData[i];
            //     upObj.push({
            //         prd_lot_cd : upRow.prd_lot_cd,
            //         prd_out_qty: upRow.prd_out_qty,
            //     })
            // };
            // updateResult = await axios.put(`/api/sales/prdOutDeleteQty`,upObj)
            //                           .catch(err => console.log("updateAxiosError",err));  
            // if(updateResult.data.result == 'success'){
                this.$swal({
                    title: "정말 삭제하시겠습니까??",
                    text: "",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete!"
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        //출고 제품 삭제
                        let result2 = await axios.delete(`/api/sales/prdOutDelete/${this.selectNo}`)
                                                .catch(err => console.log("deleteAxios에러",err));

                        if(result2.data.result == 'success'){
                            //출고 제품 삭제 후 상태 원복
                            let result3 = await axios.put(`/api/sales/prdOutDeleteStatus/${this.order_code}`)
                                                    .catch(err => console.log("Status에러",err));

                            if(result3.data.result == 'success'){
                                this.resetForm(); // 초기화
                            
                                this.$swal({
                                title: "DELETE!",
                                text: "GO to ProductOut List",
                                icon: "success"
                                }).then(result =>{
                                    if(result){
                                        this.$router.push({name:'Sales_ProOutList'}) //OK누르면 목록으로 이동
                                    }
                                })
                            }
                            
                        }                        
                    }
                });
            //};
        }, 

        //출고 단건 삭제(제품수량 업데이트 후)
        async prdOutListDelete() {
            // let updateResult
            // let upObj = [];

            // if(this.prd_out_qty == null){
            //     this.prd_out_qty = 0;
            // }

            // upObj.push({
            //     prd_lot_cd : this.prd_lot_cd,
            //     prd_out_qty: this.prd_out_qty,
            // })

            // updateResult = await axios.put(`/api/sales/prdOutDeleteQty`,upObj)
            //                           .catch(err => console.log("updateAxiosError",err));  
            // if(updateResult.data.result == 'success'){
                let result2 = await axios.delete(`/api/sales/prdOutListDelete/${this.prd_out_dtl_cd}`)
                                         .catch(err => console.log("deleteAxios에러",err));
                console.log(result2.data.result);
            //}
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

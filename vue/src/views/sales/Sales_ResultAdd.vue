<!-- 반품제품등록 -->

<template>
  <div class="py-4 container-fluid" @keydown.esc="modalCloseFunc">
      <div class="card">

          <!-- 반품 테이블 부분 -->
          <div class="card-header bg-light ps-5 ps-md-4">
              <div class="row">
                  <div class="col-6 col-lg-2"></div>
                  
                  <div class="col-6 col-lg-1 text-center mb-3 mt-2 fw-bolder" :style="t_overflow">출고 코드</div> 
                  <div class="input-group mb-2 w-25">
                      <input type="text" class="form-control" v-model="prdOut_code" aria-label="Recipient's username" aria-describedby="button-addon2" 
                      style="height: 41px; background-color: rgb(236, 236, 236);"  readonly />
                      <button class="btn btn-warning" type="button" v-if="this.isdetail == false" @click="modalOpen"><i class="fa-solid fa-magnifying-glass"></i></button>
                  </div>
                  <div class="col-6 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">출고 일자</div> 
                  <div class="col-6 col-lg-3">
                      <input class="form-control" style="background-color: rgb(236, 236, 236);" type="date" v-model="prdOut_date" readonly />
                  </div>
              
              </div>
              <div class="row">
                  <div class="col-6 col-lg-2 "></div>
                  <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">거래처 명</div> 
                  <div class="col-6 col-lg-3 mb-3">
                      <input class="form-control" style="background-color: rgb(236, 236, 236);" type="text" v-model="acc_name" readonly />
                  </div>
                  <!-- <div class="col-6 col-lg-1"></div> -->
                  <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">거래처 코드</div> 
                  <div class="col-6 col-lg-3 mb-3">
                      <input class="form-control" style="background-color: rgb(236, 236, 236);" type="text" v-model="acc_code" readonly />
                  </div>
              </div>

              <div class="row">
                  <div class="col-6 col-lg-2"></div>
                  <div class="col-6 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">담당자 명</div> 
                  <div class="input-group w-25">
                      <input type="text" class="form-control" v-model="mem_name" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px; background-color: rgb(236, 236, 236);" readonly />
                      <button class="btn btn-warning" type="button" v-if="this.isdetail == false" @click="modalOpen2"><i class="fa-solid fa-magnifying-glass"></i></button>
                  </div>
                  <div class="col-6 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">담당자 ID</div> 
                  <div class="col-6 col-lg-3">
                      <input class="form-control" style="background-color: rgb(236, 236, 236);" type="text" v-model="mem_id" readonly />
                  </div>
              </div>
          </div>

          <!-- 반품디테일 테이블 부분 -->
          <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                        <p class="fw-bolder">제품 목록</p>
                        <ag-grid-vue style="width:100%; height: 350px;"
                        class="ag-theme-alpine"
                        :columnDefs="POLDefs"
                        :rowData="POLData"
                        :gridOptions="sellgridOptions"
                        @grid-ready="gridFit"
                        overlayNoRowsTemplate="출고제품을 조회 하여주세요.">
                        </ag-grid-vue>
                    </div>
                    <div class="col-md-8">
                        <p class="fw-bolder">제품별 LOT</p>
                        <ag-grid-vue style="width:100%; height: 350px;"
                        class="ag-theme-alpine"
                        :columnDefs="prdRTDefs"
                        :rowData="prdRTData"
                        :gridOptions="newgridOptions"
                        @grid-ready="gridFit"
                        overlayNoRowsTemplate="제품의 LOT를 선택해주세요.">
                        </ag-grid-vue>
                    </div>
                </div>

                <div class="center " v-if="this.isdetail == false"> <!--등록페이지-->
                    <button class="btn btn-primary mtp30" @click="prdReturnInsert">등록</button>
                    <button class="btn btn-secondary mlp10 mtp30" @click="resetForm">초기화</button>
                </div>
                <div class="center " v-if="this.isdetail == true"> <!--상세페이지-->
                    <button v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT3' )"
                     class="btn btn-success mtp30" @click="returnUpdate">수정</button>
                    <button v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT3' )"
                     class="btn btn-secondary mlp10 mtp30" @click="prdReturnDelete">삭제</button>
                </div>
          </div>
      </div>
  </div>

  <!-- 출고제품 조회 모달 -->
  <Layout :modalCheck="asModal">
      <template v-slot:header> 
          <h5 class="modal-title">출고 목록 조회</h5>
          <button type="button" aria-label="Close" class="close" @click="modalOpen">×</button>
      </template>
      <template v-slot:default>
          <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px;" :columnDefs="prdOutDefs"
          :rowData="prdOutData" :pagination="true" @rowClicked="modalClicked" @grid-ready="gridFit"
          overlayNoRowsTemplate="등록된 출고 목록이 없습니다.">
          </ag-grid-vue>
      </template>
      <template v-slot:footer>
          <button v-show="hidden" type="button" class="btn btn-secondary" @click="modalOpen">Cancel</button>
          <button v-show="hidden" type="button" class="btn btn-primary" @click="modalOpen">OK</button>
      </template>
  </Layout>

  <!-- 담당자 조회 모달 -->
  <Layout :modalCheck="msModal">
      <template v-slot:header> 
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
      <template v-slot:header> 
          <h5 class="modal-title">LOT를 선택 해주세요.</h5>
          <button type="button" aria-label="Close" class="close" @click="modalOpen3">×</button>
      </template>
      <template v-slot:default>
          <ag-grid-vue class="ag-theme-alpine" 
          ref="lotGrid"
          style="width: 100%; height: 400px;" 
          :columnDefs="returnLotDefs"
          :rowData="returnLotData" 
          :pagination="true" 
          :gridOptions="gridOptions"
          rowClicked="multiple" 
          @grid-ready="gridFit"
          overlayNoRowsTemplate="등록된 출고제품이 없습니다.">
          </ag-grid-vue>
      </template>
      <template v-slot:footer>
          <button  type="button" class="btn btn-secondary" @click="modalOpen3">취소</button>
          <button  type="button" class="btn btn-primary" @click="modalClicked3">저장</button>
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

            //상세 헤드부분에 넣을 데이터 
            RLHead: {
                act_cd: '',
                act_nm: '',
                id: '',
                name: '',
                prd_out_cd: '',
                prd_out_dt: ''
            }, 
            //단건 삭제를 위해 선언
            prd_return_dtl_cd: '',

            //input박스에 값 넣기 위해 선언
            acc_code: '',
            acc_name: '', 
            mem_id: '', 
            mem_name: '', 
            prdOut_date: '', 
            prdOut_code: '', 

            prd_cd: '',
            test: 'update',

            POLDefs: [

                {headerName: '제품 코드', field: 'prd_cd', cellStyle: { textAlign: "center" }},
                {headerName: '제품 이름', field: 'prd_nm', cellStyle: { textAlign: "center" }},
                {
                    headerName: '제품 출고 수량', 
                    field: 'prd_out_qty', 
                    cellStyle: { textAlign: "right" },
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                },
                {
                    headerName: 'LOT선택' ,
                    field: 'lotlist', 
                    cellStyle: { textAlign: "center" },
                    cellRenderer: (params) => {
                        //등록 페이지
                        if(this.isdetail == false){
                            const button = document.createElement('button');
                            button.innerText = '상세보기';
                            button.className = 'btn btn-warning btn-xsm';
                            button.addEventListener('click', () => {
                                this.modalOpen3(); //LOT모달 오픈
                                this.prd_cd = params.data.prd_cd //선택한 행에 제품명 담기
                                this.getOutLotList();
                            });
                            return button;
                        };
                        // 상세 페이지 일떄
                        if(this.isdetail == true){
                            //관리자랑 영업팀장만 검색할 수 있다
                            if(this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT3' )){
                                const button = document.createElement('button');
                                button.innerText = '상세보기';
                                button.className = 'btn btn-warning btn-xsm';
                                button.addEventListener('click', () => {
                                    this.modalOpen3(); //LOT모달 오픈
                                    this.prd_cd = params.data.prd_cd //선택한 행에 제품명 담기
                                    this.getOutLotList();
                                });
                                return button;
                            }
                        };
                    }
                 },
            ],
            POLData: [ ],

            sellgridOptions: {
                rowSelection: {
                    mode:"singleRow",
                    checkboxes: false,
                    enableClickSelection: true,
                }
            },

            returnLotDefs: [
                {headerName: '출고상세코드', field: 'prd_out_dtl_cd', cellStyle: { textAlign: "center" }, width: 120},
                {headerName: 'LOT', field: 'prd_lot_cd', cellStyle: { textAlign: "center" }, width: 180},
                {headerName: '제품 코드', field: 'prd_cd', cellStyle: { textAlign: "center" }, width: 120},
                {headerName: '제품 이름', field: 'prd_nm', cellStyle: { textAlign: "center" }, width: 120},
                {
                    headerName: '출고 수량', 
                    field: 'prd_out_qty', 
                    cellStyle: { textAlign: "right" },
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    }, 
                    width: 120
                },
                
            ],
            returnLotData: [],
            
            gridOptions: {
                rowSelection: { mode: "multiRow" },
                suppressMovableColumns: true,
            },

            prdRTDefs: [
                {headerName: '반품상세코드', field: 'prd_return_dtl_cd', cellStyle: { textAlign: "center" }, hide: true},
                {headerName: '출고상세코드', field: 'prd_out_dtl_cd', cellStyle: { textAlign: "center" }, hide: true},
                {headerName: '제품코드', field: 'prd_cd', cellStyle: { textAlign: "center" }},
                {headerName: 'LOT', field: 'prd_lot_cd', cellStyle: { textAlign: "center" }, width: 250},
                {
                    headerName: '출고 수량', 
                    field: 'prd_out_qty', 
                    cellStyle: { textAlign: "right" },
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                },
                {
                    headerName: '반품 수량', 
                    field: 'prd_return_qty', 
                    editable: this.sessionEditable, 
                    cellStyle: { textAlign: "right" }, 
                    cellDataType: 'number',
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                    cellRenderer: this.placeholderRenderer, // Placeholder 기능 추가
                },
                {headerName: '반품사유', field: 'note', cellStyle: { textAlign: "center" }, editable: this.sessionEditable},
                {
                    headerName: '삭제' ,
                    field: 'delete', 
                    width: 150,
                    cellStyle: { textAlign: "center" },
                    cellRenderer: (params) => {
                        //등록 페이지
                        if(this.isdetail == false){
                            const button = document.createElement('button');
                            button.innerText = '삭제';
                            button.className = 'btn btn-danger btn-xsm';
                            button.addEventListener('click', () => {
                                //행만 삭제
                                this.prdRTData = this.prdRTData.filter(row => row !== params.data);
                            });
                            return button;
                        };
                        // 상세 페이지 일떄
                        if(this.isdetail == true){
                            //관리자랑 영업팀장만 삭제할 수 있다
                            if(this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT3' )){
                                const button = document.createElement('button');
                                button.innerText = '삭제';
                                button.className = 'btn btn-danger btn-xsm';
                                button.addEventListener('click', () => {                                    
                                    //한 행에 관한 단건 딜리트 메소드
                                    this.prd_return_dtl_cd = params.data.prd_return_dtl_cd;
                                    this.returnListDelete();

                                    this.prdRTData = this.prdRTData.filter(row => row !== params.data);
                                    
                                });
                                return button;
                            }
                        };
                    }
                },
            ],
            prdRTData: [],

            //반품수량이 출구수량을 못 넘기게 하기
            newgridOptions: {
                    onCellValueChanged: (params) => {
                    if (params.colDef.field === 'prd_return_qty') {
                        const returnQty = params.data.prd_return_qty || 0;
                        const outQty = params.data.prd_out_qty || 0;

                        if (returnQty > outQty) {
                            // 알림 메시지 또는 에러 처리
                            this.$swal({
                                icon: "error",
                                title: "다시 입력 해주세요.",
                                text: "반품 수량은 출고 수량을 초과할 수 없습니다.",
                            });

                            //이전 값으로 되돌리기(행 데이터를 재설정)
                            params.node.setData({
                                ...params.data, //기존 데이터 유지
                                prd_return_qty: params.oldValue ?? 0,   //prd_return_qty만 수정
                            });
                            // 강제로 UI 업데이트(잘목된 값이 UI에 남아 있는 문제방지)
                            params.api.refreshCells({ force: true });
                        }
                        //음수 못 넣게 하기
                        if (returnQty < 0) {
                            this.$swal({
                                icon: "error",
                                title: "다시 입력 해주세요.",
                                text: "반품 수량은 음수가 될 수 없습니다.",
                            });
                            params.node.setData({
                                ...params.data,
                                prd_return_qty: params.oldValue ?? 0,
                            });
                            params.api.refreshCells({ force: true });
                        }
                    }
                },
            },

            prdOutDefs: [
                {headerName: '출고 코드', field: 'prd_out_cd', cellStyle: { textAlign: "center" }, width: 100},
                {headerName: '거래처 코드', field: 'act_cd', cellStyle: { textAlign: "center" }, width: 120},
                {headerName: '거래처 명', field: 'act_nm', cellStyle: { textAlign: "center" }, filter: 'agTextColumnFilter' , width: 130},
                {headerName: '출고 담당자', field: 'name', cellStyle: { textAlign: "center" }, filter: 'agTextColumnFilter', width: 150},
                {headerName: '출고 일자', field: 'prd_out_dt', cellStyle: { textAlign: "center" }, valueFormatter: this.$comm.dateFormatter, width: 150},
            ],
            prdOutData: [],
            memDefs: [
                {headerName: '담당자 ID', field: 'ID', cellStyle: { textAlign: "center" }},
                {headerName: '담당자 명', field: 'name', cellStyle: { textAlign: "center" }, filter: 'agTextColumnFilter'},
                {headerName: '부서', field: 'dpt_nm', cellStyle: { textAlign: "center" }, filter: 'agTextColumnFilter'},
            ],
            memData: [],
            


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
        this.$store.dispatch('breadCrumb', { title: '반품 제품 등록' });

        let selectNo = this.$route.query.bno;
        this.selectNo = this.$route.query.bno; //this.으로 저장해야 created()밖에서도 사용 가능
        
        if(selectNo != null){
            //수정    
            this.isdetail = true;     

            //페이지 이름
            this.$store.dispatch('breadCrumb', { title: '반품 제품 상세' });
            //상세조회(헤드)
            this.returnDtlList(selectNo)

        }else{
            //등록
            // this.boardInfo.created_date = this.getToday();  
        }

        this.getOrdList();
        this.getMemList();
    },
    methods: {
        modalCloseFunc() {
            if(this.asModal){
                this.asModal = !this.asModal;
            }
            if(this.msModal){
                this.msModal = !this.msModal;
            }
            if(this.psModal){
                this.psModal = !this.psModal;
            }
        },
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
            this.prdOut_code = params.data.prd_out_cd;
            this.prdOut_date = this.$comm.dateFormatter(params.data.prd_out_dt);         
            this.acc_name = params.data.act_nm;
            this.acc_code = params.data.act_cd;

            //모달에서 출고제품 코드 선택시 출고목록조회 메소드가 실행 되므로 여기서 실행
            this.getOutOrdList();

            this.asModal = !this.asModal;
        },
        modalClicked2(params) {
           
            this.mem_name = params.data.name;
            this.mem_id = params.data.ID;

            this.msModal = !this.msModal;
        },
        modalClicked3() {
            
            const selectedRows = this.$refs.lotGrid.api.getSelectedRows();

            // 기존 데이터에서 중복을 방지할 키값(prd_out_dtl_cd)
            const existingData = new Set(this.prdRTData.map(row => row.prd_out_dtl_cd));

            const newRowData = selectedRows
            .filter(row => {
                // prd_out_dtl_cd가 기존 데이터에 없는 경우에만 추가(.has()는 set안에 값이 존재하느지 확인하고 true/false를 반환)
                return !existingData.has(row.prd_out_dtl_cd);
            })
            .map(row => ({
                
                prd_out_dtl_cd: row.prd_out_dtl_cd, 
                prd_cd: row.prd_cd,
                prd_lot_cd: row.prd_lot_cd,
                prd_out_qty: row.prd_out_qty, 
                prd_return_qty: '',
                note: '',  
                delete: 'delete', 

            }));
            
            this.prdRTData = [...this.prdRTData, ...newRowData]; // 기존 데이터 유지하면서 새 데이터 추가
            
            this.psModal = !this.psModal;
        },
        placeholderRenderer(params) {
            // 주문 수량 값이 없으면 placeholder 텍스트 표시
            if (!params.value) {
                return `<span style="color: gray; font-style: italic;">숫자만 입력하세요.</span>`;
            }
            return params.value.toLocaleString ? params.value.toLocaleString() : params.value; // 값이 있으면 그대로 표시
        },
        //입력창을 조건따라 넣고 안넣고 하기
        sessionEditable(){
            if(this.isdetail == true){  //수정 페이지 이면서 관리자랑 영업팀장은 입력가능
                if(this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT3' )){
                    return true
                }
            } else if(this.isdetail == false){  //등록 페이지 일때 입력가능
                return true
            }else{
                return false;
            }
        },

        //상세조회 반품제품 헤드부분
        async returnDtlList(selectNo) {
            let result = await axios.get(`/api/sales/retrunDtlList/${selectNo}`)
                                    .catch(err => console.log("RDListError",err));
            this.RLHead = result.data;

            this.returnHeadList();
            this.getOutOrdList(); //출고제품코드 따라 나오는 출고목록은 등록이나 상세나 똑같기 때문에 여기서도 선언
            //상세조회(디테일 LOT부분)
            this.returnDtlLotList(selectNo)
        },
        returnHeadList(){
            this.acc_code = this.RLHead[0].act_cd;
            this.acc_name = this.RLHead[0].act_nm;
            this.mem_id = this.RLHead[0].id;
            this.mem_name = this.RLHead[0].name;
            this.prdOut_date = this.RLHead[0].prd_out_dt.slice(0, 10); //길이가 안맞아서 안나옴 그래서 뒤에 시간부분 자름
            this.prdOut_code = this.RLHead[0].prd_out_cd;

            
        },

        //상세조회 반품제품 디테일부분(LOT)
        async returnDtlLotList(selectNo) {
            let result = await axios.get(`/api/sales/returnDtlLotList/${selectNo}`)
                                    .catch(err => console.log("prdRTDError",err));
            this.prdRTData = result.data;

        },

        //상세조회 반품제품 디테일부분(LOT부분)-lot선택시
        // async getreturnLotList() {
        //     let searchLot = { rtc : this.selectNo , pdc : this.prd_cd };

        //     let result = await axios.get(`/api/sales/dtlReturnDtlList/`, {params : searchLot}) 
        //                             .catch(err => console.log("axiosERROR",err));
        //     this.prdRTData = result.data;
            // console.log("detail1",this.prdRTData.type);
            // this.prdRTData[0].type = this.test;
            // console.log("detail",this.prdRTData);
        //},

        //출고제품 코드를 따라 나오는 출고목록들
        async getOutOrdList() { 
            let result = await axios.get(`/api/sales/POL/${this.prdOut_code}`)
                                    .catch(err => console.log("Axios",err));
            this.POLData = result.data;
        },

        //출고조회(모달)
        async getOrdList() {
            let result = await axios.get('/api/moprdout')
                                    .catch(err => console.log(err));
            this.prdOutData = result.data; 
        },

        //출고제품의 이름을 따라서 나오는 LOT조회(모달창)
        async getOutLotList() {

          let searchLot = { poc : this.prdOut_code , pdc : this.prd_cd };
          
          let result = await axios.get(`/api/sales/returnLot/`, {params : searchLot}) 
                                  .catch(err => console.log("axiosERROR",err));
          this.returnLotData = result.data;
        },

        async getMemList() {
            let result = await axios.get('/api/momem')
                                    .catch(err => console.log(err));
            this.memData = result.data; 
        },


        async prdReturnInsert() {

            // 필수값 입력 알람
            let accCode = this.acc_code;
            let memId = this.mem_id;
            let rowQty = this.prdRTData.filter(row => !row.prd_return_qty || row.prd_return_qty <= 0);

            if (!accCode) {
                this.$swal({
                    icon: "error",
                    title: "출고 코드를 선택 해주세요.",
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
            if (!this.prdRTData || this.prdRTData.length === 0) {
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
                    title: "반품 수량을 입력하세요",
                    text: "입력 후 엔터를 쳐주세요",
                });
                return;
            }
            

            //반품 등록
            let insertReturn = [];
            let insertReturnDtl = [];


            this.prdRTData.forEach((obj) => {
                insertReturnDtl.push({
                    

                    prd_out_dtl_cd: obj.prd_out_dtl_cd,
                    prd_cd: obj.prd_cd, 
                    prd_lot_cd: obj.prd_lot_cd, 
                    prd_return_qty: obj.prd_return_qty,
                    note: obj.note,
                });
            });

            insertReturn.push({
                prd_out_cd: this.prdOut_code,
                act_cd: this.acc_code,
                ID: this.mem_id,

            });

            let insertReturnArr = [...insertReturn, insertReturnDtl ];   //첫번째가 헤드, 두번째가 디테일, 세번째 업데이트

            let result = await axios.post('/api/sales/prdReturn', insertReturnArr)   //배열은 , 붙여서 보냄(객체가 + 붙여서 넘김)
                                .catch(err => console.log("axios에러",err));

            if(result.data.result == 'success'){
                this.$swal({
                    icon: "success",
                    title: "등록완료",
                    text: "등록한 반품제품은 목록에서 확인 해주세요.",
                })
                .then(() => {
                    this.resetForm();   //등록 후 값 초기화
                });              
            }
            return result;

        },
        // 등록 후 초기화 기능
        resetForm() {
            
            this.prdOut_code = "";
            this.prdOut_date = "";
            this.acc_name = "";
            this.acc_code = "";
            this.mem_name = "";
            this.mem_id = "";

            this.POLData = [];
            this.prdRTData = [];         
        },

        //반품 삭제
        prdReturnDelete() {
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
                    let result2 = await axios.delete(`/api/sales/returnDelete/${this.selectNo}`)
                                             .catch(err => console.log("deleteAxios에러",err));
                    if(result2.data.result == 'success'){
                        this.resetForm(); // 초기화
                        
                        this.$swal({
                        title: "삭제완료",
                        text: "반품 제품 목록으로 이동합니다.",
                        icon: "success"
                        }).then(result =>{
                            if(result){
                                this.$router.push({name:'Sales_ResultList'}) //OK누르면 목록으로 이동
                            }
                        })
                    }                        
                }
            });
        },

        //반품 단건삭제
        async returnListDelete() {           
            let result2 = await axios.delete(`/api/sales/returnListDelete/${this.prd_return_dtl_cd}`)
                                    .catch(err => console.log("deleteAxios에러",err));                        
            console.log(result2.data.result);
        },
        
        //반품 제품 수정 한번에 하기
        async returnUpdate() {
            let updateResult 
            let upObj = [];
            let upRow = '';
            //뒷단에서 업데이트랑 인서트 한번에 하게 할려고 필요한 값들 한번에 보내기
            for(let i = 0; i < this.prdRTData.length; i++){
                upRow = this.prdRTData[i];
                upObj.push({
                    prd_return_dtl_cd : upRow.prd_return_dtl_cd,
                    prd_return_cd: this.selectNo,
                    prd_cd: upRow.prd_cd, 
                    prd_lot_cd : upRow.prd_lot_cd,
                    prd_return_qty: upRow.prd_return_qty,
                    note: upRow.note,
                    prd_out_dtl_cd: upRow.prd_out_dtl_cd
                })
            };
            updateResult = await axios.put(`/api/sales/returnUpdates`,upObj)
                                        .catch(err => console.log("updateAxiosError",err));       
            if(updateResult.data.result == 'success'){
                this.$swal({
                title: "수정완료",
                text: "반품 제품 목록으로 이동합니다",
                icon: "success"
                }).then(result =>{
                    if(result){
                        this.$router.push({name:'Sales_ResultList'}) //OK누르면 목록으로 이동
                    }
                });     
            };
        },

        // //반품 수정
        // async prdReturnUpdate() {
        //     //반품 수정을 위한 삭제
        //     let result = await axios.delete(`/api/sales/returnUpdateDelete/${this.selectNo}`)
        //                             .catch(err => console.log("deleteAxios에러",err));
        //     if(result.data.result == 'success'){
        //         //반품 수정을 위한 등록
        //         this.returnUpdateInsert();
        //     }
        // },
        // async returnUpdateInsert() {
        //     let updateInsert = [];

        //     this.prdRTData.forEach((obj) => {
        //         updateInsert.push({
        //             prd_return_dtl_cd: obj.prd_return_dtl_cd,
        //             prd_out_dtl_cd: obj.prd_out_dtl_cd, 
        //             prd_cd: obj.prd_cd, 
        //             prd_lot_cd: obj.prd_lot_cd, 
        //             prd_return_qty: obj.prd_return_qty,
        //             note: obj.note,
                    
        //             prd_return_cd: this.selectNo
        //         });
        //     });
        //     console.log("insert",updateInsert)

        //     let result = await axios.post('/api/sales/returnUpdateInsert', updateInsert)   
        //                             .catch(err => console.log("axios에러",err));
        //     if(result.data.result === 'success'){
        //         this.$swal({
        //             icon: "success",
        //             title: "UPDATE!",
        //             text: "반품 제품을 수정 하였습니다.",
        //         })
        //     };
        // },


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

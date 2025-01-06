<!-- 주문서 등록 -->
<style>
#acc_name[readonly] {
    background-color: rgb(236, 236, 236);
}
#acc_code[readonly] {
    background-color: rgb(236, 236, 236);
}
#mem_name[readonly] {
    background-color: rgb(236, 236, 236);
}
#mem_id[readonly] {
    background-color: rgb(236, 236, 236);
}
</style>
<template>
    <div class="py-4 container-fluid" @keydown.esc="modalCloseFunc">
        <div class="card">

            <!-- 주문 등록 폼 -->
            <div class="card-header bg-light ps-5 ps-md-4">
                <div class="row">
                    <div class="col-6 col-lg-2"></div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">거래처 명</div> 

                    <div class="input-group mb-3 w-25">
                        <input type="text" class="form-control" id="acc_name" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px; background-color: rgb(236, 236, 236);" readonly />
                        <button class="btn btn-warning" type="button" v-if="this.isdetail == false" @click="modalOpen"><i class="fa-solid fa-magnifying-glass"></i></button>
                    </div>

                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">거래처 코드</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="text" id="acc_code" value="" readonly />
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 col-lg-2"></div>
                    
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">담당자 명</div> 
                    
                    <div class="input-group mb-3 w-25">
                        <input type="text" class="form-control" id="mem_name" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px; background-color: rgb(236, 236, 236);" readonly />
                        <button class="btn btn-warning" type="button" v-if="this.isdetail == false" @click="modalOpen2"><i class="fa-solid fa-magnifying-glass"></i></button>
                    </div>

                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">담당자 ID</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="text" id="mem_id" value="" readonly />
                    </div>
                </div>
                <div class="row" v-if="this.isdetail == false">
                    <div class="col-6 col-lg-2"></div>                    
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">주문일자</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="date" :max="due_date"  v-model="order_date" />
                    </div>
                    <div class="col-6 col-lg-1"></div> 
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">납기일자</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="date" :min="order_date" v-model="due_date" />
                    </div>
                </div>
                <div class="row" v-if="this.isdetail == true">
                    <div class="col-6 col-lg-2"></div>                    
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">주문일자</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="date" v-model="order_date" readonly style="background-color: rgb(236, 236, 236);" />
                    </div>
                    <div class="col-6 col-lg-1"></div> 
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">납기일자</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="date" v-model="due_date" readonly style="background-color: rgb(236, 236, 236);"/>
                    </div>
                </div>
            </div>
            <!-- 주문디테일 테이블 부분 -->
            <div class="card-body">
                <!--등록페이지-->
                <div class="row" v-if="this.isdetail == false">
                    <div class="col-6 col-lg-11"></div>
                    <div class="col-6 col-lg-1 mb-2 text-end text-md-start">
                        <button v-if="this.$session.get('user_ps') == 'H01' || this.$session.get('user_dpt') == 'DPT3' "
                         class="btn btn-warning " @click="modalOpen3">제품 조회</button>
                    </div>
                </div>
                <!--상세페이지 이면서 주문완료 상태일때만-->
                <div class="row" v-if="this.isdetail == true && this.status == 'J01'">
                    <div class="col-6 col-lg-11"></div>
                    <div class="col-6 col-lg-1 mb-2 text-end text-md-start">
                        <button v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT3' )"
                         class="btn btn-warning " @click="modalOpen3">제품 조회</button>
                    </div>
                </div>

                <ag-grid-vue style="width:100%; height: 380px;"
                class="ag-theme-alpine"
                :columnDefs="columnDefs"
                :rowData="rowData"
                @grid-ready="gridFit"
                overlayNoRowsTemplate="제품 조회 버튼을 이용하여 제품을 추가 해주세요.">
                </ag-grid-vue>
                
                <div class="center " v-if="this.isdetail == false"> <!--등록페이지-->
                    <button class="btn btn-primary mtp30" @click="ordInsert">등록</button>
                    <button class="btn btn-secondary mlp10 mtp30" @click="resetForm">초기화</button>
                </div>
                <div class="center " v-if="this.isdetail == true && this.status == 'J01'"> <!--상세페이지 이면서 주문완료 상태일때만-->
                    <button v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT3' )"
                     class="btn btn-success mtp30" @click="orderUpdate">수정</button>
                    <button v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT3' )"
                     class="btn btn-danger mlp10 mtp30" @click="orderDelete">삭제</button>
                </div>
            </div> 
        </div>
    </div>
    <!-- 거래처 조회 모달 -->
    <Layout :modalCheck="asModal">
        <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
            <h5 class="modal-title">거래처 조회</h5>
            <button type="button" aria-label="Close" class="close" @click="modalOpen">×</button>
        </template>
        <template v-slot:default>
            <ag-grid-vue class="ag-theme-alpine" style="width: 100%; height: 400px;" :columnDefs="accDefs"
            :rowData="accData" :pagination="true" @rowClicked="modalClicked" @grid-ready="gridFit"
            overlayNoRowsTemplate="등록된 거래처가 없습니다.">
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
            <button v-show="hidden" type="button" class="btn btn-secondary" @click="modalOpen2">닫기</button>
            <button v-show="hidden" type="button" class="btn btn-primary" @click="modalOpen2">저장</button>
        </template>
    </Layout>

    <!-- 제품 조회 모달 -->
    <Layout :modalCheck="psModal">
        <template v-slot:header> 
            <h5 class="modal-title">제품 조회</h5>
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
            <button type="button" class="btn btn-secondary" @click="modalOpen3">닫기</button>
            <button type="button" class="btn btn-primary" @click="modalClicked3">저장</button>
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
            
            //수정후에 인서트할 값 담기
            upInsert: [],
            updateRow: [],

            OLHead: {
                act_cd: '',
                act_nm: '',
                id: '',
                name: '',
                order_dt: '',
                due_dt: '',
                status: ''
            }, 
            //주문완료 확인용
            status:'',

            order_dtl_cd: '',

            //테스트 값을 넘기기 위해 담을 곳 만들기
            test: '',
            //날짜 검색에 최소값과 최댓값을 위해서 바인딩이 필요하므로 설정
            due_date: '',
            order_date: '',
            
            columnDefs: [
                {headerName: '주문디테일코드', field: 'order_dtl_cd', cellStyle: { textAlign: "center" }, hide: true},
                {headerName: '제품 코드', field: 'prd_cd', cellStyle: { textAlign: "center" }},
                {headerName: '제품 이름', field: 'prd_nm', cellStyle: { textAlign: "center" }},
                {
                    headerName: '주문 수량', 
                    field: 'order_qty', 
                    editable: this.sessionEditable, 
                    cellStyle: { textAlign: "right" }, 
                    cellDataType: 'number',
                    // valueFormatter: (params) => {
                    //     if (params.value == null || params.value === '') return '';
                    //     return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    // },
                    cellRenderer: this.placeholderRenderer, // Placeholder 기능 추가
                },
                {headerName: '비고', field: 'note', editable: this.sessionEditable, cellStyle: { textAlign: "center" }},
                {
                    headerName: '삭제' ,
                    field: 'delete', 
                    cellStyle: { textAlign: "center" },
                    cellRenderer: (params) => {
                        //등록 페이지
                        if(this.isdetail == false){
                            const button = document.createElement('button');
                            button.innerText = '삭제';
                            button.className = 'btn btn-danger btn-xsm';
                            button.addEventListener('click', () => {
                                //행만 삭제
                                this.rowData = this.rowData.filter(row => row !== params.data);
                            });
                            return button;
                        };
                        // 상세페이지 이면서 주문완료 상태일때만
                        if(this.isdetail == true && this.status == 'J01'){
                            //관리자랑 영업팀장만 삭제할 수 있다
                            if(this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT3' )){
                                const button = document.createElement('button');
                                button.innerText = '삭제';
                                button.className = 'btn btn-danger btn-xsm';
                                button.addEventListener('click', () => {
                                    
                                    //한 행에 관한 단건 딜리트 메소드
                                    this.order_dtl_cd = params.data.order_dtl_cd;
                                    this.orderListDelete();
                                    this.rowData = this.rowData.filter(row => row !== params.data);
                                    
                                });
                                return button;
                            }
                        };
                    }                    
                },
            ],
            rowData: [ ],
            accDefs: [
                {headerName: '거래처 코드', field: 'act_cd', filter: 'agTextColumnFilter', cellStyle: { textAlign: "center" } },
                {headerName: '거래처 명', field: 'act_nm', filter: 'agTextColumnFilter', cellStyle: { textAlign: "center" } },
                {headerName: '구분', field: 'act_type', filter: 'agTextColumnFilter', cellStyle: { textAlign: "center" } },
            ],
            accData: [],
            memDefs: [
                {headerName: '담당자 ID', field: 'ID', filter: 'agTextColumnFilter', cellStyle: { textAlign: "center" }},
                {headerName: '담당자 명', field: 'name', filter: 'agTextColumnFilter', cellStyle: { textAlign: "center" }},
                {headerName: '부서', field: 'dpt_nm', filter: 'agTextColumnFilter', cellStyle: { textAlign: "center" }},
            ],
            memData: [],
            proDefs: [
                {headerName: '제품 코드', field: 'prd_cd', filter: 'agTextColumnFilter', cellStyle: { textAlign: "center" }},
                {headerName: '제품 이름', field: 'prd_nm', filter: 'agTextColumnFilter', cellStyle: { textAlign: "center" }},
                {
                    headerName: '제품 수량', 
                    field: 'stock', 
                    filter: 'agTextColumnFilter', 
                    cellStyle: { textAlign: "right" },
                    valueFormatter: (params) => {
                        if (params.value == null || params.value === '') return '';
                        return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                    },
                },
            ],
            proData: [],

            gridOptions: {
                rowSelection: { mode: "multiRow" },
                suppressMovableColumns: true,
            },

            asModal: false,
            msModal: false,
            psModal: false,

            //그리드 테이블에 필터를 넣어서 검색하게 만들어줌
            defaultColDef: {    //따로 검색창 만들어서 하는것 도전 했으나 실패...기본 필터만 나옴
            flex: 1,
            filter: true, // 모든 컬럼에 필터 기본 활성화
            },
        }
    },
    components: {
        AgGridVue,
        Layout
    },
    
    created() {
        this.$store.dispatch('breadCrumb', { title: '주문서 등록' });

        let selectNo = this.$route.query.bno;
        this.selectNo = this.$route.query.bno; //this.으로 저장해야 created()밖에서도 사용 가능
        
        if(selectNo != null){
            //수정    
            this.isdetail = true;     

            //상세조회(헤드)
            this.orderList(selectNo)
            //상세조회(디테일)
            this.orderDtlList(selectNo)
            //페이지 이름
            this.$store.dispatch('breadCrumb', { title: '주문서 상세' });

        }else{
            //등록
            // this.boardInfo.created_date = this.getToday();  
        }

        this.getAccList();
        this.getMemList();
        this.getProList();
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
        //거래처모달선택
        modalClicked(params) {
            document.getElementById('acc_code').value = params.data.act_cd;
            document.getElementById('acc_name').value = params.data.act_nm;
            this.asModal = !this.asModal;
        },
        modalClicked2(params) {
            document.getElementById('mem_id').value = params.data.ID;

            //테스트 다른 데이터에 넘기기 위해 담기
            this.test = params.data.ID;

            document.getElementById('mem_name').value = params.data.name;
            this.msModal = !this.msModal;
        },
        modalClicked3() {
            // 선택한 제품 rowData에 추가
            const selectedRows = this.$refs.lotGrid.api.getSelectedRows();

            // 기존 데이터에서 중복을 방지할 키값(prd_cd)
            const existingData = new Set(this.rowData.map(row => row.prd_cd));

            const newRowData = selectedRows
            .filter(row => {
                // prd_cd 기존 데이터에 없는 경우에만 추가(.has()는 set안에 값이 존재하느지 확인하고 true/false를 반환)
                return !existingData.has(row.prd_cd);
            })
            .map(row => ({
                prd_cd: row.prd_cd, 
                prd_nm: row.prd_nm, 
                order_qty: '', 
                note: '',  
                delete: 'delete', 
            }));

            //수정후에 인서트 할 값들 담기
            this.upInsert.push(newRowData);

            this.rowData = [...this.rowData, ...newRowData]; // 기존 데이터 유지하면서 새 데이터 추가
            this.psModal = !this.psModal;
        },
        placeholderRenderer(params) {
            // 주문 수량 값이 없으면 placeholder 텍스트 표시
            if (!params.value) {
                return `<span style="color: gray; font-style: italic;">수량은 숫자만 입력하세요.</span>`;
            }
            return params.value.toLocaleString ? params.value.toLocaleString() : params.value; // 값이 있으면 그대로 표시(천 단위 콤마 표시도 같이 해줌)
        },
        //입력창을 조건따라 넣고 안넣고 하기
        sessionEditable(){
            if(this.isdetail == true && this.status == 'J01'){  //수정 페이지 이면서 주문완료인 상태일때만 관리자랑 영업팀장은 입력가능
                if(this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT3' )){
                    return true
                }
            } else if(this.isdetail == false){  //등록 페이지 일때 입력가능
                return true
            }else{
                return false;
            }
        },

        //상세조회 주문서 헤드부분
        async orderList(selectNo) {
            let result = await axios.get(`/api/sales/orderList/${selectNo}`)
                                    .catch(err => console.log("OrListError",err));
            this.OLHead = result.data;
            
            this.orderHeadList();
        },
        orderHeadList(){
            document.getElementById('acc_code').value = this.OLHead[0].act_cd;
            document.getElementById('acc_name').value = this.OLHead[0].act_nm;
            document.getElementById('mem_id').value = this.OLHead[0].id;
            document.getElementById('mem_name').value = this.OLHead[0].name;
            this.order_date = this.OLHead[0].order_dt.slice(0, 10); //길이가 안맞아서 안나옴 그래서 뒤에 시간부분 자름
            this.due_date = this.OLHead[0].due_dt.slice(0, 10);
            this.status = this.OLHead[0].status;
        }, 

        //상세조회 주문서 디테일부분
        async orderDtlList(selectNo) {
            let result = await axios.get(`/api/sales/orderDtlList/${selectNo}`)
                                    .catch(err => console.log("DtlListError",err));
            this.rowData = result.data;
        },

        //주문서 수정 한번에 하기
        async orderUpdate() {
            let updateResult 
            let upObj = [];
            let upRow = '';
            //뒷단에서 업데이트랑 인서트 한번에 하게 할려고 필요한 값들 한번에 보내기
            for(let i = 0; i < this.rowData.length; i++){
                upRow = this.rowData[i];
                upObj.push({
                    order_dtl_cd : upRow.order_dtl_cd,
                    order_cd: this.selectNo,
                    prd_cd: upRow.prd_cd, 
                    prd_nm : upRow.prd_nm,
                    order_qty: upRow.order_qty,
                    note: upRow.note
                })
            };
            updateResult = await axios.put(`/api/sales/orderUpdates`,upObj)
                                        .catch(err => console.log("updateAxiosError",err));       
            if(updateResult.data.result == 'success'){
                this.$swal({
                title: "수정완료!",
                text: "주문 목록으로 돌아갑니다.",
                icon: "success"
                }).then(result =>{
                    if(result){
                        this.$router.push({name:'Sales_OrderList'}) //OK누르면 목록으로 이동
                    }
                });     
            };
        },

/*        //주문서 수정
        async orderUpdate() {
            // //주문서 수정을 위한 삭제
            // let result = await axios.delete(`/api/sales/orderUpdateDelete/${this.selectNo}`)
            //                         .catch(err => console.log("deleteAxios에러",err));
            // if(result.data.result == 'success'){
            //     //주문서 수정을 위한 등록
            //     this.orderUpdateInsert();
            // }  
            let updateResult 
            for(let i = 0; i < this.rowData.length; i++){
                let upRow = this.rowData[i]
                if(upRow.order_dtl_cd){
                    let upObj = {
                        order_qty: upRow.order_qty,
                        note: upRow.note
                    }
                    updateResult = await axios.put(`/api/sales/orderUpdate/${upRow.order_dtl_cd}`,upObj)
                                            .catch(err => console.log("updateAxiosError",err));             
                }
            };
            if(updateResult.data.result == 'success'){ 
                if(this.upInsert.length > 0){
                    this.orderUpdateInsert()
                }else{
                    this.$swal({
                    title: "Update!",
                    text: "GO to Order List",
                    icon: "success"
                    }).then(result =>{
                        if(result){
                            this.$router.push({name:'sales_orderlist'}) //OK누르면 목록으로 이동
                        }
                    });
                }
            };
        },
        //주문서 수정을 위한 등록
        async orderUpdateInsert() {
            let updateInsert = [];
            this.upInsert.forEach((obj) => {
                updateInsert.push({
                    prd_cd: obj.prd_cd, 
                    prd_nm: obj.prd_nm, 
                    order_qty: obj.order_qty, 
                    note: obj.note,
                    order_cd: this.selectNo
                });
            });
            let result = await axios.post('/api/sales/orderUpdateInsert', updateInsert)   
                                    .catch(err => console.log("axios에러",err));
            if(result.data.result === 'success'){
                this.$swal({
                title: "Update!",
                text: "GO to Order List",
                icon: "success"
                }).then(result =>{
                    if(result){
                        this.$router.push({name:'sales_orderlist'}) //OK누르면 목록으로 이동
                    }
                });
            };
        },
*/
        //주문서 삭제
        async orderDelete() {
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
                        let result2 = await axios.delete(`/api/sales/orderDelete/${this.selectNo}`)
                                                .catch(err => console.log("deleteAxios에러",err));

                        if(result2.data.result == 'success'){
                            this.resetForm(); // 초기화
                            
                            this.$swal({
                            title: "삭제완료!",
                            text: "주문 목록으로 돌아갑니다.",
                            icon: "success"
                            }).then(result =>{
                                if(result){
                                    this.$router.push({name:'Sales_OrderList'}) //OK누르면 목록으로 이동
                                }
                            })
                        }                        
                    }
                });  
        },

        //주문서 단건삭제
        async orderListDelete() {           
            let result2 = await axios.delete(`/api/sales/orderListDelete/${this.order_dtl_cd}`)
                                    .catch(err => console.log("deleteAxios에러",err));                        
            console.log(result2);
        },

        //모달창3개
        async getAccList() {
            let result = await axios.get('/api/moacc')
                                    .catch(err => console.log(err));
            this.accData = result.data; 
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
            let dueDt = this.due_date;
            let ordDt = this.order_date;
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
                    note: obj.note,

                    //테스트 다른 데이터에 값 가져오기
                    ID: this.test});
            });

            insertOrd.push({
                mem_id : document.getElementById('mem_id').value,
                act_cd : document.getElementById('acc_code').value,
                due_dt : this.due_date,
                order_dt : this.order_date
            });

            let insertOrdArr = [...insertOrd, insertOrdDtl ];   //첫번째가 헤드, 두번째가 디테일

            let result = await axios.post('/api/sales/ord', insertOrdArr)   //배열은 , 붙여서 보냄(객체가 + 붙여서 넘김)
                                .catch(err => console.log("axios에러",err));

            if(result.data.result == 'success'){
                this.$swal({
                    icon: "success",
                    title: "등록완료.",
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
            this.due_date = "";
            this.order_date = "";
            this.rowData = [];         
        },

        gridFit(params){ // 매개변수 속성으로 자동 접근하여 sizeColumnsToFit() 실행함. (가로스크롤 삭제)
            params.api.sizeColumnsToFit();
        },


        
    }

}
</script>
  
<style lang="scss">
//그리드 사용시 아래 스타일 임포트 해야하고 경로 확인이 필요하다 
@import"../../../node_modules/ag-grid-community/styles/ag-grid.css";
@import"../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css"


</style>
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
    <div class="py-4 container-fluid">
        <div class="card">
            <!-- 주문 테이블 부분 -->
            <div class="card-header bg-light ps-5 ps-md-4">
                <div class="row">
                    <div class="col-6 col-lg-2 text-end text-md-start">
                        <button class="btn btn-primary " @click="modalOpen">거래처 조회</button>
                    </div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">거래처 명</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="text" id="acc_name" value="" readonly />
                    </div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">거래처 코드</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="text" id="acc_code" value="" readonly />
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 col-lg-2 text-end text-md-start">
                        <button class="btn btn-primary " @click="modalOpen2">담당자 조회</button>
                    </div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">담당자 명</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="text" id="mem_name" value="" readonly />
                    </div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">담당자 ID</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="text" id="mem_id" value="" readonly />
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 col-lg-2"></div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">납기일자</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="date" id="due_date" value="" />
                    </div>
                    <div class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">주문일자</div> 
                    <div class="col-6 col-lg-2">
                        <input class="form-control" type="date" id="order_date" value="" />
                    </div>
                </div>
            </div>
            <!-- 주문디테일 테이블 부분 -->
            <div class="card-body">
                <div class="row">
                    <div class="col-6 col-lg-2 text-end text-md-start">
                        <button class="btn btn-primary " @click="modalOpen3">제품 조회</button>
                    </div>
                </div>
                <ag-grid-vue style="width:100%; height: 380px;"
                class="ag-theme-alpine"
                :columnDefs="columnDefs"
                :rowData="rowData"
                :gridOptions="gridOptions"
                @grid-ready="gridFit">
                </ag-grid-vue>
                <div class="row">
                    <div class="col-6 col-lg-5"></div>
                    <div class="col-6 col-lg-1 mt-2">
                        <button class="btn btn-primary " @click="ordInsert()">등록</button>
                    </div>
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
            columnDefs: [
                {headerName: '제품 코드', field: 'prd_cd'},
                {headerName: '제품 이름', field: 'prd_nm'},
                {headerName: '주문 수량', field: 'order_qty', editable: true, cellDataType: 'number'},
                {headerName: '비고', field: 'note', editable: true},
                {
                    headerName: '삭제' ,
                    field: 'delete',
                    cellRenderer: (params) => {
                        const button = document.createElement('button');
                        button.innerText = 'DELETE';
                        button.className = 'btn btn-danger';
                        button.addEventListener('click', () => {
                            this.rowData = this.rowData.filter(row => row !== params.data);
                        });
                        return button;
                    }
                 },
            ],
            rowData: [ ],
            accDefs: [
                {headerName: '거래처 코드', field: 'act_cd'},
                {headerName: '거래처 명', field: 'act_nm'},
                {headerName: '구분', field: 'act_type'},
            ],
            accData: [],
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
        this.$store.dispatch('breadCrumb', { title: '주문서 등록' });
        this.getAccList();
        this.getMemList();
        this.getProList();
        //this.getAccInfo();
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
            //params.data.act_cd;
            //this.getAccInfo(params.data.act_cd);
            document.getElementById('acc_code').value = params.data.act_cd;
            document.getElementById('acc_name').value = params.data.act_nm;
            this.asModal = !this.asModal;
        },
        modalClicked2(params) {
            //params.data.ID;
            //this.getAccInfo(params.data.ID);
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
        // async getAccInfo(moaccNo) {
        //     let result = await axios.get(`/api/moacc/${moaccNo}`)
        //                             .catch(err => console.log(err));
        //     this.AccInfo = result.data;
        // },
        // async getMemInfo(momemNo) {
        //     let result = await axios.get(`/api/momem/${momemNo}`)
        //                             .catch(err => console.log(err));
        //     this.MemInfo = result.data;
        // },

        async ordInsert() {

            // 필수값 입력 알람
            let dueDt = document.getElementById('due_date').value;
            let accCode = document.getElementById('acc_code').value;
            let memId = document.getElementById('mem_id').value;
            let rowQty = this.rowData.filter(row => !row.order_qty || row.order_qty <= 0);

            if (!accCode && !memId) {
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
                //alert("모든 제품의 주문 수량을 입력하세요.");
                this.$swal({
                    icon: "error",
                    title: "주문 수량을 입력하세요",
                    text: "입력 후 엔터를 쳐주세요",
                });
                return;
            }
            if (!dueDt) {
                this.$swal({
                    icon: "error",
                    title: "납기 일자를 입력하세요",
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
                    text: "목록에서 확인 해주세요.",
                });
            }
            return result;

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
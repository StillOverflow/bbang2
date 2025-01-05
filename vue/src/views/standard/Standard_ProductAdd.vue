<template>
    <div id="page-inner" class="mx-auto">
        <div class="py-4 container-fluid">
            <div class="card py-5 px-6">
                <div class="row">
                    <!-- 제품목록 -->
                    <div class="col-md-7" style="height: auto">
                        <h4 class="mb-3 text-center">제품 목록</h4>
                        <div class="d-flex justify-content-left align-items-center mb-2" style="width: 100%">
                            <div style="width: 15%">
                                <label class="me-2 align-self-center" style="font-size: 18px; font-weight: bold;">제품명</label>
                            </div>
                            <div class="d-flex justify-content-left align-items-center" style="width: 85%">
                                <input type="search" class="form-control d-inline" v-model="keyword" placeholder="제품명을 입력하세요" style="width: 75%" />
                                <button class="btn btn-warning mb-0" style="width: 25%; margin-left: 10px" @click="searchPrd">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </div>
                        <!-- 제품 테이블 ag-grid -->
                        <ag-grid-vue
                            class="ag-theme-alpine"
                            style="width: 100%; height: 600px"
                            :columnDefs="productDefs"
                            :rowData="productData"
                            :pagination="true"
                            :gridOptinos="gridOptinos"
                            @gridReady="onPrdGridReady"
                            @rowClicked="prdClicked">
                        </ag-grid-vue>
                    </div>

                    <!-- 우측 입력 폼 -->
                    <div class="col-md-5 mt-5" style="height: auto; padding-left: 30px">
                        <!-- 신규등록 버튼 -->
                        <div class="text-end mb-3">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                @click="newProduct"
                                v-if="this.$session.get('user_ps') == 'H01'">
                                신규등록
                            </button>
                        </div>
                        <!-- 입력 필드 -->
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">제품코드</div>
                            <div class="input-group mb-3 w-50">
                                <input type="text" class="form-control" v-model="prdInfo.prd_cd" style="height: 41px; background-color: rgb(236, 236, 236);" readonly />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">제품명 *</div>
                            <div class="input-group mb-3 w-50">
                                <input type="text" class="form-control" v-model="prdInfo.prd_nm" style="height: 41px;" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">단가 *</div>
                            <div class="input-group mb-3 w-50">
                                <input type="number" class="form-control" v-model="prdInfo.price" style="height: 41px;" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">유통가능기간(일) *</div>
                            <div class="input-group mb-3 w-50">
                                <input type="number" class="form-control" v-model="prdInfo.exp_range" style="height: 41px;" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">단위 *</div>
                            <div class="input-group mb-3 w-50">
                                <select class="form-select" v-model="prdInfo.unit">
                                    <option v-for="(opt, idx) in selectedData.selectOptions.unit" :key="idx" :value="opt.comm_dtl_cd">
                                        {{ opt.comm_dtl_nm }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">카테고리 *</div>
                            <div class="input-group mb-3 w-50">
                                <select class="form-select" v-model="prdInfo.category">
                                    <option v-for="(opt, idx) in selectedData.selectOptions.category" :key="idx" :value="opt.comm_dtl_cd">
                                        {{ opt.comm_dtl_nm }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">안전재고</div>
                            <div class="input-group mb-3 w-50">
                                <input type="number" class="form-control" v-model="prdInfo.safe_stk" style="height: 41px;" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">비고</div>
                            <textarea cols="30" rows="4" class="form-control" v-model="prdInfo.note" style="height: 100px;" />
                        </div>
                    </div>
                </div>
                <!-- 저장 및 삭제 버튼 -->
                <div class="text-center">
                    <button
                        type="button"
                        id="submitBtn"
                        class="btn btn-success ms-2 mt-3"
                        @click="isUpdated ? prdUpdate() : prdInsert()"
                        v-if="this.$session.get('user_ps') == 'H01'">
                        저장
                    </button>
                    <button
                        type="button"
                        class="btn btn-danger mt-3 ms-2"
                        @click="delProduct"
                        v-if="this.$session.get('user_ps') == 'H01'">
                        삭제
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";

export default {
    components: { AgGridVue },
    created(){
        this.$store.dispatch('breadCrumb', { title: '제품 관리' });
        this.searchPrd();
        this.fetchCommonCodes();
        let prdCd = this.$route.query.prd_cd;
        if(prdCd > 0){
            //수정
            this.getBoardInfo(prdCd);
            this.isUpdated = true;
        }       
    },
    data(){
        return{
            isDisabled: true,
            namePd: '',
            gridOptinos: {
                rowSelection: {
                    mode:"singleRow",
                    checkboxes: false,
                    enableClickSelection: true,
                }
            },
            prdInfo: {
                prd_nm : '',    
                category : '',
                price : '',
                unit : '',
                safe_stk : '',
                exp_range:'',
                note:'',
                create_dt:''
            },
            isUpdated : false,
            
            clientNamesearch:'',
            prd_cd:'',
            unit:'',            
            selectedData:{
                category: '', // 카테고리
                unit: '', // 단위
                selectOptions: {
                    category: [], // 카테고리 공통코드
                    unit: [], // 단위 공통코드
                },
            },
            newProduct() {
                this.prdInfo = {
                prd_cd: '', // 자재코드는 신규등록 시 생성됨
                prd_nm: '',
                category: '',
                price: '',
                unit: '',
                safe_stk: '',
                exp_range:'',
                note: '',
                };
                this.isUpdated = false; // 신규등록 모드로 전환
            },
            productDefs:[
                {headerName: '제품코드' , field: 'prd_cd'},
                {headerName: '제품명' , field: 'prd_nm'},
                {headerName: '카테고리' , field: 'category'},
                {headerName: '단가(원)' , field: 'price', 
                valueFormatter: (params) => {
                    if (params.value == null || params.value === '') return '';
                    return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                },},
                {headerName: '안전재고' , field: 'safe_stk'},       
            ],
            productData:[],
            keyword: '',
            prdKeyword: {}
        }        
    },


    methods:{

        //----------------------------공통함수()---------------------------
        //제품검색
        async searchPrd() {
        this.prdKeyword = {prd_nm: this.keyword};
        let result = await axios.get('/api/comm/product/', { params: this.prdKeyword });
        this.productData = result.data;
        },
        // 공통코드 가져오기
        async fetchCommonCodes() {
            try {
                const category = await axios.get('/api/comm/codeList/PC');
                const unit = await axios.get('/api/comm/codeList/UN');

                this.selectedData.selectOptions={
                    category: category.data, 
                    unit: unit.data 
                }
            } catch (error) {
                console.error('공통코드 가져오기 실패:', error);
            }
        },
        prdClicked(params){
            this.prdInfo.prd_cd = params.data.prd_cd;
            this.prdInfo.prd_nm = params.data.prd_nm;
            this.prdInfo.category = this.matchCode(this.selectedData.selectOptions.category, params.data.category);
            this.prdInfo.price = params.data.price;
            this.prdInfo.unit = this.matchCode(this.selectedData.selectOptions.unit, params.data.unit);
            this.prdInfo.safe_stk = params.data.safe_stk;
            this.prdInfo.note = params.data.note;
            this.prdInfo.exp_range = params.data.exp_range;
            this.prdInfo.create_dt = this.$comm.getMyDay(params.data.create_dt);
            this.isUpdated = true;  
            
            this.copyPrdInfo = {...this.prdInfo};
        },
        matchCode(options, value) { //매칭 메소드
            const match = options.find((opt) => opt.comm_dtl_nm == value || opt.comm_dtl_cd == value); //코드나 이름에 벨류가 있는지 확인
            return match ? match.comm_dtl_cd : ''; // 있으면 코드 반환 없으면 공백
        },
        onPrdGridReady(params){
            params.api.sizeColumnsToFit();
            this.gridApi = params.api;
        },
        
        async prdInsert(){
            if(!this.prdInfo.prd_nm || !this.prdInfo.unit || !this.prdInfo.category || !this.prdInfo.price || !this.prdInfo.safe_stk){
                this.$swal({
                icon: "error",
                title: "필수 입력값을 확인해주세요!",
                text: "자재명, 단위, 자재유형은 필수 입력값입니다.",
            });
            return;        
            }

            try {
                let result = await axios.post('/api/standard/product', this.prdInfo);
                if (result.data.result) {
                    alert('제품 등록');
                    this.bringPrd(); // 목록 갱신
                } else {
                    alert('등록에 실패');
                }
            } catch (err) {
            console.error('제품 등록 중 오류:', err);
            }
        },
        async prdUpdate() {
            if(!this.objectKey(this.prdInfo, this.copyPrdInfo)){
                this.$swal({
                    icon: "warning",
                    title: "수정할 변경 사항이 없습니다.",
                    text: "수정 후 저장 버튼을 눌러주세요.",
                });
                return; // 작업 중단
            }
                this.$swal({
                    title: "정말 수정하시겠습니까??",
                    text: "",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, modify!"
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        this.$swal({
                        title: "modify!",
                        text: "Your file has been modified.",
                        icon: "success"
                        });
                    await axios.put(`/api/standard/updateProduct/${this.prdInfo.prd_cd}`, this.prdInfo);
                    this.bringPrd(); // 목록 갱신
                    }
                    
                });
        },
        async delProduct(){   
            const currentTime = new Date();
            const createDate = new Date(this.prdInfo.create_dt);
            const timeDifference = (currentTime - createDate) / (24 *1000 * 60 * 60); 
            console.log(currentTime);
            console.log(createDate);
            console.log(timeDifference);
            // 1시간 이내인지 확인
            if (timeDifference > 1) {
                this.$swal({
                    icon: "error",
                    title: "삭제 불가",
                    text: "삭제는 생성 후 1시간 이내에만 가능합니다.",
                });
                return; 
            }
            
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
                        this.$swal({
                        title: "delete!",
                        text: "Your file has been deleted.",
                        icon: "success"
                        });
                        await axios.delete(`/api/standard/delProduct/${this.prdInfo.prd_cd}`);
                        this.bringPrd(); // 목록 갱신
                    }
                });
        },
        //변경여부 확인
        objectKey(obj1, obj2){
            return Object.keys(obj1).some((key)=>obj1[key]!=obj2[key]);
        }
    },
    


}
</script>
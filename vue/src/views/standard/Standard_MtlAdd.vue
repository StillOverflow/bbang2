<template>
    <div id="page-inner" class="mx-auto">
        <div class="py-4 container-fluid">
            <div class="card py-5 px-6">
                <div class="row">
                    <!-- 자재목록 -->
                    <div class="col-md-7" style="height: auto">
                        <h4 class="mb-3 text-center">자재 목록</h4>
                        <div class="d-flex justify-content-left align-items-center mb-2" style="width: 100%">
                            <div style="width: 15%">
                                <label class="me-2 align-self-center" style="font-size: 18px; font-weight: bold;">자재명</label>
                            </div>
                            <div class="d-flex justify-content-left align-items-center" style="width: 85%">
                                <input type="search" class="form-control d-inline" v-model="keyword" placeholder="자재명을 입력하세요" style="width: 75%" />
                                <button class="btn btn-warning mb-0" style="width: 25%; margin-left: 10px" @click="searchMtl">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </div>
                        <!-- 자재 테이블 ag-gird -->
                        <ag-grid-vue
                            class="ag-theme-alpine"
                            style="width: 100%; height: 600px"
                            :columnDefs="materialDefs"
                            :rowData="materialData"
                            :pagination="true"
                            :gridOptions="gridOptions"
                            @gridReady="onMatGridReady"
                            @rowClicked="matClicked">
                        </ag-grid-vue>
                    </div>

                    <div class="col-md-5 mt-5" style="height: auto; padding-left: 30px">
                        <!-- 신규등록 버튼 -->
                        <div class="text-end mb-3">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                @click="newMaterial"
                                v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT5')">
                                신규등록
                            </button>
                        </div>
                        <!-- 입력 폼 -->
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">자재코드</div>
                            <div class="input-group mb-3 w-50">
                                <input type="text" class="form-control" v-model="matInfo.mat_cd" style="height: 41px; background-color: rgb(236, 236, 236);" readonly />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">자재명 *</div>
                            <div class="input-group mb-3 w-50">
                                <input type="text" class="form-control" v-model="matInfo.mat_nm" style="height: 41px;" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">단가 *</div>
                            <div class="input-group mb-3 w-50">
                                <input type="number" class="form-control" v-model="matInfo.price" style="height: 41px;" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">단위 *</div>
                            <div class="input-group mb-3 w-50">
                                <select class="form-select" v-model="matInfo.unit">
                                    <option v-for="(opt, idx) in selectedData.selectOptions.unit" :key="idx" :value="opt.comm_dtl_cd">
                                        {{ opt.comm_dtl_nm }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">자재유형 *</div>
                            <div class="input-group mb-3 w-50">
                                <select class="form-select" v-model="matInfo.type">
                                    <option v-for="(opt, idx) in selectedData.selectOptions.type" :key="idx" :value="opt.comm_dtl_cd">
                                        {{ opt.comm_dtl_nm }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">카테고리</div>
                            <div class="input-group mb-3 w-50">
                                <select class="form-select" v-model="matInfo.category">
                                    <option v-for="(opt, idx) in selectedData.selectOptions.category" :key="idx" :value="opt.comm_dtl_cd">
                                        {{ opt.comm_dtl_nm }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">안전재고</div>
                            <div class="input-group mb-3 w-50">
                                <input type="number" class="form-control" v-model="matInfo.safe_stk" style="height: 41px;" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">비고</div>
                            <textarea cols="30" rows="4" class="form-control" v-model="matInfo.note" style="height: 100px;" />
                        </div>
                    </div>
                </div>
                <!-- 저장 및 삭제 버튼 -->
                <div class="text-center">
                    <button
                        type="button"
                        id="submitBtn"
                        class="btn btn-success ms-2 mt-3"
                        @click="isUpdated ? matUpdate() : matInsert()"
                        v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT5')">
                        저장
                    </button>
                    <button
                        type="button"
                        class="btn btn-danger mt-3 ms-2"
                        @click="delMaterial"
                        v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT5')">
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
        this.$store.dispatch('breadCrumb', { title: '자재 관리' });
        this.bringMat();
        //this.searchMtl();
        this.fetchCommonCodes();
        let matCd = this.$route.query.mat_cd;
        if(matCd > 0){
            //수정
            this.getBoardInfo(matCd);
            this.isUpdated = true;
        }       
    },
    data(){
        return{
            namePd: '',
            gridOptions: {
                rowSelection: {
                    mode:"singleRow",
                    checkboxes: false,
                    enableClickSelection: true,
                }
            },
            matInfo: {
                mat_nm : '',
                type : '',
                category : '',
                price : '',
                unit : '',
                safe_stk : '',
                note:'',
                create_dt:''
            },
            isUpdated : false,
            
            clientNamesearch:'',
            mat_cd:'',
            unit:'',            
            selectedData:{
                type: '', // 자재구분
                category: '', // 카테고리
                unit: '', // 단위
                selectOptions: {
                    type: [], // 자재구분 공통코드
                    category: [], // 카테고리 공통코드
                    unit: [], // 단위 공통코드
                },
            },
            newMaterial() {
                this.matInfo = {
                mat_cd: '', // 자재코드는 신규등록 시 생성됨
                mat_nm: '',
                type: '',
                category: '' ,
                price: '',
                unit: '',
                safe_stk: '' ||0,
                note: '',
                };
                this.isUpdated = false; // 신규등록 모드로 전환
            },
            materialDefs:[
                {headerName: '자재코드' , field: 'mat_cd', cellStyle: { textAlign: "center" } },
                {headerName: '자재명' , field: 'mat_nm', cellStyle: { textAlign: "center" } },
                {headerName: '자재유형' , field: 'type', cellStyle: { textAlign: "center" } },
                {headerName: '카테고리' , field: 'category', cellStyle: { textAlign: "center" } },
                {headerName: '단가(원)' , field: 'price', 
                valueFormatter: (params) => {
                    if (params.value == null || params.value === '') return '';
                    return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                }, cellStyle: { textAlign: "right" } },
                {headerName: '단위' , field: 'unit', cellStyle: { textAlign: "center" } },        
            ],
            materialData:[],
            keyword: '',
            matKeyword: {}
        }        
    },


    methods:{

        //----------------------------공통함수()---------------------------
        //자재검색
        async searchMtl() {
        this.matKeyword = {mat_nm: this.keyword};
        let result = await axios.get('/api/comm/material/', { params: this.matKeyword });
        this.materialData = result.data;
        },
        // 공통코드 가져오기
        async fetchCommonCodes() {
            try {
                const type = await axios.get('/api/comm/codeList/MA');
                const category = await axios.get('/api/comm/codeList/MC');
                const unit = await axios.get('/api/comm/codeList/UN');

                this.selectedData.selectOptions={
                    type: type.data, 
                    category: category.data, 
                    unit: unit.data 
                }
            } catch (error) {
                console.error('공통코드 가져오기 실패:', error);
            }
        },
        matClicked(params){
            this.matInfo.mat_cd = params.data.mat_cd;
            this.matInfo.mat_nm = params.data.mat_nm;
            this.matInfo.type = this.matchCode(this.selectedData.selectOptions.type, params.data.type);
            this.matInfo.category = this.matchCode(this.selectedData.selectOptions.category, params.data.category);
            this.matInfo.price = params.data.price;
            this.matInfo.unit = this.matchCode(this.selectedData.selectOptions.unit, params.data.unit);
            this.matInfo.safe_stk = params.data.safe_stk;
            this.matInfo.note = params.data.note;
            this.matInfo.create_dt = this.$comm.getMyDay(params.data.create_dt);
            this.isUpdated = true;      
            
            this.copyMatInfo = {...this.matInfo}
        },
        matchCode(options, value) { //매칭 메소드
            const match = options.find((opt) => opt.comm_dtl_nm == value || opt.comm_dtl_cd == value); //코드나 이름에 벨류가 있는지 확인
            return match ? match.comm_dtl_cd : ''; // 있으면 코드 반환 없으면 공백
        },
        async bringMat(){
            let result = await axios.get('/api/standard/allMaterials')
                                    .catch(err=>console.log(err));
            this.materialData = result.data;
        },
        onMatGridReady(params){
            params.api.sizeColumnsToFit();
            this.gridApi = params.api;
        },
        
        async matInsert(){
            if(!this.matInfo.mat_nm || !this.matInfo.unit || !this.matInfo.type || !this.matInfo.price){
                this.$swal({
                icon: "error",
                title: "필수 입력값을 확인해주세요!",
                text: "자재명, 단위, 자재유형은 필수 입력값입니다.",
                confirmButtonText: "확인"
            });
            return;        
            }

            this.$swal({
                    title: "등록하시겠습니까??",
                    text: "",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "확인",
                    cancelButtonText: "취소"
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        this.$swal({
                        title: "등록완료!",
                        text: "",
                        icon: "성공",
                        confirmButtonText: "확인"
                        });
                        await axios.post('/api/standard/material', this.matInfo);
                        this.bringMat();
                        this.matInfo={};
                    }                   
                });
        },
        async matUpdate() {
            if(!this.objectKey(this.matInfo, this.copyMatInfo)){
                this.$swal({
                    icon: "warning",
                    title: "수정할 변경 사항이 없습니다.",
                    text: "수정 후 저장 버튼을 눌러주세요.",
                    confirmButtonText: "확인"
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
                    confirmButtonText: "저장",
                    cancelButtonText: "취소"
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        this.$swal({
                        title: "수정완료!",
                        text: "",
                        icon: "success",
                        confirmButtonText: "확인"
                        });
                        await axios.put(`/api/standard/updateMaterial/${this.matInfo.mat_cd}`, this.matInfo);
                        this.bringMat(); // 목록 갱신
                        this.matInfo={};
                    }
                });
        },
        async delMaterial(){           
            const currentTime = new Date();
            const createDate = new Date(this.matInfo.create_dt);
            const timeDifference = (currentTime - createDate) / (24 *1000 * 60 * 60); 
            // 1시간 이내인지 확인
            if (timeDifference > 1) {
                this.$swal({
                    icon: "error",
                    title: "삭제 불가",
                    text: "삭제는 생성 후 1시간 이내에만 가능합니다.",
                    confirmButtonText: "확인"
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
                    confirmButtonText: "삭제",
                    cancelButtonText:"취소"
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        this.$swal({
                        title: "삭제성공!",
                        text: "",
                        icon: "success",
                        confirmButtonText: "확인"
                        });
                        await axios.delete(`/api/standard/delMaterial/${this.matInfo.mat_cd}`);
                        this.bringMat(); // 목록 갱신
                        this.matInfo={};
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
<template>
    <div id="page-inner" class="mx-auto">
        <div class="py-4 container-fluid">
            <div class="card py-5 px-6">
                <div class="row">
                    <!-- 불량 목록 -->
                    <div class="col-md-7" style="height: auto">
                        <h4 class="mb-3 text-center">불량 목록</h4>
                        <div class="d-flex justify-content-left align-items-center mb-2" style="width: 100%;">
                            <div style="width: 15%;">
                                <label class="me-2 align-self-center" style="font-size: 18px; font-weight: bold;">불량명</label>
                            </div>
                            <div class="d-flex justify-content-left align-items-center" style="width: 85%;">
                                <input
                                    type="search"
                                    class="form-control d-inline"
                                    v-model="keyword"
                                    placeholder="불량명을 입력하세요"
                                    style="width: 75%;"
                                />
                                <button
                                    class="btn btn-warning mb-0"
                                    style="width: 25%; margin-left: 10px;"
                                    @click="searchDef"
                                >
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </div>
                        <!-- 불량 테이블 ag-grid -->
                        <ag-grid-vue
                            class="ag-theme-alpine"
                            style="width: 100%; height: 600px;"
                            :columnDefs="defectDefs"
                            :rowData="defectData"
                            :pagination="true"
                            :gridOptions="gridOptions"
                            @gridReady="onDefGridReady"
                            @rowClicked="defClicked"
                        ></ag-grid-vue>
                    </div>

                    <!-- 우측 입력 폼 -->
                    <div class="col-md-5 mt-5" style="height: auto; padding-left: 30px">
                        <!-- 신규등록 버튼 -->
                        <div class="text-end mb-3">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                @click="newDefect"
                                v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT2')"
                            >
                                신규등록
                            </button>
                        </div>
                    
                        <!-- 입력 필드 -->
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder">불량코드</div>
                            <div class="input-group mb-3 w-50">
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="defInfo.def_cd"
                                    style="height: 41px; background-color: rgb(236, 236, 236);" readonly/>
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder">불량명 *</div>
                            <div class="input-group mb-3 w-50">
                                <input type="text" class="form-control" v-model="defInfo.def_nm" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder">불량구분 *</div>
                            <div class="input-group mb-3 w-50">
                                <select class="form-select" v-model="defInfo.def_type">
                                    <option
                                        v-for="(opt, idx) in selectedData.selectOptions.def_type"
                                        :key="idx"
                                        :value="opt.comm_dtl_cd"
                                    >
                                        {{ opt.comm_dtl_nm }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder">불량내용</div>
                            <div class="input-group mb-3 w-50">
                                <input type="text" class="form-control" v-model="defInfo.def_detail" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder">비고</div>
                            <textarea
                                class="form-control h-25"
                                rows="10"
                                v-model="defInfo.note"
                            ></textarea>
                        </div>
                    </div>
                </div>
                <!-- 저장 및 삭제 버튼 -->
                <div class="text-center mtp30">
                    <button
                        type="button"
                        id="submitBtn"
                        class="btn btn-success me-2"
                        @click="isUpdated ? defUpdate() : defInsert()"
                        v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT2')"
                    >
                        저장
                    </button>
                    <button
                        type="button"
                        class="btn btn-danger"
                        @click="delDefInfo"
                        v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT2')"
                    >
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
//prefix 코드인풋
export default {
    components: { AgGridVue },
    created(){
        this.$store.dispatch('breadCrumb', { title: '불량 관리' });
        this.searchDef();
        this.fetchCommonCodes();
        let defCd = this.$route.query.def_cd;
        if(defCd > 0){
            //수정
            this.getBoardInfo(defCd);
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
            defInfo: {
                def_nm : '',
                def_type : '',
                def_detail:'',
                note:'',
                //create_dt:''
            },
            isUpdated : false,
            
            clientNamesearch:'',
            def_cd:'',            
            selectedData:{
                def_type: '', // 단위
                selectOptions: {
                    def_type: [], // 단위 공통코드
                },
            },
            newDefect() {
                this.defInfo = {
                def_cd: '', // 자재코드는 신규등록 시 생성됨
                def_nm: '',
                def_detail: '',
                def_type: '',    
                note: '',
                };
                this.isUpdated = false; // 신규등록 모드로 전환
            },
            defectDefs:[
                {headerName: '불량코드' , field: 'def_cd', cellStyle: { textAlign: "center" } },
                {headerName: '불량명' , field: 'def_nm', cellStyle: { textAlign: "center" } },
                {headerName: '불량구분' , field: 'def_type', cellStyle: { textAlign: "center" } },
                {headerName: '불량내용' , field: 'def_detail', cellStyle: { textAlign: "center" } },     
            ],
            defectData:[],
            keyword: '',
            defKeyword: {}
        }        
    },


    methods:{

        //----------------------------공통함수()---------------------------
        //불량검색
        async searchDef() {
        this.defKeyword = {def_nm: this.keyword};
        let result = await axios.get('/api/standard/defect', { params: this.defKeyword });
        this.defectData = result.data;
        },
        // 공통코드 가져오기
        async fetchCommonCodes() {
            try {
                const def_type = await axios.get('/api/comm/codeList/QT');

                this.selectedData.selectOptions={
                    def_type: def_type.data
                }
            } catch (error) {
                console.error('공통코드 가져오기 실패:', error);
            }
        },
        defClicked(params){
            this.defInfo.def_cd = params.data.def_cd;
            this.defInfo.def_nm = params.data.def_nm;
            this.defInfo.def_detail = params.data.def_detail;
            this.defInfo.def_type = this.matchCode(this.selectedData.selectOptions.def_type ,params.data.def_type)
            this.defInfo.note = params.data.note;
            this.defInfo.create_dt = this.$comm.getMyDay(params.data.create_dt);
            this.isUpdated = true;    
            
            this.copyDefInfo = {...this.defInfo}
        },
        matchCode(options, value) { //매칭 메소드
            const match = options.find((opt) => opt.comm_dtl_nm == value || opt.comm_dtl_cd == value); //코드나 이름에 벨류가 있는지 확인
            return match ? match.comm_dtl_cd : ''; // 있으면 코드 반환 없으면 공백
        },
        onDefGridReady(params){
            params.api.sizeColumnsToFit();
            this.gridApi = params.api;
        },
        
        async defInsert(){
            if(!this.defInfo.def_nm || !this.defInfo.def_type){
                this.$swal({
                icon: "error",
                title: "필수 입력값을 확인해주세요!",
                text: "",
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
                        icon: "success",
                        confirmButtonText: "확인"
                        });
                        axios.post(`/api/standard/insertDefect`, this.defInfo);
                        await this.searchDef(); // 목록 갱신
                        this.defInfo={};
                    }                   
                });
        },
        async defUpdate() {
            if(!this.objectKey(this.defInfo, this.copyDefInfo)){
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
                    confirmButtonText: "수정",
                    cancelButtonText: "취소"
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        this.$swal({
                        title: "수정완료!",
                        text: "",
                        icon: "success",
                        confirmButtonText: "확인"
                        });
                    await axios.put(`/api/standard/updateDefect/${this.defInfo.def_cd}`, this.defInfo);
                    this.searchDef(); // 목록 갱신
                    this.defInfo={};
                    }
                    
                });
        },
        async delDefInfo(){   
            const currentTime = new Date();
            const createDate = new Date(this.defInfo.create_dt);
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
                    confirmButtonText: "삭제!",
                    cancelButtonText: "취소"
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        this.$swal({
                        title: "삭제완료!",
                        text: "",
                        icon: "success",
                        confirmButtonText: "확인"
                        });
                        await axios.delete(`/api/standard/delDefect/${this.defInfo.def_cd}`);
                        this.searchDef(); // 목록 갱신
                        this.defInfo={};
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
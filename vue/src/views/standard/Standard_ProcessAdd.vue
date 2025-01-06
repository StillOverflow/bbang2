<template>
    <div id="page-inner" class="mx-auto">
        <div class="py-4 container-fluid">
            <div class="card py-5 px-6">
                <div class="row">
                    <!-- 공정목록 -->
                    <div class="col-md-6" style="height: auto">
                        <h4 class="mb-3 text-center">공정 목록</h4>
                        <div class="d-flex justify-content-left align-items-center mb-2" style="width: 100%">
                            <div style="width: 15%">
                                <label class="me-2 align-self-center" style="font-size: 18px; font-weight: bold;">공정명</label>
                            </div>
                            <div class="d-flex justify-content-left align-items-center" style="width: 85%">
                                <input type="search" class="form-control d-inline" v-model="keyword" placeholder="공정명을 입력하세요" style="width: 75%" />
                                <button class="btn btn-warning mb-0" style="width: 25%; margin-left: 10px" @click="searchProc">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </div>
                        <!-- 공정 테이블 ag-grid -->
                        <ag-grid-vue
                            class="ag-theme-alpine"
                            style="width: 100%; height: 600px"
                            :columnDefs="processDefs"
                            :rowData="processData"
                            :pagination="true"
                            :gridOptions="gridOptions"
                            @gridReady="onProcGridReady"
                            @rowClicked="procClicked">
                        </ag-grid-vue>
                    </div>

                    <!-- 우측 입력 폼 -->
                    <div class="col-md-6 mt-5" style="height: auto; padding-left: 30px">
                        <!-- 신규등록 버튼 -->
                        <div class="text-end mb-3">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                @click="newProcess"
                                v-if="this.$session.get('user_ps') == 'H01'">
                                신규등록
                            </button>
                        </div>
                        <!-- 입력 필드 -->
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">공정코드 *</div>
                            <div class="input-group mb-3 w-50">
                                <input
                                    type="text"
                                    class="form-control"
                                    v-model="procInfo.proc_cd"
                                    :style="{textTransform: 'uppercase', height: '41px', backgroundColor: isUpdated ? 'rgb(236, 236, 236)' : 'white'}"
                                    maxlength="2"
                                    :disabled="isUpdated" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">공정명 *</div>
                            <div class="input-group mb-3 w-50">
                                <input type="text" class="form-control" v-model="procInfo.proc_nm" style="height: 41px;" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">설비구분 *</div>
                            <div class="input-group mb-3 w-50">
                                <select class="form-select" v-model="procInfo.eqp_type">
                                    <option v-for="(opt, idx) in selectedData.selectOptions.eqp_type" :key="idx" :value="opt.comm_dtl_cd">
                                        {{ opt.comm_dtl_nm }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">평균가동시간</div>
                            <div class="input-group mb-3 w-50">
                                <input type="number" class="form-control" v-model="procInfo.duration" style="height: 41px;" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">비고</div>
                            <textarea cols="30" rows="10" class="form-control  h-25" v-model="procInfo.note" style="height: 100px;" />
                        </div>
                    </div>
                </div>
                <!-- 저장 및 삭제 버튼 -->
                <div class="text-center">
                    <button
                        type="button"
                        id="submitBtn"
                        class="btn btn-success ms-2 mt-3"
                        @click="isUpdated ? procUpdate() : procInsert()"
                        v-if="this.$session.get('user_ps') == 'H01'">
                        저장
                    </button>
                    <button
                        type="button"
                        class="btn btn-danger mt-3 ms-2"
                        @click="delProcess"
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
//prefix 코드인풋
export default {
    components: { AgGridVue },
    created(){
        this.$store.dispatch('breadCrumb', { title: '공정 관리' });
        this.searchProc();
        this.fetchCommonCodes();
        let procCd = this.$route.query.proc_cd;
        if(procCd > 0){
            //수정
            this.getBoardInfo(procCd);
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
            procInfo: {
                proc_nm : '',
                eqp_type : '',
                duration:'',
                note:'',
                create_dt:''

            },
            isUpdated : false,
            
            clientNamesearch:'',
            proc_cd:'',
            unit:'',            
            selectedData:{
                eqp_type: '', // 단위
                selectOptions: {
                    eqp_type: [], // 단위 공통코드
                },
            },
            
            processDefs:[
                {headerName: '공정코드' , field: 'proc_cd', cellStyle: { textAlign: "center" } },
                {headerName: '공정명' , field: 'proc_nm', cellStyle: { textAlign: "center" } },
                {headerName: '설비구분' , field: 'eqp_type', cellStyle: { textAlign: "center" } },
                {headerName: '평균가동시간(시간)' , field: 'duration', cellStyle: { textAlign: "center" } },     
            ],
            processData:[],
            keyword: '',
            procKeyword: {}
        }        
    },


    methods:{
        newProcess() {
                this.procInfo = {
                proc_cd: '', // 자재코드는 신규등록 시 생성됨
                proc_nm: '',
                duration: '',
                eqp_type: '',    
                note: '',
                // prefix:'',
                };
                this.isUpdated = false; // 신규등록 모드로 전환
                this.isDisabled = false;
            },
        //----------------------------공통함수()---------------------------
        //공정검색
        async searchProc() {
        this.procKeyword = {proc_nm: this.keyword};
        let result = await axios.get('/api/standard/process', { params: this.procKeyword });
        this.processData = result.data;
        },
        // 공통코드 가져오기
        async fetchCommonCodes() {
            try {
                const eqp_type = await axios.get('/api/comm/codeList/EQ');

                this.selectedData.selectOptions={
                    eqp_type: eqp_type.data
                }
            } catch (error) {
                console.error('공통코드 가져오기 실패:', error);
            }
        },
        procClicked(params){
            this.procInfo.proc_cd = params.data.proc_cd;
            this.procInfo.proc_nm = params.data.proc_nm;
            this.procInfo.duration = params.data.duration;
            this.procInfo.eqp_type = this.matchCode(this.selectedData.selectOptions.eqp_type ,params.data.eqp_type)
            this.procInfo.note = params.data.note;
            this.procInfo.create_dt = this.$comm.getMyDay(params.data.create_dt);
            this.isUpdated = true;
            this.prefix='';         

            this.copyProcInfo = {...this.procInfo};
        },
        matchCode(options, value) { //매칭 메소드
            const match = options.find((opt) => opt.comm_dtl_nm == value || opt.comm_dtl_cd == value); //코드나 이름에 벨류가 있는지 확인
            return match ? match.comm_dtl_cd : ''; // 있으면 코드 반환 없으면 공백
        },
        onProcGridReady(params){
            params.api.sizeColumnsToFit();
            this.gridApi = params.api;
        },
        
        async procInsert(){
            if(!this.procInfo.proc_nm || !this.procInfo.eqp_type){
                this.$swal({
                icon: "error",
                title: "필수 입력값을 확인해주세요!",
                text: "자재명, 단위, 자재유형은 필수 입력값입니다.",
                confirmButtonText: "확인"
            });
            return;        
            }
            this.$swal({
                    title: "등록하시겠습니까?",
                    text: "",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "등록",
                    cancelButtonText: "취소"
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        this.$swal({
                        title: "등록성공!",
                        text: "",
                        icon: "success",
                        confirmButtonText: "확인"
                        });
                        axios.post(`/api/standard/insertProcess/${this.procInfo.proc_cd}`, this.procInfo);
                        this.searchProc(); // 목록 갱신
                        this.procInfo={};
                    }                   
                });
        },
        async procUpdate() {
            if(!this.objectKey(this.procInfo, this.copyProcInfo)){
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
                        await axios.put(`/api/standard/updateProcess/${this.procInfo.proc_cd}`, this.procInfo);
                        this.searchProc(); // 목록 갱신
                        this.procInfo={};
                    }
                   
                });
        },
        async delProcess(){  
            const currentTime = new Date();
            const createDate = new Date(this.procInfo.create_dt);
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
    
                 // 조건 만족하지 않을 경우 작업 중단         
                this.$swal({
                    title: "정말 삭제하시겠습니까??",
                    text: "",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "삭제",
                    cancelButtonText: "취소"
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        this.$swal({
                        title: "삭제완료!",
                        text: "",
                        icon: "success",
                        confirmButtonText: "확인"
                        });
                        await axios.delete(`/api/standard/delProcess/${this.procInfo.proc_cd}`);
                        this.searchProc(); // 목록 갱신
                        this.procInfo={};
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
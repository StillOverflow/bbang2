<template>
    <div id="page-inner" class="mx-auto">
        <div class="py-4 container-fluid">
            <div class="card py-5 px-6">
                <div class="row">
                    <!-- 사원목록 -->
                    <div class="col-md-7" style="height: auto">
                        <h4 class="mb-3 text-center">사원 목록</h4>
                        <div class="d-flex justify-content-left align-items-center mb-2" style="width: 100%">
                            <div style="width: 15%">
                                <label class="me-2 align-self-center" style="font-size: 18px; font-weight: bold;">사원명</label>
                            </div>
                            <div class="d-flex justify-content-left align-items-center" style="width: 85%">
                                <input type="search" class="form-control d-inline" v-model="keyword" placeholder="사원명을 입력하세요" style="width: 75%" />
                                <button class="btn btn-warning mb-0" style="width: 25%; margin-left: 10px" @click="searchMem">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </div>
                        <!-- 사원 테이블 ag-grid -->
                        <ag-grid-vue
                            class="ag-theme-alpine"
                            style="width: 100%; height: 600px"
                            :columnDefs="memberDefs"
                            :rowData="memberData"
                            :pagination="true"
                            :gridOptions="gridOptions"
                            @gridReady="onMemGridReady"
                            @rowClicked="memClicked">
                        </ag-grid-vue>
                    </div>

                    <!-- 사원 상세정보 -->
                    <div class="col-md-4 mt-5" style="height: auto; padding-left: 30px; margin-left: 20px;">
                        <div class="text-end mb-3">
                            <button type="button" class="btn btn-secondary mb-0 ms-4" @click="newMember">신규등록</button>
                        </div>

                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;">사원코드 *</div>
                            <div class="input-group mb-3" style="width: 25%;">
                                <input type="text" class="form-control" v-model="memInfo.mem_cd" style="height: 41px; background-color: rgb(236, 236, 236);" maxlength="10" disabled />
                            </div>
                            <div class="col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 15%; font-size: 16px; text-align: right; padding-right: 15px;">ID *</div>
                            <div class="input-group mb-3" style="width: 30%;">
                                <input type="text" class="form-control" v-model="memInfo.id" style="height: 41px;" disabled />
                            </div>
                        </div>

                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;">사원명</div>
                            <div class="input-group mb-3" style="width: 65%;">
                                <input type="text" class="form-control" v-model="memInfo.name" style="height: 41px;" />
                            </div>
                        </div>

                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;">성별</div>
                            <div class="input-group mb-3" style="width: 25%;">
                                <select class="form-select custon-width" v-model="memInfo.gender">
                                    <option v-for="(opt, idx) in selectedData.selectOptions.gender" :key="idx" :value="opt.comm_dtl_cd">{{ opt.comm_dtl_nm }}</option>
                                </select>
                            </div>
                            <div class="col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 20%; font-size: 16px; text-align: right; padding-right: 15px;">부서</div>
                            <div class="input-group mb-3" style="width: 30%;">
                                <select class="form-select custon-width" v-model="memInfo.dpt_cd">
                                    <option v-for="(opt, idx) in selectedData.selectOptions.dpt_cd" :key="idx" :value="opt.dpt_cd">{{ opt.dpt_nm }}</option>
                                </select>
                            </div>
                        </div>

                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;">생년월일</div>
                            <div class="input-group mb-3" style="width: 65%;">
                                <input type="date" class="form-control" v-model="memInfo.birth" style="height: 41px;" />
                            </div>
                        </div>

                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;">연락처</div>
                            <div class="input-group mb-3" style="width: 65%;">
                                <input type="text" class="form-control" v-model="memInfo.phone" style="height: 41px;" @input="autoSeparate" maxlength="13" placeholder="000-0000-0000" />
                            </div>
                        </div>

                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;">e-mail</div>
                            <div class="input-group mb-3" style="width: 65%;">
                                <input type="text" class="form-control" v-model="memInfo.email" style="height: 41px;" />
                            </div>
                        </div>

                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;">입사일 *</div>
                            <div class="input-group mb-3" style="width: 65%;">
                                <input type="date" class="form-control" v-model="memInfo.hire_dt" style="height: 41px;" />
                            </div>
                        </div>

                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;">퇴사일</div>
                            <div class="input-group mb-3" style="width: 65%;">
                                <input type="date" class="form-control" v-model="memInfo.quit_dt" style="height: 41px;" />
                            </div>
                        </div>

                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;">주소</div>
                            <div class="input-group mb-3" style="width: 65%;">
                                <input type="text" class="form-control" v-model="memInfo.addr" style="height: 41px;" />
                                <button type="button" class="btn btn-warning" @click="openPostcode">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </div>

                        <div class="d-flex justify-content-left mb-2">
                            <div class="col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;">권한 *</div>
                            <div class="input-group mb-3" style="width: 30%;">
                                <select class="form-select custon-width" v-model="memInfo.permission">
                                    <option v-for="(opt, idx) in selectedData.selectOptions.permission" :key="idx" :value="opt.comm_dtl_cd">{{ opt.comm_dtl_nm }}</option>
                                </select>
                            </div>
                            <div class="col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 20%; font-size: 16px; text-align: right; padding-right: 15px;">상태</div>
                            <div class="input-group mb-3" style="width: 30%;">
                                <select class="form-select custon-width" v-model="memInfo.status">
                                    <option v-for="(opt, idx) in selectedData.selectOptions.status" :key="idx" :value="opt.comm_dtl_cd">{{ opt.comm_dtl_nm }}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="text-center mt-3">
                        <button type="button" id="submitBtn" class="btn btn-success ms-2 mt-3" @click="isUpdated ? memUpdate() : memInsert()">저장</button>
                    </div>                 
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
    name: "PostCode",
    created(){
        this.$store.dispatch('breadCrumb', { title: '사원 관리' });
        this.fetchCommonCodes();
        this.searchMem();
        
        let memCd = this.$route.query.mem_cd;
        if(memCd > 0){
            //수정
            this.getBoardInfo(memCd);
            this.isUpdated = true;
        }       
    },
    data(){
        return{
            isNewMode: false,
            namePd: '',
            gridOptions: {
                rowSelection: {
                    mode:"singleRow",
                    checkboxes: false,
                    enableClickSelection: true,
                }
            },
            memInfo: {
                mem_cd : '',
                id:'',
                name : '',
                gender: '',
                birth:'',
                phone:'',
                email:'',
                hire_dt:'',
                quit_dt:'',
                addr:'',
                permission:'',
                status:'',
                dpt_cd:''
            },
            isUpdated : false,
            
            clientNamesearch:'',
            mem_cd:'',
            unit:'',       
            status:'',     
            selectedData:{
                gender: '', // 단위
                permission:'',
                selectOptions: {
                    gender: [], // 단위 공통코드
                    permission:[],
                    status:[],
                    dpt_cd: [],
                },
            },
            newMember() {
                this.memInfo = {
                mem_cd : '',
                id:'',
                name : '',
                gender: '',
                birth:'',
                phone:'',
                email:'',
                hire_dt:'',
                quit_dt:'',
                addr:'',
                permission:'',
                status:'',
                dpt_cd:''
                };
                this.isUpdated = false; // 신규등록 모드로 전환
                this.isNewMode = true;
            },
            memberDefs:[
                {headerName: 'id' , field: 'id', cellStyle: { textAlign: "center" } },
                {headerName: '사원명' , field: 'name', cellStyle: { textAlign: "center" } },
                {headerName: '부서' , field: 'dpt_cd', cellStyle: { textAlign: "center" } },
                {headerName: '휴대폰' , field: 'phone', cellStyle: { textAlign: "center" } },     
                {headerName: '입사일' , field: 'hire_dt', valueFormatter: this.$comm.dateFormatter, cellStyle: { textAlign: "center" } },     
                {headerName: '상태정보' , field: 'status', cellStyle: { textAlign: "center" } }, 
                {headerName: '권한' , field: 'permission', cellStyle: { textAlign: "center" } },
            ],
            memberData:[],
            keyword: '',
            memKeyword: {}
        }        
    },


    methods:{
        //휴대폰
        autoSeparate() {
        let inputValue = this.memInfo.phone;

        // 숫자가 아닌 문자 제거
        inputValue = inputValue.replace(/[^0-9]/g, '');

        // 올바른 위치에 대시 추가
        if (inputValue.length > 3 && inputValue.charAt(3) !== '-') {
            inputValue = inputValue.slice(0, 3) + '-' + inputValue.slice(3);
        }
        if (inputValue.length > 8 && inputValue.charAt(8) !== '-') {
            inputValue = inputValue.slice(0, 8) + '-' + inputValue.slice(8);
        }

        // 입력값 업데이트
        this.memInfo.phone = inputValue;
        },
        //주소api
        openPostcode() {
        new window.daum.Postcode({
            oncomplete: (data) => {
            // 주소 데이터를 v-model로 바인딩
            this.memInfo.addr = data.address;
            },
        }).open();
        },
        //----------------------------공통함수()---------------------------
        //사원 검색 조회
        async searchMem() {
        this.memKeyword = {name: this.keyword};
        let result = await axios.get('/api/comm/member', { params: this.memKeyword });
        this.memberData = result.data;
        },
        // 공통코드 가져오기
        async fetchCommonCodes() {
            try {
                const gender = await axios.get('/api/comm/codeList/GE');
                const permission = await axios.get('/api/comm/codeList/MB');
                const status = await axios.get('/api/comm/codeList/MS');
                const dpt_cd = await axios.get('/api/standard/dptSelect');

                this.selectedData.selectOptions={
                    gender: gender.data,
                    permission: permission.data,
                    status: status.data,
                    dpt_cd: dpt_cd.data,
                }
                
            } catch (error) {
                console.error('공통코드 가져오기 실패:', error);
            }
        },
        
        memClicked(params){
            this.memInfo.mem_cd = params.data.mem_cd;
            this.memInfo.id = params.data.id;
            this.memInfo.name = params.data.name;
            this.memInfo.birth = this.matchDate_null(params.data.birth);
            this.memInfo.gender = this.matchCode(this.selectedData.selectOptions.gender, params.data.gender);
            this.memInfo.dpt_cd = this.matchDptCode(this.selectedData.selectOptions.dpt_cd, params.data.dpt_cd);
            this.memInfo.phone = params.data.phone;
            this.memInfo.email = params.data.email;
            this.memInfo.hire_dt = this.matchDate(params.data.hire_dt);
            this.memInfo.quit_dt = this.matchDate_null(params.data.quit_dt);
            this.memInfo.addr = params.data.addr;
            this.memInfo.permission = this.matchCode(this.selectedData.selectOptions.permission, params.data.permission);
            this.memInfo.status = this.matchCode(this.selectedData.selectOptions.status, params.data.status);
            this.isUpdated = true;
            this.isNewMode = false;       
            
            this.copyMemInfo = {...this.memInfo};
        },
        matchCode(options, value) { //매칭 메소드
            const match = options.find((opt) => opt.comm_dtl_nm == value || opt.comm_dtl_cd == value); //코드나 이름에 벨류가 있는지 확인
            return match ? match.comm_dtl_cd : ''; // 있으면 코드 반환 없으면 공백
        },
        matchDptCode(options, value) { //매칭 메소드
            const match = options.find((opt) => opt.dpt_nm == value || opt.dpt_cd == value); //코드나 이름에 벨류가 있는지 확인
            return match ? match.dpt_cd : ''; // 있으면 코드 반환 없으면 공백
        },
        // matchDate(value){
        //     const date = new Date(value);
        //     return date.toISOString().split('T')[0];
        // },
        onMemGridReady(params){
            params.api.sizeColumnsToFit();
            this.gridApi = params.api;
        },
        matchDate(value) {
        return this.$comm.dateFormatter({ value });
        },
        matchDate_null(value) {
        return this.$comm.dateFormatter_returnNull({ value });
        },
        
        async memInsert(){
            if(!this.memInfo.name || !this.memInfo.gender || !this.memInfo.hire_dt || !this.memInfo.permission ){
                this.$swal({
                icon: "error",
                title: "필수 입력값을 확인해주세요!",
                text: "사원명",
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
                        title: "등록완료",
                        icon: "success",
                        confirmButtonText: "확인"
                        });
                        await axios.post(`/api/standard/insertMember`, this.memInfo);
                        this.searchMem(); // 목록 갱신
                        this.memInfo={};
                    }         
                              
                });
        },
        async memUpdate() {
            if(!this.objectKey(this.memInfo, this.copyMemInfo)){
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
                        icon: "success",
                        confirmButtonText: "확인"
                        });
                    await axios.put(`/api/standard/updateMember/${this.memInfo.mem_cd}`, this.memInfo);
                    this.searchMem(); // 목록 갱신
                    this.memInfo={};
                    }
                    
                });
        },
        async delMember(){           
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
                        title: "삭제완료",
                        icon: "success",
                        text: "",
                        confirmButtonText: "확인"
                        });
                        await axios.delete(`/api/standard/delMember/${this.memInfo.mem_cd}`);
                        this.searchMem(); // 목록 갱신
                        this.memInfo={};
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
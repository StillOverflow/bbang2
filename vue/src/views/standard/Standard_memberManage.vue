<template>
    <div id="page-inner" class="mx-auto">
      <div class="py-4 container-fluid">
        <div class="card py-5 px-6">
          <div class="row">
            <!-- 사원목록 -->
            <div class="col-md-8" style="height: auto">
              <h4 class="mb-3 text-center">사원 목록</h4>
              <div class="d-flex justify-content-left align-items-center mb-2" style="width: 100%" >
                <div style="width: 15%">
                  <label class="me-2 align-self-center">사원명</label>
                </div>
                
                <div  class="d-flex justify-content-left align-items-center" style="width: 75%" >
                  <input type="search" class="form-control d-inline" v-model="keyword" placeholder="사원명을 입력하세요" style="width: 75%" />
                  <button class="btn btn-warning mb-0" style="width: 25%; margin-left: 10px" @click="searchMem" > <i class="fa-solid fa-magnifying-glass"></i> </button>
                </div>
              </div>
              <!-- 사원 테이블 ag-gird -->
              <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 900px; height: 600px"
                :columnDefs="memberDefs"
                :rowData="memberData"
                :pagination="true"
                :gridOptinos="gridOptinos"
                @gridReady="onMemGridReady"
                @rowClicked="memClicked">
              </ag-grid-vue>
            </div>
            
            <!-- <div class="col-2 col-xl-1 d-flex flex-column align-items-center justify-content-center"></div> -->
            <div class="col-md-4 mt-5" style="height: auto">
                <div class="mb-3 d-flex justify-content-end" >
                    <button type="button" class="btn btn-secondary ms-5  mt-3 saveBtn" @click="newMember">신규등록</button>
                </div>
                <div class="d-flex justify-content-left  mb-2">
                    <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">사원코드 *</div>
                    <div class="input-group mb-3 w-30">
                        <input type="text" class="form-control" v-model="memInfo.mem_cd" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px; background-color: rgb(236, 236, 236);" maxlength="2" disabled/>                     
                    </div>
                    <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">ID *</div>
                    <div class="input-group mb-3 w-30">
                        <input type="text" class="form-control" v-model="memInfo.id" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px;" disabled/>
                    </div>
                </div>
           
            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">사원명</div>
                <div class="input-group mb-3 w-50">
                    <input type="text" class="form-control" v-model="memInfo.name" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;" :disabled="!isNewMode"/>
                </div>
            </div>
            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">성별</div>
                <div class="input-group mb-3 w-10">
                    <select class="form-select custon-width" v-model="memInfo.gender">
                        <option v-for="(opt, idx) in selectedData.selectOptions.gender"
                            :key="idx"
                            :value="opt.comm_dtl_cd">
                            {{ opt.comm_dtl_nm }}
                        </option>
                    </select>
                </div>
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">부서</div>
                <div class="input-group mb-3 w-20">
                    <select class="form-select custon-width" v-model="memInfo.dpt_cd">
                        <option v-for="(opt, idx) in selectedData.selectOptions.dpt_cd"
                            :key="idx"
                            :value="opt.dpt_cd">
                            {{ opt.dpt_nm }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">생년월일</div>
                <div class="input-group mb-3 w-50">
                    <input type="date" class="form-control" v-model="memInfo.birth" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;"  />
                </div>
            </div>
                <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">연락처</div>
                <div class="input-group mb-3 w-50">
                    <input type="text" class="form-control" v-model="memInfo.phone" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;"  />
                </div>
            </div>

            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">e-mail</div>
                <div class="input-group mb-3 w-50">
                    <input type="text" class="form-control" v-model="memInfo.email" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;"  />
                </div>
            </div>
            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">입사일 *</div>
                <div class="input-group mb-3 w-50">
                    <input type="date" class="form-control" v-model="memInfo.hire_dt" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;"  />
                </div>
            </div>
            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">퇴사일</div>
                <div class="input-group mb-3 w-50">
                    <input type="date" class="form-control" v-model="memInfo.quit_dt" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;"  />
                </div>
            </div>
            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">주소</div>
                <div class="input-group mb-3 w-50">
                    <input type="text" class="form-control" v-model="memInfo.addr" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;"  />
                </div>
            </div>

            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">권한 *</div>
                <div class="input-group mb-3 w-20">
                    <select class="form-select custon-width" v-model="memInfo.permission">
                        <option v-for="(opt, idx) in selectedData.selectOptions.permission"
                            :key="idx"
                            :value="opt.comm_dtl_cd">
                            {{ opt.comm_dtl_nm }}
                        </option>
                    </select>
                </div>
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">상태</div>
                <div class="input-group mb-3 w-20">
                    <select class="form-select custon-width" v-model="memInfo.status">
                        <option v-for="(opt, idx) in selectedData.selectOptions.status"
                            :key="idx"
                            :value="opt.comm_dtl_cd">
                            {{ opt.comm_dtl_nm }}
                        </option>
                    </select>
                </div>
            </div>
            </div> 
                <div class="text-center">
                    <button type="button" id="submitBtn" class="btn btn-success ms-2  mt-3 saveBtn" @click="isUpdated? memUpdate() : memInsert()"> submit </button>
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
    created(){
        this.$store.dispatch('breadCrumb', { title: '사원 관리' });
        this.searchMem();
        this.fetchCommonCodes();
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
            gridOptinos: {
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
                {headerName: 'id' , field: 'id'},
                {headerName: '사원명' , field: 'name'},
                {headerName: '부서' , field: 'dpt_cd'},
                {headerName: '휴대폰' , field: 'phone'},     
                {headerName: '입사일' , field: 'hire_dt', valueFormatter: this.$comm.dateFormatter},     
                {headerName: '상태정보' , field: 'status'}, 
                {headerName: '권한' , field: 'permission'},
            ],
            memberData:[],
            keyword: '',
            memKeyword: {}
        }        
    },


    methods:{
        //----------------------------공통함수()---------------------------
        //사원 검색 조회
        async searchMem() {
        this.memKeyword = {mem_nm: this.keyword};
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

                console.log(this.selectedData.selectOptions.dpt_cd);
                console.log(dpt_cd.data);

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
            this.memInfo.birth = this.matchDate(params.data.birth);
            this.memInfo.gender = this.matchCode(this.selectedData.selectOptions.gender, params.data.gender);
            this.memInfo.dpt_cd = this.matchDptCode(this.selectedData.selectOptions.dpt_cd, params.data.dpt_cd);
            this.memInfo.phone = params.data.phone;
            this.memInfo.email = params.data.email;
            this.memInfo.hire_dt = this.matchDate(params.data.hire_dt);
            this.memInfo.quit_dt = this.matchDate(params.data.quit_dt);
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
        matchDate(value){
            const date = new Date(value);
            return date.toISOString().split('T')[0];
        },
        onMemGridReady(params){
            params.api.sizeColumnsToFit();
            this.gridApi = params.api;
        },
        
        async memInsert(){
            console.log(this.memInfo)
            if(!this.memInfo.name || !this.memInfo.gender || !this.memInfo.hire_dt || !this.memInfo.permission ){
                this.$swal({
                icon: "error",
                title: "필수 입력값을 확인해주세요!",
                text: "사원명",
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
                    confirmButtonText: "Yes!"
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        this.$swal({
                        title: "register!",
                        text: "Your file has been register.",
                        icon: "success"
                        });
                        await axios.post(`/api/standard/insertMember`, this.memInfo);
                        this.searchMem(); // 목록 갱신
                    }                   
                });
        },
        async memUpdate() {
            if(!this.objectKey(this.memInfo, this.copyMemInfo)){
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
                    await axios.put(`/api/standard/updateMember/${this.memInfo.mem_cd}`, this.memInfo);
                    this.searchMem(); // 목록 갱신
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
                    confirmButtonText: "Yes, delete!"
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        this.$swal({
                        title: "delete!",
                        text: "Your file has been deleted.",
                        icon: "success"
                        });
                        await axios.delete(`/api/standard/delMember/${this.memInfo.mem_cd}`);
                        this.searchMem(); // 목록 갱신
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
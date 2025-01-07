<template>
    <div id="page-inner" class="mx-auto">
      <div class="py-4 container-fluid">
        <div class="card py-5 px-6">
          <div class="row">
            <!-- 거래처목록 -->
            <div class="col-md-6" style="height: auto">
              <h4 class="mb-3 text-center">거래처 목록</h4>
              <div class="d-flex justify-content-left align-items-center mb-2" style="width: 100%" >
                <div style="width: 15%">
                  <label class="me-2 align-self-center" style="font-size: 18px;">거래처명</label>
                </div>
                
                <div  class="d-flex justify-content-left align-items-center" style="width: 85%" >
                  <input type="search" class="form-control d-inline" v-model="keyword" placeholder="거래처명을 입력하세요" style="width: 75%" />
                  <button class="btn btn-warning mb-0" style="width: 25%; margin-left: 10px" @click="searchAct" > <i class="fa-solid fa-magnifying-glass"></i> </button>
                </div>
              </div>
              <!-- 거래처 테이블 ag-gird -->
              <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 600px"
                :columnDefs="accountDefs"
                :rowData="accountData"
                :pagination="true"
                :gridOptions="gridOptions"
                @gridReady="onActGridReady"
                @rowClicked="actClicked">
              </ag-grid-vue>
            </div>

            <!-- <div class="col-1 col-xl-1 d-flex flex-column align-items-center ">
                    <button type="button" class="btn btn-secondary mb-0 ms-4  mt-5 saveBtn" @click="newAccount"
                    style="visibility: hidden;">신규등록</button>              
            </div> -->
            <div class="col-md-5 mt-5" style="height: auto; padding-left: 30px; margin-left: 20px;">
                <div class="text-end mb-3">
                        <button type="button" class="btn btn-secondary mb-0 ms-4" @click="newAccount"
                        v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT3' )">신규등록</button>              
                </div>

                
                <div class="d-flex justify-content-left mb-2">
                    <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;" :style="t_overflow">거래처코드 *</div>
                    <div class="input-group mb-3" style="width: 45%;">
                        <input type="text" class="form-control" v-model="actInfo.act_cd" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px; background-color: rgb(236, 236, 236);" maxlength="2" disabled/>                     
                    </div>
                    <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 25%; font-size: 16px; text-align: right; padding-right: 15px;" :style="t_overflow">거래처명 *</div>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" v-model="actInfo.act_nm" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px;"  />
                    </div>
                </div>
           
            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;" :style="t_overflow">사업자등록번호 *</div>
                <div class="input-group mb-3" style="width: 65%;">
                    <input type="text" class="form-control" v-model="actInfo.business_no" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;" @input = "autoBusinessNo" maxlength ="12"/>
                </div>
            </div>
            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;" :style="t_overflow">대표자명</div>
                <div class="input-group mb-3 w-50">
                    <input type="text" class="form-control" v-model="actInfo.ceo_nm" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;"  />
                </div>
            </div>
            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;" :style="t_overflow">거래처담당자</div>
                <div class="input-group mb-3 w-50">
                    <input type="text" class="form-control" v-model="actInfo.mgr_nm" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;"  />
                </div>
            </div>
            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder align-items-center" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;" :style="t_overflow">거래처담당자<br> 연락처</div>
                <div class="input-group mb-3 w-50">
                    <input type="text" class="form-control" v-model="actInfo.mgr_tel" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;" @input="autoSeparate"  maxlength="13" placeholder="010-0000-0000" />
                </div>
            </div>

            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;" :style="t_overflow">업체연락처</div>
                <div class="input-group mb-3 w-50">
                    <input type="text" class="form-control" v-model="actInfo.act_tel" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;" @input="autoSeparateTel"  maxlength="12" placeholder="000-000-0000"/>
                </div>
            </div>
            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;" :style="t_overflow">소재지</div>
                <div class="input-group mb-3 w-50">
                    <!-- <input type="text" class="form-control" v-model="actInfo.location" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;"  /> -->
                    <select class="form-select custon-width" v-model="actInfo.location">
                        <option value="서울">서울</option>  
                        <option value="인천">인천</option>
                        <option value="대전">대전</option>    
                        <option value="광주">광주</option>                  
		                <option value="대구">대구</option>
                        <option value="울산">울산</option>
                        <option value="부산">부산</option>
                        <option value="경기도">경기도</option>
                        <option value="강원도">강원도</option>
                        <option value="충남">충남</option>
                        <option value="충북">충북</option>
                        <option value="경북">경북</option>
                        <option value="경남">경남</option>
                        <option value="전북">전북</option>
                        <option value="전남">전남</option>
                        <option value="제주">제주</option>
                    </select>
                </div>
            </div>
            <div class="d-flex justify-content-left  mb-2">    
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;" :style="t_overflow">거래처주소</div>
                <div class="input-group mb-3 w-70">
                    <input type="text" class="form-control" v-model="actInfo.act_addr" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;"  />
                    <button type="button" class="btn btn-warning " @click="openPostcode"><i class="fa-solid fa-magnifying-glass"></i></button>
                </div>
            </div>

            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;" :style="t_overflow">거래처구분 *</div>
                <div class="input-group mb-3 w-50">
                    <select class="form-select custon-width" v-model="actInfo.act_type">
                        <option v-for="(opt, idx) in selectedData.selectOptions.act_type"
                            :key="idx"
                            :value="opt.comm_dtl_cd">
                            {{ opt.comm_dtl_nm }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="d-flex justify-content-left  mb-2">
                <div class="col-6 col-lg-3 text-center mb-2 mt-2 fw-bolder" style="width: 35%; font-size: 16px; text-align: right; padding-right: 15px;" :style="t_overflow">비고</div>                
                        <textarea cols="30" rows="6" type="text" class="form-control h-25" v-model="actInfo.note" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px;" />                
            </div>
            <div class="col-1 col-xl-1 d-flex justify-content-between  flex-column align-items-center "></div>
            </div> 
                <div class="text-center">
                    <button type="button" id="submitBtn" class="btn btn-success ms-2 mt-3" @click="isUpdated? actUpdate() : actInsert()"
                    v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT3' )"> 저장 </button>
                    <button type="button" class="btn btn-danger ms-2 mt-3" @click="delAccount"
                    v-if="this.$session.get('user_ps') == 'H01' || (this.$session.get('user_ps') == 'H02' && this.$session.get('user_dpt') == 'DPT3' )"> 삭제 </button>
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
        this.$store.dispatch('breadCrumb', { title: '거래처 관리' });
        this.searchAct();
        this.fetchCommonCodes();
        let actCd = this.$route.query.act_cd;
        if(actCd > 0){
            //수정
            this.getBoardInfo(actCd);
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
            actInfo: {
                act_nm : '',
                act_type : '',
                business_no: '',
                ceo_nm:'',
                mgr_nm:'',
                mgr_tel:'',
                act_tel:'',
                location:'',
                act_addr:'',
                note:'',
                //create_dt:''
            },
            isUpdated : false,
            
            clientNamesearch:'',
            act_cd:'',
            unit:'',            
            selectedData:{
                act_type: '', // 단위
                selectOptions: {
                    act_type: [], // 단위 공통코드
                },
            },
            newAccount() {
                this.actInfo = {
                act_cd: '',
                act_nm : '',
                business_no: '',
                ceo_nm:'',
                mgr_nm:'',
                mgr_tel:'',
                act_tel:'',
                location:'',
                act_addr:'',
                act_type:'',
                note:'',
                };
                this.isUpdated = false; // 신규등록 모드로 전환
            },
            accountDefs:[
                {headerName: '거래처코드' , field: 'act_cd', cellStyle: { textAlign: "center" } },
                {headerName: '거래처명' , field: 'act_nm', cellStyle: { textAlign: "center" } },
                {headerName: '거래처구분' , field: 'act_type', cellStyle: { textAlign: "center" } },
                {headerName: '사업자등록번호' , field: 'business_no', cellStyle: { textAlign: "center" } },     
            ],
            accountData:[],
            keyword: '',
            actKeyword: {}
        }        
    },


    methods:{
        //휴대폰
        autoSeparate() {
        let inputValue = this.actInfo.mgr_tel;
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
        this.actInfo.mgr_tel = inputValue;
        },

        //사업자등록번호
        autoBusinessNo() {
        let inputValue = this.actInfo.business_no;

        inputValue = inputValue.replace(/[^0-9]/g, '');

        if (inputValue.length > 3 && inputValue.charAt(3) !== '-') {
            inputValue = inputValue.slice(0, 3) + '-' + inputValue.slice(3);
        }
        if (inputValue.length > 6 && inputValue.charAt(6) !== '-') {
            inputValue = inputValue.slice(0, 6) + '-' + inputValue.slice(6);
        }

        this.actInfo.business_no = inputValue;
        },
        //업체전화번호
        autoSeparateTel(){
        let inputValue = this.actInfo.act_tel;

        inputValue = inputValue.replace(/[^0-9]/g, '');

        if (inputValue.length > 3 && inputValue.charAt(3) !== '-') {
            inputValue = inputValue.slice(0, 3) + '-' + inputValue.slice(3);
        }
        if (inputValue.length > 7 && inputValue.charAt(7) !== '-') {
            inputValue = inputValue.slice(0, 7) + '-' + inputValue.slice(7);
        }

        this.actInfo.act_tel = inputValue;
        },

        //주소api
        openPostcode() {
        new window.daum.Postcode({
            oncomplete: (data) => {
            // 주소 데이터를 v-model로 바인딩
            this.actInfo.act_addr = data.address;
            },
        }).open();
        },

        //----------------------------공통함수()---------------------------
        //거래처 검색 조회
        async searchAct() {
        this.actKeyword = {act_nm: this.keyword};
        let result = await axios.get('/api/comm/account', { params: this.actKeyword });
        this.accountData = result.data;
        },
        // 공통코드 가져오기
        async fetchCommonCodes() {
            try {
                const act_type = await axios.get('/api/comm/codeList/AC');

                this.selectedData.selectOptions={
                    act_type: act_type.data
                }
            } catch (error) {
                console.error('공통코드 가져오기 실패:', error);
            }
        },
        actClicked(params){
            this.actInfo.act_cd = params.data.act_cd;
            this.actInfo.act_nm = params.data.act_nm;
            this.actInfo.business_no = params.data.business_no;
            this.actInfo.ceo_nm = params.data.ceo_nm;
            this.actInfo.mgr_nm = params.data.mgr_nm;
            this.actInfo.mgr_tel = params.data.mgr_tel;
            this.actInfo.act_tel = params.data.act_tel;
            this.actInfo.location = params.data.location;
            this.actInfo.act_addr = params.data.act_addr;
            this.actInfo.act_type = this.matchCode(this.selectedData.selectOptions.act_type ,params.data.act_type)
            this.actInfo.note = params.data.note;
            this.actInfo.create_dt = this.$comm.getMyDay(params.data.create_dt);
            this.isUpdated = true;       
            
            this.copyActInfo = {...this.actInfo};
        },
        matchCode(options, value) { //매칭 메소드
            const match = options.find((opt) => opt.comm_dtl_nm == value || opt.comm_dtl_cd == value); //코드나 이름에 벨류가 있는지 확인
            return match ? match.comm_dtl_cd : ''; // 있으면 코드 반환 없으면 공백
        },
        onActGridReady(params){
            params.api.sizeColumnsToFit();
            this.gridApi = params.api;
        },
        
        async actInsert(){
            if(!this.actInfo.act_nm || !this.actInfo.act_type || !this.actInfo.business_no){
                this.$swal({
                icon: "error",
                title: "필수 입력값을 확인해주세요!",
                text: "",
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
                        text: "등록완료",
                        icon: "success"
                        });
                        await axios.post(`/api/standard/account/${this.actInfo.act_cd}`, this.actInfo);
                        this.searchAct(); // 목록 갱신
                        this.actInfo={};
                    }                   
                });





            // try {
            //     let result = await axios.post(`/api/standard/account/${this.actInfo.act_cd}`, this.actInfo);
            //     if (result.data.result) {
            //         alert('거래처 등록');
            //         this.searchAct(); // 목록 갱신
            //     } else {
            //         alert('등록에 실패');
            //     }
            // } catch (err) {
            // console.error('거래처 등록 중 오류:', err);
            // }
        },
        async actUpdate() {
            if(!this.objectKey(this.actInfo, this.copyActInfo)){
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
                    confirmButtonText: "확인",
                    cancelButtonText: "취소"
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        this.$swal({
                        title: "수정완료!",
                        text: "",
                        icon: "success",
                        confirmButtonText: "확인"
                        });
                    await axios.put(`/api/standard/updateAccount/${this.actInfo.act_cd}`, this.actInfo);
                    this.searchAct(); // 목록 갱신
                    }
                    
                });
        },
        async delAccount(){       
            const currentTime = new Date();
            const createDate = new Date(this.actInfo.create_dt);
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
                    cancelButtonText: "확인"
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        this.$swal({
                        title: "삭제완료!",
                        text: "",
                        icon: "success",
                        confirmButtonText: "확인"
                        });
                        await axios.delete(`/api/standard/delAccount/${this.actInfo.act_cd}`);
                        this.searchAct(); // 목록 갱신
                        this.actInfo={};
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
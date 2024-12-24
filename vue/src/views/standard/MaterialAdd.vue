<template>
    <div id="page-inner" class="mx-auto">
      <div class="py-4 container-fluid">
        <div class="card py-5 px-6">
          <div class="row">
            <!-- 제품목록 -->
            <div class="col-md-6" style="height: auto">
              <h4 class="mb-3 text-center">자재 목록</h4>
              <div class="d-flex justify-content-left align-items-center mb-2" style="width: 100%" >
                <div style="width: 15%">
                  <label class="me-2 align-self-center">자재명</label>
                </div>
                
                <div  class="d-flex justify-content-left align-items-center" style="width: 85%" >
                  <input type="search" class="form-control d-inline" v-model="keyword" placeholder="자재명을 입력하세요" style="width: 75%" />
                  <button class="btn btn-warning mb-0" style="width: 25%; margin-left: 10px" @click="searchMtl" > <i class="fa-solid fa-magnifying-glass"></i> </button>
                </div>
              </div>
              <!-- 자재 테이블 ag-gird -->
              <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 600px"
                :columnDefs="materialDefs"
                :rowData="materialData"
                :pagination="true"
                :gridOptinos="gridOptinos"
                @gridReady="onMatGridReady"
                @rowClicked="matClicked">
              </ag-grid-vue>
            </div>
            
            <div class="col-2 col-xl-1 d-flex flex-column align-items-center justify-content-center"></div>
            <div class="col-md-4 mt-5" style="height: auto">
                <div class="mb-3 d-flex justify-content-end" >
                    <button type="button" class="btn btn-secondary ms-5  mt-3 saveBtn" @click="newMaterial">신규등록</button>
                </div>
                <div class="d-flex justify-content-left align-items-center mb-2">
                    <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">자재코드</div>
                    <div class="input-group mb-3 w-50">
                        <input type="text" class="form-control" v-model="matInfo.mat_cd" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px; background-color: rgb(236, 236, 236);" readonly />
                    </div>
                </div>
            <div class="d-flex justify-content-left align-items-center mb-2">
                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">자재명</div>
                <div class="input-group mb-3 w-50">
                    <input type="text" class="form-control" v-model="matInfo.mat_nm" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;"  />
                </div>
            </div>
            <div class="d-flex justify-content-left align-items-center mb-2">
                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">단가</div>
                <div class="input-group mb-3 w-50">
                        <input type="number" class="form-control" v-model="matInfo.price" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px;"  />
                </div>
            </div>    
            <div class="d-flex justify-content-left align-items-center mb-2">
                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">단위</div>
                <div class="input-group mb-3 w-50">
                    <select class="form-select custon-width" v-model="matInfo.unit">
                        <option v-for="(opt, idx) in selectedData.selectOptions.unit"
                            :key="idx"
                            :value="opt.comm_dtl_cd">
                            {{ opt.comm_dtl_nm }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="d-flex justify-content-left align-items-center mb-2">
                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">자재유형</div>
                <div class="input-group mb-3 w-50">
                    <select class="form-select custon-width" v-model="matInfo.type">
                        <option v-for="(opt, idx) in selectedData.selectOptions.type"
                            :key="idx"
                            :value="opt.comm_dtl_cd">
                            {{ opt.comm_dtl_nm }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="d-flex justify-content-left align-items-center mb-2">
                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">카테고리</div>
                <div class="input-group mb-3 w-50">
                    <select class="form-select custon-width" v-model="matInfo.category">
                        <option v-for="(opt, idx) in selectedData.selectOptions.category"
                            :key="idx"
                            :value="opt.comm_dtl_cd">
                            {{ opt.comm_dtl_nm }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="d-flex justify-content-left align-items-center mb-2">
                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">안전재고</div>
                <div class="input-group mb-3 w-50">
                        <input type="text" class="form-control" v-model="matInfo.safe_stk" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px;" />
                </div>
            </div>
            <div class="d-flex justify-content-left align-items-center mb-2">
                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">비고</div>
                
                        <textarea cols="40" rows="8" type="text" class="form-control" v-model="matInfo.note" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px;" />
                
            </div>
            </div> 
                <div class="text-center">
                    <button type="button" id="submitBtn" class="btn btn-success ms-2  mt-3 saveBtn" @click="isUpdated? matUpdate() : matInsert()" :disabled="isDisabled"> submit </button>
                    <button type="button" class="btn btn-danger mt-3 ms-2 saveBtn" @click="delMaterial"> delete </button>
                </div>
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
            isDisabled: true,
            namePd: '',
            gridOptinos: {
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
                note:''
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
                category: '',
                price: '',
                unit: '',
                safe_stk: '',
                note: '',
                };
                this.isUpdated = false; // 신규등록 모드로 전환
            },
            materialDefs:[
                {headerName: '자재코드' , field: 'mat_cd'},
                {headerName: '자재명' , field: 'mat_nm'},
                {headerName: '자재유형' , field: 'type'},
                {headerName: '카테고리' , field: 'category'},
                {headerName: '단가(원)' , field: 'price', 
                valueFormatter: (params) => {
                    if (params.value == null || params.value === '') return '';
                    return new Intl.NumberFormat().format(params.value); // 천 단위 콤마 추가
                },},
                {headerName: '단위' , field: 'unit'},        
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

                this.selectedData.selectOptions.type = type.data || [];
                this.selectedData.selectOptions.category = category.data || [];
                this.selectedData.selectOptions.unit = unit.data || [];
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
            this.matInfo.note = params.data.note
            this.isUpdated = true;         
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
            try {
                let result = await axios.post('/api/standard/material', this.matInfo);
                if (result.data.result) {
                    alert('자재 등록');
                    this.bringMat(); // 목록 갱신
                } else {
                    alert('등록에 실패');
                }
            } catch (err) {
            console.error('자재 등록 중 오류:', err);
            }
        },
        async matUpdate() {
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
                    }
                    await axios.put(`/api/standard/updateMaterial/${this.matInfo.mat_cd}`, this.matInfo);
                    this.bringMat(); // 목록 갱신
                });
        },
        async delMaterial(){           
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
                        await axios.delete(`/api/standard/delMaterial/${this.matInfo.mat_cd}`);
                        this.bringMat(); // 목록 갱신
                    }
                });
                
            
            
        }

    },
    
    watch : {
        // mat_nm(newVal, oldVal) {
        //     console.log('newVal => ', newVal.mat_nm);
        //     console.log('newVal => ', oldVal.mat_nm);
            
        //     // if(this.matInfo){
        //     //     this.isEditMode=false;
        //     //     return;
        //     // }
        //     // this.matClicked(this.matInfo);
        //     // this.isEditMode = true; // 조회 시 수정 모드 활성화
        // }
        matInfo : {
            deep: true,
            handler(newVal, oldVal) {
                console.log("oldVal => ", oldVal);
                if(newVal){
                    this.isDisabled = false;
                }
                
            },
            
        }
    },

}
</script>
<template>
    <div id="page-inner" class="mx-auto">
      <div class="py-4 container-fluid">
        <div class="card py-5 px-6">
          <div class="row">
            <!-- 제품목록 -->
            <div class="col-md-6" style="height: auto">
              <h4 class="mb-3 text-center">자재 목록</h4>
              <div
                class="d-flex justify-content-left align-items-center mb-2"
                style="width: 100%"
              >
                <div style="width: 15%">
                  <label class="me-2 align-self-center">자재명</label>
                </div>
                
                <div
                  class="d-flex justify-content-left align-items-center"
                  style="width: 85%"
                >
                  <input
                    type="text"
                    class="form-control d-inline"
                    v-model="keyword"
                    placeholder="자재명을 입력하세요"
                    style="width: 75%"
                  />
                  <button
                    class="btn btn-warning mb-0"
                    style="width: 25%; margin-left: 10px"
                    @click="searchMtl"
                  >
                    검색
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
                :gridOptinos="gridOptinos"
                @gridReady="onMatGridReady"
                @rowClicked="matClicked">
              </ag-grid-vue>
            </div>
            <div class="col-2 col-xl-1 d-flex flex-column align-items-center justify-content-center"></div>
            <div class="col-md-4" style="height: auto">
                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">자재코드</div>
                <div class="input-group mb-3 w-50">
                    <input type="text" class="form-control" v-model="matInfo.mat_cd" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px; background-color: rgb(236, 236, 236);" readonly />
                </div>

                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">자재명</div>
                <div class="input-group mb-3 w-50">
                    <input type="text" class="form-control" v-model="matInfo.mat_nm" aria-label="Recipient's username" aria-describedby="button-addon2" 
                    style="height: 41px;"  />
                </div>

                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">단가</div>
                <div class="input-group mb-3 w-50">
                        <input type="number" class="form-control" v-model="matInfo.price" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px;"  />
                </div>

                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">단위</div>
                <div class="input-group mb-3 w-50">
                    <select class="form-select custon-width" v-model="matInfo.unit">
                        <option v-for="(opt, idx) in selectedData.selectOptions.unit"
                            :key="idx"
                            :value="selectedData.unit">
                            {{ opt.comm_dtl_nm }}
                        </option>
                    </select>
                </div>

                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">자재유형</div>
                <div class="input-group mb-3 w-50">
                        <input type="text" class="form-control" v-model="matInfo.type" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px;" />
                </div>

                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">카테고리</div>
                <div class="input-group mb-3 w-50">
                        <input type="text" class="form-control" v-model="matInfo.category" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px;" />
                </div>

                <div class="col-6 col-lg-2 text-center mb-2 mt-2 fw-bolder" :style="t_overflow">안전재고</div>
                <div class="input-group mb-3 w-50">
                        <input type="text" class="form-control" v-model="matInfo.safe_stk" aria-label="Recipient's username" aria-describedby="button-addon2" 
                        style="height: 41px;" />
                </div>

            </div> 
                <div class="text-center">
                    <button type="button" class="btn btn-success mt-3 saveBtn " @click="isUpdated? matUpdate() : matInsert()">
                        저장
                    </button>
                    <button
                        class="btn btn-danger mt-3 ms-2 saveBtn ">
                        삭제
                    </button>
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
            matInfo: {
                mat_nm : '',
                type : '',
                category : '',
                price : '',
                unit : '',
                safe_stk : ''
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
            
        }        
    },

    methods:{
        matClicked(params){
            this.matInfo.mat_cd = params.data.mat_cd;
            this.matInfo.mat_nm = params.data.mat_nm;
            this.matInfo.type = params.data.type;
            this.matInfo.category = params.data.category;
            this.matInfo.price = params.data.price;
            this.matInfo.unit = params.data.unit;
            this.matInfo.safe_stk = params.data.safe_stk;         
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
        // 공통코드 가져오기
        async fetchCommonCodes() {
            try {
                const type = await axios.get('/api/commList/MA');
                const category = await axios.get('/api/commList/PC');
                const unit = await axios.get('/api/commList/UN');

                this.selectedData.selectOptions.type = type.data || [];
                this.selectedData.selectOptions.category = category.data || [];
                this.selectedData.selectOptions.unit = unit.data || [];
            } catch (error) {
                console.error('공통코드 가져오기 실패:', error);
            }
        },
        async matInsert(){
            let obj = {
                mat_nm: this.matInfo.mat_nm,
                price: this.matInfo.price,
                unit: this.matInfo.unit,
                type: this.matInfo.type,
                category: this.matInfo.category,
                safe_stk: this.matInfo.safe_stk,
            }

            let result = await axios.post("/api/standard/material", obj)
                                    .catch(err=>console.log(err));
            let addRes = result.data;
            if(addRes.mat_no > 0){
                alert('등록되었습니다.');
            }
        },
        async matUpdate(){
            let obj = {
                mat_cd: this.matInfo.mat_cd,
                mat_nm: this.matInfo.mat_nm,
                price: this.matInfo.price,
                unit: this.matInfo.unit,
                type: this.matInfo.type,
                category: this.matInfo.category,
                safe_stk: this.matInfo.safe_stk,
            }
            let result = await axios.put(`/api/standard/updateMaterial/${this.matInfo.mat_cd}`, obj)
                                    .catch(err=>console.log(err));
            let updateRes = result.data;
            if(updateRes.readonly){
                alert('수정완료')
            }
        }
    },

}
</script>
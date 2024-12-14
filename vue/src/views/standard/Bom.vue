<script setup>
// import BomProduct from "./BomProduct.vue";
// import BomMaterial from "./BomMaterial.vue";
// import BomInformation from "./BomInformation.vue";
</script>

<template>
  <div class=" py-4 container-fluid">
   <!-- bom 관리 -->
    <div class="row">
      <!-- 제품목록 -->
      <div class="col-md-6">
        <h4 class="mb-3">제품 목록</h4>
        <div class="mb-3 me-3">
          <label class="me-2 align-self-center">제품명</label>
          <input type="text" class="form-control w-50 d-inline" placeholder="제품명을 입력하세요">
          <button class="btn btn-primary" @click = "searchPrd">검색</button>
        </div>
        <!-- 제품 테이블 ag-gird -->
        <ag-grid-vue
          class="ag-theme-alpine pt-6"
          style="width: 100%; height: 600px;"
          :columnDefs="productDefs"
          :rowData="productData"
          :pagination="true"
          @rowClicked="rowClicked"> <!--행선택시 bom데이터 조회-->
        </ag-grid-vue>
      </div>

      <div class="col-md-6">
        <!-- 자재 목록 -->
        <h4 class="mb-3">자재 목록</h4>
        <div class="mb-3">
          <label class="me-2 align-self-center">자재명</label>
          <input type="text" class="form-control w-50 d-inline">
          <button class="btn btn-primary">조회</button>
        </div>
        <div class="col-13 text-end">
          <button class="btn btn-primary" @click = "InsertBomData">자재 추가</button>
        </div>
        <!-- 자재 테이블 ag-gird -->
        <ag-grid-vue
          class="ag-theme-alpine"
          style="width: 100%; height: 300px;"
          :columnDefs="materialDefs"
          :rowData="materialData"
          :rowSelection="multiple"
          :pagination="true"
          :cellValueChanged ="cellValueChanged"
          @grid-ready="onGridReady">
        </ag-grid-vue>
        

        <!-- BOM 목록 -->
        <h4 class="mt-4 mb-3">BOM 정보</h4>
        <div class="col-13 text-end">
          <button class="btn btn-danger ms-10" @click = "DeleteBomData">삭제</button>
        </div>
        <!-- BOM 테이블 ag-grid -->
        <ag-grid-vue
          class="ag-theme-alpine"
          style="width: 100%; height: 300px;"
          :columnDefs="bomDefs"
          :rowData="bomData"
          :rowSelection="multiple"> 
        </ag-grid-vue>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';

export default {
  components: { AgGridVue },
  //화면 정보 제목
  created() { 
    this.$store.dispatch('breadCrumb', { title: 'BOM 관리' });
    this.bringMtlData();
    this.bringPrdData();
  },
  data() {
    return {
      selectBomData: null, //제품 선택
      // 제품 테이블 컬럼명
      productDefs: [
        { headerName: '제품코드', field: 'prd_cd', sortable: true},
        { headerName: '제품명', field: 'prd_nm', sortable: true},
        { headerName: '사용여부', field: 'usage_sta'},
        { headerName: '선택', field: 'button',},
      ],
      // 제품 테이블 데이터
      productData: [
        // { prdCode: 'ASS-001', prdName: '소금빵', UseSta: 'N' },
        // { prdCode: 'ASS-002', prdName: '생지', UseSta: 'Y' },
        // { prdCode: 'ASS-003', prdName: '크림', UseSta: 'Y' },
      ],


      // 자재 테이블 컬럼명
      materialDefs: [
        { headerName: '자재코드', field: 'mat_cd', sortable: true, checkboxSelection: true},
        { headerName: '자재명', field: 'mat_nm', sortable: true},
        { headerName: '구분', field: 'type', sortable: true},
        { headerName: 'BOM양', field: 'bom_quantity', editable: true, enableCellChangeFlash: true},
      ],
      // 자재 테이블 데이터
      materialData: [
        // { matCode: 'SSS-001', matName: '밀가루', matType: '원자재', bomQuantity: '0' },
        // { matCode: 'SSS-002', matName: '팥', matType: '부자재', bomQuantity: '0' },
      ],


      // BOM 테이블 정의
      bomDefs: [
        { headerName: '제품코드', field: 'prd_cd', sortable: true,  checkboxSelection: true},
        { headerName: '자재코드', field: 'mat_cd', sortable: true},
        { headerName: '자재명', field: 'mat_nm', sortable: true},
        { headerName: '단가', field: 'price', sortable: true},
        { headerName: 'BOM양', field: 'bom_quantity', sortable: true},
        { headerName: '단위', field: 'unit', cellEditor: 'agSelectCellEditor', 
          cellEditorParams: { values: ['kg', 'g', 'mg'] }, 
          sortable: true,
          editable: true},
      ],
      // BOM 테이블 데이터
      bomData: [
        // {
        //   prdCode: 'ASS-001',
        //   matCode: 'SSS-001',
        //   matName: '밀가루',
        //   price: '2500',
        //   bomQuantity: '100',
        //   unit: 'kg',
        // },
      ],
    };
  },
  //제품정보 불러오기
  methods: {
    async bringPrdData(){
      let result = await axios.get('/api/standard/products')
                              .catch(err => console.log(err));
      this.productData = result.data;
    },
  //자재정보 불러오기
    async bringMtlData(){
      let result = await axios.get('/api/standard/materials')
                              .catch(err => console.log(err));
      this.materialData = result.data;
    },
  //제품 행 클릭시 행 제품코드 전달
  rowClicked(params){
    this.selectBomData =params.data.prd_cd;
    this.bringBomData(this.selectBomData);
  } ,
  //bom정보 불러오기
    async bringBomData(prdCd){
      let result = await axios.get(`/api/standard/bom/${prdCd}`)
                              .catch(err => console.log(err));
      this.bomData = result.data;
    },
  //자재추가
  onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
    },
  //bom에 선택한 자재데이터 추가
  async InsertBomData() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map( node => node.data );
    let result = await axios.post(`/api/standard/bom`, selectedData) 
                            .catch(err => console.log(err));
    let addRes = result.data;
    if(addRes.success){
      alert('추가성공');
      this.bringBomData(this.selectBomData);
    }
      },
  //선택한 bom 정보 삭제
  async DeleteBomData(prdCd, matCd){
    let result = await axios.delete(`/api/standard/bom/${prdCd}/${matCd}`)
                            .catch(err => console.log(err));
  let sqlRes = result.data;
  if(sqlRes.affectRows>=1 && sqlRes.changedRow==0){
    alert('삭제완료');
    this.bringBomData(this.selectBomData);
  }
  },
  //키워드로 검색하기
  async searchPrd(){
    let result = await axios.get(`/api/standard/prodcuts?search=${this.keyword}`).catch(err => console.log(err));
    this.productData = result.data
  }    
    }
  }
</script>


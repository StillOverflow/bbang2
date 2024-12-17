<script setup>

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
          <input type="text" class="form-control w-50 d-inline" v-model="keyword" placeholder="제품명을 입력하세요">
          <button class="btn btn-primary" @click = "searchPrd">검색</button>
        </div>
        <!-- 제품 테이블 ag-gird -->
        <ag-grid-vue
          class="ag-theme-alpine pt-6"
          style="width: 100%; height: 600px;"
          :columnDefs="productDefs"
          :rowData="productData"
          :pagination="true"
          :paginationAutoPageSize="true"
          :cellValueChanged ="cellValueChanged"
          @rowClicked="rowClicked"> <!--행선택시 bom데이터 조회-->
        </ag-grid-vue>
      </div>

      <div class="col-md-6">
        <!-- 자재 목록 -->
        <h4 class="mb-3">자재 목록</h4>
        <div class="mb-3">
          <label class="me-2 align-self-center">자재명</label>
          <input type="text" class="form-control w-50 d-inline" v-model="matkeyword" placeholder="자재명을 입력하세요">
          <button class="btn btn-primary" @click = "searchMtl">검색</button>
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
          @gridReady="onMatGridReady">
        </ag-grid-vue>
        

        <!-- BOM 목록 -->
        <h4 class="mt-4 mb-3">BOM 정보</h4>
        <div class="col-13 text-end">
          <button class="btn btn-danger ms-10" @click = "deleteBom">삭제</button>
        </div>
        <!-- BOM 테이블 ag-grid -->
        <ag-grid-vue
          class="ag-theme-alpine"
          style="width: 100%; height: 300px;"
          :columnDefs="bomDefs"
          :rowData="bomData"
          :pagination="true"
          :rowSelection="multiple"
          overlayNoRowsTemplate="제품에 대한 bom정보가 없습니다."
          @gridReady="onBomGridReady"> 
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
    this.bringCommData();
  },
  data() {
    return {
      selectBomData: null, //제품 선택
      selectMatData: null,
      selectPrdData: null,
      // 제품 테이블 컬럼명
      productDefs: [
        { headerName: '제품코드', field: 'prd_cd', sortable: true},
        { headerName: '제품명', field: 'prd_nm', sortable: true},
        { headerName: '사용여부', field: 'usage_sta' ,cellEditor: 'agSelectCellEditor'},
        { headerName: '선택', field: 'button',},
      ],
      // 제품 테이블 데이터
      productData: [
        // { prdCode: 'ASS-001', prdName: '소금빵', UseSta: 'N' },
        // { prdCode: 'ASS-002', prdName: '생지', UseSta: 'Y' },
        // { prdCode: 'ASS-003', prdName: '크림', UseSta: 'Y' },
      ],
      //검색데이터
      keyword: "",

      // 자재 테이블 컬럼명
      materialDefs: [
        { headerName: '자재코드', field: 'mat_cd', sortable: true, checkboxSelection: true},
        { headerName: '자재명', field: 'mat_nm', sortable: true},
        { headerName: '구분', field: 'type', sortable: true},
        { headerName: '단위', field: 'unit', sortable: true, cellEditor: 'agSelectCellEditor',
          cellEditorParams: { 
            values : []
          }, 
          
          editable: true
        },
        { headerName: 'BOM양', field: 'usage', editable: true, enableCellChangeFlash: true},
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
        { headerName: 'BOM양', field: 'usage', sortable: true},
        { headerName: '단위', field: 'unit', sortable: true, editable: true},
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
  
  methods: {
    //공통코드검색
    async bringCommData(){
      let result = await axios.get(`/api/standard/commList/${'UN'}`);
      this.commData = result.data;
      //console.log("commData", this.commData)
      let unitDataList = []; // 정의 

      this.commData.forEach((data) => {
        //console.log("data => ", );
        unitDataList.push(data.comm_dtl_nm) //[,,,]
      });
      
      let idx = this.materialDefs.findIndex( obj => obj.field == 'unit'); // => 숫자
      this.materialDefs[idx].cellEditorParams.values = unitDataList; // materialDefs[idx] => materialDefs[3]
    },
    //제품검색기능
    searchPrd(){
      axios.get(`/api/standard/products/${this.keyword}`)
      .then(response => {
      this.productData = response.data;
    })
    .catch(err => {
      console.error("검색 실패:", err);
    });
    },
    
    //제품정보 불러오기
    async bringPrdData(){
      let result = await axios.get('/api/standard/products')
                              .catch(err => console.log(err));
      this.productData = result.data;
    },
    //자재검색기능
    searchMtl(){
      axios.get(`/api/standard/materials/${this.matkeyword}`)
      .then(response => {
      this.materialData = response.data;
    })
    .catch(err => {
      console.error("검색 실패:", err);
    });
    },
  //자재정보 불러오기
    async bringMtlData(){
      let result = await axios.get('/api/standard/materials')
                              .catch(err => console.log(err));
      this.materialData = result.data;
    },
  //제품 행 클릭시 행 제품코드 전달
  rowClicked(params){
    this.selectBomData = params.data.prd_cd;
    this.bringBomData(this.selectBomData);
  } ,
  //bom 행클릭시 행 제품코드랑 자재코드 전달


  //bom정보 불러오기
    async bringBomData(prdCd){
      let result = await axios.get(`/api/standard/bom/${prdCd}`)
                              .catch(err => console.log(err));
      this.bomData = result.data;
      
    },
  //자재추가
    onMatGridReady(params) {
      this.materialGridApi = params.api;
    },
    onBomGridReady(params) {
      this.bomGridApi = params.api; // BOM 테이블 gridApi
    },
  //bom에 선택한 자재데이터 추가
  async InsertBomData() {
    try {
      const selectedNodes = this.materialGridApi.getSelectedNodes();
      const selectedMat = selectedNodes.map( node => node.data );

      for(const dup of selectedMat){
        if(this.bomData.some(obj => obj.mat_cd == dup.mat_cd)){
          alert('이미 자재 존재');
          return;
        }
      }
      const bomMatData = selectedMat.map(material=>({
        prd_cd: this.selectBomData,
        mat_cd: material.mat_cd,
        unit: material.unit,
        usage: parseFloat(material.usage) || 0
      }));


      let result = await axios.post(`/api/standard/bom`, bomMatData)  
                              .catch(err => console.log(err));
      let addRes = result.data;
      console.log(result);
      if(addRes.result == 'success'){//그리드 실시간 반영을 위한 데이터
        const selectBom = selectedMat.map(material=>({
          prd_cd: this.selectBomData,
          mat_cd: material.mat_cd,
          unit: material.unit,
          usage: parseFloat(material.usage) || 0,
          mat_nm: material.mat_nm,
          price: material.price||0
        }));

        this.bomGridApi.applyTransaction({
          add: selectBom,
        });

        console.log("BOM 테이블에 추가된 데이터:", bomMatData);
        alert('추가성공');
        
      }} catch (error) {
          console.error("서버 요청 중 오류 발생:", error);
          alert(`오류 발생`);
      }
    
    },
  //선택한 bom 정보 삭제
    async deleteBom(){
      const selectedNodes = this.bomGridApi.getSelectedNodes(); //현재행 가져오기
      const selectedBomData = selectedNodes.map(node => node.data); //가져온 데이터 배열에 저장

      for(const bom of selectedBomData){ //bom객체에 아까 저장한 배열에서 .prc_cd추출
        let result = await axios.delete(`/api/standard/bom/${bom.prd_cd}/${bom.mat_cd}`)
                                .catch(err => console.log(err));
        let sqlRes = result.data;
        if(sqlRes.result =='success'){
          this.bomGridApi.applyTransaction({ // applyTransaction : 실시간으로
            remove: [bom], //bom객체를 remove대상 지정
          });
          alert('삭제성공')
    }
      }
    
    },
      
      }
    }
</script>


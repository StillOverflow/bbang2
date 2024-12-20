<!-- 기준정보 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      

      <!-- 제품/공정흐름도 -->
      <div class="card-body">
        <div class="row">
          <div class="col-7">
            <h4 class="ms-3">제품</h4>
          </div>
          <div class="col-5">
            <div class="row">
              <div class="col-5">
                <h4 class="ms-3" >BOM내역</h4>
              </div>
              <div class="col-8 text-end">
                <button
                  class="btn btn-success"
                  @click="modalOpen"
                >
                  자재추가
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-5">
            <!-- 제품 목록 -->
            <ag-grid-vue
              class="ag-theme-alpine me-5"
              style="width: 100%; height: 300px"
              :columnDefs="productDefs"
              :rowData="productData"
              :pagination="true"
              :cellValueChanged="cellValueChanged"
              :gridOptions="gridOptions"
              @gridReady="gridReady"
              @rowClicked="prodClicked"
            >
              <!--행선택시 bom데이터 조회-->
            </ag-grid-vue>
          </div>
          <div class="col-2 col-xl-1 d-flex flex-column align-items-center justify-content-center"></div>
          <div class="col-5">
            <!-- BOM 목록 -->
            <ag-grid-vue
              class="ag-theme-alpine"
              style="width: 100%; height: 300px"
              :columnDefs="bomDefs"
              :rowData="bomData"
              :pagination="true"
              :rowSelection="multiple"
              overlayNoRowsTemplate="제품에 대한 bom정보가 없습니다."
              :gridOptions="bomOptions"
              @rowClicked="proFlowClicked"
              @gridReady="gridReady"
            >
            </ag-grid-vue>
          </div>
        </div>
      </div>

      <!-- bom내역/ 공정코드 -->
      <div class="card-body">
        <div class="row">
          <div class="col-7">
            <h4 class="ms-3">공정흐름도</h4>
            <div class="col-8 text-end">
              <button class="btn btn-secondary mb-0 ms-2" >위로</button>
              <button class="btn btn-secondary mb-0 ms-2" >아래로</button>
              <button
                class="btn btn-success mb-0 ms-2"
                @click="modalOpen"
              >
                공정추가
              </button>
              <button class="btn btn-danger mb-0 ms-2" @click="deleteProc">삭제</button>
            </div>
          </div>

          <div class="col-5">
            <div class="row">
              <div class="col-5">
                <h4 class="ms-0">공정별 자재</h4>
              </div>
              <div class="ms-3 col-10">
                <button class="btn btn-danger " >삭제</button>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-5">
            <!-- 공정 흐름도 -->
            <ag-grid-vue
              class="ag-theme-alpine"
              style="width: 100%; height: 300px"
              :columnDefs="procFlowDefs"
              :rowData="procFlowData"
              :rowSelection="multiple"
              :pagination="true"
              :cellValueChanged="cellValueChanged"
              :gridOptions="proFlowOptions"
              @rowClicked="proFlowClicked"
              @gridReady="onProFlowgridReady"

              overlayNoRowsTemplate="제품을 선택하세요."
            >
            </ag-grid-vue>
          </div>
          <div class="col-2 col-xl-1 d-flex flex-column align-items-center justify-content-center"></div>
          <div class="col-5">
            <!-- 공정별 자재 흐름도 -->
            <ag-grid-vue
              class="ag-theme-alpine"
              style="width: 100%; height: 300px"
              :columnDefs="procFlowMtlDefs"
              :rowData="procFlowMtlData"
              :rowSelection="multiple"
              :pagination="true"
              :cellValueChanged="cellValueChanged"
              overlayNoRowsTemplate="공정에 대한 자재정보가 없습니다."
              @gridReady="gridReady"
            >
            </ag-grid-vue>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Layout :modalCheck="isModal">
    <template v-slot:header>
      <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
      <h5 class="modal-title">공정코드 검색</h5>
      <button type="button" aria-label="Close" class="close" @click="modalOpen">
        ×
      </button>
    </template>
    <template v-slot:default>
      <ag-grid-vue
        class="ag-theme-alpine"
        style="width: 100%; height: 400px"
        :columnDefs="modalDefs"
        :rowData="modalData"
        :pagination="true"
        :gridOptions="bomOptions"
        @rowClicked="modalClicked"
        @gridReady="onModalGridReady"
      >
      </ag-grid-vue>
    </template>
    <template v-slot:footer>
      <button type="button" class="btn btn-secondary" @click="modalOpen">
        Cancel
      </button>
      <button type="button" class="btn btn-primary" @click="InsertProc">
        OK
      </button>
    </template>
  </Layout>
  <div class="col-6 text-end">
    <button class="btn btn-success" @click="save">저장</button>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";
import Layout from "../components/modalLayout.vue";

export default {
  components: { AgGridVue, Layout },
  created() {
    this.$store.dispatch("breadCrumb", { title: "공정흐름도 관리" });
    this.bringProFlow();
    this.bringPrdUsa();
    this.bringBomData();
    this.bringMtlData();
    this.bringProcCd();
  },
  data() {
    return {
      bomOptions: {
        rowSelection: { mode: "multiRow" },
        suppressMovableColumns: true,
      },
      proFlowOptions:{
        rowDragManaged :true,
        rowDragEntireRow: true,
        rowSelection: { mode: "multiRow" },
      },
      gridOptions: {
        rowSelection: {
          mode: "singleRow",
          checkboxes: false,
          enableClickSelection: true,
        },
      },
      //제품정보
      productDefs: [
        { headerName: "제품코드", field: "prd_cd", sortale: true },
        { headerName: "제품명", field: "prd_nm", sortale: true },
        { headerName: "사용여부", field: "useSta", sortale: true },
      ],
      productData: [],
      //공정흐름도
      procFlowDefs: [
        {
          headerName: "순서",
          field: "proc_seq",
          valueGetter: "node.rowIndex + 1",
          sortale: true,
          rowDrag: true,         
        },
        { headerName: "공정코드", field: "proc_cd", sortale: true },
        { headerName: "공정명", field: "proc_nm", sortale: true },
      ],
      procFlowData: [],

      //bom조회
      bomDefs: [
        {
          headerName: "제품코드",
          field: "prd_cd",
          sortable: true,
        },
        { headerName: "자재코드", field: "mat_cd", sortable: true },
        { headerName: "자재명", field: "mat_nm", sortable: true },
        { headerName: "BOM양", field: "usage", sortable: true, editable: true },
        { headerName: "단위", field: "unit", sortable: true },
      ],
      bomData: [],
      //공정별 자재 데이터
      procFlowMtlDefs: [
        { headerName: "자재코드", field: "mat_cd", sortable: true },
        { headerName: "자재명", field: "mat_nm", sortable: true },
        { headerName: "투입량", field: "mat_qty", sortable: true },
        { headerName: "단위", field: "unit", sortable: true },
      ],
      procFlowMtlData: [],

      //모달 공정코드
      modalDefs: [
        { headerName: "공정코드", field: "proc_cd", sortable: true },
        { headerName: "공정명", field: "proc_nm", sortable: true },
      ],
      modalData: [],
      //저장 버튼 누르기전 담아둘 장소
      saveModal: [],
      deleteModal:[],
      isModal: false,
    };
  },

  methods: {
    //모달오픈
    modalOpen() {
      this.isModal = !this.isModal;
    },
    //제품조회
    async bringPrdUsa() {
      let result = await axios
        .get("/api/standard/productFlow")
        .catch((err) => console.log(err));
      this.productData = result.data;
    },
    //공정흐름도 조회
    async bringProFlow(prdCd) {
      let result = await axios
        .get(`/api/standard/flow/${prdCd}`)
        .catch((err) => console.log(err));
      this.procFlowData = result.data;
    },
    //제품선택정보
    prodClicked(params) {
      this.selectProData = params.data.prd_cd;
      this.bringProFlow(this.selectProData);
      this.bringBomData(this.selectProData);
    },
    //공정흐름도선택정보
    proFlowClicked(params) {
      this.selectProFlowData = params.data.proc_cd;
      this.bringMtlData(this.selectProFlowData);
    },
    //모달선택정보
    modalClicked(params){
      this.selectModalData = params.data.prod_cd;
    },
    //공정코드 조회
    async bringProcCd() {
      let result = await axios
        .get(`/api/standard/procCd`)
        .catch((err) => console.log(err));
      this.modalData = result.data;
    },
    //bom조회
    async bringBomData(prdCd) {
      let result = await axios
        .get(`/api/standard/bom/${prdCd}`)
        .catch((err) => console.log(err));
      this.bomData = result.data;
    },
    //공정별 자재
    async bringMtlData(procCd) {
      let result = await axios
        .get(`/api/standard/proessMtl/${procCd}`)
        .catch((err) => console.log(err));
      this.procFlowMtlData = result.data;
    },
    gridReady(params) {
      this.gridApi = params.api;
    },
    onModalGridReady(params){
      this.modalApi = params.api;
    },
    onProFlowgridReady(params){
      this.prowFlowApi = params.api;
    },
    //순서변경
//     onRowDragEnd(event) {
//       const newOrder = this.prowFlowApi.getDisplayedRowAtIndex(0).data;
//       console.log(newOrder, event);
//       return newOrder;
// },
onRowDragEnd() { // `event` 제거
  const updatedSequence = [];
  const newOrder = this.prowFlowApi.getDisplayedRowAtIndex(0).data;
  updatedSequence.push(newOrder);
  this.saveData = updatedSequence; // Track updates for saving
},
    //모달 공정 클릭시 추가
    async InsertProc(){
      const selectedNodes =this.modalApi.getSelectedRows(); //정보 배열로 담기

      //const selectedModal = selectedNodes.map((node)=>node.data); //배열로
      console.log('selectedNodes =>', selectedNodes);
      for(const dup of selectedNodes) {
        const saveModal = {//그리드용
          proc_seq: this.procFlowData.length + 1,
          proc_cd: dup.proc_cd,
          proc_nm: dup.proc_nm
        };
      

      const saveRealModal={
        proc_cd: saveModal.proc_cd,
        proc_nm: saveModal.proc_nm,
        proc_seq: saveModal.proc_seq
      };

      this.saveModal.push(saveRealModal);
      this.prowFlowApi.applyTransaction({
        add: [saveModal],
      }); //ui반영
      console.log("saveModal => ", saveModal);
    };
    },

    //공정흐름도 삭제
    async deleteProc(){
      const selectedNodes = this.prowFlowApi.getSelectedRows();
      console.log(selectedNodes);
      for(const bom of selectedNodes){
        this.deleteModal.push(bom);

        this.prowFlowApi.applyTransaction({
          remove: [bom],
        })

      }
    },
    async save(){
      for(const bom of this.deleteModal){
      await axios.delete(
        `/api/standard/flow/${bom.proc_flow_cd}`
      );
      console.log(bom.proc_flow_cd);
      for (const bom of this.saveModal){
        await axios.post(`/api/standard/procFlow`, bom)
      }

      this.saveModal = [];
      this.deleteModal = [];
      this.bringProFlow(this.selectProData);
    }
    }







    
  },
};
</script>

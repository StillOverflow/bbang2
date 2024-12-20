<!-- 기준정보 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <div class="card-header bg-light ps-5 ps-md-4">
        <!-- 대상분류 자재/제품/공정 -->
        <div class="row mb-3">
          <div
            class="col-12 col-md-1 text-center me-5 mb-2 fw-bolder"
            :style="t_overflow"
          >
            대상분류
          </div>
          <div
            class="form-check col-4 col-md-2"
            v-for="(opt, idx) in radios"
            :key="idx"
          >
            <input
              class="form-check-input"
              type="radio"
              v-model="selected_radio"
              :value="opt.item"
              :id="'radio' + opt.item"
              @change="getDivs"
            />
            <label class="form-check-label" :for="'radio' + opt.item">
              {{ opt.name }}
            </label>
          </div>
        </div>

        <!-- 구분/카테고리/모달 조회조건 선택 -->
        <div class="row">
          <div
            class="col-6 col-lg-1 text-center mb-2 fw-bolder"
            :style="t_overflow"
          >
            구분
          </div>
          <div class="col-6 col-lg-2 mb-2">
            <select class="form-select" v-model="selected_div">
              <option v-for="(opt, idx) in divs" :key="idx" :value="opt.item">
                {{ opt.name }}
              </option>
            </select>
          </div>
          <div
            class="col-6 col-lg-1 text-center mb-2 fw-bolder"
            :style="t_overflow"
          >
            카테고리
          </div>
          <div class="col-6 col-lg-2 mb-2">
            <select
              class="form-select"
              v-model="selected_cate"
              :disabled="noCate"
            >
              <option v-for="(opt, idx) in cates" :key="idx" :value="opt.item">
                {{ opt.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 제품/공정흐름도 -->
      <div class="card-body">
        <div class="row">
          <div class="col-7">
            <h4 class="ms-3">제품</h4>
          </div>
          <div class="col-5">
            <div class="row">
              <div class="col-5">
                <h4 class="ms-3" :style="t_break">BOM내역</h4>
              </div>
              <div class="col-8 text-end">
                <button
                  class="btn btn-success"
                  :style="t_break"
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
              <button class="btn btn-secondary" :style="t_break">위로</button>
              <button class="btn btn-secondary" :style="t_break">아래로</button>
              <button
                class="btn btn-success"
                :style="t_break"
                @click="modalOpen"
              >
                공정추가
              </button>
              <button class="btn btn-danger" :style="t_break">삭제</button>
            </div>
          </div>

          <div class="col-5">
            <div class="row">
              <div class="col-5">
                <h4 class="ms-0">공정별 자재</h4>
              </div>
              <div class="ms-3 col-10">
                <button class="btn btn-danger" :style="t_break">삭제</button>
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
              overlayNoRowsTemplate="제품을 선택하세요."
              :gridOptions="gridOptions"
              @rowClicked="proFlowClicked"
              @gridReady="gridReady"
            >
            </ag-grid-vue>
          </div>
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
        @grid-ready="gridFit"
      >
      </ag-grid-vue>
    </template>
    <template v-slot:footer>
      <button type="button" class="btn btn-secondary" @click="modalOpen">
        Cancel
      </button>
      <button type="button" class="btn btn-primary" @click="modalOpen">
        OK
      </button>
    </template>
  </Layout>
  <div class="col-6 text-end">
    <button class="btn btn-success">저장</button>
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
          valueGetter: "node.rowIndex+1",
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
    //모달 공정 클릭시 정보 전달
    // modalClicked(params){
    //   selecteProCdData = params.data.proc_cd;
    //   추가 메소드
    // },

    //공정흐름도 등록
    // async InsertProcFlowData(){
    //   try{
    //     const selectedNodes = this.gridApi.getSelectedNodes();
    //     const selectedProCd = selectedNodes.map((node)=>node.data);

    //     for(const dup of selectedProCd){ //그리드
    //       const saveBom ={
    //         proc_nm: dup.proc_nm,
    //         proc_cd: dup.proc_cd,

    //       }
    //     }

    //   }catch (error) {
    //     console.error("서버 요청 중 오류 발생:", error);
    //     alert(`오류 발생`);
    //   }
    // },
    gridFit(params) {
      // 매개변수 속성으로 자동 접근하여 sizeColumnsToFit() 실행함. (가로스크롤 삭제)
      params.api.sizeColumnsToFit();
    },
  },
};
</script>

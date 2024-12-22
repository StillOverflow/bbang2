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
                <h4 class="ms-3">BOM내역</h4>
              </div>
              <div class="col-8 text-end">
                <button class="btn btn-success" @click="InsertProcMtl">
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
          <div
            class="col-2 col-xl-1 d-flex flex-column align-items-center justify-content-center"
          ></div>
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
              @rowClicked="bomClicked"
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
              <button class="btn btn-secondary mb-0 ms-2">위로</button>
              <button class="btn btn-secondary mb-0 ms-2">아래로</button>
              <button class="btn btn-success mb-0 ms-2" @click="modalOpen">
                공정추가
              </button>
              <button class="btn btn-danger mb-0 ms-2" @click="deleteProc">
                삭제
              </button>
            </div>
          </div>

          <div class="col-5">
            <div class="row">
              <div class="col-5">
                <h4 class="ms-0">공정별 자재</h4>
              </div>
              <div class="ms-3 col-10">
                <button class="btn btn-danger" @click="deleteProcMtl">
                  삭제
                </button>
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
          <div
            class="col-2 col-xl-1 d-flex flex-column align-items-center justify-content-center"
          ></div>
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
              :gridOptions="bomOptions"
              @rowClicked="ProFlowMtlClicked"
              @gridReady="onProFlowMtl"
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
        취소
      </button>
      <button type="button" class="btn btn-primary" @click="InsertProc">
        추가
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
        rowSelection: { mode: "singleRow", enableClickSelection: true },
        suppressMovableColumns: true,
      },
      proFlowOptions: {
        rowDragManaged: true,
        rowDragEntireRow: true,
        rowSelection: { mode: "singleRow", enableClickSelection: true },
        onRowDragEnd: this.onRowDragEnd,
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
      saveProwMtlData: [],
      deleteProwMtlData: [],
      saveModal: [],
      deleteModal: [],
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
      this.selectProFlowData = params.data.proc_flow_cd;
      this.bringMtlData(this.selectProFlowData);
    },
    //모달선택정보
    modalClicked(params) {
      this.selectModalData = params.data.prod_cd;
    },
    //공정별 자재 선택
    ProFlowMtlClicked(params) {
      this.selectroFlowMtllData = params.data.proc_mat_flow_cd;
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
    onModalGridReady(params) {
      this.modalApi = params.api;
    },
    onProFlowgridReady(params) {
      this.prowFlowApi = params.api;
    },
    onProFlowMtl(params) {
      this.procFlowMtlApi = params.api;
    },

    //모달 공정 클릭시 공정흐름도 추가
    async InsertProc() {
      const selectedNodes = this.modalApi.getSelectedRows(); //정보 배열로 담기
      let maxSeq = 0;

      const response = await axios.get(
        `/api/standard/flowSeq/${this.selectProData}`
      );
      maxSeq = response.data[0].maxSeq;

      let index = 1;
      for (const dup of selectedNodes) {
        const procSeq = maxSeq + index;
        index++;
        const saveBom = {
          //그리드용
          proc_seq: procSeq,
          proc_cd: dup.proc_cd,
          proc_nm: dup.proc_nm,
        };

        const saveRealModal = {
          prd_cd: this.selectProData,
          proc_cd: saveBom.proc_cd,
          proc_seq: saveBom.proc_seq,
        };

        this.saveModal.push(saveRealModal);

        this.prowFlowApi.applyTransaction({
          add: [saveBom],
        }); //ui반영
        this.isModal = !this.isModal;
      }
    },

    //공정흐름도 삭제
    async deleteProc() {
      const selectedNodes = this.prowFlowApi.getSelectedRows();
      console.log(selectedNodes);
      for (const bom of selectedNodes) {
        this.deleteModal.push(bom);

        this.prowFlowApi.applyTransaction({
          remove: [bom],
        });
        !this.isModal;
      }
    },

    //공정 자재추가
    async InsertProcMtl() {
      const selectedNodes = this.gridApi.getSelectedRows(); // 선택된 BOM 데이터
      for (const material of selectedNodes) {
        //그리드용
        const saveMaterial = {
          mat_cd: material.mat_cd,
          mat_nm: material.mat_nm,
          mat_qty: parseFloat(material.usage) || 0,
          unit: material.unit,
          proc_flow_cd: this.selectProFlowData,
        };

        const newMaterial = {
          mat_cd: saveMaterial.mat_cd,
          mat_qty: saveMaterial.mat_qty,
          prd_cd: this.selectProData,
          proc_flow_cd: this.selectProFlowData,
        };

        this.saveProwMtlData.push(newMaterial);

        this.procFlowMtlApi.applyTransaction({
          add: [saveMaterial],
        }); // 그리드
      }
    },
    //공정별 자재 삭제
    async deleteProcMtl() {
      const selectedNodes = this.procFlowMtlApi.getSelectedRows();
      console.log(selectedNodes);
      for (const bom of selectedNodes) {
        this.deleteProwMtlData.push(bom);

        this.procFlowMtlApi.applyTransaction({
          remove: [bom],
        });
      }
    },
    //저장
    async save() {
      console.log("Save 메소드");
      //공정흐름삭제
      if (this.deleteModal.length > 0) {
        for (const bom of this.deleteModal) {
          await axios.delete(`/api/standard/flow/${bom.proc_flow_cd}`);
        }
      }
      //공정별 자재 삭제
      if (this.deleteProwMtlData.length > 0) {
        for (const bom of this.deleteProwMtlData) {
          await axios.delete(`/api/standard/flowMtl/${bom.proc_mat_flow_cd}`);
        }
      }
      // 공정흐름도만 등록
      if (this.saveModal.length > 0 && this.saveProwMtlData.length == 0) {
        //공정흐름등록 데이터 존재 자재등록데이터 비존재
        for (const procFlow of this.saveModal) {
          try {
            await axios.post(`/api/standard/flow`, procFlow);
          } catch (error) {
            console.error("공정흐름도 등록 실패:", error);
          }
        }
      }
      // 공정흐름도등록 + 등록한 공정에 자재 등록
      if (this.saveModal.length > 0 && this.saveProwMtlData.length > 0) {
        //공정흐름등록 데이터 존재 자재등록데이터 존재
        const sendProcFlowMtl = [...this.saveModal, ...this.saveProwMtlData];
        try {
          await axios.post(`/api/standard/procFlowMtl`, sendProcFlowMtl);
        } catch (error) {
          console.error("공정흐름도와 자재 등록 실패:", error);
        }
      }
      // 기존 흐름도 공정별 자재만 등록
      if (this.saveModal.length == 0 && this.saveProwMtlData.length > 0) {
        //공정흐름도 데이터 비존재 자재등록데이터 존재
        for (const material of this.saveProwMtlData) {
          try {
            await axios.post(`/api/standard/processMaterial`, material);
          } catch (error) {
            console.error("공정별 자재 등록 실패:", error);
          }
        }
      }

      //
      if (
        this.saveModal.length > 0 &&
        this.saveProwMtlData.some((material) => material.proc_flow_cd) //공정흐름도 데이터 존재 자재등록데이터에서 공정흐름도가 존재하는경우
      ) {
        for (const material of this.saveProwMtlData) {
          if (material.proc_flow_cd) {
            try {
              await axios.post(`/api/standard/processMaterial`, material);
            } catch (error) {
              console.error("기존 공정흐름 자재 등록 실패:", error);
            }
          }
        }
      }
      this.saveModal = [];
      this.deleteModal = [];
      this.saveProwMtlData = [];
      this.deleteProwMtlData = [];
      this.bringProFlow(this.selectProData);
    },
  },
};
</script>

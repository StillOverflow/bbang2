<template>
  <div id="page-inner" class="mx-auto">
    <div class="py-4 container-fluid">
      <div class="card py-5 px-6">
        <div class="row">
          <!-- 제품목록 -->
          <div class="col-md-6" style="height: auto">
            <h4 class="mb-3 text-center">제품 목록</h4>
            <div
              class="d-flex justify-content-left align-items-center mb-2" style="width: 100%">
              <div style="width: 15%">
                <label class="me-2 align-self-center" style="font-size: 18px; font-weight: bold;">제품명</label>
              </div>
              <div
                class="d-flex justify-content-left align-items-center"
                style="width: 85%"
              >
                <input
                  type="text"
                  class="form-control d-inline"
                  v-model="keyword"
                  placeholder="제품명을 입력하세요"
                  style="width: 75%"
                />
                <button
                  class="btn btn-warning mb-0"
                  style="width: 25%; margin-left: 10px"
                  @click="searchPrd"
                >
                <i class="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>
            <!-- 제품 테이블 ag-gird -->
            <ag-grid-vue
              class="ag-theme-alpine my-4"
              style="width: 100%; height: 683px"
              :columnDefs="productDefs"
              :rowData="productData"
              :pagination="true"
              :paginationAutoPageSize="true"
              :gridOptions="prdOptions"
              :cellValueChanged="cellValueChanged"
              @gridReady="onPrdGridReady"
              @rowClicked="rowClicked" >
              <!--행선택시 bom데이터 조회-->
            </ag-grid-vue>
          </div>
          <!-- <div class="col-2 col-xl-1 d-flex flex-column align-items-center justify-content-center"></div> -->
          <div class="col-md-6" style="height: auto">
            <!-- 자재 목록 -->
            <h4 class="mb-3 text-center">자재 목록</h4>
            <div class="mb-3" >
              <label class="me-2 align-self-center" style="font-size: 18px; font-weight: bold;">자재명</label>
              <input
                type="text"
                class="form-control d-inline"
                v-model="matkeyword"
                placeholder="자재명을 입력하세요"
                style="width: 70%"
              />
              <button class="btn btn-warning mb-0 ms-2"  @click="searchMtl" ><i class="fa-solid fa-magnifying-glass"></i></button>
              
            </div>
            <div class="col-13 text-end">
              
            </div>
            <!-- 자재 테이블 ag-gird -->
            <ag-grid-vue
              class="ag-theme-alpine my-4"
              style="width: 100%; height: 300px"
              :columnDefs="materialDefs"
              :rowData="materialData"
              :pagination="true"
              :gridOptions="gridOptions"
              :cellValueChanged="cellValueChanged"
              @gridReady="onMatGridReady"
            >
            </ag-grid-vue>
            <!-- BOM 목록 -->          
            <div class="col-13 text-end">
              <!-- <h4 class="mt-4 mb-3">BOM 정보</h4> -->
              <label class="align-self-center me-9 fs-5">BOM 정보</label>
              <button class="btn btn-outline-primary mt-2 mb-2 ms-2"  @click="InsertBomData"
              v-if="this.$session.get('user_ps') == 'H01'">
                자재 추가
              </button>
              <button class="btn btn-outline-primary mt-2 mb-2 ms-2"
              v-else style="visibility: hidden;">
                공간
              </button>
              <button class="btn btn-outline-danger mt-2 mb-2 ms-2" @click="deleteBom"
              v-if="this.$session.get('user_ps') == 'H01'">
                삭제
              </button>
              <button class="btn btn-outline-primary mt-2 mb-2 ms-2"
              v-else style="visibility: hidden;">
                공간
              </button>
            </div>
            <!-- BOM 테이블 ag-grid -->
            <div>
              <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 300px"
                :columnDefs="bomDefs"
                :rowData="bomData"
                :pagination="true"
                :gridOptions="gridOptions"
                :cellValueChanged="cellValueMtlChanged"
                overlayNoRowsTemplate="제품에 대한 bom정보가 없습니다."
                @gridReady="onBomGridReady"
              >
              </ag-grid-vue>
              <div class="text-center">
                <button
                  type="button" class="btn btn-success ms-2 mt-3" @click="save"
                  
                  v-if="this.$session.get('user_ps') == 'H01'">
                  저장
                </button>
                <button type="button" class="btn btn-secondary ms-2 mt-3" @click="reset">
                        초기화
                </button>
              </div>              
            </div>
          </div> 
        </div>     
      </div>      
    </div>    
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";
import axios from "axios";
// import Swal from "sweetalert2";

export default {
  components: { AgGridVue },

  //화면 정보 제목
  created() {
    this.$store.dispatch("breadCrumb", { title: "BOM 관리" });
    this.bringMtlData();
    //this.bringPrdData();
    this.searchPrd();
  },

  data() {
    return {
      selectBomData: null, //제품 선택
      selectMatData: null,
      selectPrdData: null,
      // 제품 테이블 컬럼명
      gridOptions: {
        rowSelection: { mode: "multiRow" },
        suppressMovableColumns: true,
      },
      
      prdOptions: {
        rowSelection: {
          mode: "singleRow",
          checkboxes: false,
          enableClickSelection: true,
          suppressMovableColumns: true,
        },
      },
      productDefs: [
        { headerName: "제품코드", field: "prd_cd", sortable: true , cellStyle: { textAlign: "center" } },
        { headerName: "제품명", field: "prd_nm", sortable: true , cellStyle: { textAlign: "center" } },
        {
          headerName: "카테고리",
          field: "category",
          cellEditor: "agSelectCellEditor", cellStyle: { textAlign: "center" } 
        },
        {
          headerName: "등록날짜",
          field: "create_dt",
          valueFormatter: this.$comm.dateFormatter, cellStyle: { textAlign: "center" } 
        },
      ],
      // 제품 테이블 데이터
      productData: [],
      //검색데이터
      keyword: "",

      // 자재 테이블 컬럼명
      materialDefs: [
        {
          headerName: "자재코드",
          field: "mat_cd",
          sortable: true,
        },
        { headerName: "자재명", field: "mat_nm", sortable: true , cellStyle: { textAlign: "center" } },
        { headerName: "구분", field: "type", sortable: true, cellStyle: { textAlign: "center" }  },
        {
          headerName: "BOM양",
          field: "usage",
          editable: true,
          enableCellChangeFlash: true,
          cellDataType: 'number',
          cellRenderer: this.placeholderRenderer, // Placeholder 기능 추가
          cellStyle: { textAlign: "right" }  
        },
        {
          headerName: "단위",
          field: "unit_cd",
          sortable: true,
          valueGetter: (params) => params.data.unit_nm, // 화면표시
          valueSetter: (params) => {
            params.data.unit_cd = params.newValue; // 내부 코드 전달
            return true;
          },
        },
      ],
      // 자재 테이블 데이터
      materialData: [],

      // BOM 테이블 정의
      bomDefs: [
        {
          headerName: "제품코드",
          field: "prd_cd",
          sortable: true,
        },
        { headerName: "자재코드", field: "mat_cd", sortable: true, cellStyle: { textAlign: "center" }  },
        { headerName: "자재명", field: "mat_nm", sortable: true, cellStyle: { textAlign: "center" }  },
        { headerName: "BOM양", field: "usage", sortable: true ,editable: true,
        cellStyle: {textAlign: "right"},
        cellValueChanged: this.cellValueMtlChanged},
        { headerName: "단위", field: "unit", sortable: true , cellStyle: { textAlign: "center" } },
      ],
      // BOM 테이블 데이터
      bomData: [],

      saveData: [],
      deleteData: [],
    };
  },

  methods: {
    //자재업데이트
    cellValueMtlChanged(params)  { 
        const updatedBom = params.data;

        // 값이 숫자인지 확인하고 변환
        if (!isNaN(params.newValue)) {
          updatedBom.usage = parseFloat(params.newValue);
        } else {
          updatedBom.usage = 0; // 잘못된 입력 처리
        }

        // 수정된 데이터 저장
        const saveIndex = this.updatedBoms.findIndex(
          (item) => item.prd_cd == updatedBom.prd_cd && item.mat_cd == updatedBom.mat_cd
        );

        if (saveIndex != -1) { //이미 있다면 기존 데이터 업데이트, 없으면 새로운 데이터 추가
          this.updatedBoms[saveIndex] = {
            usage: updatedBom.usage,
            prd_cd: updatedBom.prd_cd,
            mat_cd: updatedBom.mat_cd
          };
        } else {
          this.updatedBoms.push({
            usage: updatedBom.usage,
            prd_cd: updatedBom.prd_cd,
            mat_cd: updatedBom.mat_cd
          });
        }
    },
    //플레이스홀더
    placeholderRenderer(params) {
            // 주문 수량 값이 없으면 placeholder 텍스트 표시
            if (!params.value) {
                return `<span style="color: gray; font-style: italic;">bom양을 입력하세요</span>`;
            }
            return params.value.toLocaleString ? params.value.toLocaleString() : params.value; // 값이 있으면 그대로 표시
        },
    //제품검색기능
    searchPrd() {
      axios
        .get(`/api/standard/products/${this.keyword}`)
        .then((response) => {
          this.productData = response.data;
        })
        .catch((err) => {
          console.error("검색 실패:", err);
        });
    },

    //자재검색기능
    searchMtl() {
      axios
        .get(`/api/standard/materials/${this.matkeyword}`)
        .then((response) => {
          this.materialData = response.data;
        })
        .catch((err) => {
          console.error("검색 실패:", err);
        });
    },
    //자재정보 불러오기
    async bringMtlData() {
      let result = await axios
        .get("/api/standard/materials")
        .catch((err) => console.log(err));
      this.materialData = result.data;
    },
    //제품 행 클릭시 행 제품코드 전달
    rowClicked(params) {
      this.selectBomData = params.data.prd_cd;
      this.bringBomData(this.selectBomData);
      this.bringMtlData();
    },

    //bom정보 불러오기
    async bringBomData(prdCd) {
      let result = await axios
        .get(`/api/standard/bom/${prdCd}`)
        .catch((err) => console.log(err));
      this.bomData = result.data;
    },
  
    //스크롤없애기
    onPrdGridReady(params) {
      this.prdGridApi = params.api;
      params.api.sizeColumnsToFit();
    },
    //자재추가
    onMatGridReady(params) {
      this.materialGridApi = params.api;
      params.api.sizeColumnsToFit();
    },
    onBomGridReady(params) {
      this.bomGridApi = params.api; // BOM 테이블 gridApi
      params.api.sizeColumnsToFit();
    },

    //bom에 선택한 자재데이터 추가
    async InsertBomData() {
      try {
        const selectedNodes = this.materialGridApi.getSelectedNodes(); //자재데이터 불러오기
        const selectedMat = selectedNodes.map((node) => node.data); //배열로 저장
        if (!this.selectBomData) {
          this.$swal({
            icon: "error",
            title: "제품 선택이 되지 않았습니다.",
            text: "제품 선택 후 추가해주세요",
            confirmButtonText: "확인"
          });
          return;
        }
        for (const dup of selectedMat) {
          if(!dup.usage||dup.usage<0){
            this.$swal({
            icon: "warning",
            title: "BOM양을 입력해주세요.",
            text: "BOM양은 0보다 큰 숫자를 적어주세요.",
            confirmButtonText: "확인"
          });
          return; // 입력값이 잘못된 경우 추가 작업 중단
        }


          const saveBom = {
            //보여주기용 그리드에 넘기기
            prd_cd: this.selectBomData,
            mat_cd: dup.mat_cd,
            unit: dup.unit_nm,
            //this.commData.find(obj => obj.comm_dtl_nm ==  dup.unit_nm).comm_dtl_cd ,
            usage: parseFloat(dup.usage) || 0,
            // usage : dup.usage.setValue,
            mat_nm: dup.mat_nm,
            price: dup.price || 0,
            unit_cd: dup.unit_cd,
          };

          if (
            this.bomData.some((obj) => obj.mat_cd == dup.mat_cd) || //그리드와 실제정보비교
            this.saveData.some((obj) => obj.mat_cd == dup.mat_cd)
          ) {
            this.$swal({
              icon: "error",
              title: "존재하는 자재가 있습니다.",
              text: "다시 선택해주세요",
              confirmButtonText: "확인"
            });
            break;
          }
          //실제넘기는값
          const saveRealData = {
            prd_cd: saveBom.prd_cd,
            mat_cd: saveBom.mat_cd,
            unit: saveBom.unit_cd,
            usage: saveBom.usage,
          };

          this.saveData.push(saveRealData); //savaData 배열에 저장

          this.bomGridApi.applyTransaction({
            add: [saveBom],
          }); //ui만 반영
        }

        this.materialData.forEach((mat) => {
          mat.usage = ""; // usage 필드를 빈 문자열로 초기화
        });

      } catch (error) {
        console.error("error:", error);
        alert(`오류 발생`);
      }
    },
    //선택한 bom 정보 삭제
    async deleteBom() {
      const selectedNodes = this.bomGridApi.getSelectedNodes(); //현재행 가져오기
      const selectedBomData = selectedNodes.map((node) => node.data); //가져온 데이터 배열에 저장
      
      for (const bom of selectedBomData) {
        //반복문으로 배열 0 배열1 배열2... 뽑아내기
        this.deleteData.push(bom); //deletedata 배열에 저장

        this.saveData = this.saveData.filter(
          (obj) => obj.mat_cd !== bom.mat_cd
        ); //세이브데이터에서 자재코드가 삭제하려는 자재코드랑 같지 않은거만 남겨두기

        this.bomGridApi.applyTransaction({
          // applyTransaction : 실시간으로
          remove: [bom], //bom객체를 remove대상 지정
        });
      }
    },
    async save() {
      const updatedBoms = this.bomData.map((bom) => ({
        usage: bom.usage,
        mat_cd: bom.mat_cd,
        prd_cd: bom.prd_cd
      }));
    const result = await this.$swal({
      title: "저장하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      if(this.deleteData.length>0){
      for (const bom of this.deleteData) {
        await axios.delete(`/api/standard/bom/${bom.prd_cd}/${bom.mat_cd}`);
      }
    }
    if(this.saveData.length>0){
      for (const bom of this.saveData) {
        await axios.post(`/api/standard/bom`, bom);
      }
    }
      if (updatedBoms.length > 0) {
        await axios.put('/api/standard/updateBomUsage', updatedBoms);
      }
      this.saveData = [];
      this.deleteData = [];
      this.bringBomData(this.selectBomData);

      this.$swal("저장되었습니다!", "", "success"); 
      this.bomData = [];
    }

},
    reset(){
      this.bomData = [];
      this.keyword = "";
      this.matkeyword = "";
      this.saveData = [];
      this.deleteData = [];
      this.selectBomData = null;
      this.materialData.forEach(item => {
        item.usage = '';  
      });

      this.$swal({
        icon: "success",
        title: "초기화 완료",
        text: "모든 데이터가 초기화되었습니다.",
      });
    },
  },
};
</script>
<style>

  .saveBtn {
    width: 130px;
    height: 50px;
    display: block;
  }
</style>
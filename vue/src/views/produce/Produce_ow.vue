<!-- 생산 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <div class="card-body">
        <div class="row">
          <!--기본정보-->
          <div class="col-md-6">
            <p class="text-uppercase text-lg font-weight-bolder">기본정보</p>            
              <label for="example-text-input" class="form-control-label">생산계획코드</label>
              <div class="row">
              <div class="col-6 col-xxl-2">
                <input class="form-control" type="text" value="" readonly/>
              </div>
              <div class="col-4 text-end text-md-start">
                <button class="btn btn-primary me-3">검색</button>
              </div>
            </div>
            <label for="example-text-input" class="form-control-label">작업일자</label>
            <input class="form-control w-40" type="date" value="" />

            <hr class="horizontal dark" />

            <p class="text-uppercase text-lg font-weight-bolder">생산제품 목록</p>
            <ag-grid-vue
              class="ag-theme-alpine"
              style="width: 100%; height: 400px;"
              :columnDefs="planDtlDefs"
              :rowData="planDtlData"
              :pagination="true"
              @rowClicked="rowClicked"
              @grid-ready="gridFit"
              overlayNoRowsTemplate="생산계획코드를 검색해주세요">
            </ag-grid-vue>
          </div>
          
          <!--공정설정-->
          <div class="col-md-6 bg-gr">
            <p class="text-uppercase text-lg font-weight-bolder">공정설정</p>
            <ag-grid-vue
              class="ag-theme-alpine"
              style="width: 100%; height: 400px;"
              :columnDefs="instFlowDefs"
              :rowData="instFlowData"
              :gridOptions="gridOptions"
              @grid-ready="gridFit"
              overlayNoRowsTemplate="생산제품 목록을 선택해주세요">
            </ag-grid-vue>
            
            <hr class="horizontal dark" />

            <p class="text-uppercase text-lg font-weight-bolder">공정 및 자재설정</p>
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-center text-uppercase text-ser opacity-7"
                      width="10%"> 사용유무 </th>
                    <th class="text-center text-uppercase text-ser opacity-7"
                      width="10%"> 자재코드 </th>
                    <th class="text-center text-uppercase text-ser opacity-7"> 자재명
                    </th>
                    <th class="text-center text-uppercase text-ser opacity-7">필요수량(개당)
                    </th>
                    <th class="text-center text-uppercase text-ser opacity-7">현재고</th>
                    <th class="text-center text-uppercase text-ser opacity-7"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="align-middle text-center" @click="matShow('mat1')">
                    <td><span class="text-s">1</span></td>
                    <td><span class="text-s">반죽공정</span></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>▼</td>
                  </tr>
                  <tr class="align-middle text-center" @click="matShow('mat2')">
                    <td><span class="text-s">2</span></td>
                    <td><span class="text-s">반죽분리공정</span></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>▼</td>
                  </tr>
                  <tr class="align-middle text-center" @click="matShow('mat3')">
                    <td><span class="text-s">3</span></td>
                    <td><span class="text-s">발효공정</span></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>▲</td>
                  </tr>

                  <tr class="align-middle text-center mat3">
                    <td>
                      <input type="checkbox" id="mat_step" checked>
                    </td>
                    <td><span class="text-s">PRC2206123</span></td>
                    <td><span class="text-s">밀가루</span></td>
                    <td><span class="text-s">30g</span></td>
                    <td><span class="text-s">180g</span></td>
                    <td></td>
                  </tr>
                  <tr class="align-middle text-center mat3" id="mat2">
                    <td>
                      <input type="checkbox" id="mat_step" checked>
                    </td>
                    <td><span class="text-s">PRC2206123</span></td>
                    <td><span class="text-s">이스트</span></td>
                    <td><span class="text-s">30g</span></td>
                    <td><span class="text-s">180g</span></td>
                    <td></td>
                  </tr>
                  <tr class="align-middle text-center mat3" id="mat3">
                    <td>
                      <input type="checkbox" id="mat_step" checked>
                    </td>
                    <td><span class="text-s">PRC2206123</span></td>
                    <td><span class="text-s">물</span></td>
                    <td><span class="text-s">30g</span></td>
                    <td><span class="text-s">180g</span></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';

export default {
  name: 'Produce_ow',
  components: { AgGridVue },
  created() {
    this.$store.dispatch('breadCrumb', { title: '생산지시서 등록' });
    this.getPlanList();
    this.getPlanDtlList();
  },
  data() {
    return {
      selectBomData: null,
      planList: [],
      planDtlList: [],
      pr_step: [],
      instInfo: {
        inst_cd : '',
        prod_plan_cd : '',
        status : '',
        work_dt : '',
        update_dt : '',
        create_dt : ''
      },      
      planDtlDefs: [
        { headerName: '제품코드', field: 'prd_cd', sortable: true},
        { headerName: '제품명', field: 'prd_nm', sortable: true},
        { headerName: '생산수량', field: 'prod_plan_qty'},
      ],
      planDtlData: [],
      
      instFlowDefs: [
        { headerName: '순번', field: 'PROC_SEQ', sortable: true},
        { headerName: '공정코드', field: 'PROC_CD'},
        { headerName: '공정명', field: 'NOTE',},
      ],
      instFlowData: [],
      gridOptions: {
        rowSelection: { 
            mode: 'multiRow', // 하나만 선택하게 할 때는 singleRow
            // enableClickSelection: true (행을 클릭하는 것만으로 한 개 선택 가능.)
        }
      }
    };
  },
  methods : {

    matShow(id){
      const elements = document.querySelectorAll('.'+id);
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.toggle('dnone');
      }
    },
    async getPlanList() {            
        let result = await axios.get('/api/plan')
                                .catch(err => console.log(err));
        this.planList = result.data; // 서버가 실제로 보낸 데이터
    },
    async getPlanDtlList() {            
        let result = await axios.get(`/api/plan/PR1/dtl`)
                                .catch(err => console.log(err));
        this.planDtlData = result.data; // 서버가 실제로 보낸 데이터
    },
    rowClicked(params){
      this.getInstFlowList(params.data.prd_cd);
    },
    async getInstFlowList(prdCd) {   
      let result = await axios.get(`/api/inst/${prdCd}/flow`)
                              .catch(err => console.log(err));
      this.instFlowData = result.data; // 서버가 실제로 보낸 데이터
    },
    async boardInsert(){
      let obj = {
        prod_plan_cd : this.instInfo.prod_plan_cd,
        status : this.instInfo.status,
        work_dt : this.instInfo.work_dt,
        update_dt : this.getToday(),
        create_dt : this.getToday()
      }

      let result = await axios.post("/api/produce/inst", obj)
                              .catch(err => console.log(err));
      let addRes = result.data;
      if(addRes.board_no > 0){
          alert('등록되었습니다.');
          this.instInfo.no = addRes.board_no;
      }
    },
    gridFit(params){ // 매개변수 속성으로 자동 접근하여 sizeColumnsToFit() 실행함. (가로스크롤 삭제)
      params.api.sizeColumnsToFit();
    }
  }
};

</script>
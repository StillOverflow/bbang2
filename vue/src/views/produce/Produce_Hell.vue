<!-- 생산계획서 조회 -->
 <style>
.table {
  margin-bottom: 0rem !important;  
}
</style>
<template>
  
  <div class="py-4 container-fluid" @keydown.esc="modalCloseFunc1">
    <div class="card">      
      <div class="card-header ps-5 ps-md-4">
        <h5 class="modal-title mb-3">1. 생산지시서 선택</h5>
        <!--지시서 검색-->
        <div class="row">
          <div class="input-group w-50 mbp10">
            <input class="form-control" type="text" v-model="inst_cd" placeholder="생산지시서 코드를 검색해주세요"
              style="height: 41px;">
            <button class="btn btn-warning" type="button" @click="modalOpen">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

         <!--생산지시서 검색모달[S]-->
          <Layout :modalCheck="isModal">
            <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
              <h5 class="modal-title">생산지시서 검색</h5>
              <button type="button" aria-label="Close" class="close" @click="modalOpen">×</button>
            </template>
            <template v-slot:default>
              <ag-grid-vue class="ag-theme-alpine" 
              style="width:100%; height:250px;" 
              :columnDefs="instDefs"
              :rowData="instData" 
              @grid-ready="gridFit"
              @rowClicked="modalClicked" 
              :grid-options="modalOptions"
              @rowIndexChanged="RowIndexChangedEvent"
              overlayNoRowsTemplate="등록된 지시서가 없습니다.">
              </ag-grid-vue>
            </template>
            <template v-slot:footer>
              <button type="button" class="btn btn-secondary" @click="modalOpen">닫기</button>
            </template>
          </Layout>
        <!--생산지시서 검색모달[E]-->

        <!--지시서 목록-->       
        <div class="table-responsive">
          <table class="table">
            <thead class="table-secondary">
              <tr>
                <th class="text-center text-uppercase text-ser opacity-7" width="10%"> 제품코드 </th>
                <th class="text-center text-uppercase text-ser opacity-7">제품명</th>
                <th class="text-center text-uppercase text-ser opacity-7">지시량</th>
                <th class="text-center text-uppercase text-ser opacity-7">기지시량</th>
                <th class="text-center text-uppercase text-ser opacity-7">미지시량</th>
                <th class="text-center text-uppercase text-ser opacity-7">상태</th>
                <th class="text-center text-uppercase text-ser opacity-7"></th>
              </tr>
            </thead>   
            <tbody>
              <template v-if="instDtlCount >0">
                <tr class="text-center align-middle"
                v-for="val in instDtlData"
                :key="val.INST_DTL_CD">
                  <td>{{ val.PRD_CD }}</td>
                  <td>{{ val.PRD_NM }}</td>
                  <td>{{ this.$comm.getCurrency(val.TOTAL_QTY) }}</td>
                  <td>{{ this.$comm.getCurrency(val.PRD_OUT_QTY) }}</td>
                  <td>{{ val.TOTAL_QTY-val.PRD_OUT_QTY > 1 ? this.$comm.getCurrency(val.TOTAL_QTY-val.PRD_OUT_QTY) : 0}}</td>
                  <td :class="val.ACT_TYPE == '완료' ? 'text-primary' : 'text-secondary'">{{ val.ACT_TYPE == '완료' ? '완료' : '미완료' }}</td>
                  <td><button class="btn btn-dark btn-sm" @click="getResultList(val);">선택하기</button></td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="6">
                  <div class="list-nodata">생산지시서를 선택해주세요.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr class="horizontal dark">
        
        <div class="row">
          <!--공정목록-->
          <div class="col-7">
            <h5 class="modal-title mb-3">2. <span>{{ this.prdInfo.PRD_NM ? '['+this.prdInfo.PRD_NM+']': '제품' }}</span> 공정목록</h5>
            <div class="table-responsive produce">
              <table class="table">
                <thead class="table-secondary">
                  <tr>
                    <th class="text-center text-uppercase text-ser opacity-7" width="10%"> 순번 </th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="20%">공정코드</th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="30%">공정명</th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="20%">생산상태</th>
                    <th class="text-center text-uppercase text-ser opacity-7" width="20%">검수상태</th>
                  </tr>
                </thead>   
                <tbody>
                  <template v-if="flowCount >0">
                    <template v-for="flow in flowData" :key="flow.PROC_CD">
                      <tr class="text-center align-middle flowList" :class="'flow_'+flow.PROC_FLOW_CD" @click="getResultInfo(flow.PROD_RESULT_CD);this.PROC_NM = flow.PROC_NM">
                        <td width="10%">{{ flow.STEP }}</td>
                        <td width="20%">{{ flow.PROC_CD }}</td>
                        <td width="30%">{{ flow.PROC_NM }}</td>
                        <td width="20%" :class="flow.ACT_TYPE != '완료' ? 'text-secondary' : 'text-primary'">{{ flow.ACT_TYPE }}</td>    
                        <td width="20%" :class="flow.QUE_ACT_TYPE == 'N' ? 'text-secondary' : 'text-primary'">{{ flow.QUE_ACT_TYPE == 'N' ? '미완료' : '완료' }}</td>    
                      </tr>
                      <template v-for="equ in equData" :key="equ.EQP_CD">
                        <template v-if="equ.EQP_TYPE == flow.EQP_TYPE">
                          <tr class="text-center align-middle sub-tr" :class="equ.use_cnt > 0 ? 'none-select' : ''">
                            <td width="10%"></td>
                            <td width="10%">
                              <div class="form-check col-10 d-flex">
                                <input class="form-check-input ms-1" type="radio" v-model="equ_radio" :value="equ.EQP_CD" :id="'radio' + equ.EQP_CD">
                              </div>
                            </td>
                            <td width="10%">{{ equ.EQP_CD }}</td>
                            <td width="20%">{{ equ.EQP_NM }}</td>
                            <td width="25%">{{ equ.use_cnt > 0 ? '사용중' : '사용가능' }}</td>  
                            <td width="15%"></td>
                          </tr>
                        </template>
                      </template>
                    </template>
                  </template>
                  <tr v-else>
                    <td colspan="6">
                      <div class="list-nodata">생산지시서를 선택해주세요.</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          
          <div class="col-5">
            <h5 class="modal-title mb-3">3. <span>{{ this.resultInfo.PROC_NM ? '['+this.resultInfo.PROC_NM+']': '' }}</span> 공정 설정</h5>
            <div class="progress-bx">
              <template v-if="this.resultInfo.PROD_RESULT_CD">
                <!--공정설정-->      
                <div class="row mtp10">
                  <div class="col-3 text-center font-weight-bolder mtp10">담당자명</div>
                  <input type="hidden" v-model="resultInfo.ID">
                  <div class="input-group w-50">                  
                    <input class="form-control form-control-sm" type="text" v-model="resultInfo.NAME" :v-bind="this.$session.get('user_nm')" placeholder="담당자를 검색해주세요" style="height: 41px;" readonly>
                    <button class="btn btn-warning" type="button" @click="modalOpen2" v-if="resultAble == true"><i class="fa-solid fa-magnifying-glass"></i></button>
                  </div>
                </div>

                <Layout :modalCheck="isModal2">
                  <template v-slot:header> <!-- <template v-slot:~> 이용해 slot의 각 이름별로 불러올 수 있음. -->
                      <h5 class="modal-title">담당자 조회</h5>
                      <button type="button" aria-label="Close" class="close" @click="modalOpen2">×</button>
                  </template>
                  <template v-slot:default>
                      <ag-grid-vue class="ag-theme-alpine" 
                      style="width: 100%; height: 400px;" 
                      :columnDefs="memDefs"
                      :rowData="memData" 
                      :pagination="true" 
                      @rowClicked="modalClicked2"
                      @grid-ready="gridFit"
                      overlayNoRowsTemplate="등록된 담당자가 없습니다.">
                      </ag-grid-vue>
                  </template>
                  <template v-slot:footer>
                      <button v-show="hidden" type="button" class="btn btn-secondary" @click="modalOpen2">Cancel</button>
                      <button v-show="hidden" type="button" class="btn btn-primary" @click="modalOpen2">OK</button>
                  </template>
              </Layout>

              <div class="row mtp10">
                <div class="col-3 text-center font-weight-bolder mtp10">생산량</div>                
                  <input class="form-control form-control-sm w-30 mlp10" type="text" v-model="resultInfo.PROD_QTY" :placeholder="resultInfo.TOTAL_QTY" style="height: 41px;" @keyup="prod_qty">
                  <span class="point-red dnone" :id="'qty_' + resultInfo.PROD_RESULT_CD">계획량보다 높게 설정할 수 없습니다.</span>
              </div>

              <div class="row mtp10">
                <div class="col-3 text-center font-weight-bolder mtp10">자재</div>
                <div class="input-group w-50">
                  <button class="btn btn-secondary" type="button" @click="modalOpen3">실사용량 등록</button>
                </div>
              </div>
              
                <div class="row mtp10">
                  <div class="col-3 text-center">
                    <button class="btn btn-success" @click="process('start')">작업시작</button>
                  </div>
                  <input class="form-control form-control-sm w-50" type="text" v-model="resultInfo.START_TIME" placeholder="0000-00-00 00:00:00" style="height: 41px;" readonly>
                </div>
                <div class="row mtp10">
                  <div class="col-3 text-center">
                    <button class="btn btn-danger" @click="process('end')">작업종료</button>
                  </div>
                  <input class="form-control form-control-sm w-50" type="text" v-model="resultInfo.END_TIME" placeholder="0000-00-00 00:00:00" style="height: 41px;" readonly>
                </div>
                <div class="row mtp10 mbp10">
                  <div class="text-center mtp10">
                    <button v-if="this.resultInfo.STATUS == 'Z03' && this.resultInfo.QUE_STATUS == 'A01'" class="btn btn-outline-secondary btn-lg" disabled>공정완료</button>
                    <button v-else-if="this.resultInfo.STATUS == 'Z03' && this.resultInfo.QUE_STATUS == 'A02'" class="btn btn-outline-primary btn-lg" disabled>품질검사 진행중</button>
                    <button v-else-if="this.resultInfo.STATUS == 'Z02' && this.resultInfo.QUE_STATUS == 'A02'" class="btn btn-outline-success btn-lg" disabled>공정 진행중</button>
                    <button v-else-if="this.resultInfo.STATUS == 'Z01' && this.resultInfo.QUE_STATUS == 'A02'" class="btn btn-outline-secondary btn-lg" disabled>공정 대기중</button>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <Layout :modalCheck="isModal3">
            <template v-slot:header>
              <h5 class="modal-title">실사용량 등록</h5>
              <button type="button" aria-label="Close" class="close" @click="modalOpen3">×</button>
            </template>
            <template v-slot:default>
              <div class="table-responsive">
                <table class="table">
                  <thead class="table-secondary">
                    <tr>
                      <th class="text-center text-uppercase text-ser opacity-7" width="15%"> 제품코드 </th>
                      <th class="text-center text-uppercase text-ser opacity-7" width="15%"> 자재명 </th>
                      <th class="text-center text-uppercase text-ser opacity-7" width="15%"> 지시량 </th>
                      <th class="text-center text-uppercase text-ser opacity-7" width="30%"> 현재고 </th>
                      <th class="text-center text-uppercase text-ser opacity-7" width="30%"> 실투여량 </th>
                      <th class="text-center text-uppercase text-ser opacity-7" width="20%"> 잔여 </th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="matCount >0">
                      <tr v-for="mat in matData" :key="mat.PROC_CD" class="text-center align-middle">
                        <td>{{ mat.MAT_CD }}</td>
                        <td>{{ mat.MAT_NM }}</td>
                        <td>{{ mat.MAT_QTY }}</td>
                        <td>{{ mat.MAT_STOCK > 1 ? this.$comm.getCurrency(mat.MAT_STOCK) : 0 }}</td>
                        <td class="row">
                          <input type="number" class="form-control col-8 w-80" v-model.number="mat.MAT_USE_QTY" @keyup="matHandle(mat)">
                          <span class="col-1">{{ mat.UNIT }}</span>
                          <span class="point-red dnone" :id="'point_' + mat.MAT_CD">지시량보다 높게 설정할 수 없습니다.</span>
                        </td>    
                        <td class="align-middle text-center">
                          <div class="d-flex align-items-center justify-content-center">
                            <span class="me-2 text-xs font-weight-bold">{{ mat.result_qty }}%</span>
                              <div>
                                <div class="progress">
                                  <div class="progress-bar bg-gradient-info" role="progressbar" aria-valuenow="60"
                                      aria-valuemin="0" aria-valuemax="100" :style="'width:'+mat.result_qty+'%' "></div>
                                </div>
                              </div>
                          </div>
                        </td>
                      </tr>
                    </template>
                    <tr v-else>
                      <td colspan="6">
                        <div class="list-nodata">등록된 자재목록이 없습니다.</div>
                      </td>
                    </tr>
                  </tbody>
              </table>
            </div>
            </template>
            <template v-slot:footer>
              <button type="button" class="btn btn-secondary" @click="modalOpen3">닫기</button>
              <button type="button" class="btn btn-primary" @click="matInsert">저장</button>
            </template>
          </Layout>

        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios';
import { AgGridVue } from 'ag-grid-vue3';
import Layout from '../components/modalLayout.vue';

export default {
  components: { AgGridVue, Layout },
  created() {
    this.$store.dispatch('breadCrumb', { title: '생산공정관리' });
  },
  computed : {
    instDtlCount(){ //지시서 제품 갯수
      return this.instDtlData.length;
    },
    flowCount(){ //공정 갯수
      return this.flowData.length;
    }
  },
  data() {
    return {
      isModal: false, //지시서 모달
      isModal2: false, //담당자 모달
      isModal3: false, //자재수량 모달
      inst_cd:'',
      proc_flow_cd:'', 
      prdInfo: [],
      flowInfo: [],
      resultInfo: [],
      resultAble: false,
      
      instDefs: [
        { headerName: '지시서코드', field: 'INST_CD', sortable: true, width: 120, cellStyle: {textAlign: "center"}},
        { headerName: '생산제품수', field: 'PRD_CNT', sortable: true, width: 120, cellStyle: {textAlign: "center"} },
        { headerName: '작업일자', field: 'WORK_DT', sortable: true, valueFormatter: this.$comm.dateFormatter, cellStyle: {textAlign: "center"}},
        { headerName: '등록일', field: 'CREATE_DT', valueFormatter: this.$comm.dateFormatter, cellStyle: {textAlign: "center"}},
      ],
      instData: [],

      instDtlData: [],
      flowData: [],

      memDefs: [
        {headerName: '담당자 ID', field: 'ID', filter: 'agTextColumnFilter'},
        {headerName: '담당자 명', field: 'name', filter: 'agTextColumnFilter'},
        {headerName: '부서', field: 'dpt_nm', filter: 'agTextColumnFilter'},
      ],
      memData: [],

      matData: [],
      equData: [],
      equ_radio:'',
      ID:'',
    };
  },
  methods: {    

    /*모달 [S]*/
    modalOpen() { //지시서 모달
      this.isModal = !this.isModal;
      this.getInstList();
    },
    modalOpen2() { //담당자 모달
      this.isModal2 = !this.isModal2;
      this.getMemList();
    },
    modalOpen3() { //자재 사용량 모달
      this.isModal3= !this.isModal3;
      this.getMatList();
    },
    modalClicked(params) {
      this.isModal = !this.isModal;
      if(params.data.ACT_TYPE == "완료"){
        this.$swal({
          title: "선택불가",
          text: "진행이 완료된 지시서는 생산실적 페이지에서 조회할 수 있습니다",
          icon: "error"
        }).then((result) => {
          if (result.isConfirmed) {
            this.isModal = !this.isModal;
          }
        })
      }else{
        this.getInstDtlList(params.data.INST_CD);
        this.inst_cd= params.data.INST_CD;    
      }
    },
    modalClicked2(params) {
      this.resultInfo.ID = params.data.ID;
      this.resultInfo.NAME = params.data.name;

      this.isModal2 = !this.isModal2;
    },
    modalCloseFunc1() {
      if(this.isModal){
        this.isModal = !this.isModal;
      }
    },
    /*모달 [E]*/

    //지시서 리스트
    async getInstList() {
      let result = await axios.get('/api/inst')
                              .catch(err => console.log(err));
      this.instData = result.data;
    },

    // 담당자 리스트
    async getMemList() {
      let result = await axios.get('/api/momem')
                              .catch(err => console.log(err));
      this.memData = result.data; 
    },

    //자재 리스트
    async getMatList() {
      let obj = {
        INST_CD : this.resultInfo.INST_CD,
        PROC_FLOW_CD : this.resultInfo.PROC_FLOW_CD
      }
      let result = await axios.get(`/api/progress/mat`, {params:obj})
                              .catch(err => console.log(err));
      this.matData = result.data;
      this.matCount = this.matData.length;
    },    

    //지시서 제품 리스트
    async getInstDtlList(inst_cd) {
      let result = await axios.get(`/api/inst/dtl/${inst_cd}`)
                              .catch(err => console.log(err));
      this.instDtlData = result.data;
    },

    //자재 수량 조정
    matHandle(mat){
      let matEle = document.getElementById('point_'+mat.MAT_CD);
      if(parseFloat(mat.MAT_QTY) < parseFloat(mat.MAT_USE_QTY)){
        matEle.classList.remove("dnone");
        mat.MAT_USE_QTY = "";
      }else{
        matEle.classList.add("dnone");
        mat.result_qty = Math.round(((parseFloat(mat.MAT_QTY) - parseFloat(mat.MAT_USE_QTY)) /parseFloat(mat.MAT_QTY)) * 100,2);      
      }
    },

    //지시량 조정
    prod_qty(){
      let qtyEle = document.getElementById('qty_'+this.resultInfo.PROD_RESULT_CD);
      if(this.resultInfo.PROD_QTY > this.resultInfo.TOTAL_QTY){
        this.resultInfo.PROD_QTY = '';
        qtyEle.classList.remove("dnone");
      }else{
        qtyEle.classList.add("dnone");
      }
    },

    //생산 공정리스트
    async getResultList(val){
      this.prdInfo = val;
      let obj = {
        INST_CD : this.inst_cd,
        PRD_CD : this.prdInfo.PRD_CD
      }
      let result = await axios.get('/api/progress/result', {params:obj})
                              .catch(err => console.log(err));
                              this.equData = '';
      this.flowData = result.data;
      this.equ_radio = result.data.EQP_CD;
    },

    //공정정보 가져오기
    async getResultInfo(result_cd){
      
      let obj = {
        PROD_RESULT_CD : result_cd
      }
      let result = await axios.get('/api/progress/result', {params:obj})
                              .catch(err => console.log(err));

      this.resultInfo = result.data[0];
      this.equ_radio = this.resultInfo.EQP_CD;
      if(this.resultInfo.STATUS == 'Z01'){
        this.resultAble = true;
      }

      if(this.resultInfo.STEP > 1){
        this.resultInfo.PROD_QTY = this.resultInfo.LAST_PASS_QTY;
      }else{
        this.resultInfo.PROD_QTY = this.prdInfo.TOTAL_QTY;
      }
      
      this.resultInfo.START_TIME = this.$comm.getDatetimeMin(this.resultInfo.START_TIME);
      this.resultInfo.END_TIME = this.$comm.getDatetimeMin(this.resultInfo.END_TIME);

      this.showProcess(); //공정관리화면 노출
      this.getFlowEquList(); //설비 선택목록 조회
      this.getMatList(); //사용 자재목록 조회
    },

    //공정관리화면 노출
    showProcess(){

      if((this.resultInfo.LAST_STATUS != 'Z03' && this.resultInfo.LAST_STATUS != '0') || (this.resultInfo.LAST_QUE_STATUS != 'A01' && this.resultInfo.LAST_QUE_STATUS != '0')){
        this.$swal({
          icon: "error",
          title: "이전 공정이 완료되지 않았습니다.",
        });        
      }

      let flow_cd = this.resultInfo.PROC_FLOW_CD;
      const elements = document.querySelectorAll('.flowList');
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove('table-primary');
      }
      const flowEle = document.querySelector('.flow_'+flow_cd);
      flowEle.classList.add("table-primary");    
   },

    //설비 선택목록 조회
    async getFlowEquList() {
      let result = await axios.get(`/api/progress/equ/${this.resultInfo.EQP_TYPE}`)
                              .catch(err => console.log(err));
      this.equData = result.data
    },

    //자재 사용량 등록
    async matInsert(){
      let matArr = [];

      this.matData.forEach((obj) => {
          matArr.push({
            INST_MAT_CD: obj.INST_MAT_CD,
            MAT_USE_QTY: obj.MAT_USE_QTY
          });
      });

      let result = await axios.put(`/api/progress/mat`, matArr)
                              .catch(err => console.log(err));

      if(result.data == 'success'){
        this.isModal3 = !this.isModal3;
      }
    },

    //공정 시작/종료
    async process(mode){
      this.matEmpty = this.matData.findIndex((item) => item.MAT_STOCK < 1);


      if(mode == "start"){
          
        if (!this.equ_radio) {
          this.$swal({
            icon: "error",
            title: "사용할 설비를 선택해주세요",
          });
          return;
        }else if (!this.resultInfo.ID) {
          this.$swal({
            icon: "error",
            title: "공정 담당자를 선택해주세요",
          });
          return;
        }else if (this.matEmpty > 0) {
          this.$swal({
            icon: "error",
            title: "재고가 부족한 자재가 있습니다.",
            text : "자재 실사용량의 현재고를 확인해주세요"
          });
          return;
        }else{
          
          if(this.resultAble == false){
            this.$swal({
              title: "이미 진행중인 공정입니다.",
              text: "진행중인 공정은 수정할 수 없습니다.",
              icon: "error",
            })
          }else{
            this.$swal({
              title: "해당 공정을 수행하시겠습니까?",
              text: "공정을 시작하면 상세 정보를 수정할 수 없습니다.",
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "예",
              cancelButtonText: "아니요"
            }).then(async(result) => {
              if (result.isConfirmed) {
                let matArr = [];
                let startArr = [];

                let obj = {
                  EQP_CD : this.equ_radio,
                  ID : this.resultInfo.ID,
                  NAME : this.resultInfo.NAME,
                  STATUS : 'Z02',
                  PROD_QTY :  this.resultInfo.PROD_QTY,
                  START_TIME: this.$comm.getDateTime()
                };

                this.matData.forEach((val) => {
                  if(val.MAT_STOCK > 0){
                    matArr.push({
                      INST_MAT_CD: val.INST_MAT_CD,
                      MAT_CD: val.MAT_CD,
                      MAT_QTY: val.MAT_QTY,
                      MAT_USE_QTY: val.MAT_USE_QTY,
                      PROD_RESULT_CD: this.resultInfo.PROD_RESULT_CD
                    });
                  }
                });
                startArr = [obj, matArr];

                let result = await axios.put(`/api/progress/start/${this.resultInfo.PROD_RESULT_CD}`, startArr)
                                  .catch(err => console.log(err));

                if(result.data == 'success'){
                  this.resultAble = false;
                  this.resultInfo.START_TIME = this.$comm.getDatetimeMin(obj.START_TIME);
                  this.getResultList(this.resultInfo);
                  this.equ_radio = this.resultInfo.EQP_CD;
                  this.getResultInfo(this.resultInfo.PROD_RESULT_CD);
                  await axios.put(`/api/progress/status/${this.resultInfo.INST_CD}`, {STATUS:'Z02'})
                             .catch(err => console.log(err));
                }           
              }
            })
          }
        }
      }else{
        if(this.resultInfo.STATUS == 'Z03'){
          this.$swal({
            title: "진행 완료된 공정입니다.",
            icon: "error",
          })
        }else{
          this.$swal({
            title: "해당 공정을 종료하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "예",
            cancelButtonText: "아니요"
          }).then(async(result) => {
            if (result.isConfirmed) {

              let obj = {
                STATUS : 'Z03',
                END_TIME: this.$comm.getDateTime()
              };

              let result =await axios.put(`/api/progress/end/${this.resultInfo.PROD_RESULT_CD}`, obj)
                                    .catch(err => console.log(err));

              if(result.data == 'success'){
                this.getResultList(this.resultInfo);
                this.resultInfo.END_TIME = this.$comm.getDatetimeMin(obj.END_TIME);
                this.resultInfo.STATUS = 'Z03';
                this.equ_radio = this.resultInfo.EQP_CD;
                this.getResultInfo(this.resultInfo.PROD_RESULT_CD);
              }
            }
          })
        }
      }
    }   
  } 
};

</script>
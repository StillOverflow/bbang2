<!-- 생산 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <div class="card-body">
        <div class="row">
          <!--기본정보-->
          <div class="col-md-6">
            <p class="text-uppercase text-lg">기본정보</p>            
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

            <p class="text-uppercase text-lg">생산제품 목록</p>
            <ag-grid-vue class="ag-theme-alpine w-100 h-50" :columnDefs="myDefs" :rowData="myData" @grid-ready="gridFit"/>
          </div>
          
          <!--공정설정-->
          <div class="col-md-6 bg-gr">
            <p class="text-uppercase text-lg">공정설정</p>
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7"
                      width="10%"> 사용유무 </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7"
                      width="10%"> 순번 </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7"> 공정코드
                    </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7">공정명</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="align-middle text-center">
                    <!--<li class="prod" v-for="(item, index) in prods" :key="index">
                      <input type="checkbox" v-model="prodArr" :value="item.name" />
                    </li>-->

                    <td>
                      <label><input type="checkbox" v-model="pr_step" value="1"></label>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">1</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC22012</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">반죽공정</span></td>
                  </tr>
                  <tr class="align-middle text-center">
                    <td>
                      <label><input type="checkbox" v-model="pr_step" value="2"></label>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">2</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC22012</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">반죽분할공정</span></td>
                  </tr>
                  <tr class="align-middle text-center">
                    <td>
                      <label><input type="checkbox" v-model="pr_step" value="3"></label>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">3</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC22012</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">발효공정</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <hr class="horizontal dark" />

            <p class="text-uppercase text-lg">공정 및 자재설정</p>
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7"
                      width="10%"> 사용유무 </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7"
                      width="10%"> 자재코드 </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7"> 자재명
                    </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7">필요수량(개당)
                    </th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7">현재고</th>
                    <th class="text-center text-uppercase text-secondary text-s font-weight-bolder opacity-7"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="align-middle text-center" @click="matShow('mat1')">
                    <td><span class="text-secondary text-s font-weight-bold">1</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">반죽공정</span></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>▼</td>
                  </tr>
                  <tr class="align-middle text-center" @click="matShow('mat2')">
                    <td><span class="text-secondary text-s font-weight-bold">2</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">반죽분리공정</span></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>▼</td>
                  </tr>
                  <tr class="align-middle text-center" @click="matShow('mat3')">
                    <td><span class="text-secondary text-s font-weight-bold">3</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">발효공정</span></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>▲</td>
                  </tr>

                  <tr class="align-middle text-center mat3">
                    <td>
                      <input type="checkbox" id="mat_step" checked>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC2206123</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">밀가루</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">30g</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">180g</span></td>
                    <td></td>
                  </tr>
                  <tr class="align-middle text-center mat3" id="mat2">
                    <td>
                      <input type="checkbox" id="mat_step" checked>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC2206123</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">이스트</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">30g</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">180g</span></td>
                    <td></td>
                  </tr>
                  <tr class="align-middle text-center mat3" id="mat3">
                    <td>
                      <input type="checkbox" id="mat_step" checked>
                    </td>
                    <td><span class="text-secondary text-s font-weight-bold">PRC2206123</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">물</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">30g</span></td>
                    <td><span class="text-secondary text-s font-weight-bold">180g</span></td>
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
import axios from 'axios';
import { AgGridVue } from "ag-grid-vue3";

export default {
  name: 'Produce_ow',
  // 컴포넌트 로직
  data() {
    return {
      pr_step: [],
      instInfo: {
        inst_cd : '',
        prod_plan_cd : '',
        status : '',
        work_dt : '',
        update_dt : '',
        create_dt : ''
      },
      // grid API 테이블 데이터 (Defs: thead 구성, Data: tbody 구성)
      myDefs: null,
      myData: null
    };
  },
  components: { // grid API
        AgGridVue
    },
  created() {
    this.$store.dispatch('breadCrumb', { title: '생산지시서 등록' });
  },
  beforeMount(){ // grid API 테이블에 값 불러오기
    this.myDefs = [
      { headerName: '순번', field: 'no' },
      { headerName: '제품코드', field: 'model' },
      { headerName: '제품명', field: 'name' },
      { headerName: '생산수량', field: 'qty' }
    ];
    this.myData = [
      { no: '1', model: 'PRD2123', name: '소금빵', qty: 200 },
      { no: '2', model: 'PRD2123', name: '케로로빵', qty: 200 },
      { no: '3', model: 'PRD2123', name: '단팥빵', qty: 200 }
    ];
    this.prDefs = [
      { headerName: '사용유무', field: 'yn' },
      { headerName: '순번', field: 'no' },
      { headerName: '공정코드', field: 'code' },
      { headerName: '공정명', field: 'name' }
    ];
    this.prData = [
      { yn: '1', model: 'PRD2123', name: '소금빵', qty: 200 },
      { yn: '2', model: 'PRD2123', name: '케로로빵', qty: 200 },
      { yn: '3', model: 'PRD2123', name: '단팥빵', qty: 200 }
    ];
  },
  methods : {
    matShow(id){
      const elements = document.querySelectorAll('.'+id);
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.toggle('dnone');
      }
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
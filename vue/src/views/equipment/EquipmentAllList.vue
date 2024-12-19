<!-- 설비 전체 조회 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <!-- 검색조건 -->
      <div class="card-header bg-light ps-5 ps-md-4">
        <div class="row">
          <div
            class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder"
            :style="t_overflow"
          >
            설비 구분
          </div>
          <div class="col-6 col-lg-3 mb-2">
            <select
              class="form-select custon-width"
              v-model="equipmentData.eqp_type"
            >
              <option
                v-for="(opt, idx) in equipmentData.selectOptions"
                :key="idx"
                :value="opt.item"
              >
                {{ opt.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div
            class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder"
            :style="t_overflow"
          >
            사용 유무
          </div>
          <div class="col-6 col-lg-3 mb-2">
            <input class="form-control" type="text" v-model="search" />
          </div>

          <div
            class="col-6 col-lg-1 text-center mb-2 mt-2 fw-bolder"
            :style="t_overflow"
          >
            설비 상태
          </div>
          <div class="col-6 col-lg-3 mb-2">
            <input class="form-control" type="text" v-model="search" />
          </div>
        </div>
        <div class="row">
          <div class="col-6 col-lg-4 mb-2"></div>
          <div class="col-6 col-lg-1 mb-2">
            <button
              type="button"
              class="btn mb-0 btn-success btn-xsm null null ms-auto"
              @click="searchForm"
            >
              검색
            </button>
          </div>
        </div>
      </div>
      <!-- 주문목록 -->
      <div class="card-body" style="position: relative; height: 600px">
        <ag-grid-vue
          style="width: 100%; height: 100%"
          class="ag-theme-alpine"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :pagination="true"
          @grid-ready="gridFit"
        >
        </ag-grid-vue>
      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue3';
import axios from 'axios';
// import Layout from '../components/modalLayout.vue';

export default {
  name: 'EquipmentAllList',
  data() {
    return {
      equipInfo: {},

      equipmentData: {
        //이미지 경로
        img_path: '',
        // 입력 데이터 값
        eqp_type: '',
        eqp_nm: '',
        model: '',
        pur_dt: '',
        pur_act: '',
        mfg_act: '',
        repl_cycle: '',
        insp_cycle: '',
        id: '',
        opt_temp: '',
        opt_humid: '',
        opt_rpm: '',
        opt_speed: '',
        opt_power: '',
        uph: '',
        is_use: '',
        end_dt: '',
      },

      equipData: [],

      columnDefs: [
        { field: 'eqp_type', headerName: '설비구분', selectOptions: [] },
        { field: 'eqp_cd', headerName: '설비코드' },
        { field: 'eqp_nm', headerName: '설비명' },
        { field: 'model', headerName: '모델' },
        { field: 'status', headerName: '설비상태' },
        {
          field: 'create_dt',
          headerName: '등록일자',
          valueFormatter: this.$comm.dateFormatter, // 날짜 포맷터 추가
        },
        {
          field: 'end_dt',
          headerName: '최종점검일자',
          valueFormatter: this.$comm.dateFormatter,
        },
        { field: 'id', headerName: '담당자' },
      ],
      rowData: [],
      //거래처,날짜 검색어
      search: '',
      sdt: '',
      edt: '',
    };
  },
  components: {
    AgGridVue,
  },
  created() {
    this.getEquipList();

    // 페이지 제목 저장
    this.$store.dispatch('breadCrumb', { title: '설비 정보 조회' });

    // 설비구분 공통코드 로드
    this.getComm('EQ')
      .then((result) => {
        this.equipmentData.selectOptions = result.map((item) => ({
          item: item.comm_dtl_cd,
          name: item.comm_dtl_nm,
        }));
      })
      .catch((err) => console.log(err));
  },
  mounted() {
    axios
      .get('/api/equip')
      .then((response) => {
        this.rowData = response.data;
      })
      .catch((err) => console.log('설비 정보 조회 실패', err));
  },
  methods: {
    gridFit(params) {
      // 매개변수 속성으로 자동 접근하여 sizeColumnsToFit() 실행함. (가로스크롤 삭제)
      params.api.sizeColumnsToFit();
    },

    async getComm(cd) {
      // 공통코드가 EQ(설비구분)일 때
      this.getComm('EQ')
        .then((result) => {
          //selectOptions에 담아 select 박스에 활용
          this.leftFields.find(
            (field) => field.value === 'eqp_type'
          ).selectOptions = result.map((item) => ({
            item: item.comm_dtl_cd,
            name: item.comm_dtl_nm,
          }));
        })
        .catch((err) => console.log(err));

      // 공통코드가 EU(설비상태)일 때
      this.getComm('EU')
        .then((result) => {
          //selectOptions에 담아 select 박스에 활용
          this.rightFields.find(
            (field) => field.value === 'is_use'
          ).selectOptions = result.map((item) => ({
            item: item.comm_dtl_cd,
            name: item.comm_dtl_nm,
          }));
        })
        .catch((err) => console.log(err));

      // 공통코드 가져오기
      let result = await axios
        .get('/api/commList/' + cd)
        .catch((err) => console.log(err));
      return result.data;
    },

    // 설비 전체 조회
    async getEquipList() {
      let result = await axios
        .get(`/api/equip`)
        .catch((err) => console.log(err));
      this.equipData = result.data; // 서버가 실제로 보낸 데이터
    },

    //거래처명,날짜 검색기능
    searchForm() {
      //this.$router.push({ name : 'sales_orderlist', query : { query : this.search, st : this.std, et : this.etd}});
      let searchdt = {
        eqp_type: this.equipmentData.eqp_type,
        no: this.search,
        st: this.sdt,
        et: this.edt,
      };

      axios
        .get('/api/sales/search/', { params: searchdt })
        .then((response) => {
          this.rowData = response.data;
        })
        .catch((err) => console.log('AXIOS실패', err));
    },

    // 날짜 포맷터 함수(공통코드(commFunc.js)로 이동)
    // dateFormatter(params) { //여기서 ag grid에 date형식을 보냄
    //     return this.dateFormat(params.value, 'yyyy-MM-dd'); // 여기서 date 형식을 편하게 바꿀수 있다(dd-MM-yyyy)
    // },
    // dateFormat(value, format) { //date 방식을 지정 후 dateFormatter로 보냄
    //     let date = value == null ? new Date() : new Date(value);

    //     let year = date.getFullYear();
    //     let month = ('0' + (date.getMonth() + 1)).slice(-2);
    //     let day = ('0' + date.getDate()).slice(-2);

    //     let result = format.replace('yyyy', year)
    //                     .replace('MM', month)
    //                     .replace('dd', day);
    //     return result;
    // },
  },
};
</script>

<style lang="scss">
//그리드 사용시 아래 스타일 임포트
@import '../../../node_modules/ag-grid-community/styles/ag-grid.css';
@import '../../../node_modules/ag-grid-community/styles/ag-theme-alpine.css';
</style>

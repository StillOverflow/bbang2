<template>
    <div>
        <!-- 조회대상 자재/제품/공정 -->
        <div class="row mb-3">
          <h6 class="col-2 col-xxl-1 mb-2 d-flex justify-content-center" :style="t_overflow">조회대상</h6>
          <div class="form-check col-10 d-flex">
            <div v-for="(opt, idx) in radios" :key="idx">
              <input class="form-check-input ms-1" type="radio" v-model="selected_radio" :value="opt.item" :id="'radio' + opt.item"
               @change="changeDivs()">
              <label class="form-check-label ms-2 me-4 text-start" :for="'radio' + opt.item">
                {{opt.name}}
              </label>
            </div>
          </div>
        </div>
    
        <!-- 구분/카테고리/모달 조회조건 선택 -->
        <div class="row">
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">대상구분</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <select class="form-select" v-model="selected_div" :disabled="noCate">
              <option :value="null">전체</option>
              <option v-for="(opt, idx) in divs" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">카테고리</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <select class="form-select" v-model="selected_cate" :disabled="noCate">
              <option :value="null">전체</option>
              <option v-for="(opt, idx) in cates" :key="idx" :value="opt.item">{{opt.name}}</option>
            </select>
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">대상선택</h6>
          <div class="col-10 col-lg-4 col-xxl-2 d-flex">
            <div class="input-group">
              <input type="search" class="form-control" v-model="modal_val.nm" style="height: 41px;">
              <button class="btn btn-warning mb-2" type="button" @click="modalToggle">SEARCH</button>
            </div>
          </div>
          <h6 class="col-2 col-xxl-1 mb-2 d-flex align-items-center justify-content-center" :style="t_overflow">대상코드</h6>
          <div class="col-10 col-lg-4 col-xxl-2 mb-2">
            <input type="text" class="form-control" :value="modal_val.cd" readonly>
          </div>
        </div>

        <ModalLayout :modalCheck="isModal">
            <template v-slot:header>
            <h5>품질기준 대상선택</h5>
            <button type="button" aria-label="Close" class="close" @click="modalToggle">×</button>
            </template>
            <template v-slot:default>
            <ag-grid-vue class="ag-theme-alpine" :style="g_height" :columnDefs="modalDefs" :rowData="modalData" 
                :gridOptions="gridOptions" :rowSelection="false" @rowClicked="modalSelect"/>
            </template>
            <template v-slot:footer> <!-- 아무것도 안 넣으면 기본 버튼이 표시됨. -->
            <button type="button" class="btn btn-secondary" @click="modalToggle">CLOSE</button>
            </template>
        </ModalLayout>
    </div>
</template>

<script>
    import { AgGridVue } from "ag-grid-vue3";
    import axios from "axios";
    import ModalLayout from "../components/modalLayout.vue";

    export default {
        name: 'SelectTarget',
        props: {
            gridOptions: Object
        },
        components: { 
            AgGridVue, // grid API
            ModalLayout
        },
        data() {
            return {
                // 스타일 바인딩
                t_overflow: {whiteSpace: 'nowrap'},
                t_break: {wordBreak: 'keep-all'},
                g_height: {height: '520px'},
        
                // 검색조건 전용 값
                selected_radio: null,
                radios: [],
                selected_div: null,
                divs: [],
                noCate: false, // 공정은 카테고리가 없으므로 비활성화용
                selected_cate: null,
                cates: [],
                date_val: '',

                // 모달 내부 grid API 데이터 (Defs: thead 구성, Data: tbody 구성)
                isModal: false, // 토글기능
                modalDefs: [
                    { headerName: '유형', field: 'type', width: 70 },
                    { headerName: '구분', field: 'cate_type', width: 80 },
                    { headerName: '카테고리', field: 'category', width: 90 },
                    { headerName: '코드', field: 'cd', width: 80 },
                    { headerName: '이름', field: 'nm', width: 126 },
                    { headerName: '등록현황', 
                        field: 'has_std', 
                        cellClassRules: {
                        'textRed': params => params.value == '미등록',
                        'textGreen': params => params.value == '등록완료'
                        },
                        width: 100 },
                    { headerName: '마지막 등록일', field: 'std_date', width: 120, valueFormatter: this.$comm.dateFormatter_returnNull}
                ],
                modalData: [],
                modal_val: { // 선택된 값
                    nm: null,
                    cd: null
                },
            }
        },
        
        methods: {
            // ------------ 모달 메소드 ------------
            modalToggle(){
                this.isModal = !this.isModal;
                this.getModalList();
            },

            async getModalList(){
                // 조회대상(radio) 미선택 시 => 전체 조회
                // 조회대상(radio) 선택 시 => 선택한 대상 내에서 카테고리 조건 넣어 조회
                // ** 이름을 입력하면 유사한(LIKE) 이름으로 조회
                let params = { 
                type: this.selected_radio,
                cate_type: this.selected_div,
                cate: this.selected_cate,
                nm: this.modal_val.nm 
                };

                let result = await axios.get('/api/quality/targetAll', {params: params})
                                        .catch(err => console.log(err));
                let data = result.data;
                data.forEach((obj) => {
                obj.has_std = obj.std_date == null ? '미등록' : '등록완료'; // SELECT문 컬럼에 포함되지 않았으므로 추가
                });
                this.modalData = data;
            },
            
            modalSelect(params){ // @rowClicked
                let selected = params.data;
                if(!this.selected_radio){ // 이름으로 검색만 하고 radio 선택 안 되어있으면 선택해줌
                let type = null;
                switch(selected.type){
                    case '자재' : type = 'P01'; break;
                    case '공정' : type = 'P02'; break;
                    case '제품' : type = 'P03'; break;
                }
                this.selected_radio = type;
                this.changeDivs('modal');
                }
                this.selected_div = selected.cate_type_cd;
                this.selected_cate = selected.category_cd;
                console.log(selected.cate_type_cd + selected.category_cd);

                this.date_val = selected.std_date ? this.$comm.getMyDay(selected.std_date) : this.$comm.getMyDay();
                this.modal_val.cd = selected.cd;
                this.modal_val.nm = selected.nm;
                this.myData_save = new Set();
                this.modalToggle();
            },
            // ---------- 모달 메소드 끝 -----------
        }
    }
</script>
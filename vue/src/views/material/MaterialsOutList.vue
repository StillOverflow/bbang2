<template>
   <div class="py-4 container-fluid">
      <div class="row">
         <div class="col-12">
            <div class="card">
               <div class="card-header bg-light">
                  <div id="searchBox" class="mx-auto">
                     
                     <div class="d-block w-100 mx-auto">
                        <div class="row">
                           <div class="d-flex justify-content-left align-items-center text-left mb-3">
                              <div class="col-lg-1 text-center fw-bolder">출고 일자</div>
                              <div class="col-lg-2">
                                 <input class="form-control" type="date" :max="endDt" v-model="startDt" />
                              </div>
                              <div class="w-5 text-center fw-bolder">~</div>
                              <div class="col-lg-2">
                                 <input class="form-control" type="date" :min="startDt" v-model="endDt" />
                              </div>
                           </div>
                        </div>
                        
                        <div class="row">
                           <div class="d-flex justify-content-left align-items-center mb-3">
                              <div class="col-lg-1 text-center fw-bolder">자재명</div>
                              <div class="input-group w-45">
                                 <input class="form-control" type="text" v-model="mat_nm" placeholder="자재명을 입력하세요." style="height: 41px;">
                                 <button class="btn btn-warning" type="button" @click="searchOrder"><i class="fa-solid fa-magnifying-glass"></i></button>
                              </div>
                           </div>
                        </div>
                        
                        <div class="row">
                           <div class="d-flex justify-content-left align-items-center text-left mb-3">
                              <div class="col-lg-1 text-center fw-bolder">자재구분</div>
                              <div class="form-check w-40 d-flex justify-content-between align-items-center">
                                 <div class="w-15">
                                    <input class="form-check-input me-1" type="radio">
                                    <label class="form-check-label text-start">전체</label>
                                 </div>
                                 <div class="w-15" v-for="(data, idx) in materialType" :key="idx">
                                    <input class="form-check-input me-1" type="radio" v-model="selected_radio" :value="data.comm_dtl_cd" :id="'radio' + data.comm_dtl_cd" @change="searchOrder">
                                    <label class="form-check-label text-start" :for="'radio' + data.comm_dtl_cd">
                                       {{ data.comm_dtl_nm }}
                                    </label>
                                 </div>
                              </div>
                           </div>
                        </div>
                        
                        <div class="row">
                           <div class="col-12 d-flex justify-content-left align-items-center text-left mb-3">
                              <div class="col-lg-1 text-center fw-bolder">카테고리</div>
                                 
                              <div class="form-check w-50 d-flex justify-content-between align-items-center">
                                 <div class="w-15">
                                    <input class="form-check-input me-1" type="radio">
                                    <label class="form-check-label text-start">전체</label>
                                 </div>
                                 <div class="w-15" v-for="(data, idx) in category" :key="idx">
                                    <input class="form-check-input me-1" type="radio" v-model="selected_radio" :value="data.comm_dtl_cd" :id="'radio' + data.comm_dtl_cd" @change="searchOrder">
                                    <label class="form-check-label text-start" :for="'radio' + data.comm_dtl_cd">
                                       {{ data.comm_dtl_nm }}
                                    </label>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div class="row">
                        <div class="col-12 d-flex justify-content-center">
                           <button type="button" class="btn btn-warning m-2" @click="getSearchResultDatas">
                              <i class="fa-solid fa-magnifying-glass"></i>
                           </button>
                           <button type="button" class="btn btn-secondary m-2" @click="resetBtn">
                              <i class="fa-solid fa-rotate"></i>
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="card-body">
                  <div class="row">
                     <ag-grid-vue class="ag-theme-alpine " 
                        style="width: 100%; height: 400px;"  
                        :columnDefs="productDefs" 
                        :rowData="productData" 
                        :pagination="true" 
                        @grid-ready="productGrid" 
                        :gridOptions="gridOptions"
                        overlayNoRowsTemplate="주문내역이 없습니다."
                     />
                  </div>

                  <div class="center">
                     <button class="btn btn-primary mtp30" @click="planInsert">SUBMIT</button>
                     <button class="btn btn-secondary mlp10 mtp30" @click="resetForm">RESET</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { AgGridVue } from 'ag-grid-vue3';
   import axios from 'axios';
   import Swal from 'sweetalert2';
   import { useStore } from 'vuex';
   import { onBeforeMount, shallowRef, ref } from 'vue';
   
   //import { , onBeforeMount, ref, watch } from 'vue';

//! ---------------------------------------- 데이터 정의 ----------------------------------------
   // Vuex store 사용
   const store = useStore();

   // 동적 검색 조건 
   const materialType = shallowRef([]);   // 자재 구분
   const category = shallowRef([]);       // 자재 카테고리

   // const selectedMaterialType = ref('');
   // const selectedCategory = ref('');
   const startDt = ref('');
   const endDt = ref('');
   const mat_nm = ref('');
//! ---------------------------------------- Vue Hook ----------------------------------------
   // created와 비슷~~
   onBeforeMount(() => {
      store.dispatch('breadCrumb', { title: '자재 출고 조회' });  // 페이지 제목 설정
      getDynamicConditions(); // 카테고리
   });

//! ---------------------------------------- axios 서버통신 ----------------------------------------
   // 카테고리 및 자재구분 조회
   const getDynamicConditions = async () => {
      try {
         const [resultCategory, resultTypeList] = await Promise.all([
            axios.get('/api/comm/codeList/MC'),
            axios.get('/api/comm/codeList/MA')
         ]);

         category.value = resultCategory.data;
         materialType.value = resultTypeList.data;
      } catch (err) {
         category.value = [];
         materialType.value = [];

         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

   // const getSearchResultDatas = async () => {
   //    try {
   //       const result = await axios.get('/api/material/planList');
   //       console.log(result.data)
   //    } catch (err) {
   //       Swal.fire({
   //          icon: "error",
   //          title: "API 요청 오류:",
   //          text: err.message || err
   //       });
   //    }
   // }

</script>

<style lang="scss" scoped>
   * {
      box-sizing: border-box;
   }
</style>
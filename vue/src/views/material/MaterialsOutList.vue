<template>
   <div class="py-4 container-fluid">
      <div class="row">
         <div class="col-12">
            <div class="card">
               <div class="card-header bg-light">
                  <div id="searchBox" class="row mx-auto">
                     
                     <div class="row d-block w-100">
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
                                 <input class="form-control" type="text" v-model="plan_cd" :v-bind="this.plan_cd" placeholder="자재명을 입력하세요." style="height: 41px;">
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
                                 <div class="w-15">
                                    <input class="form-check-input me-1" type="radio">
                                    <label class="form-check-label text-start">원자재</label>
                                 </div>
                                 <div class="w-15">
                                    <input class="form-check-input me-1" type="radio">
                                    <label class="form-check-label text-start">부자재</label>
                                 </div>
                                 <div class="w-15">
                                    <input class="form-check-input me-1" type="radio">
                                    <label class="form-check-label text-start">소모품</label>
                                 </div>
                                 <div class="w-15">
                                    <input class="form-check-input me-1" type="radio">
                                    <label class="form-check-label text-start">기타</label>
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
                                 <div class="w-15">
                                    <input class="form-check-input me-1" type="radio">
                                    <label class="form-check-label text-start">가류</label>
                                 </div>
                                 <div class="w-15">
                                    <input class="form-check-input me-1" type="radio">
                                    <label class="form-check-label text-start">당류</label>
                                 </div>
                                 <div class="w-15">
                                    <input class="form-check-input me-1" type="radio">
                                    <label class="form-check-label text-start">유지</label>
                                 </div>
                                 <div class="w-15">
                                    <input class="form-check-input me-1" type="radio">
                                    <label class="form-check-label text-start">냉장</label>
                                 </div>
                                 <div class="w-15">
                                    <input class="form-check-input me-1" type="radio">
                                    <label class="form-check-label text-start">기타</label>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>


                     <div class="row">
                        <div class="col-6 d-flex justify-content-center">
                           <button type="button" class="btn btn-warning m-2" @click="searchForm">
                              <i class="fa-solid fa-magnifying-glass"></i>
                           </button>
                           <button type="button" class="btn btn-secondary m-2" @click="resetBtn">
                              <i class="fa-solid fa-rotate"></i>
                           </button>
                        </div>
                     </div>

                  </div>
                  
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
   
</script>

<style lang="scss" scoped>
   * {
      box-sizing: border-box;
   }
</style>
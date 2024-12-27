<template>
   <div class="card-header bg-light ps-5 ps-md-4">

      <div class="d-flex justify-content-center align-items-center text-center">
         <div class="col-lg-1 text-center mb-2 mt-2 fw-bolder">출고 일자</div>
         <div class="col-lg-4">
            <input class="form-control" type="date" :max="endDt" v-model="startDt" />
         </div>
         <div class="col-lg-1 text-center fw-bolder">~</div>
         <div class="col-lg-4">
            <input class="form-control" type="date" :min="startDt" v-model="endDt" />
         </div>
      </div>
      
      <div class="row">
         <div class="col-3 col-lg-1 text-center mt-2 fw-bolder" :style="t_overflow">자재명</div>
         <div class="input-group w-30">
            <input class="form-control" type="text" v-model="plan_cd" :v-bind="this.plan_cd" placeholder="생산지시서 코드를 검색해주세요" style="height: 41px;">
            <button class="btn btn-warning mb-3" type="button" @click="searchOrder"><i class="fa-solid fa-magnifying-glass"></i></button>
         </div>
      </div>

      <div class="row mb-2">
         <div class="col-3 col-lg-1 text-center fw-bolder" style="white-space: nowrap;">자재구분</div>
         <div class="form-check col-10 d-flex">
            <div>
               <input class="form-check-input ms-1" type="radio">
               <label class="form-check-label ms-2 me-4 text-start">원자재</label>
            </div>
            <div>
               <input class="form-check-input ms-1" type="radio">
               <label class="form-check-label ms-2 me-4 text-start">부자재</label>
            </div>
            <div>
               <input class="form-check-input ms-1" type="radio">
               <label class="form-check-label ms-2 me-4 text-start">소모품</label>
            </div>
            <div>
               <input class="form-check-input ms-1" type="radio">
               <label class="form-check-label ms-2 me-4 text-start">기타</label>
            </div>
         </div>
      </div>

      <div class="row mb-2">
         <div class="col-3 col-lg-1 text-center fw-bolder" style="white-space: nowrap;">카테고리</div>
         <div class="form-check col-10 d-flex">
            <div>
               <input class="form-check-input ms-1" type="radio">
               <label class="form-check-label ms-2 me-4 text-start">가류</label>
            </div>
            <div>
               <input class="form-check-input ms-1" type="radio">
               <label class="form-check-label ms-2 me-4 text-start">당류</label>
            </div>
            <div>
               <input class="form-check-input ms-1" type="radio">
               <label class="form-check-label ms-2 me-4 text-start">유지</label>
            </div>
            <div>
               <input class="form-check-input ms-1" type="radio">
               <label class="form-check-label ms-2 me-4 text-start">냉장</label>
            </div>
            <div>
               <input class="form-check-input ms-1" type="radio">
               <label class="form-check-label ms-2 me-4 text-start">기타</label>
            </div>
         </div>
      </div>

      <div class="d-flex justify-content-center align-items-center mt-3 text-center">
         <button type="button" class="btn btn-warning m-2" @click="searchForm">
            <i class="fa-solid fa-magnifying-glass"></i>
         </button>
         <button type="button" class="btn btn-secondary m-2" @click="resetBtn">
            <i class="fa-solid fa-rotate"></i>
         </button>
      </div>
   </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>
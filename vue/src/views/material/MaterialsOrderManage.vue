<template>
   <div class="py-4 container-fluid">
      <div class="card">      
         <div class="card-header bg-light ,">
            <div class="d-flex justify-content-end align-items-center">
               <button class="btn btn-warning m-0 mx-1">
                  <i class="fa-regular fa-file"></i>조회
               </button>
               <button class="btn btn-outline-primary m-0 mx-1">
                  <i class="fa-solid fa-plus"></i>
               </button>
               <button class="btn btn-outline-danger m-0 mx-1">
                  <i class="fa-solid fa-minus"></i>
               </button>
            </div>
         </div>
         <div class="card-body">
            <div class="row">
               <div class="col-md-6">
                  <ag-grid-vue
                     class="ag-theme-alpine"
                     style="width: 100%; height: 300px;"
                     :rowData="orderForm"
                     :pagination="true"
                     :gridOptions="orderFormOptions"
                     @rowClicked="rowClicked"
                     @grid-ready="orderFormGridReady"
                     @first-data-rendered="orderFormGridEvent">
                  </ag-grid-vue>
               </div>
            </div>
            <div class="center mtp30">
               <button class="btn btn-primary" @click="instInsert">SAVE</button>
               <button class="btn btn-secondary mlp10">RESET</button>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>
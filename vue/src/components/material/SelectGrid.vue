<template>
   <div class="py-4 container-fluid">
      <div class="row">
         <div class="col-12">
            <div class="card">
               <div class="card-action mb-2">미지시 계획서 조회</div>
               <div class="card-content">
                  <div class="table-responsive">
                     <ag-grid-vue
                        class="ag-theme-alpine"
                        style="width: 100%; height: 300px;"
                        :rowData="prodPlanListData"
                        :pagination="true"
                        :paginationPageSize="10"
                        :gridOptions="planOptions"
                        @rowClicked="rowClicked"
                        @grid-ready="gridReady">
                     </ag-grid-vue>
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

</style>
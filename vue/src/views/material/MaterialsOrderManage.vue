<template>
   <div id="page-wrapper">

		<div id="page-inner">
			<div class="row">
				<div class="col-md-12">
					<div class="card p-3">
						<div class="card-action">자재발주조회</div>
						<div class="card-content">
							<div class="table-responsive">
								<ag-grid-vue
                           class="ag-theme-alpine"
                           style="width: 100%; height: 400px;"
                           :columnDefs="prodPlanDefs"
                           :rowData="prodPlanData"
                           :pagination="true" 
                           @rowClicked="rowClicked" 
                           @grid-ready="gridFit"
                           overlayNoRowsTemplate="미지시 생산 계획건이 없습니다.">
                        </ag-grid-vue>
							</div>
						</div>
					</div>
				</div>
			</div> <!--END row-->
		</div>
		<!-- /. PAGE INNER  -->
	</div>
</template>

<script>
   import { AgGridVue } from 'ag-grid-vue3';
   // import axios from 'axios';

   export default {
      components: { AgGridVue },
      created() {
         this.$store.dispatch('breadCrumb', { title: '미지시 계획서 자재 조회' });
      },
      data() {
         return {
            prodPlanDefs : null,
         	prodPlanData : null,
            // 제품 테이블 컬럼명
            // prodPlanDefs: [
            //    { headerName: '제품코드', field: 'prd_cd', sortable: true},
            //    { headerName: '제품명',   field: 'prd_nm', sortable: true},
            //    { headerName: '생산수량', field: 'prod_plan_qty'},
            // ],
         };
      },
   }
</script>

<style lang="scss" scoped>

</style>
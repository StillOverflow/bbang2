<template>
   <div id="page-wrapper">
		<div class="header">
			<h1 class="page-header">자재발주조회</h1>
			<ol class="breadcrumb">
				<li><a href="#">candy</a></li>
				<li><a href="#">자재관리</a></li>
				<li class="active">자재발주조회</li>
			</ol>
		</div>

		<div id="page-inner">
			<div class="row">
				<div class="col-md-12">
					<div class="card">
						<!--<div class="card-action">자재발주조회</div>-->
						<div class="card-content">
							<div id="inputReset">
								<label>업체명</label>
								<input type="text" id="companyName" style="width: 315px; border: 1px solid rgba(128, 128, 128, 0.61);" autocomplete="off" >
								<br/>
								<label>발주신청일</label>
								<input type="date" id="startDate"
									style="width: 140px; border: 1px solid rgba(128, 128, 128, 0.61);">&nbsp;ㅡ&nbsp;
								<input type="date" id="endDate"
									style="width: 140px; border: 1px solid rgba(128, 128, 128, 0.61);">&nbsp;&nbsp;&nbsp;
								<button type="button" class="cndSrchBtn" id="mtrlOrderSeachBtn" onclick="search()">검색</button>
								<button type="button" class="cndRstBtn" id="restBtn">초기화</button>
							</div>
							<div style="clear:both"></div>
						</div>
					</div>
				</div>
			</div> <!--END row-->
			<div class="row">
				<div class="col-md-12">
					<div class="card">
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
         this.$store.dispatch('breadCrumb', { title: '생산지시서 등록' });
         this.getPlanList();
         this.getPlanDtlList();
      },
      // data() {
      //    prodPlanData : []
      //    return {
            
      //       // 제품 테이블 컬럼명
      //       prodPlanDefs: [
      //          { headerName: '제품코드', field: 'prd_cd', sortable: true},
      //          { headerName: '제품명',   field: 'prd_nm', sortable: true},
      //          { headerName: '생산수량', field: 'prod_plan_qty'},
      //       ],
      //    };
      // },
   }
</script>

<style lang="scss" scoped>

</style>
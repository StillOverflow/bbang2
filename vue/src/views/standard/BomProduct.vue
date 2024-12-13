<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Authors table</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">제품코드</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                제품명
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                사용여부
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                선택
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr :key="product.PRD_CD" v-for="product in productList">
              <td>
                <div class="d-flex px-2 py-1">          
                  <div class="d-flex flex-column justify-content-center">
                    {{ product.PRD_CD }}
                  </div>
                </div>
              </td>
              <td>
                {{product.PRD_NM}}
              </td>
              <td class="align-middle text-center text-sm">
                {{product.USAGE_STA}}
              </td>
              <td class="align-middle text-center">
                <button class="btn btn-xs btn-info" @click="selectPrdBtn(product.PRD_CD)">선택</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';

export default{
  data(){
    return{
      productList:[],
    };
  },
  methods:{
    async getPrdInfo(){
      // let result = await axios.get(`/api/productList`);
      // this.productList = result.data; 
    },
    selectPrdBtn(prdCd){
      this.$emit('selectPRdBtn',prdCd);
    }
  }

}

</script>
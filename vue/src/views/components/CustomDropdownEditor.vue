<template>
   <div class="inputSearch">
      <!-- 입력 필드 -->
      <div class="input-group mb-3">
         <input type="text" class="form-control searchKeyword" placeholder="자재명을 입력하세요." v-model="searchKeyword" @change="onChange($event)">
         <button class="btn btn-warning" type="button" id="button-addon3">
            <i class="fa-solid fa-magnifying-glass"></i>
         </button>
      </div>
      
      <!-- 드롭다운 리스트 -->
      <div class="dropdownBox" v-show="!isHidden">
         <button type="button" v-for="(item,index) in searchMaterialArr" :key="index" ref="newArray" class="smallText m-3">{{ item.mat_nm }}</button>
      </div>
   </div>
</template>

<script setup>
   //import axios from 'axios';
   import { ref, defineProps } from 'vue';
   //import Swal from 'sweetalert2';
   
   let searchKeyword = ref('');
   let newArray = ref([]);
   let isHidden = ref(true);

   const data = defineProps(['params']);

   const onChange = () => {
      console.log("keyword.value 자식 => ", searchKeyword.value)
      data.params.context.searchComponent.searchKeywordFunc(searchKeyword.value);
      let result = data.params.context.searchComponent.getSearchResults();
      console.log("result => ", result)
      //getMaterial(searchKeyword.value);
   }

   // 검색 결과를 실시간으로 감지하여 업데이트
   // watch(
   // () => data.context.searchComponent.getSearchResults(), // 부모의 검색 결과 반환 메서드 호출
   // (newResults) => {
   //    searchResults.value = newResults; // 검색 결과 업데이트
   // },
   // { immediate: true }, // 초기값도 반영
   // );


   
</script>

<style scoped>
   .inputSearch {
      position: relative;
      width: 100%;
   }
   
   .searchKeyword {
      height: 41px;
   }
   
   .dropdown-input {
      width: 100%;
      padding: 5px;
      box-sizing: border-box;
   }
   
   .dropdownBox {
      position: absolute;
      top: 100%;
      left: 0;
      background: #fff;
      border: 1px solid #ccc;
      max-height: 300px;
      overflow-y: auto;
      z-index: 10;
      padding: 5px;
      border-radius: 5px;
   }
   
   .smallText {
      all: unset; 
      display: block;
      font-size: 12px;
      color: #999999;
      cursor: pointer;
      border: none;
      background-color: none;
   }

   .smallText:hover {
      color: #7c4758;
      font-weight: 600;
   }
</style>
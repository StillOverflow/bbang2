<template>
   <div class="inputSearch">
      <!-- 입력 필드 -->
      <div class="input-group mb-3 w-30">
         <input type="text" class="form-control searchKeyword" placeholder="자재명을 입력하세요." v-model="searchKeyword" @change="onChange($event)">
         <button class="btn btn-warning" type="button" id="button-addon3">
            <i class="fa-solid fa-magnifying-glass"></i>
         </button>
      </div>
      
      <!-- 드롭다운 리스트 -->
      <div class="dropdownBox w-30" v-show="!isHidden">
         <button type="button" v-for="(item,index) in searchMaterialArr" :key="index" ref="newArray" class="smallText m-3">{{ item.mat_nm }}</button>
      </div>
   </div>
</template>

<script setup>
   import axios from 'axios';
   import { ref } from 'vue';
   import Swal from 'sweetalert2';
   
   let searchKeyword = ref('');
   let searchMaterialArr = ref([]);
   let newArray = ref([]);
   let isHidden = ref(true);

   const onChange = () => {
      // 검색어가 비어 있는지 확인
      getMaterial(searchKeyword.value);
   }

   const getMaterial = async (keyword) => {
      try {
         const result = await axios.get('/api/comm/material', { params : { 'mat_nm' : keyword } });
         searchMaterialArr.value = result.data;
         console.log(result.data.length)
         if (result.data.length > 0) {
            isHidden.value = false; // 드롭다운 표시
         } else {
            searchMaterialArr.value = [{ mat_nm: '검색결과가 없습니다.' }];
            //isHidden.value = true; // 검색어가 없으면 드롭다운 숨김
         }
      } catch (err) {
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };
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
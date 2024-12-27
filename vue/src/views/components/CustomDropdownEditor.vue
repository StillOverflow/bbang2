<template>
   <div class="inputSearch">
   
      <!-- 입력 필드 -->
      <div class="input-group">
         <input
            type="text"
            class="form-control searchKeyword"
            :placeholder="placeholder"
            v-model="searchKeyword"
            @input="onChange($event)"
         />
         <button class="btn" type="button" id="button-addon3">
            <i class="fa-solid fa-magnifying-glass"></i>
         </button>
      </div>

      <!-- 드롭다운 리스트 -->
      <div v-show="!isHidden" class="dropdownBox">
         <button v-for="(item, index) in searchResults" :key="index" class="dropdown-item" @click="onClickMatNm(item.mat_cd, item.mat_nm)">
            {{ item.mat_nm }}
         </button>
      </div>
   </div>
</template>

<script setup>
   import axios from 'axios';
   import Swal from 'sweetalert2';
   import { ref, onBeforeMount } from "vue";

//! ----------------------------------------- 데이터 정의 -----------------------------------------   
   let searchKeyword = ref("");  // 검색 키워드
   let isHidden = ref(false);    // 드롭다운 표시 여부 (true: 숨김, false: 표시)
   let searchResults = ref([]);  // 드롭다운 박스에 나타날 데이터
   let matCode = ref('');
   let matName = ref('');
   //const props = defineProps(["params"]);  // 부모에서 전달한 params 정의
   
   onBeforeMount(() => {
      getValue();
   });

//! ----------------------------------------- 이벤트 함수 -----------------------------------------   
   const onChange = () => {
      getMaterial(searchKeyword.value)
   };

   const getMaterial = async (keyword) => {
      try {
         const result = await axios.get('/api/comm/material', { params : { 'mat_nm' : keyword } });
         searchResults.value = result.data;
         
      } catch (err) {
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

   const onClickMatNm = (code, name) => {
      searchKeyword.value = name;  // 클릭한 항목의 이름을 검색어 필드에 설정
      isHidden.value = true;       // 드롭다운 숨김

      matCode.value = code
      matName.value = searchKeyword.value;
   }

   const getValue = () => {
      return matName.value;
   }

//! ----------------------------------------- Vue Method -----------------------------------------


</script>

<style scoped>
   .inputSearch {
      position: relative;
      width: 100%;
      z-index: 1050;
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
      top: 0;
      left: 0;
      background: #fff;
      border: 1px solid #ccc;
      max-height: 500px;
      overflow-y: auto;
      z-index: 1100;
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

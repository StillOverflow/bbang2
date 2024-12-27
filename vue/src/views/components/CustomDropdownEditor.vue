<template>
   <div class="inputSearch">
     <!-- 입력 필드 -->
     <div class="input-group mb-3">
       <input
         type="text"
         class="form-control searchKeyword"
         :placeholder="placeholder"
         v-model="searchKeyword"
         @change="onChange($event)"
       />
       <button class="btn btn-warning" type="button" id="button-addon3">
         <i class="fa-solid fa-magnifying-glass"></i>
       </button>
     </div>
 
     <!-- 드롭다운 리스트 -->
     <div v-if="searchResults.length > 0" class="dropdownBox">
       <button v-for="(item, index) in searchResults" :key="index" class="dropdown-item">
         {{ item.mat_nm }}
       </button>
     </div>
   </div>
 </template>
 
 <script setup>
 //import axios from 'axios';
 import { ref, defineProps, watch } from "vue";
 //import Swal from 'sweetalert2';
 
 let searchKeyword = ref("");
 let isHidden = ref(false);
 let searchResults = ref([]);
 
 const data = defineProps(["params"]);
 const placeholder = data.params.context.searchComponent.msg;
 console.log("placeholder => ", placeholder);
 
 const onChange = () => {
   console.log("keyword.value 자식 => ", searchKeyword.value);
   data.params.context.searchComponent.searchKeywordFunc(searchKeyword.value);
 };
 
 watch(
   () => data.params.context.searchComponent.getSearchResults(),
   (newResults) => {
     searchResults.value = newResults; // 검색 결과 업데이트
     console.log("watch(자식)", searchResults.value);
     if (searchResults.value.length > 0) {
       console.log("타나?");
       isHidden.value = true; // 드롭다운 표시
     } else {
       searchResults.value = [{ mat_nm: "검색결과가 없습니다." }];
     }
   }
 );
 </script>
 
 <style scoped>
 .inputSearch {
   position: relative;
   width: 100%;
   z-index: 1000 !important;
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
   z-index: 1000 !important;
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
 
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
         <button class="btn btn-warning" type="button" id="button-addon3">
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
   import { ref, defineProps, watch } from "vue";

//! ----------------------------------------- 데이터 정의 -----------------------------------------   
   let searchKeyword = ref("");  // 검색 키워드
   let isHidden = ref(false);    // 드롭다운 표시 여부 (true: 숨김, false: 표시)
   let searchResults = ref([]);  // 드롭다운 박스에 나타날 데이터

   const data = defineProps(["params"]);  // 부모에서 전달한 params 정의

//! ----------------------------------------- 이벤트 함수 -----------------------------------------   
   const onChange = () => {
      console.log("keyword.value 자식 => ", searchKeyword.value);
      data.params.context.searchComponent.searchKeywordFunc(searchKeyword.value); // 부모 컴포넌트에 검색어 전달 및 검색 실행 요청
      
   };

   const onClickMatNm = (code, name) => {
      searchKeyword.value = name;  // 클릭한 항목의 이름을 검색어 필드에 설정
      isHidden.value = true;       // 드롭다운 숨김
      console.log("자재 이름 => ", name);
      console.log("자재 코드 =>", code);
   }

//! ----------------------------------------- Vue Method -----------------------------------------
   watch(   // 부모의 getSearchResults 지켜보는 중
      () => data.params.context.searchComponent.getSearchResults(), 
      (newResults) => {
         searchResults.value = newResults; // 검색 결과 업데이트

         if (searchResults.value.length > 0) {
            isHidden.value = false; // 검색 결과가 있으면 드롭다운 표시
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

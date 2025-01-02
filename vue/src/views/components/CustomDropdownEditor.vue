<template>
   <div>

      <div class="inputSearch" @keydown="keyEventHandler($event)">
         <!-- 입력 필드 -->
         <div class="input-group">
            <input
               type="text"
               class="form-control searchKeyword"
               placeholder="자재명 입력"
               v-model="searchKeyword"
               @input="onChange($event)"
            />
            <button type="button" id="button-addon3" @click="onClickModalOpen" class="btn">
               <i class="fa-solid fa-magnifying-glass"></i>
            </button>
         </div>

         <!-- 드롭다운 리스트 -->
         <div v-if="!isHidden" class="dropdownBox">
            <div v-if="searchResults.length">
               <button 
                  v-for="(item, index) in searchResults"
                  :key="index"
                  class="dropdown-item matResultList"
                  :data-mat-cd="item.mat_cd"
                  :data-mat-unit="item.unit"
                  :class="{ active: index === selectedIndex }"
                  @click="onClickMatNm(item.mat_cd, item.mat_nm, item.unit)"
                  style="font-size: 12px;"
               >
                  {{ item.mat_nm }}
               </button>
            </div>
         <div v-else class="dropdown-item text-left fw-bolder" style="color: #2bce89; font-size: 12px;">결과 없음</div>
      </div>
      </div>
   </div>
   
</template>

<script setup>
   import axios from 'axios';
   import Swal from 'sweetalert2';
   import { ref, onBeforeMount, defineProps } from "vue";

//! ----------------------------------------- 데이터 정의 -----------------------------------------   
   let searchKeyword = ref('');  // 검색 키워드
   let isHidden = ref(false);    // 드롭다운 표시 여부 (true: 숨김, false: 표시)
   let searchResults = ref([]);  // 드롭다운 박스에 나타날 데이터
   let matCode = ref('');        // 자재 코드
   let matName = ref('');        // 자재명
   let matUnit = ref('');

   const props = defineProps(["params"]);  // 부모에서 전달한 params 정의
//! ----------------------------------------- Vue Method -----------------------------------------
   onBeforeMount(() => {
      getValue();
      console.log("props.params => ", props.params)
   });
   
//! ----------------------------------------- 이벤트 함수 -----------------------------------------   
   // 자재명 input값이 변할 때
   const onChange = () => {
      getMaterial(searchKeyword.value);
   };

   // 자재정보 가져오는 axios
   const getMaterial = async (keyword) => {
      try {
         const result = await axios.get('/api/comm/material', { params : { 'mat_nm' : String(keyword).trim() } });
         searchResults.value = result.data;
      } catch (err) {
         Swal.fire({
            icon: "error",
            title: "API 요청 오류:",
            text: err.message || err
         });
      }
   };

   let selectedIndex = ref(-1);
   // keydown & keyup 이벤트 : 방향키 위, 아래 및 엔터
   const keyEventHandler = (event) => {
      let elementBtns = document.querySelectorAll(".matResultList");
      if(isHidden.value) return;
      switch (event.key) {
         case 'ArrowDown' :
            if(event.isComposing) return; // 한글 끝부분 2개씩 입력막기
            event.preventDefault();       // 스크롤 이벤트 막기

            if (elementBtns.length > 0) {
               selectedIndex.value = (selectedIndex.value + 1) % elementBtns.length; // 순환
               elementBtns[selectedIndex.value].focus();
            }
         break;

         case "ArrowUp" :
            if(event.isComposing) return; // 한글 끝부분 2개씩 입력막기
            event.preventDefault();       // 스크롤 이벤트 막기

            if (elementBtns.length > 0 && document.activeElement) {
               if(selectedIndex.value !== 0) {
                  selectedIndex.value = (selectedIndex.value - 1) % elementBtns.length; // 드롭박스 순환
               } else {
                  selectedIndex.value = elementBtns.length -1;
               }
               elementBtns[selectedIndex.value].focus(); // 포커스 잡기
            }
         break;

         case "Enter" :
            if (document.activeElement) {
               matName.value = document.activeElement.innerText;
               matCode.value = document.activeElement.getAttribute("data-mat-cd");
               matUnit.value = document.activeElement.getAttribute("data-mat-unit");
            }
         break;
      }
   }

   const onClickMatNm = (code, name, unit) => {
      searchKeyword.value = name;  // 클릭한 항목의 이름을 검색어 필드에 설정
      isHidden.value = true;       // 드롭다운 숨김

      matCode.value = code; // 자재 코드
      matName.value = name; // 자재명
      matUnit.value = unit; // 자재 단위
   };

   const onClickModalOpen = () => {
      props.params.isModal.openModal(searchKeyword.value);  // 부모에 있는 모달 제어하기 
   }

//! ------------------------------------ grid 내장함수 ------------------------------------
   // 그리드 최종값 가져오기
   const getValue = () => {
      let newObj = { matName : matName.value, matCode : matCode.value, matUnit : matUnit.value };
      return newObj;
   }

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

   .dropdown-item.active {
      background-color: #007bff;
      color: white;
   }
</style>

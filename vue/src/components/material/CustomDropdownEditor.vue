<template>
   <div class="dropdown-editor">
      <!-- 입력 필드 -->
      <input
         v-model="searchText"
         type="text"
         placeholder="자재명을 입력하세요"
         class="dropdown-input"
         @change="onInput"
      />
   
      <!-- 드롭다운 리스트 -->
      <div v-if="dropdownVisible" class="dropdownBox">
         <div v-for="(item, index) in filteredItems" :key="index" class="dropdownItem" @click="selectItem(item)">{{ item.name }}</div>
      </div>
   </div>
</template>

<script setup>
   import { ref, props, emit } from 'vue';
   import axios from 'axios';
   
   defineProps(['value']); // Ag-Grid에서 전달된 값
   defineEmits(['input']); // 부모에게 값 전달
   
   // 상태 관리
   const searchText = ref(''); // 입력 텍스트
   const dropdownVisible = ref(false); // 드롭다운 표시 여부
   const filteredItems = ref([]); // 검색 결과
   
   // 초기 값 설정
   searchText.value = props.value || '';

   // 입력 이벤트 핸들러
   const onInput = async () => {
      console.log(searchText.value);
      if (searchText.value.length > 0) {
      try {
         // 서버 호출
         const result = await axios.get('/api/comm/material', { params : { 'mat_nm' : searchText.value } });
         filteredItems.value = result.data || [];
         dropdownVisible.value = filteredItems.value.length > 0;
      } catch (error) {
         console.error('검색 오류:', error);
      }
      } else {
         dropdownVisible.value = false;
      }
   };

   // 항목 선택
   const selectItem = (item) => {
      searchText.value = item.name;
      dropdownVisible.value = false;
      emit('input', item.name); // 선택된 값 부모에 전달
   };
</script>

<style scoped>
   .dropdown-editor {
      position: relative;
      width: 100%;
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
      width: 100%;
      background: #fff;
      border: 1px solid #ccc;
      max-height: 150px;
      overflow-y: auto;
      z-index: 10;
   }
   
   .dropdownItem {
      padding: 5px;
      cursor: pointer;
   }
   
   .dropdownItem:hover {
      background: #f0f0f0;
   }
</style>
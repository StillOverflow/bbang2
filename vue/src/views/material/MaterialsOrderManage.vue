<template>
   <div>
      <ActionButton type="view" label="조회" @click="handleView" />
         <ActionButton type="create" label="등록" @click="handleCreate" />
      <ActionButton type="update" label="수정" @click="handleUpdate" />
      <ActionButton type="delete" label="삭제" @click="handleDelete" />
   </div>
</template>

<script>
   import ActionButton from '../../components/ActionButton.vue'; // components 폴더의 컴포넌트를 가져옴
   import { defineComponent } from 'vue';

   export default defineComponent({
      name: 'Material',
      components: {
         ActionButton,
      },
      setup() {
         const handleView = () => alert('조회 버튼 클릭!');
         const handleCreate = () => alert('등록 버튼 클릭!');
         const handleUpdate = () => alert('수정 버튼 클릭!');
         const handleDelete = () => alert('삭제 버튼 클릭!');

         return {
            handleView,
            handleCreate,
            handleUpdate,
            handleDelete,
         };
      },
   });
</script>

<style scoped>
   
</style>

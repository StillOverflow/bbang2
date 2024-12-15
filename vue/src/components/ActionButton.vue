<template>
   <button :class="buttonClass" @click="handleClick">
      {{ label }}
   </button>
</template>

<script>
   export default {
      name: 'ActionButton',
      props: {
         type: {
            type: String,
            required: true,
            validator: (value) => ['list', 'create', 'update', 'delete'].includes(value),
         },
         label: {
            type: String,
            required: true,
         },
      },
      computed: {
         buttonClass() {
            // 버튼에 스타일 지정
            switch (this.type) {
               case 'list':
                  return 'btnList';
               case 'create':
                  return 'btnCreate';
               case 'update':
                  return 'btnUpdate';
               case 'delete':
                  return 'btnDelete';
               default:
                  return 'btn-default';
            }
         },
      },
      methods: {
         handleClick() {
            this.$emit('click');
         },
      },
   };
</script>

<style scoped>
   
   .btnList { /* 조회 버튼 */
      background-color: #88b6d3;
   }
   .btnCreate { /* 등록 버튼 */
      background-color: #ffe88c;
   }
   .btnUpdate { /* 수정 버튼 */
      background-color: #cab8f4;
   }
   .btnDelete { /* 삭제 버튼 */
      background-color: #f8b7cd;
   }
</style>

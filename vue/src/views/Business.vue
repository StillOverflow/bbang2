<!-- 영업 -->

<!--TOAST UI 테스트 뷰-->
<template>
  <div>
    <h1>Vue 3 + Toast UI Editor</h1>
    <ToastEditor
      :initialValue="'Hello, Toast UI Editor!'"
      height="400px"
      previewStyle="tab"
    />
  </div>
</template>

<script>
import ToastEditor from '../components/ToastEditor.vue';

export default {
  name: 'App',
  components: {
    ToastEditor,
  },
};
</script>



<!-- TOAST UI  테스트 컴포넌트 -->
<template>
  <div ref="editorRef"></div>
</template>

<!--기능1-->
<script>
import { ref, onMounted } from 'vue';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

export default {
  name: 'ToastEditor',
  props: {
    initialValue: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '500px',
    },
    previewStyle: {
      type: String,
      default: 'vertical', // 'tab' 또는 'vertical'
    },
  },
  setup(props) {
    const editorRef = ref(null);

    onMounted(() => {
      // Toast UI Editor 초기화
      new Editor({
        el: editorRef.value,
        height: props.height,
        initialEditType: 'markdown', // 'markdown' 또는 'wysiwyg'
        previewStyle: props.previewStyle,
        initialValue: props.initialValue,
      });
    });

    return { editorRef };
  },
};
</script>


<!--기능2-->
<!-- <script>
import { ref, onMounted } from 'vue';
import Editor from '@toast-ui/editor';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor/dist/toastui-editor.css';

export default {
  name: 'ToastEditor',
  setup() {
    const editorRef = ref(null);

    onMounted(() => {
      new Editor({
        el: editorRef.value,
        height: '500px',
        initialEditType: 'markdown',
        previewStyle: 'vertical',
        plugins: [codeSyntaxHighlight],
      });
    });

    return { editorRef };
  },
};
</script> -->

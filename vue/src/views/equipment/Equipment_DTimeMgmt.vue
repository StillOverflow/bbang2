<!-- 설비 비가동 관리 -->
<template>
  <div>
  </div>
</template>

<script>
export default {
  created() {
    // 페이지 제목 저장
    this.$store.dispatch('breadCrumb', { title: '설비 비가동 관리' });
  },
}
</script>

<style lang="scss" scoped></style>
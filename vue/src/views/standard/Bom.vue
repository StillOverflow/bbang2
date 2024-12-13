<script setup>
import BomProduct from "./BomProduct.vue";
import BomMaterial from "./BomMaterial.vue";
import BomInformation from "./BomInformation.vue";
</script>

<!-- BOM -->

<!-- 설비 -->
<template>
  <div>
    <!-- 템플릿 내용 -->
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-6">
          <BomProduct />
      </div>
        
        <div class="col-md-6">
          <div class="col-12">
            <BomMaterial />
        </div>
        <div class="col-12">
          <BomInformation />
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Bom",
  // 컴포넌트 로직
};
</script>

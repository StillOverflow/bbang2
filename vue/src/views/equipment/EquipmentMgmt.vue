<!-- 설비 -->
<template>
  <div class="py-4 container-fluid">
    <div class="card">
      <div class="card-body">
        희희 설비관리임

        <div class="row">
          <!-- 이미지 보이는 곳 -->
          <div class="col-md-2">
            <p class="text-uppercase text-lg"></p>
            <img
              src="../../../src/assets/img/blank_img.png"
              alt=""
              width="150px"
              height="150px"
            />

            <input class="form-control" type="text" value="" />
          </div>
          <!-- 왼쪽 입력란 -->
          <div class="col-md-5">
            <label for="example-text-input" class="form-control-label"
              >설비구분</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >설비명</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >모델명</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >구매일자</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >구매업체</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >제조업체</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >교체주기(연)</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >점검주기(일)</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >설비담당자</label
            >
            <input class="form-control" type="text" value="" />
          </div>

          <!-- 오른쪽 입력란 -->
          <div class="col-md-5">
            <label for="example-text-input" class="form-control-label"
              >적정 온도</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >적정 습도</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >적정 RPM</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >적정 속도</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >적정 전력량</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >UPH</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >점검 구분</label
            >
            <input class="form-control" type="text" value="" />
            <label for="example-text-input" class="form-control-label"
              >설비 상태</label
            >
            <input class="form-control" type="text" value="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Equipment_Mgmt',
  // 컴포넌트 로직
  data() {
    return {};
  },
  created() {
    this.$store.dispatch('breadCrumb', { title: '설비 관리' });
  },
};
</script>

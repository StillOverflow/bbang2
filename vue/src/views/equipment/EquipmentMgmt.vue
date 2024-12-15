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
              height="150px" class="mb-3"
            />

            <input class="form-control w-40" type="text" v-model="imageField">
          </div>
          <!-- 왼쪽 입력란 -->
          <div class="col-md-5">
            <span v-for="(a,i) in left_menus" :key="i">
            <label for="example-text-input" class="form-control-label"
              >{{ a }}</label
            >
            <input class="form-control" type="text" v-model="left_blank[i]" />
          </span>
          </div>

          <!-- 오른쪽 입력란 -->
          <div class="col-md-5">
            <span v-for="(a,i) in right_menus" :key="i">
            <label for="example-text-input" class="form-control-label"
              >{{ a }}</label
            >
            <input class="form-control" type="text" v-model="right_black[i]" />
          </span>
          </div>
        </div>
      </div>
      <div class="col-12 d-flex justify-content-center mt-3">
  <button class="btn btn-primary me-2" :style="t_overflow" >등록</button>
  <button class="btn btn-danger" :style="t_overflow" @click="resetAll">초기화</button>
</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Equipment_Mgmt',
  // 컴포넌트 로직
  data() {
    return {
      // 스타일 바인딩
      t_overflow: {whiteSpace: 'nowrap'},

      left_menus : ['설비구분','설비명','모델명','구매일자','구매업체','제조업체','교체주기(연)','점검주기(일)','설비담당자'],
      right_menus : ['적정 온도','적정 습도','적정 RPM','적정 속도','적정 전력량','UPH','점검 구분','설비 상태'],

      //필드값 초기화
      left_blank : Array(9).fill(""),
      right_black : Array(8).fill(""),
      imageField : "",
    };
  },
  methods: {
    resetAll(){
      this.left_blank = this.left_blank.map(()=>'');
      this.right_black = this.right_black.map(()=>'');
      this.imageField = '';
    }
    },
  created() {
    this.$store.dispatch('breadCrumb', { title: '설비 관리' });
  },
};
</script>

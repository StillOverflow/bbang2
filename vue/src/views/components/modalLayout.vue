<template>
    <div tabindex="-1" class="modal-wrap" v-show="modalCheck">
        <div class="modal-container">
            <header class="modal-header">
                <slot name="header">
                    <h5 class="modal-title">BootstrapVue</h5>
                    <button type="button" aria-label="Close" class="close" @click="modalOpen">×</button>
                </slot>                
            </header>
            <div class="modal-body">
                <slot><p class="my-4">Hello from modal!</p></slot>                 
            </div>
            <footer class="modal-footer">
                <slot name="footer">
                    <button type="button" class="btn btn-secondary" @click="modalOpen">닫기</button>
                    <button type="button" class="btn btn-primary" @click="modalOpen">저장</button>
                </slot>                  
            </footer>
        </div>
    </div>
</template>


<script>
export default {
  data() {
    return {
      // modalCheck: false,
    };
  },
  props: {
    modalCheck : Boolean
  },
  methods: {
    gridFit(params) { // 매개변수 속성으로 자동 접근하여 sizeColumnsToFit() 실행함. (가로스크롤 삭제)
      params.api.sizeColumnsToFit();
    },
    // modalOpen() {
    //   this.modalCheck = !this.modalCheck
    // }
  }
};
</script>

<style>
.modal-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.4);
}

/* modal or popup */
.modal-container {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 10px;
  box-sizing: border-box;
}

.close {
    float: right;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    opacity: .5
}

.close:hover {
    color: #000;
    text-decoration: none
}

.close:not(:disabled):not(.disabled):focus,.close:not(:disabled):not(.disabled):hover {
    opacity: .75
}

button.close {
    padding: 0;
    background-color: transparent;
    border: 0
}

a.close.disabled {
    pointer-events: none
}
</style>
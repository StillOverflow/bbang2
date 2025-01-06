<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

const store = useStore();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});
</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Enter your id and password to sign in</p>
                </div>
                <div class="card-body">
                  <div class="mb-3">
                    <argon-input
                      id="id"
                      type="text"
                      placeholder="Id"
                      v-model="id"
                      size="lg"
                      v-on:keyup.enter="signIn"
                    />
                  </div>
                  <div class="mb-3">
                    <argon-input
                      id="password"
                      type="password"
                      placeholder="Password"
                      v-model="password"
                      size="lg"
                      v-on:keyup.enter="signIn"
                    />
                  </div>

                  <div class="text-center">
                    <argon-button
                      class="mt-4"
                      variant="gradient"
                      color="success"
                      fullWidth
                      size="lg"
                      @click="signIn"
                      >Sign in</argon-button
                    >
                  </div>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg&quot;);
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  "Attention is the new currency"
                </h4>
                <p class="text-white position-relative">
                  The more effortless the writing looks, the more effort the
                  writer actually put into the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>


<script>
import axios from 'axios';

export default {
  methods: {    
     //로그인
     async signIn() {
      if (!this.id) {
          this.$swal({
              icon: "error",
              title: "아이디를 입력하세요",
          });
          return;
      }else if (!this.password) {
        this.$swal({
              icon: "error",
              title: "비밀번호를 입력하세요",
          });
          return;
      }

      let obj = {
          id : this.id,
          password : this.password
      }
      let result = await axios.get('/api/comm/login', { params:obj })
                              .catch(err => console.log(err));
      
      if(result.data.ID){
        if(result.data.STATUS == 'G03'){
          this.$swal({
            icon: "error",
            title: "로그인 불가",
            text: "퇴사처리된 계정정보입니다",
          })
        }else{
          this.$session.set('user_id', result.data.ID);
          this.$session.set('user_cd', result.data.MEM_CD);
          this.$session.set('user_nm', result.data.NAME);
          this.$session.set('user_dpt', result.data.DPT_CD);
          this.$session.set('user_psnm', result.data.PS);
          this.$session.set('user_ps', result.data.PERMISSION);
          this.$session.set('user_st', result.data.STATUS);
          this.$router.push({ name : 'Dashboard'});   
        }
      }else{
        this.$swal({
          icon: "error",
          title: "로그인 정보가 맞지 않습니다",
          text: "아이디 또는 비밀번호를 확인해주세요",
        })
      }
      return result;
    },

  }
    
};

</script>
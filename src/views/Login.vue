<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">MP Demo Admin Portal</div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="ms-content">
        <el-form-item prop="email">
          <el-input v-model="loginForm.email" placeholder="email">
            <template #prepend>
              <el-button icon="el-icon-user"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="loginForm.password" @keyup.enter="submitForm()">
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">Login</el-button>
        </div>
        <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { api } from "../api/index";
import { cookies } from "../utils/cookies"

export default {
  setup() {
    const router = useRouter();
    const param = reactive({
      email: "",
      password: "",
    });
    const rules = {
      email: [
        {
          required: true,
          message: "Please fill in Email",
          trigger: "blur",
        },
      ],
      password: [{ required: true, message: "Please fill in password", trigger: "blur" }],
    };
    const login = ref(null);

    const store = useStore();
    store.commit("clearTags");

    return {
      param,
      rules,
      login,
      router,
    };
  },
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    submitForm() {
      this.$refs["loginForm"].validate(async (valid) => {
        if (valid) {
          let res = await api.login(this.loginForm);
          console.log("res",res);
          switch (res.status) {
            case 404:
              ElMessage.error("User Not Found");
              return false;
            case 403:
              ElMessage.error("Invalid Password");
              return false;
            case 200:
              ElMessage.success("Login Success");
              cookies.set("api-token",res.data)
              this.router.push("/");
              return true;
          }
          //localStorage.setItem("ms_username", param.username);
          //router.push("/");
        } else {
          ElMessage.error("Login failed");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  /* background-image: url(../assets/img/login-bg.jpg); */
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>

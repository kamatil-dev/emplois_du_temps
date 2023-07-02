<template>
  <n-space
    justify="center"
    align="center"
    :style="modeSombre ? 'background:#0a0a0b;' : null"
    style="width: 100%; height: 100%; position: absolute; top: 0; left: 0"
  >
    <n-card hoverable style="max-width: 300px">
      <n-space align="center" vertical>
        <n-space justify="center">
          <n-image src="/logo.svg" preview-disabled height="40" />
          <n-image
            :style="modeSombre ? 'filter: invert(1)' : null"
            src="/title.svg"
            preview-disabled
            height="40"
          />
        </n-space>
        <n-form
          ref="formRefEl"
          :model="loginData"
          :rules="rules"
          @keydown.enter="handleLogin"
        >
          <n-form-item path="username">
            <n-input
              v-model:value="loginData.username"
              placeholder="Nom d'utilisateur"
            />
          </n-form-item>
          <n-form-item class="block" path="password">
            <n-input
              v-model:value="loginData.password"
              type="password"
              placeholder="Mot de passe"
              show-password-on="click"
            />
          </n-form-item>
        </n-form>
        <n-button
          type="primary"
          round
          attr-type="submit"
          :loading="loginLoading"
          @click="handleLogin"
        >
          Se connecter
        </n-button>
      </n-space></n-card
    >
  </n-space>
</template>
<script setup>
import {
  NSpace,
  NCard,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NImage,
  useMessage,
} from "naive-ui";

useHead({
  title: "Authentification",
});

definePageMeta({
  middleware: "guest",
});

const modeSombre = useState("mode_sombre"),
  message = useMessage(),
  user = useState("user"),
  formRefEl = ref(),
  loginLoading = ref(false),
  loginData = ref({
    username: null,
    password: null,
  }),
  rules = {
    username: [
      {
        required: true,
        message: "Ce champ est obligatoire",
      },
    ],
    password: [
      {
        required: true,
        message: "Ce champ est obligatoire",
      },
    ],
  },
  handleLogin = async () => {
    loginLoading.value = true;
    formRefEl.value?.validate(async (errors) => {
      if (!errors) {
        // Retourne false si le nom d'utilisateur ou mot de passe sont incorrecte
        const loginRequest = await $fetch(
          "https://api.inicontent.com/emplois_du_temps/auth/login",
          {
            method: "POST",
            body: loginData.value,
          }
        );
        if (loginRequest.result && loginRequest.result.id) {
          user.value = loginRequest.result;
          message.success(loginRequest.message.fr);
          await navigateTo("/emplois");
        } else message.error(loginRequest.message.fr);
      }
      loginLoading.value = false;
    });
  };
</script>
<style scoped></style>

<template>
  <n-card>
    <template #header>Profile</template>
    <template #header-extra>
      <n-button
        @click="saveProfile"
        icon-placement="right"
        :loading="saveProfileLoading"
      >
        <template #icon
          ><n-icon><SaveArrowRight20Regular /></n-icon
        ></template>
        Sauvgarder
      </n-button>
    </template>
    <n-form ref="userRef" :model="user">
      <n-form-item label="Nom d'utilisateur" path="username">
        <n-input
          v-model:value="user.username"
          placeholder="Nom d'utilisateur"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item label="Mot de passe" path="password">
        <n-input
          v-model:value="user.password"
          placeholder="Mot de passe"
          type="password"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item label="Liste des salles" path="salles" id="salles">
        <n-dynamic-tags v-model:value="user.salles" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item label="Liste des filières" path="filières">
        <n-dynamic-tags v-model:value="user.filières" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item label="Liste des modules" path="modules">
        <n-dynamic-tags v-model:value="user.modules" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item label="Liste des enseignants" path="enseignants">
        <n-dynamic-tags
          v-model:value="user.enseignants"
          @keydown.enter.prevent
        />
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script setup>
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NDynamicTags,
  NIcon,
  NButton,
  useMessage,
} from "naive-ui";
import SaveArrowRight20Regular from "@vicons/fluent/SaveArrowRight20Regular";

useHead({
  title: "Profile",
});

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const user = useState("user"),
  message = useMessage(),
  saveProfileLoading = ref(false),
  saveProfile = async () => {
    saveProfileLoading.value = true;
    await $fetch(
      `https://api.inicontent.com/emplois_du_temps/user/${user.value.id}`,
      {
        method: "PUT",
        body: user.value,
      }
    );
    saveProfileLoading.value = false;
    message.success("les modifications sont sauvegardées");
  };

user.value.password = null;
</script>

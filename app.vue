<template>
  <n-config-provider
    :locale="frFR"
    :date-locale="dateFrFR"
    :theme="modeSombre ? darkTheme : null"
  >
    <n-message-provider>
      <NuxtLayout>
        <NuxtLoadingIndicator :height="2" />
        <NuxtPage />
      </NuxtLayout>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import {
  NConfigProvider,
  NMessageProvider,
  darkTheme,
  frFR,
  dateFrFR,
} from "naive-ui";

const modeSombre = useState("mode_sombre"),
  modeSombreCookie = useCookie("modeSombre");
if (modeSombreCookie.value) modeSombre.value = modeSombreCookie.value;
watch(modeSombre, (value) => (modeSombreCookie.value = value ? true : null));
</script>

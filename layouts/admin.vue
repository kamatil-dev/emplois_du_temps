<template>
  <n-layout style="height: 100vh">
    <n-layout-header bordered>
      <n-space style="padding: 0 10px" align="center" justify="space-between">
        <n-space align="center">
          <div style="padding-top: 5px">
            <n-image src="/logo.svg" preview-disabled height="40" />
            <n-image
              :style="modeSombre ? 'filter: invert(1)' : null"
              src="/title.svg"
              preview-disabled
              height="40"
            />
          </div>
          <n-menu mode="horizontal" :options="menuOptions" />
        </n-space>
        <n-space>
          <n-button @click="() => (modeSombre = modeSombre ? null : true)"
            ><template #icon
              ><n-icon>
                <WeatherMoon20Regular v-if="modeSombre" />
                <WeatherSunny20Regular v-else /> </n-icon></template
          ></n-button>
          <n-dropdown :options="userOptions" :on-select="userOptionsOnSelect">
            <n-button>
              <template #icon>
                <n-icon>
                  <Person20Regular />
                </n-icon>
              </template>
              Admin
            </n-button>
          </n-dropdown>
        </n-space>
      </n-space>
    </n-layout-header>
    <n-layout-content content-style="padding:20px">
      <slot />
    </n-layout-content>
  </n-layout>
</template>

<script setup>
import {
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NSpace,
  NDropdown,
  NButton,
  NIcon,
  NImage,
  NMenu,
} from "naive-ui";
import { NuxtLink } from "#components";
import Person20Regular from "@vicons/fluent/Person20Regular";
import Edit20Regular from "@vicons/fluent/Edit20Regular";
import DoorArrowLeft20Regular from "@vicons/fluent/DoorArrowLeft20Regular";
import WeatherMoon20Regular from "@vicons/fluent/WeatherMoon20Regular";
import WeatherSunny20Regular from "@vicons/fluent/WeatherSunny20Regular";

const user = useState("user"),
  modeSombre = useState("mode_sombre"),
  menuOptions = [
    {
      key: "admin",
      label: () =>
        h(
          NuxtLink,
          {
            to: "/emplois",
          },
          { default: () => "Listes des Emplois" }
        ),
    },
    {
      key: "salles",
      label: () =>
        h(
          NuxtLink,
          {
            to: "/salles",
          },
          { default: () => "Occupation des salles" }
        ),
    },
  ],
  userOptions = [
    {
      label: "Profile",
      key: "profile",
      icon: () => h(NIcon, () => h(Edit20Regular)),
    },
    {
      label: "Déconnecter",
      key: "logout",
      icon: () => h(NIcon, () => h(DoorArrowLeft20Regular)),
    },
  ],
  userOptionsOnSelect = async (key) => {
    switch (key) {
      case "profile":
        return navigateTo("/profile");
      case "logout":
        await $fetch("https://api.inicontent.com/emplois_du_temps/auth/logout");
        user.value = null;
        return navigateTo("/");
      default:
        break;
    }
  };
</script>

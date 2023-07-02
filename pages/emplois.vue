<template>
  <n-card>
    <template #header>Emplois du temps</template>
    <template #header-extra>
      <NuxtLink to="/emploi/nouveau">
        <n-button>
          <template #icon>
            <n-icon><Add20Regular /></n-icon>
          </template>
          Ajouter
        </n-button>
      </NuxtLink>
    </template>
    <div v-if="emplois && emplois?.length > 0">
      <n-grid
        cols="4"
        x-gap="12px"
        y-gap="12px"
        style="margin-top: 25px"
        :item-responsive="true"
      >
        <n-gi v-for="emploi in emplois">
          <n-card>
            <template #header>{{ emploi.filière }}</template>
            <template #header-extra>
              <n-space vertical>
                <NuxtLink :to="`/emploi/${emploi.id}`">
                  <n-button quaternary circle type="primary">
                    <template #icon>
                      <n-icon>
                        <ArrowRight20Filled />
                      </n-icon>
                    </template>
                  </n-button>
                </NuxtLink>
                <n-button
                  :loading="RemoveEmploiLoading"
                  @click="() => RemoveEmploi(emploi.id)"
                  quaternary
                  circle
                  type="error"
                >
                  <template #icon>
                    <n-icon>
                      <Delete20Regular />
                    </n-icon>
                  </template>
                </n-button>
              </n-space>
            </template>
            <n-text
              >{{
                `${String(new Date(emploi.date[0]).getMonth() + 1).padStart(
                  2,
                  "0"
                )}/${String(new Date(emploi.date[0]).getFullYear()).substring(
                  2
                )}`
              }}
              -
              {{
                `${String(new Date(emploi.date[1]).getMonth() + 1).padStart(
                  2,
                  "0"
                )}/${String(new Date(emploi.date[1]).getFullYear()).substring(
                  2
                )}`
              }}
            </n-text>
          </n-card>
        </n-gi>
      </n-grid>
      <n-space v-if="totalPages > 1" style="margin-top: 15px" justify="end">
        <n-pagination v-model:page="page" :page-count="totalPages"
      /></n-space>
    </div>
    <n-empty v-else />
  </n-card>
</template>

<script setup>
import {
  NCard,
  NButton,
  NIcon,
  NEmpty,
  NPagination,
  NSpace,
  NGrid,
  NGi,
  NText,
  useMessage,
} from "naive-ui";
import Add20Regular from "@vicons/fluent/Add20Regular";
import ArrowRight20Filled from "@vicons/fluent/ArrowRight20Filled";
import Delete20Regular from "@vicons/fluent/Delete20Regular";
useHead({
  title: "Liste des emplois",
});

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const message = useMessage(),
  page = ref(1),
  totalPages = ref(1),
  { data: emplois } = await useFetch(
    "https://api.inicontent.com/emplois_du_temps/emploi",
    {
      query: {
        _options: JSON.stringify({
          page: page.value,
          per_page: 15,
        }),
      },
      transform: (res) => {
        totalPages.value = res.options.total_pages;
        return res.result;
      },
    }
  ),
  RemoveEmploiLoading = ref(false),
  RemoveEmploi = async (id) => {
    const res = await $fetch(
      `https://api.inicontent.com/emplois_du_temps/emploi/${id}!`, // "!" est pour supprimer l'emploi de façon définitive sans passer à la corbeille
      {
        method: "DELETE",
      }
    );
    if (res.result) message.success(res.message.fr);
    else message.error(res.message.fr);
  };
</script>

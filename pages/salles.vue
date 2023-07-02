<template>
  <n-card>
    <template #header>Occupation des salles</template>
    <template #header-extra
      ><NuxtLink to="/profile#salles"
        ><n-button>Ajouter/Supprimer</n-button></NuxtLink
      ></template
    >
    <n-space justify="center" align="center">
      <n-input-group>
        <n-select
          style="width: 25%"
          v-model:value="jour"
          placeholder="Jour"
          :options="[
            {
              label: 'Lundi',
              value: 'Lundi',
            },
            {
              label: 'Mardi',
              value: 'Mardi',
            },
            {
              label: 'Mercredi',
              value: 'Mercredi',
            },
            { label: 'Jeudi', value: 'Jeudi' },
            { label: 'Vendredi', value: 'Vendredi' },
            { label: 'Samedi', value: 'Samedi' },
          ]"
        />
        <n-select
          style="width: 25%"
          v-model:value="heure"
          placeholder="Heure"
          :options="[
            { label: '8h00 - 10h00', value: '8h00 - 10h00' },
            { label: '10h00 - 12h00', value: '10h00 - 12h00' },
            { label: '12h00 - 14h00', value: '12h00 - 14h00' },
            { label: '14h00 - 16h00', value: '14h00 - 16h00' },
            { label: '16h00 - 18h00', value: '16h00 - 18h00' },
          ]"
        />
        <n-date-picker
          type="daterange"
          placeholder="Date"
          v-model:value="date"
        />
        <n-button
          :type="jour && heure && date?.length > 0 ? 'primary' : 'default'"
          icon-placement="right"
          :loading="sallesLoading"
          @click="ChercherSalles"
        >
          <template #icon>
            <n-icon>
              <ArrowRight20Filled />
            </n-icon>
          </template>
          Chercher
        </n-button>
      </n-input-group>
    </n-space>
    <n-grid
      v-if="!sallesLoading"
      cols="4"
      x-gap="12px"
      y-gap="12px"
      style="margin-top: 25px"
      :item-responsive="true"
    >
      <n-gi v-if="plannings" v-for="planning in plannings">
        <n-card>
          <template #header>{{ planning.salle }}</template>
          <template #header-extra>
            <n-icon color="#FF0000">
              <Circle20Filled />
            </n-icon>
          </template>
          <n-space vertical>
            <n-text>
              {{ planning.module }}
            </n-text>
            <n-text>
              {{ planning.enseignant }}
            </n-text>
          </n-space>
        </n-card>
      </n-gi>
      <n-gi
        v-for="salle in plannings.length === 0
          ? user.salles
          : user.salles.filter(
              (salle) => !plannings.find((planning) => planning.salle === salle)
            )"
      >
        <n-card style="height: 100%">
          <template #header>{{ salle }}</template>
          <template #header-extra>
            <n-icon color="#008000">
              <Circle20Filled />
            </n-icon>
          </template>
        </n-card>
      </n-gi>
    </n-grid>
  </n-card>
</template>

<script setup>
import {
  NCard,
  NButton,
  NSpace,
  NIcon,
  NDatePicker,
  NInputGroup,
  NSelect,
  NGrid,
  NGi,
  NText,
  useMessage,
} from "naive-ui";
import ArrowRight20Filled from "@vicons/fluent/ArrowRight20Filled";
import Circle20Filled from "@vicons/fluent/Circle20Filled";

useHead({
  title: "Occupation des salles",
});

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const user = useState("user"),
  message = useMessage(),
  date = ref(),
  heure = ref(),
  jour = ref(),
  sallesLoading = ref(false),
  plannings = ref([]),
  ChercherSalles = async () => {
    if (!date.value || date.value.length === 0 || !heure.value) {
      message.error("Prière de selectionner la date et le jour et l'heure.");
      return;
    }
    plannings.value = []; // Vider La Liste des Salles
    sallesLoading.value = true; // Afficher l'indicateur de téléchargement
    const { data: listeDesPlannings } = await useFetch(
      "https://api.inicontent.com/emplois_du_temps/emploi",
      {
        params: {
          _where: JSON.stringify([
            ["date.0", "<=", date.value[0]],
            ["date.1", ">=", date.value[1]],
          ]),
          _options: JSON.stringify({ per_page: 1000 }),
        },
        transform: (response) =>
          response.result?.map((emploi) =>
            emploi.planning.find(
              (planning) =>
                planning.jour === jour.value && planning.heure === heure.value
            )
          ),
      }
    ); // Avoir une liste des emplois qui ont la même date,heure,jour choisie
    plannings.value = listeDesPlannings.value ?? [];
    sallesLoading.value = false;
  };
</script>

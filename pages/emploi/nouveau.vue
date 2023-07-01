<template>
  <n-drawer v-model:show="AfficherModal" :width="502">
    <n-drawer-content closable>
      <template #header>
        Séance du {{ SéanceActuelle.jour }} {{ SéanceActuelle.heure }}
      </template>
      <template #footer>
        <n-button
          v-if="
            Emploi.planning.find(
              (planning) =>
                planning.jour === SéanceActuelle.jour &&
                planning.heure === SéanceActuelle.heure
            )
          "
          round
          icon-placement="right"
          @click="
            () => (
              (Emploi.planning[
                Emploi.planning.findIndex(
                  (planning) =>
                    planning.jour === SéanceActuelle.jour &&
                    planning.heure === SéanceActuelle.heure
                )
              ] = SéanceActuelle),
              (AfficherModal = false),
              (SéanceActuelle = {
                jour: null,
                heure: null,
                enseignant: null,
                module: null,
                semaines: [],
                types: [],
                charge_horaire: {},
                salle: null,
              })
            )
          "
        >
          <template #icon>
            <n-icon>
              <SaveArrowRight20Regular />
            </n-icon>
          </template>
          Sauvgarder</n-button
        >
        <n-button
          v-else
          round
          icon-placement="right"
          @click="
            () => (
              Emploi.planning.push(SéanceActuelle),
              (AfficherModal = false),
              (SéanceActuelle = {
                jour: null,
                heure: null,
                enseignant: null,
                module: null,
                semaines: [],
                types: [],
                charge_horaire: {},
                salle: null,
              })
            )
          "
        >
          <template #icon>
            <n-icon>
              <Add20Regular />
            </n-icon>
          </template>
          Ajouter à l'emploi</n-button
        >
      </template>
      <n-form ref="formRef" :model="SéanceActuelle" :rules="rules">
        <n-form-item path="module" label="Nom du Module">
          <n-select
            v-model:value="SéanceActuelle.module"
            :options="
              user?.modules.map((module) => ({
                label: module,
                value: module,
              })) || []
            "
            tag
            @update:value="(label) => AjouterUnModule(label)"
            filterable
            placeholder="Nom du Module"
          />
        </n-form-item>
        <n-form-item path="types" label="Type des cours">
          <n-checkbox-group v-model:value="SéanceActuelle.types">
            <n-space item-style="display:flex">
              <n-checkbox value="tp" label="TP" />
              <n-checkbox value="td" label="TD" />
              <n-checkbox value="cm" label="CM" />
            </n-space>
          </n-checkbox-group>
        </n-form-item>
        <n-form-item
          v-if="SéanceActuelle.types.length > 0"
          path="charge_horaire"
          label="Charge Horaire"
        >
          <n-space>
            <n-input-number
              v-for="_type in SéanceActuelle.types"
              v-model:value="SéanceActuelle.charge_horaire[_type]"
              :placeholder="`Charge Horaire des ${_type.toUpperCase()}s`"
              :show-button="false"
              @keydown.enter.prevent
            >
              <template #suffix>Hr ({{ _type.toUpperCase() }})</template>
            </n-input-number>
          </n-space>
        </n-form-item>

        <n-form-item path="enseignant" label="Nom du Enseignant(e)">
          <n-select
            v-model:value="SéanceActuelle.enseignant"
            :options="
              user?.enseignants.map((enseignant) => ({
                label: enseignant,
                value: enseignant,
              })) || []
            "
            tag
            @update:value="(label) => AjouterUnEnseignant(label)"
            filterable
            placeholder="Nom de Enseignant(e)"
          />
        </n-form-item>
        <n-form-item path="semaines" label="Semaines">
          <n-input
            pair
            v-model:value="SéanceActuelle.semaines"
            @keydown.enter.prevent
            separator="-"
            :placeholder="[1, 16]"
          />
        </n-form-item>
        <n-form-item path="salle" label="Salle">
          <n-select
            v-model:value="SéanceActuelle.salle"
            :options="SallesDispo"
            tag
            :loading="SallesDispoLoading"
            @update-show="(show) => show && RécupérerLesSallesDispo()"
            @update:value="AjouterUneSalle"
            filterable
            placeholder="La Salle"
          />
        </n-form-item>
      </n-form>
    </n-drawer-content>
  </n-drawer>
  <n-list bordered show-divider>
    <template #header>
      <n-space align="center" justify="space-between">
        <n-thing>
          <template #header> Emploi du Temps </template>
          <template #description>
            <n-select
              v-model:value="Emploi.filière"
              :options="
                user?.filières.map((filière) => ({
                  label: filière,
                  value: filière,
                })) || []
              "
              tag
              @update:value="(label) => AjouterUneFilière(label)"
              filterable
              placeholder="Nom de Filière"
            />
          </template>
          <n-space align="center">
            <n-date-picker
              ref="EmploiDateRef"
              type="daterange"
              v-model:value="Emploi.date"
            />
            <n-text v-if="Emploi.date"
              >({{ new Date(Emploi.date[1]).getFullYear() - 1 }}/{{
                new Date(Emploi.date[1]).getFullYear()
              }})</n-text
            >
          </n-space>
        </n-thing>
        <n-button
          icon-placement="right"
          @click="SauvgarderEmploi"
          :loading="SauvgarderEmploiLoading"
          ><template #icon
            ><n-icon> <SaveArrowRight20Regular /> </n-icon
          ></template>
          Sauvegarder</n-button
        >
      </n-space>
    </template>
    <n-list-item>
      <template #prefix>
        <n-text></n-text>
      </template>
      <n-grid :cols="5" item-responsive style="text-align: center">
        <n-gi><n-text>8h00 - 10h00</n-text></n-gi>
        <n-gi><n-text>10h00 - 12h00</n-text></n-gi>
        <n-gi><n-text>12h00 - 14h00</n-text></n-gi>
        <n-gi><n-text>14h00 - 16h00</n-text></n-gi>
        <n-gi><n-text>16h00 - 18h00</n-text></n-gi>
      </n-grid>
    </n-list-item>
    <n-list-item
      v-for="Jour in [
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
      ]"
    >
      <template #prefix>
        <n-text style="writing-mode: vertical-lr">{{ Jour }}</n-text>
      </template>
      <n-grid :cols="5" item-responsive style="text-align: center">
        <n-gi
          style="min-height: 150px"
          v-for="Heure in [
            '8h00 - 10h00',
            '10h00 - 12h00',
            '12h00 - 14h00',
            '14h00 - 16h00',
            '16h00 - 18h00',
          ]"
        >
          <div
            class="planning"
            v-if="
              Emploi.planning.find(
                (planning) => planning.jour === Jour && planning.heure === Heure
              )
            "
          >
            <n-icon
              @click="
                () => (
                  (SéanceActuelle = Emploi.planning.find(
                    (planning) =>
                      planning.jour === Jour && planning.heure === Heure
                  )),
                  (AfficherModal = true)
                )
              "
              style="width: 100%; height: 100%; display: flex; cursor: pointer"
              size="50"
            >
              <Edit20Regular style="margin: auto" />
            </n-icon>
            <n-list class="seance" :show-divider="false">
              <template #header>
                <n-text>{{
                  Emploi.planning.find(
                    (planning) =>
                      planning.jour === Jour && planning.heure === Heure
                  ).module
                }}</n-text>
              </template>
              <n-list-item>
                <n-text>{{
                  Emploi.planning
                    .find(
                      (planning) =>
                        planning.jour === Jour && planning.heure === Heure
                    )
                    .types.map((_type) => _type.toUpperCase())
                    .join("/")
                }}</n-text>
              </n-list-item>
              <n-list-item>
                <n-text>{{
                  Emploi.planning.find(
                    (planning) =>
                      planning.jour === Jour && planning.heure === Heure
                  ).enseignant
                }}</n-text>
              </n-list-item>
              <n-list-item>
                <n-text
                  >Charge Horaire ({{
                    Emploi.planning
                      ?.find(
                        (planning) =>
                          planning.jour === Jour && planning.heure === Heure
                      )
                      ?.types.map(
                        (_type) =>
                          Emploi.planning.find(
                            (planning) =>
                              planning.jour === Jour && planning.heure === Heure
                          ).charge_horaire[_type]
                      )
                      .join("h/")
                  }}h)</n-text
                >
              </n-list-item>
              <n-list-item>
                <n-text
                  >Semaines S{{
                    Emploi.planning
                      .find(
                        (planning) =>
                          planning.jour === Jour && planning.heure === Heure
                      )
                      .semaines.join("-S")
                  }}</n-text
                >
              </n-list-item>
              <n-list-item>
                <n-text>{{
                  Emploi.planning.find(
                    (planning) =>
                      planning.jour === Jour && planning.heure === Heure
                  ).salle
                }}</n-text>
              </n-list-item>
            </n-list>
          </div>
          <n-icon
            v-else
            @click="
              () =>
                Emploi.date?.length > 0
                  ? ((SéanceActuelle = {
                      jour: Jour,
                      heure: Heure,
                      enseignant: null,
                      module: null,
                      semaines: [],
                      types: [],
                      charge_horaire: {},
                      salle: null,
                    }),
                    (AfficherModal = true))
                  : (message.error(
                      'Prière de selectionner la date du l\'emploi.'
                    ), // A fin d'avoir une liste des salles disponible durant la même période
                    EmploiDateRef?.focus())
            "
            style="width: 100%; height: 100%; display: flex; cursor: pointer"
            size="50"
          >
            <Add20Regular style="margin: auto" />
          </n-icon>
        </n-gi>
      </n-grid>
    </n-list-item>
  </n-list>
</template>

<script setup>
import {
  NList,
  NListItem,
  NGrid,
  NGi,
  NIcon,
  NText,
  NButton,
  NThing,
  NSpace,
  NDatePicker,
  NInput,
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NInputNumber,
  NSelect,
  NCheckboxGroup,
  NCheckbox,
  useMessage,
} from "naive-ui";
import Add20Regular from "@vicons/fluent/Add20Regular";
import SaveArrowRight20Regular from "@vicons/fluent/SaveArrowRight20Regular";
import Edit20Regular from "@vicons/fluent/Edit20Regular";

const route = useRoute();

useHead({
  title: `Ajouter un emploi`,
});

definePageMeta({
  layout: "admin",
  middleware: "admin",
});

const user = useState("user"),
  Emploi = reactive({ planning: [] }),
  EmploiDateRef = ref(), // Pour cibler le champ en cas d'erreur
  AfficherModal = ref(false),
  SéanceActuelle = ref({
    heure: null,
    jour: null,
    module: null,
    enseignant: null,
    semaines: [],
    types: [],
    charge_horaire: {},
    salle: null,
  }),
  formRef = ref(),
  rules = {},
  SallesDispo = ref([]),
  SallesDispoLoading = ref(false),
  message = useMessage(), // Pour aficher des notification en cas d'erreur ou success
  AjouterUneSalle = async (label) => {
    if (!user.value.salles.includes(label)) {
      SallesDispoLoading.value = true;
      user.value.salles = [...user.value.salles, label];
      SallesDispo.value.push(label);
      await $fetch(
        `https://api.inicontent.com/emplois_du_temps/user/${user.value.id}`,
        {
          method: "PUT",
          body: {
            salles: user.value.salles,
          },
        }
      );
      SallesDispoLoading.value = false;
    }
    return {
      label: label,
      key: label,
    };
  },
  RécupérerLesSallesDispo = async () => {
    SallesDispo.value = []; // Vider La Liste des Salles
    SallesDispoLoading.value = true; // Afficher l'indicateur de téléchargement
    const { data: SallesOccupées } = await useFetch(
      "https://api.inicontent.com/emplois_du_temps/emploi",
      {
        params: {
          _where: JSON.stringify([
            ["date.0", ">=", Emploi?.date[0]],
            ["date.1", "<=", Emploi?.date[1]],
          ]),
          _options: JSON.stringify({ per_page: 1000 }),
        },
        transform: (response) =>
          response.result?.map(
            (emploi) =>
              emploi.planning.find(
                (planning) =>
                  planning.jour === SéanceActuelle.value.jour &&
                  planning.heure === SéanceActuelle.value.heure
              )?.salle
          ),
      }
    ); // Avoir une liste des emplois qui ont la même duré que l'emploi actuel
    SallesDispoLoading.value = false;
    SallesDispo.value = SallesOccupées.value
      ? user.value.salles
          .filter((salle) => !SallesOccupées.value.includes(salle))
          .map((salle) => ({ label: salle, value: salle }))
      : user.value.salles.map((salle) => ({ label: salle, value: salle }));
  },
  AjouterUneFilière = async (label) => {
    if (!user.value?.filières?.includes(label)) {
      user.value.filières = [...(user.value?.filières || []), label];
      await $fetch(
        `https://api.inicontent.com/emplois_du_temps/user/${user.value.id}`,
        {
          method: "PUT",
          body: {
            filières: user.value.filières,
          },
        }
      );
    }

    return {
      label: label,
      key: label,
    };
  },
  AjouterUnModule = async (label) => {
    if (!user.value?.modules?.includes(label)) {
      user.value.modules = [...(user.value?.modules || []), label];
      await $fetch(
        `https://api.inicontent.com/emplois_du_temps/user/${user.value.id}`,
        {
          method: "PUT",
          body: {
            modules: user.value.modules,
          },
        }
      );
    }

    return {
      label: label,
      key: label,
    };
  },
  AjouterUnEnseignant = async (label) => {
    if (!user.value?.enseignants?.includes(label)) {
      user.value.enseignants = [...(user.value?.enseignants || []), label];
      await $fetch(
        `https://api.inicontent.com/emplois_du_temps/user/${user.value.id}`,
        {
          method: "PUT",
          body: {
            enseignants: user.value.enseignants,
          },
        }
      );
    }

    return {
      label: label,
      key: label,
    };
  },
  SauvgarderEmploiLoading = ref(false),
  SauvgarderEmploi = async () => {
    SauvgarderEmploiLoading.value = true;
    const res = await $fetch(
      `https://api.inicontent.com/emplois_du_temps/emploi`,
      {
        method: "POST",
        body: Emploi.value,
      }
    );
    SauvgarderEmploiLoading.value = false;

    if (res.result && res.result.id) {
      message.success(res.message.fr);
      await navigateTo(`/emploi/${res.result.id}`);
    } else message.error(res.message.fr);
  };
</script>

<style>
.n-list.seance {
  text-align: left;
}

.n-list.seance .n-list__header .n-text {
  font-weight: 800;
}

.n-list.seance .n-list__header,
.n-list.seance .n-list-item {
  padding: 5px !important;
}

.planning {
  height: 100%;
}

.planning .n-icon,
.planning:hover .seance {
  display: none !important;
}

.planning:hover .n-icon {
  display: flex !important;
}
</style>

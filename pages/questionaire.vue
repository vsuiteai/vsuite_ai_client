<script setup lang="ts">
import Advisor_onboarding from "../components/client/questionaire/advisor_onboarding.vue";
import Ceo_onboarding from "../components/client/questionaire/ceo_onboarding.vue";
import type { Component } from "vue";

import { useCurrentUserStore } from "../store/current_user";

const current_client_store = useCurrentUserStore();
const clientController = useClientController();

const current_client = computed(() => {
  return current_client_store.getCurrentUser;
});
const analytics = useAnalyticsController();

const route = useRoute("/questionaire");

definePageMeta({
  layout: "authenticated",
  breadcrumb_top: "",
  breadcrumb_bottom: "",
  middleware: ["authenticated"],
});
route.meta.breadcrumb_bottom = "Questionaire";

type form_types_generics = {
  component: Component;
  label: string;
  questionaire_entry: QuestionaireEntry | null;
};

const form_types = reactive<{
  client_onboarding_form: form_types_generics;
  advisior_onboarding_form: form_types_generics;
}>({
  client_onboarding_form: {
    component: Ceo_onboarding,
    label: "CEO Form",
    questionaire_entry: null,
  },
  advisior_onboarding_form: {
    component: Advisor_onboarding,
    label: "Company Form",
    questionaire_entry: null,
  },
});

type FormTypeTabKey = keyof typeof form_types;

const current_tab = ref<FormTypeTabKey>("client_onboarding_form");

const submissions = ref([]);

const get_current_tab = computed(() => {
  return unref(form_types[current_tab.value].component);
});

const prepare_questionaire = async () => {
  const uid = current_client.value?.client_uid ?? "";

  if (uid === "") {
    return;
  }

  const res = await clientController.get_client_submissions(uid);
  // console.log(res);
  submissions.value = res?.submissions ? res?.submissions : [];

  if (submissions.value.length > 0) {
    (submissions.value ?? []).forEach((el: QuestionaireEntry) => {
      if ((el?.form_type ?? "") === "advisior_onboarding_form") {
        form_types.advisior_onboarding_form.questionaire_entry = el;
      }
      if ((el?.form_type ?? "") === "client_onboarding_form") {
        form_types.client_onboarding_form.questionaire_entry = el;
      }
    });
  }
};

watchEffect(async () => {
  if (current_client.value) {
    await prepare_questionaire();
  }
});
</script>

<template>
  <div
    class="w-full flex flex-col gap-[4px] bg-[#ffffff] border-[1px] border-[#E5E7EB] rounded-t-[12px] py-[16px] px-[20px]"
  >
    <div class="w-full flex justify-between items-center">
      <span class="font-[500] text-[18px]/[24px] text-[#101840]">
        Questionaire
      </span>
    </div>
  </div>

  <div class="flex flex-col item-start">
    <div class="flex item-start gap-[4px] border-x-[1px] border-[#EDEFF5]">
      <template v-for="(value, key, index) of form_types" :key="key">
        <button
          @click="current_tab = key"
          :class="{
            'font-[500] text-[14px]/[20px] text-[#E10600]  border-[1px] border-b-[1px] border-[#EDEFF5] bg-[#F9CDCC3D]':
              current_tab === key,
            'font-[300] text-[14px]/[20px] text-[#808080]': current_tab !== key,
          }"
          class="flex items-center py-[16px] px-[20px] gap-[8px]"
        >
          {{ value.label }}
        </button>
      </template>
    </div>
    <div
      class="flex flex-col items-start py-[24px] px-[32px] border-[1px] border-[#E5E7EB]"
    >
      <template v-if="form_types[current_tab].questionaire_entry">
        <component
          :is="get_current_tab"
          :questionaire_entry="form_types[current_tab].questionaire_entry"
          :current_client="current_client"
        ></component>
      </template>
    </div>
  </div>
</template>

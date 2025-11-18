<script setup lang="ts">
import General from "~/components/client/settings/general.vue";
import Security from "~/components/client/settings/security.vue";

const route = useRoute("/settings");

definePageMeta({
  layout: "authenticated",
  breadcrumb_top: "",
  breadcrumb_bottom: "",
  middleware: ["authenticated"],
});
route.meta.breadcrumb_bottom = "Settings";

const settings_tabs = {
  general_setting: { label: "General", component: General },
  billing_setting: {
    label: "Security",
    component: Security,
  },
} as const; // makes keys literal types

type ClientTabKey = keyof typeof settings_tabs;

const clientController = useClientController();

const current_tab = ref<ClientTabKey>("general_setting");

const get_current_tab = computed(() => {
  // return settings_tabs[current_tab.value].component;
  return unref(settings_tabs[current_tab.value].component);
});
</script>

<template>
  <div
    class="w-full flex flex-col gap-[4px] bg-[#ffffff] border-[1px] border-[#E5E7EB] rounded-t-[12px] py-[16px] px-[20px]"
  >
    <div class="w-full flex justify-between items-center">
      <span class="font-[500] text-[18px]/[24px] text-[#101840]">
        Settings
      </span>
    </div>
  </div>

  <div class="flex flex-col item-start">
    <div class="flex item-start gap-[4px] border-x-[1px] border-[#EDEFF5]">
      <template v-for="(value, key, index) of settings_tabs" :key="key">
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
      <component :is="get_current_tab"></component>
    </div>
  </div>
</template>

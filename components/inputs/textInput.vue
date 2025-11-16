<script setup lang="ts">
import { useField } from "vee-validate";
const props = defineProps({
  name: {
    required: true,
    type: String,
  },
  label: {
    required: true,
    type: String,
  },
  error_color_class: {
    required: true,
    type: String,
    default: "text-[#EAEAEA]",
  },
  in_used: {
    required: false,
    type: String,
    default: "signin_signup",
  },
});

const { value, errorMessage } = useField(() => props.name);

const input_class = computed(() => {
  if (props.in_used === "signin_signup") {
    return {
      "w-full": true,
      "bg-[#1C1C1E]": true,
      "border-[1px]": true,
      "border-[#4A1C1C]": true,
      "rounded-[8px]": true,
      "py-[8px]": true,
      "px-[16px]": true,
      "text-[#999999]": true,
      "text-[14px]": true,
      "outline-none": true,
    };
  } else {
    return {
      "bg-gray-50": true,
      border: true,
      "border-[#F1F6FA]": true,
      "text-[#667085]": true,
      "text-[14px]": true,
      "rounded-[4px]": true,
      "focus:ring-gray-600": true,
      "focus:border-gray-600": true,
      block: true,
      "w-full": true,
      "min-h-[50px]": true,
      "px-[16px]": true,
      "py-[8px]": true,
    };
  }
});
</script>

<template>
  <div class="flex flex-col gap-[8px] w-full">
    <label
      class="text-[14px]"
      :class="{
        'text-[#EAEAEA] font-[400] ': in_used === 'signin_signup',
        'text-[#4B5563] font-[500]': in_used !== 'signin_signup',
      }"
    >
      {{ props.label }}
    </label>

    <div class="flex flex-col gap-[4px] w-full">
      <input v-model="value" type="text" :class="input_class" />
      <span :class="error_color_class" class="font-[400] text-[12px] self-end">
        {{ errorMessage }}
      </span>
    </div>
  </div>
</template>

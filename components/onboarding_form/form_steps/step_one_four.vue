<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import * as yup from "yup";
import { useOnboardClientFormSectionOneFourStore } from "~/store/client_onboarding_form/useOnboardClientFormSectionOneFourStore";

const emits = defineEmits(["is_valid"]);

const onboardClientFormSectionOneFourStore =
  useOnboardClientFormSectionOneFourStore();

console.log(
  onboardClientFormSectionOneFourStore.step_one_four_business_reflection
);

const schema = toTypedSchema(
  yup.object({
    step_one_four_business_reflection: yup
      .string()
      .required("Please enter your answer")
      .label(
        onboardClientFormSectionOneFourStore.step_one_four_business_reflection
          .question_label
      ),
    step_one_four_business_challenge_faced_today: yup
      .string()
      .required("Please enter your answer")
      .label(
        onboardClientFormSectionOneFourStore
          .step_one_four_business_challenge_faced_today.question_label
      ),

    step_one_four_possible_new_biz_ventures: yup
      .string()
      .required("Please enter your answer")
      .label(
        onboardClientFormSectionOneFourStore
          .step_one_four_possible_new_biz_ventures.question_label
      ),
  })
);

const { errors, meta, values, defineField } = useForm({
  validationSchema: schema,
  validateOnMount: true,
  initialValues: {
    step_one_four_business_reflection:
      onboardClientFormSectionOneFourStore.get_step_one_four_business_reflection,
    step_one_four_business_challenge_faced_today:
      onboardClientFormSectionOneFourStore.get_step_one_four_business_challenge_faced_today,
    step_one_four_possible_new_biz_ventures:
      onboardClientFormSectionOneFourStore.get_step_one_four_possible_new_biz_ventures,
  },
});

const [
  step_one_four_business_reflection,
  step_one_four_business_reflection_attr,
] = defineField("step_one_four_business_reflection");
const [
  step_one_four_business_challenge_faced_today,
  step_one_four_business_challenge_faced_today_attr,
] = defineField("step_one_four_business_challenge_faced_today");
const [
  step_one_four_possible_new_biz_ventures,
  step_one_four_possible_new_biz_ventures_attr,
] = defineField("step_one_four_possible_new_biz_ventures");

const is_step_one_four_business_reflection_valid = computed(
  () => step_one_four_business_reflection.value && meta.value.valid
);
const is_step_one_four_business_challenge_faced_today_valid = computed(
  () => step_one_four_business_challenge_faced_today.value && meta.value.valid
);
const is_step_one_four_possible_new_biz_ventures_valid = computed(
  () => step_one_four_possible_new_biz_ventures.value && meta.value.valid
);

const isCurrentStepCompleted = computed(
  () =>
    is_step_one_four_business_reflection_valid.value &&
    is_step_one_four_business_challenge_faced_today_valid.value &&
    is_step_one_four_possible_new_biz_ventures_valid.value
);

watch(isCurrentStepCompleted, (newVal) => {
  if (newVal) emits("is_valid");
});

const syncStoreValue = <T>(
  localRef: Ref<T | undefined>,
  storeGetter: () => T,
  storeSetter: (value: T) => void
) => {
  if (typeof localRef === "undefined") return;

  watch(localRef, (newVal) => {
    if (newVal) storeSetter(newVal);
  });

  watch(storeGetter, (newVal) => {
    if (newVal !== localRef.value) localRef.value = newVal;
  });
};

onMounted(() => {
  // Sync fields with store

  syncStoreValue(
    step_one_four_business_challenge_faced_today,
    () =>
      onboardClientFormSectionOneFourStore.step_one_four_business_reflection
        .question_answer,
    onboardClientFormSectionOneFourStore.update_step_one_four_business_reflection
  );
  syncStoreValue(
    step_one_four_business_challenge_faced_today,
    () =>
      onboardClientFormSectionOneFourStore
        .step_one_four_business_challenge_faced_today.question_answer,
    onboardClientFormSectionOneFourStore.update_step_one_four_business_challenge_faced_today
  );
  syncStoreValue(
    step_one_four_possible_new_biz_ventures,
    () =>
      onboardClientFormSectionOneFourStore
        .step_one_four_possible_new_biz_ventures.question_answer,
    onboardClientFormSectionOneFourStore.update_step_one_four_possible_new_biz_ventures
  );
});
</script>

<template>
  <section class="w-full h-full">
    <div class="flex flex-col gap-y-[40px] w-full">
      <!-- Current Form Step Header Begins -->
      <div class="hidden lg:flex flex-col gap-y-[10px]">
        <span class="text-[20px] font-[500]">Market Awareness</span>
        <span class="text-[16px] font-[400] text-[#222221]"> </span>
      </div>

      <div
        class="lg:hidden flex w-full h-full px-[25px] lg:px-[50px] flex-col gap-[10px] items-center justify-center"
      >
        <span class="font-[700] text-[20px] text-center">
          Market Awareness
        </span>
        <span
          class="font-[400] text-[14px] text-center tracking-[0.02em] w-[80%]"
        >
        </span>
      </div>
      <!-- Current Form Step Header Ends -->

      <!-- Current Form Step Body Begins -->
      <div class="flex w-full px-[25px] lg:px-[0px] flex-col gap-y-[40px]">
        <div class="relative z-0 w-full flex flex-col">
          <label
            for="step_one_four_business_reflection"
            class="text-[18px] font-[600] text-black mb-[10px] lg:mb-[unset]"
            >{{
              onboardClientFormSectionOneFourStore
                .step_one_four_business_reflection.question_label
            }}</label
          >

          <div class="relative">
            <textarea
              v-model="step_one_four_business_reflection"
              v-bind="step_one_four_business_reflection_attr"
              id="step_one_four_business_reflection"
              rows="4"
              class="block w-full text-black/[.5] border-[1px] lg:px-[24px] lg:py-[24px] lg:text-[16px] font-[400] lg:bg-transparent lg:border-black/[0.2] appearance-none focus:outline-none focus:ring-0 focus:border-black py-[18px] px-[14px] text-[14px] bg-white border-black"
            ></textarea>
          </div>
        </div>

        <div class="relative z-0 w-full flex flex-col">
          <label
            for="step_one_four_business_challenge_faced_today"
            class="text-[18px] font-[600] text-black mb-[10px] lg:mb-[unset]"
            >{{
              onboardClientFormSectionOneFourStore
                .step_one_four_business_challenge_faced_today.question_label
            }}</label
          >

          <div class="relative">
            <textarea
              v-model="step_one_four_business_challenge_faced_today"
              v-bind="step_one_four_business_challenge_faced_today_attr"
              id="step_one_four_business_challenge_faced_today"
              rows="4"
              class="block w-full text-black/[.5] border-[1px] lg:px-[24px] lg:py-[24px] lg:text-[16px] font-[400] lg:bg-transparent lg:border-black/[0.2] appearance-none focus:outline-none focus:ring-0 focus:border-black py-[18px] px-[14px] text-[14px] bg-white border-black"
            ></textarea>
          </div>
        </div>

        <div class="relative z-0 w-full flex flex-col">
          <label
            for="step_one_four_possible_new_biz_ventures"
            class="text-[18px] font-[600] text-black mb-[10px] lg:mb-[unset]"
            >{{
              onboardClientFormSectionOneFourStore
                .step_one_four_possible_new_biz_ventures.question_label
            }}</label
          >

          <div class="relative">
            <textarea
              v-model="step_one_four_possible_new_biz_ventures"
              v-bind="step_one_four_possible_new_biz_ventures_attr"
              id="step_one_four_possible_new_biz_ventures"
              rows="4"
              class="block w-full text-black/[.5] border-[1px] lg:px-[24px] lg:py-[24px] lg:text-[16px] font-[400] lg:bg-transparent lg:border-black/[0.2] appearance-none focus:outline-none focus:ring-0 focus:border-black py-[18px] px-[14px] text-[14px] bg-white border-black"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
input[type="number"].as_text::-webkit-inner-spin-button,
input[type="number"].as_text::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* For Firefox */
input[type="number"].as_text {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>

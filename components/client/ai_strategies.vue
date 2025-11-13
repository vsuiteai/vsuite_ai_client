<script setup lang="ts">
const emits = defineEmits(["prev", "next"]);

const props = defineProps<{
  client_details: ClientDetail | null;
  queries: Query[];
  pagination_firstDoc: Query | null;
  pagination_lastDoc: Query | null;
  can_prev: boolean;
  can_next: boolean;
}>();

const filter_status = ref(null);
const filter_status_opt = ref([
  {
    key: null,
    value: "All Status",
  },
  {
    key: true,
    value: "Completed",
  },
  {
    key: false,
    value: "Failed",
  },
  {
    key: false,
    value: "In progress",
  },
]);

const filter_consultant = ref(null);
const filter_date_from = ref(null);
const filter_date_to = ref(null);
</script>

<template>
  <!-- {{ queries }} -->
  <div
    class="w-full flex flex-col gap-[4px] bg-[#ffffff] border-[1px] border-[#E5E7EB] rounded-t-[12px] py-[16px] px-[20px]"
  >
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center justify-center gap-[8px]">
        <img
          src="/assets/images/industry_coverage.png"
          class="w-[24px] h-[24px]"
          alt=""
        />
        <span class="font-[500] text-[18px]/[24px] text-[#101840]">
          STRATEGIES
        </span>
      </div>
      <div class="flex items-center gap-[8px]">
        <InputsDropdown v-model="filter_status" :options="filter_status_opt" />
      </div>
    </div>
  </div>

  <div
    class="w-full flex flex-col gap-[4px] bg-[#F1F6FA] border-[1px] border-t-0 border-[#E5E7EB] rounded-b-[12px] py-[16px] px-[20px]"
  >
    <div class="flex flex-col items-end gap-[16px] w-full">
      <div class="w-full relative overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead
            class="text-xs text-gray-700 uppercase bg-[#E5E7EB8A] border-b-[1px] border-b-[#E5E7EB] dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th
                scope="col"
                class="px-[20px] py-[16px] font-[500] text-[13px] text-[#1A1A1D] uppercase"
              >
                STRATEGY ID
              </th>
              <th
                scope="col"
                class="px-[20px] py-[16px] font-[500] text-[13px] text-[#1A1A1D] uppercase"
              >
                DATE - TIME STARTED
              </th>
              <th
                scope="col"
                class="px-[20px] py-[16px] font-[500] text-[13px] text-[#1A1A1D] uppercase"
              >
                STATUS
              </th>
              <th
                scope="col"
                class="px-[20px] py-[16px] font-[500] text-[13px] text-[#1A1A1D] uppercase"
              >
                INITIATOR
              </th>
              <th
                scope="col"
                class="px-[20px] py-[16px] font-[500] text-[13px] text-[#1A1A1D] uppercase"
              >
                ACTION
              </th>
            </tr>
          </thead>
          <template v-if="(queries ?? []).length > 0">
            <tbody class="bg-[#F1F6FA]">
              <AiStrategyAiStraListInClient
                v-for="q in queries"
                :key="q?.query_id"
                :query="q"
              />
            </tbody>
          </template>
        </table>
      </div>
      <div class="w-full flex justify-end">
        <!-- pagination -->
        <div class="w-full flex justify-end">
          <!-- pagination -->

          <!-- {{ pagination }} -->
          <nav class="flex gap-[8px]">
            <button
              :disabled="!can_prev"
              @click="emits('prev')"
              class="flex items-center justify-center py-[8px] px-[16px] gap-[10px] bg-[#ffffff] border-[1px] border-[#EFEFEF] rounded-[4px] h-[32px]"
            >
              <span class="font-[500] text-[14px] text-[#000000]"> Prev </span>
            </button>

            <button
              :disabled="!can_next"
              @click="emits('next')"
              class="flex items-center justify-center py-[8px] px-[16px] gap-[10px] bg-[#ffffff] border-[1px] border-[#EFEFEF] rounded-[4px] h-[32px]"
            >
              <span class="font-[500] text-[14px] text-[#000000]"> Next </span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.a_client_in_client_list:hover span {
  opacity: 50%;
}
</style>

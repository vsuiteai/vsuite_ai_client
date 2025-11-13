<script setup lang="ts">
import { IconsInsights } from "#components";
import { parent_routes } from "~/config/parent_routes";
import { useCurrentUserStore } from "../store/current_user";

const route = useRoute("/");

definePageMeta({
  layout: "authenticated",
  breadcrumb_top: "",
  breadcrumb_bottom: "",
  middleware: ["authenticated"],
});

route.meta.breadcrumb_bottom = "Dashboard";

const queryCont = useQueryController();
const analytics = useAnalyticsController();
const current_client_store = useCurrentUserStore();

const dashboard_insight = reactive({
  files_uploaded: {
    label: "Files Uploaded ",
    value: 0,
    image: true,
    icon: false,
    icon_comp: null,

    image_url: new URL("/assets/images/files_general.png", import.meta.url)
      .href,
    icon_color: "#FACC15",
  },
  insight_generated: {
    label: "AI Insights Generated ",
    value: 0,
    image: false,
    image_url: "",
    icon: true,
    icon_comp: IconsInsights,
    icon_color: "#FACC15",
  },
});

const queries = ref<Query[]>([]);
const pagination_num_of_pages = ref<number | null>(null);
const pagination_current_page_num = ref<number>(0);
const pagination_firstDoc = ref<Query | null>(null);
const pagination_lastDoc = ref<Query | null>(null);

const submissions = reactive<{
  client_onboarding_form: null | boolean | QuestionaireEntry;
  advisior_onboarding_form: null | boolean | QuestionaireEntry;
}>({
  client_onboarding_form: null,
  advisior_onboarding_form: null,
});

const intiate_fresh_onboarding = ref(true);
const loading_analytics = ref(true);
const loading_analytics_error = ref(false);
const filter_status = ref(null);
const filter_status_opt = ref([
  {
    key: null,
    value: "All Status",
  },
  {
    key: true,
    value: "Active",
  },
  {
    key: false,
    value: "InActive",
  },
]);

const current_client = computed(() => {
  return current_client_store.getCurrentUser;
});

const intiate_fresh_onboarding__check = computed(() => {
  if (loading_analytics.value) return null;
  if (
    !submissions.advisior_onboarding_form ||
    !submissions.client_onboarding_form ||
    dashboard_insight.files_uploaded.value === 0
  ) {
    route.meta.breadcrumb_bottom = "Client Onboarding";
    return true;
  }

  return false;
});

const parse_get_queries_response = (
  result: clientQueriesResult | null,
  direction: "next" | "prev" | null
) => {
  if (!result) return;

  const { queries: newQueries = [], pagination } = result;

  pagination_num_of_pages.value = pagination.num_of_pages;

  if (newQueries.length) {
    queries.value = newQueries;
    pagination_current_page_num.value =
      direction === "next" || direction === null
        ? pagination_current_page_num.value + 1
        : pagination_current_page_num.value - 1;
  }

  const { firstDoc, lastDoc } = pagination || {};

  // if (direction === "prev") {
  //   pagination_firstDoc.value = firstDoc || null;
  // }

  // if (direction === "next") {
  //   pagination_lastDoc.value = lastDoc || null;
  // }

  pagination_firstDoc.value = firstDoc || null;
  pagination_lastDoc.value = lastDoc || null;
};

const getAnalytics = async () => {
  try {
    if ((current_client.value?.client_uid ?? "") === "")
      throw new Error("Client can not be identified");

    const client_data = await analytics.get_dashboard_startup_analytics(
      current_client.value?.client_uid!
    );

    if (!client_data) throw new Error("Client data can not be fetched");

    dashboard_insight.files_uploaded.value = client_data.total_files;
    dashboard_insight.insight_generated.value = client_data.ai_query_count;

    parse_get_queries_response(client_data.total_queries, null);

    submissions.advisior_onboarding_form =
      client_data.submissions_stats.advisior_onboarding_form;
    submissions.client_onboarding_form =
      client_data.submissions_stats.client_onboarding_form;
  } catch (error) {
    console.log(error);
    loading_analytics_error.value = true;
  }
  loading_analytics.value = false;
  // console.log(client_data);
};

const pagination_can_prev = computed(() => {
  if (!pagination_num_of_pages.value) return false;
  if (pagination_current_page_num.value <= 1) return false;
  return true;
});

const pagination_can_next = computed(() => {
  if (!pagination_num_of_pages.value) return false;
  if (!(pagination_current_page_num.value < pagination_num_of_pages.value))
    return false;
  return true;
});

const next = async () => {
  const client_uid = current_client.value?.client_uid ?? "";
  if (client_uid === "") {
    return;
  }

  if (!pagination_can_next.value) return;

  // console.log("const next = async () => {};");
  // console.log(pagination_lastDoc.value?.id);

  const total_queries =
    (await queryCont.get_queries(
      client_uid,
      null,
      pagination_lastDoc.value?.id
    )) ?? null;

  parse_get_queries_response(total_queries, "next");
};

const prev = async () => {
  const client_uid = current_client.value?.client_uid ?? "";
  if (client_uid === "") {
    return;
  }

  if (!pagination_can_prev.value) return;

  const total_queries =
    (await queryCont.get_queries(
      client_uid,
      pagination_firstDoc.value?.id,
      null
    )) ?? null;

  parse_get_queries_response(total_queries, "prev");
};

watchEffect(async () => {
  if (current_client.value) {
    await getAnalytics();
  }
});
</script>

<template>
  <section v-if="loading_analytics" class="w-full h-[80vh] relative">
    <LoadersFullPageInpage />
  </section>

  <section v-else-if="loading_analytics_error" class="w-full h-[80vh] relative">
    Error loading data
  </section>

  <section v-else class="w-full h-[80vh] relative">
    <!-- {{ loading_analytics }} -->
    <!-- {{ pagination_can_prev }}
    {{ pagination_current_page_num }}
    {{ pagination_can_next }} -->
    <template v-if="intiate_fresh_onboarding__check === false">
      <div class="w-full h-full">
        <div class="flex gap-[24px] mb-[24px] w-full overflow-x-auto">
          <template v-for="insight in dashboard_insight">
            <div
              class="flex flex-col items-start justify-center gap-[12px] p-[20px] border border-[#E5E7EB] rounded-[12px] shadow-[0px_1px_3px_rgba(0,0,0,0.02),_inset_0px_-6px_6px_6px_rgba(255,255,255,0.08)] min-w-[250px]"
            >
              <div class="flex gap-[12px] flex-col">
                <template v-if="insight.image">
                  <img :src="insight.image_url" width="24px" alt="" />
                </template>
                <template v-if="insight.icon">
                  <component
                    :is="insight.icon_comp"
                    :color="insight.icon_color"
                  />
                </template>
                <span class="font-[500] text-[16px]/[20px] text-[#1A1A1D]">
                  {{ insight.label }}
                </span>
              </div>
              <div class="flex flex-col gap-[8px]">
                <span class="font-[600] text-[22px]/[29px] text-[#1A1A1D]">
                  {{ insight.value }}
                </span>
              </div>
            </div>
          </template>
        </div>
        <div class="w-full flex flex-col gap-[24px]">
          <div class="w-full">
            <ClientAiStrategies
              v-if="current_client"
              :client_details="current_client"
              :queries="queries"
              :pagination_firstDoc="pagination_firstDoc"
              :pagination_lastDoc="pagination_lastDoc"
              @next="next()"
              @prev="prev()"
              :can_prev="pagination_can_prev"
              :can_next="pagination_can_next"
            />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="intiate_fresh_onboarding__check === true">
      <div class="bg-white">
        <div
          class="max-w-screen-md mx-auto p-4 sm:px-6 lg:px-8 flex flex-col justify-between"
        >
          <div class="text-center">
            <h3
              class="text-xl leading-normal font-extrabold tracking-tight text-gray-900"
            >
              Follow These Steps to
              <span class="text-indigo-600">Get Started</span>
            </h3>
          </div>

          <div class="mt-20">
            <ul class="">
              <li class="bg-gray-100 p-5 pb-10 text-center mb-20">
                <div class="flex flex-col items-center">
                  <div class="flex-shrink-0 relative top-0 -mt-16">
                    <div
                      class="flex items-center justify-center h-20 w-20 rounded-full bg-indigo-500 text-white border-4 border-white text-xl font-semibold"
                    >
                      <template
                        v-if="!(current_client?.client_is_verified ?? false)"
                      >
                        1
                      </template>

                      <template v-else>
                        <IconsTick />
                      </template>
                    </div>
                  </div>
                  <div class="mt-4">
                    <h4 class="text-lg leading-6 font-semibold text-gray-900">
                      Verify the primary contact's email address
                    </h4>
                    <p class="mt-2 text-base leading-6 text-gray-500">
                      We have sent a verification link to the primary contact's
                      email. Please check the inbox and click the link to
                      confirm ownership. This ensures we can send important
                      updates and keep your account secure.
                    </p>
                  </div>
                </div>
              </li>
              <li class="bg-gray-100 p-5 pb-10 text-center mb-20">
                <div class="flex flex-col items-center">
                  <div class="flex-shrink-0 relative top-0 -mt-16">
                    <div
                      class="flex items-center justify-center h-20 w-20 rounded-full bg-indigo-500 text-white border-4 border-white text-xl font-semibold"
                    >
                      <template v-if="!submissions.client_onboarding_form">
                        2
                      </template>

                      <template v-else>
                        <IconsTick />
                      </template>
                    </div>
                  </div>
                  <div class="mt-4">
                    <h4 class="text-lg leading-6 font-semibold text-gray-900">
                      Submit Your CEO Onboarding Questionnaire
                    </h4>
                    <p class="mt-2 text-base leading-6 text-gray-500">
                      This step gives us the insights we need from leadership to
                      align vsuite with your company goals.
                    </p>

                    <p class="mt-2 text-base leading-6 text-gray-500">
                      Answer the onboarding questions thoroughly; Validate your
                      answers; Submit when ready and receive instant
                      confirmation;
                    </p>

                    <template v-if="!submissions.client_onboarding_form">
                      <NuxtLink
                        :class="{
                          'hover:opacity-[50%]':
                            !submissions.client_onboarding_form,
                        }"
                        target="_blank"
                        :to="`${parent_routes.web_app.forms.client_onboarding.path}?uid=${current_client?.client_uid}`"
                        class="flex items-center justify-center mx-auto mt-4 gap-[8px] p-[16px] h-[44px] bg-[#E10600] rounded-[200px] w-[300px]"
                      >
                        <span class="font-[500] text-[15px] text-[#FFFFFF]">
                          CEO Onboarding Questionnaire
                        </span>
                      </NuxtLink>
                    </template>
                  </div>
                </div>
              </li>

              <li class="bg-gray-100 p-5 pb-10 text-center mb-20">
                <div class="flex flex-col items-center">
                  <div class="flex-shrink-0 relative top-0 -mt-16">
                    <div
                      class="flex items-center justify-center h-20 w-20 rounded-full bg-indigo-500 text-white border-4 border-white text-xl font-semibold"
                    >
                      <template v-if="!submissions.advisior_onboarding_form">
                        3
                      </template>

                      <template v-else>
                        <IconsTick />
                      </template>
                    </div>
                  </div>
                  <div class="mt-4">
                    <h4 class="text-lg leading-6 font-semibold text-gray-900">
                      Submit Your Advisor Questionnaire
                    </h4>
                    <p class="mt-2 text-base leading-6 text-gray-500">
                      Complete the advisor questionnaire to help us understand
                      your business needs and tailor your experience.
                    </p>

                    <template v-if="!submissions.advisior_onboarding_form">
                      <NuxtLink
                        :class="{
                          'hover:opacity-[50%]':
                            !submissions.advisior_onboarding_form,
                        }"
                        target="_blank"
                        :to="`${parent_routes.web_app.forms.advisior_onboarding.path}?uid=${current_client?.client_uid}`"
                        class="flex items-center justify-center mx-auto mt-4 gap-[8px] p-[16px] h-[44px] bg-[#E10600] rounded-[200px] w-[300px]"
                      >
                        <span class="font-[500] text-[15px] text-[#FFFFFF]">
                          Advisor Questionnaire
                        </span>
                      </NuxtLink>
                    </template>
                  </div>
                </div>
              </li>

              <li class="bg-gray-100 p-5 pb-10 text-center mb-20">
                <div class="flex flex-col items-center">
                  <div class="flex-shrink-0 relative top-0 -mt-16">
                    <div
                      class="flex items-center justify-center h-20 w-20 rounded-full bg-indigo-500 text-white border-4 border-white text-xl font-semibold"
                    >
                      <template
                        v-if="dashboard_insight.files_uploaded.value === 0"
                      >
                        4
                      </template>

                      <template v-else>
                        <IconsTick />
                      </template>
                    </div>
                  </div>
                  <div class="mt-4">
                    <h4 class="text-lg leading-6 font-semibold text-gray-900">
                      Upload Your Company Files
                    </h4>
                    <p class="mt-2 text-base leading-6 text-gray-500">
                      Securely upload important documents to complete your
                      company profile.
                    </p>

                    <p
                      v-if="dashboard_insight.files_uploaded.value === 0"
                      class="mt-2 text-base leading-6 text-gray-500"
                    >
                      Click on the button below to continue. Proceed to upload
                      all company operational, financial and sales files. Once
                      uploaded, your files will be securely stored in vsuite.
                    </p>

                    <template
                      v-if="dashboard_insight.files_uploaded.value === 0"
                    >
                      <NuxtLink
                        :class="{
                          'hover:opacity-[50%]':
                            dashboard_insight.files_uploaded.value === 0,
                        }"
                        target="_blank"
                        :to="`${parent_routes.web_app.forms.asset_upload.path}?uid=${current_client?.client_uid}`"
                        class="flex items-center justify-center mx-auto mt-4 gap-[8px] p-[16px] h-[44px] bg-[#E10600] rounded-[200px] w-[300px]"
                      >
                        <span class="font-[500] text-[15px] text-[#FFFFFF]">
                          Upload Your Company Files
                        </span>
                      </NuxtLink>
                    </template>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

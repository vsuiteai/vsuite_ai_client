<script setup lang="ts">
import { parent_routes } from "~/config/parent_routes";
import { useAssetUploadFormStore } from "~/store/asset_upload_form/useAssetUploadFormStore";

type client_view = "uploaded_file_view" | "file_upload_form_view";

definePageMeta({
  layout: "guest",
});

const route = useRoute();
const uid = route.query.uid as string;

const clientController = useClientController();
const client = ref<ClientDetail | null>(null);

const error_fetching_client = ref<boolean>(false);
const loading = ref<boolean>(true);
const form_submission_success = ref<boolean>(false);
const current_view = ref<client_view>("file_upload_form_view");

const end_upload_process = async () => {
  form_submission_success.value = false;
  await useRouter().push(parent_routes.web_app.dashboard.path);
};

onMounted(async () => {
  if (!uid) {
    error_fetching_client.value = true;
    loading.value = false;
    return;
  }

  const res = (await clientController.get_client(uid)) ?? false;

  if (!res) {
    error_fetching_client.value = true;
    loading.value = false;
    return;
  }

  if (!(res.client ?? false)) {
    error_fetching_client.value = true;
    loading.value = false;

    return;
  }
  client.value = res.client;

  loading.value = false;
});
</script>
<template>
  <section class="w-full h-full">
    <!-- {{ route }} -->
    <section v-if="loading" class="w-full h-full">
      <LoadersFullPage />
    </section>
    <section v-else class="w-full h-full">
      <template v-if="error_fetching_client">
        <ErrorsFormClientNotFound />
      </template>
      <template v-else>
        <template v-if="client && !form_submission_success">
          <AssetUploadForm
            :client_details="client"
            @form_submission_success="form_submission_success = true"
            @end_upload_process="end_upload_process"
          />
        </template>

        <SuccessesFileUploaded
          v-if="form_submission_success"
          @restart_upload_process="
            () => {
              useAssetUploadFormStore().restart_form();
              form_submission_success = false;
              current_view = 'file_upload_form_view';
            }
          "
          @end_upload_process="end_upload_process"
        />
      </template>
    </section>
  </section>
</template>

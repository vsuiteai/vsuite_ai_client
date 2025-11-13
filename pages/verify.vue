<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/yup";
import * as yup from "yup";

definePageMeta({
  layout: "guest",
});

const route = useRoute();
const token = route.query.token as string;

const clientController = useClientController();
const client = ref<ClientDetail | null>(null);

const error_verifying_client = ref<boolean>(false);
const error_verifying_client__msg = ref<string>("");
const loading = ref<boolean>(true);

onMounted(async () => {
  if (!token) {
    error_verifying_client.value = true;
    loading.value = false;
    return;
  }
  const res = (await clientController.verify_client(token)) ?? null;

  // console.log(res);

  if (!res) {
    error_verifying_client.value = true;
    error_verifying_client__msg.value =
      "There was an error while processing your request";

    loading.value = false;
    return;
  }

  if (res.client) {
    client.value = res.client;
    loading.value = false;

    return;
  }

  error_verifying_client.value = true;
  error_verifying_client__msg.value = res.res_message;

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
      <template v-if="error_verifying_client">
        <ErrorsVerifyingClient :error_message="error_verifying_client__msg" />
      </template>
      <template v-else> <SuccessesVerificationSuccessful /> </template>
    </section>
  </section>
</template>

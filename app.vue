<script setup lang="ts">
import { useCurrentUserStore } from "./store/current_user";

const { loggedIn, user } = useUserSession();

watchEffect(() => {
  if (user.value && loggedIn.value) {
    useCurrentUserStore().setCurrentUser(user.value as ClientDetail);
  }
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from "./store/current_user";

const { loggedIn, user } = useUserSession();

onMounted(async () => {
  if (user.value) {
    const loggedin_user = user.value as ClientDetail;

    try {
      const refreshed_user =
        (await useClientController().get_client(loggedin_user.client_uid!))
          ?.client ?? false;
      // console.log("here");
      // console.log(user.value);

      if (refreshed_user) {
        useCurrentUserStore().setCurrentUser(refreshed_user);
      } else {
        useCurrentUserStore().setCurrentUser(user.value as ClientDetail);
      }
    } catch (error) {
      useCurrentUserStore().setCurrentUser(user.value as ClientDetail);
    }
  }
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

import { defineStore } from "pinia";

export const useCurrentUserStore = defineStore("currentUserStore", () => {
  const current_user = ref<ClientDetail | null>(null);

  const getCurrentUser = computed(() => {
    return current_user.value;
  });

  const setCurrentUser = (data: ClientDetail) => {
    current_user.value = data;
  };

  return {
    getCurrentUser,
    setCurrentUser,
  };
});

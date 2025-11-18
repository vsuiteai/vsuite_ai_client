import { defineStore } from "pinia";

type user_settings_data = {
  client_company_name: string;
  client_contact_fullname: string;
  client_contact_phone: string;
  client_contact_role: string;
  client_contact_work_email: string;
  client_industry: string;
  client_logo_url: string;
};

export const useCurrentUserStore = defineStore("currentUserStore", () => {
  const current_user = ref<ClientDetail | null>(null);

  const getCurrentUser = computed(() => {
    return current_user.value;
  });

  const updateCurrentUser = (data: user_settings_data) => {
    const { session } = useUserSession();

    if (!current_user.value) return;

    const current_session = session?.value ?? false;
    console.log("hhhh");
    if (!current_session) return;

    let key: keyof user_settings_data;

    for (key in data) {
      if (!Object.hasOwn(data, key)) continue;

      const element = data[key] ?? "";

      if (element && current_session.user) {
        current_user.value[key] = element;
        current_session.user[key] = element;
      }
    }

    console.log(current_session.user);
  };

  const setCurrentUser = (data: ClientDetail) => {
    current_user.value = data;
  };

  const clearCurrentUser = () => {
    current_user.value = null;
  };

  return {
    getCurrentUser,
    updateCurrentUser,
    setCurrentUser,
    clearCurrentUser,
  };
});

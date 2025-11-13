<script setup lang="ts">
import { useCurrentUserStore } from "~/store/current_user";

const current_route = useRouter().currentRoute;

const current_user_store = useCurrentUserStore();

const current_user = computed(() => {
  return current_user_store.getCurrentUser;
});
</script>

<template>
  <div class="h-[100vh] w-[100vw]">
    <div class="h-full w-full flex">
      <SiderbarSidebar />
      <section
        id="dashboard_content"
        class="min-h-full w-full ml-[275px] relative overflow-x-hidden"
      >
        <div
          class="w-full lg:w-[calc(100%-275px)] h-[70px] lg:h-[90px] fixed z-[1]"
        >
          <div
            id="dashboard_content__header"
            class="w-full h-full bg-[#FAFAFA] py-[14px] px-[20px] border-[#EDEFF5] border-[1px]"
          >
            <div class="flex items-center justify-between h-full w-full">
              <div class="flex items-center gap-[16px]">
                <IconsMenuHamburger class="lg:hidden" />

                <span
                  class="text-[#1A1A1D] font-[500] text-[16px] lg:text-[22px]"
                >
                  {{ current_route.meta.breadcrumb_bottom }}
                </span>
              </div>

              <div class="flex items-center items-center gap-[12px]">
                <IconsNotificationBell />

                <div class="flex gap-[8px] items-center">
                  <div
                    class="flex items-center justify-center w-[32px] lg:w-[42px] h-[32px] lg:h-[42px] bg-[#4F46E5] rounded-full"
                  >
                    <span class="font-[600] text-[12px] text-[#FFFFFF]">
                      {{ getInitials(current_user?.client_company_name) }}
                    </span>
                  </div>
                  <div class="flex flex-col items-start justify-center">
                    <span class="font-[500] text-[15px] text-[#1A1A1D]">
                      {{ current_user?.client_contact_work_email }}
                    </span>

                    <span class="font-[500] text-[14px] neutral_2">
                      {{ current_user?.client_contact_role }}
                    </span>
                  </div>
                  <!-- <IconsChevronDown /> -->
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="dashboard_content__content"
          class="w-full py-[calc(70px+24px)] lg:py-[calc(90px+24px)] px-[20px] relative"
        >
          <slot />
        </div>
      </section>
    </div>
  </div>
</template>

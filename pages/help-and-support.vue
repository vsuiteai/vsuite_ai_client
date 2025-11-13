<script setup lang="ts">
const route = useRoute("/help-and-support");

definePageMeta({
  layout: "authenticated",
  breadcrumb_top: "",
  breadcrumb_bottom: "",
  middleware: ["authenticated"],
});
route.meta.breadcrumb_bottom = "Help and Support";
</script>

<template>
  <section class="w-full bg-[#ffffff] py-[20px] mb-[24px]">
    <div class="flex flex-col gap-y-[45px]">
      <div
        class="w-full lg:p-[50px] px-[15px] py-[25px] md:p-[25px] flex flex-col items-center justify-center gap-y-[35px] md:gap-y-[80px]"
      >
        <div
          class="flex flex-col gap-y-[20px] lg:gap-y-[60px] items-center justify-center w-full lg:w-[unset]"
        >
          <h3
            class="font-[600] text-[24px] capitalize text-black dark:text-[#FFFFFFDE]"
          >
            We're here to help
          </h3>
          <div
            class="flex flex-col lg:flex-row gap-[6px] lg:gap-[10px] items-center justify-center sm:w-full"
          >
            <div class="lg:w-[600px] w-full">
              <input
                type="text"
                class="w-full h-[48px] rounded-[2px] bg-[#FFFFFF] dark:bg-[#3D3D41] border-[1px] dark:border-0 border-[#E2E8F0] placeholder-[#00000033] dark:placeholder-[#FFFFFF99] text-[18px] block w-full py-[15px] px-[20px] outline-0"
                placeholder="Search your question here..."
              />
            </div>
            <button
              disabled
              class="py-[6px] px-[40px] bg-[#000000] rounded-[2px] w-full h-[48px] lg:w-[240px] lg:max-w-[240px] hover:opacity-[.7] w-full"
            >
              <span class="font-[500] text-[18px] text-[#FFFFFF]">Search</span>
            </button>
          </div>
        </div>

        <div
          class="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]"
        >
          <div
            class="p-[35px] bg-white dark:bg-[#323236] rounded-[20px] shadow-[3px_3px_18px_rgba(0,0,0,0.01)] flex flex-col gap-[30px] items-center justify-start"
          >
            <IconsHelpAndSupportMediaGuide />
            <div
              class="w-full flex flex-col gap-[20px] items-center justify-center"
            >
              <div
                class="font-[600] text-[20px] text-center min-h-[60px] flex flex-col items-center justify-center"
              >
                <NuxtLink to="#"> Step-by-Step Guide </NuxtLink>
              </div>

              <span class="font-[400] text-[16px] text-center"
                >Learn how to use our platform with easy, detailed
                instructions.</span
              >
            </div>
          </div>
          <div
            class="p-[35px] bg-white dark:bg-[#323236] rounded-[20px] shadow-[3px_3px_18px_rgba(0,0,0,0.01)] flex flex-col gap-[30px] items-center justify-start"
          >
            <IconsHelpAndSupportOutlineHelp />
            <div
              class="w-full flex flex-col gap-[20px] items-center justify-center"
            >
              <div
                class="font-[600] text-[20px] text-center min-h-[60px] flex flex-col items-center justify-center"
              >
                <NuxtLink to="#"> FAQs </NuxtLink>
              </div>

              <span class="font-[400] text-[16px] text-center">
                Get quick answers to the most common questions.
              </span>
            </div>
          </div>
          <div
            class="p-[35px] bg-white dark:bg-[#323236] rounded-[20px] shadow-[3px_3px_18px_rgba(0,0,0,0.01)] flex flex-col gap-[30px] items-center justify-start"
          >
            <IconsHelpAndSupport />
            <div
              class="w-full flex flex-col gap-[20px] items-center justify-center"
            >
              <div
                class="font-[600] text-[20px] text-center min-h-[60px] flex flex-col items-center justify-center"
              >
                <NuxtLink to="#"> Contact Support </NuxtLink>
              </div>

              <span class="font-[400] text-[16px] text-center">
                Reach out to us for help via email, phone, or live chat.</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

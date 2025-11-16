<script setup lang="ts">
import { company_roles } from "~/config/company_roles";
import { industries } from "~/config/industry";
import { useForm } from "vee-validate";
import * as yup from "yup";

import { useCurrentUserStore } from "../../../store/current_user";

const current_client_store = useCurrentUserStore();
const clientCont = useClientController();

const current_client_data = ref(current_client_store.getCurrentUser);
const current_client_saved_image_url = ref("");
const pre_saved_image_data = ref("");
const pre_saved_image = ref<file_to_be_uploaded>(null);

const updating = ref(false);
const updating_error = ref("");

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    company_name: yup
      .string()
      .required("Please enter the company name")
      .label("Client Company Name"),

    contact_name: yup
      .string()
      .required("Please enter the contact name")
      .label("Company Contact Name"),

    client_contact_work_email: yup
      .string()
      .email("Please enter a valid work email")
      .required("Please enter the contact work email")
      .label("Contact Work Email"),

    phone: yup
      .string()
      .required("Please enter the contact phone")
      .label("Contact Phone"),

    contact_role: yup
      .string()
      .required("Please select the contact role")
      .label("Contact Role"),

    client_industry: yup
      .string()
      .required("Please select an industry")
      .label("Contact Role"),
  }),

  initialValues: {
    company_name: current_client_data.value?.client_company_name,
    contact_name: current_client_data.value?.client_contact_fullname,
    client_contact_work_email:
      current_client_data.value?.client_contact_work_email,
    phone: current_client_data.value?.client_contact_phone,
    contact_role: current_client_data.value?.client_contact_role,
    client_industry: current_client_data.value?.client_industry,
  },
});

const register_client = handleSubmit(async (values) => {
  try {
    console.log("here");

    if (updating.value) return;
    console.log("here2");

    if (!(current_client_data.value?.client_uid ?? false)) return;
    console.log("here3");

    updating.value = true;
    updating_error.value = "";

    const updatedClientDetail = {
      company_name: values.company_name!,
      contact_name: values.contact_name!,
      phone: values.phone!,
      client_contact_work_email: values.client_contact_work_email!,
      contact_role: values.contact_role!,
      client_industry: values.client_industry!,
    };

    console.log(updatedClientDetail);

    clientCont.update_client_data(
      updatedClientDetail,
      pre_saved_image.value,
      current_client_data.value?.client_uid!
    );
  } catch (error) {
    if (error instanceof Error) {
      updating_error.value = error.message;
    } else {
      updating_error.value = "An unexpected error occurred.";
    }
  }
  updating.value = false;
});

const preview_image = (e: Event) => {
  const input = e.target as HTMLInputElement | null;

  if (!input) return;

  if (input.files && input.files[0]) {
    let reader = new FileReader();
    pre_saved_image.value = input.files[0];

    reader.onload = (e: ProgressEvent<FileReader>) => {
      pre_saved_image_data.value = e.target?.result as string;
    };

    reader.readAsDataURL(input.files[0]);
  }
};

const decodedUrl = computed(() => {
  if (current_client_data.value?.client_logo_url) {
    return decodeURIComponent(current_client_data.value?.client_logo_url);
  } else {
    return false;
  }
});
</script>

<template>
  <div class="w-full flex flex-col gap-[24px]">
    <!-- {{ current_client_data }} -->
    <div class="w-full flex flex-col gap-[4px] bg-[#ffffff]">
      <div class="w-full flex justify-end items-center">
        <div class="flex items-center gap-[8px]">
          <button
            @click="register_client"
            class="flex items-center gap-[8px] p-[16px] h-[44px] bg-[#E10600] rounded-[200px]"
          >
            <span class="font-[500] text-[15px] text-[#FFFFFF]">
              Save Update
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="w-full flex flex-col gap-[40px] bg-[#ffffff]">
      <div class="w-full flex flex-col items-start gap-[30px]">
        <div class="w-full flex items-center justify-between gap-[20px]">
          <div class="flex items-center gap-[30px]">
            <div
              class="flex items-center justify-center w-[80px] h-[80px] bg-gray-50 rounded-full"
            >
              <template v-if="pre_saved_image_data">
                <img
                  class="h-[80px] w-[auto] rounded-full"
                  :src="pre_saved_image_data"
                />
              </template>
              <template v-else-if="decodedUrl">
                <img class="h-[80px] w-[auto] rounded-full" :src="decodedUrl" />
              </template>

              <template v-else>
                <IconsProfile height="80px" width="80px" />
              </template>
            </div>

            <div class="flex flex-col gap-[4px]">
              <span class="font-[500] text-[16px]/[24px] text-[#474D66]">
                Logo
              </span>
              <span class="text-[12px]/[16px] text-[#696F8C]">
                Supports JPEG & PNG under 3MB (max. 800x400px)
              </span>
            </div>
          </div>

          <div class="flex gap-[16px]">
            <label
              for="client_logo"
              class="text-[#1A1A1D] underline font-[500] text-[14px] hover:cursor-pointer"
            >
              Change Picture
              <input
                type="file"
                id="client_logo"
                name="client_logo"
                hidden
                accept="image/*"
                @change="preview_image($event)"
              />
            </label>
            <button
              disabled
              class="text-[#E10600] underline font-[500] text-[14px]"
            >
              Delete Picture
            </button>
          </div>
        </div>
      </div>
      <div class="w-full flex flex-col gap-[16px]">
        <h4 class="font-[600] text-[16px] text-[#474D66]">Personal Details</h4>

        <div class="w-full flex flex-col gap-[16px]">
          <div class="flex flex-col items-start gap-[4px]">
            <span class="font-[500] text-[12px]/[16px] text-red-800">
              <!-- {{ editing_consultant_error }} -->
            </span>
          </div>

          <div class="w-full grid gap-4 grid-cols-2 gap-[20px]">
            <div class="flex flex-col gap-[8px]">
              <InputsTextInput
                name="company_name"
                label="Client Company Name"
                in_used="settings"
              />
            </div>
            <div class="flex flex-col gap-[8px]">
              <InputsTextInput
                name="contact_name"
                label="Company Contact Name"
                in_used="settings"
              />
            </div>

            <div class="flex flex-col gap-[8px]">
              <InputsEmailInput
                name="client_contact_work_email"
                label="Contact Work Email"
                in_used="settings"
              />
            </div>

            <div class="flex flex-col gap-[8px]">
              <InputsDropdownInput
                name="contact_role"
                label="Contact Role"
                :options="company_roles"
                in_used="settings"
              />
            </div>

            <div class="w-full col-span-2 grid grid-cols-2 gap-4">
              <InputsTextInput
                name="phone"
                label="Company Phone"
                in_used="settings"
              />

              <InputsDropdownInput
                name="client_industry"
                label="Client Industry"
                :options="industries"
                in_used="settings"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";
import { company_roles } from "~/config/company_roles";
import { industries } from "~/config/industry";
import { parent_routes } from "~/config/parent_routes";
const { loggedIn, user, fetch: refreshSession } = useUserSession();

definePageMeta({
  layout: "auth-pages",
});

const authController = useAuthController();
const registering = ref(false);
const registering_error = ref("");

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

    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Please enter your password")
      .label("Password"),

    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Please confirm your password")
      .label("Confirm Password"),
  }),
});

const register_client = handleSubmit(async (values) => {
  try {
    registering.value = true;
    registering_error.value = "";

    const currentDomain = window.location.origin;

    const clientDetail = {
      client_company_name: values.company_name!,
      client_contact_fullname: values.contact_name!,
      client_contact_phone: values.phone!,
      client_contact_work_email: values.client_contact_work_email!,
      client_contact_role: values.contact_role!,
      client_industry: values.client_industry!,
      client_is_verified: false,
      client_password: values.password!,
      onboarding_process_status: "not_started" as onboarding_process_status,
    };

    if (!(await authController.create_client(clientDetail, currentDomain))) {
      throw new Error("An unexpected error occurred.");
    }

    await refreshSession();

    if (user) {
      await navigateTo(parent_routes.web_app.dashboard.path);
    }
  } catch (error) {
    if (error instanceof Error) {
      registering_error.value = error.message;
    } else {
      registering_error.value = "An unexpected error occurred.";
    }
  }
  registering.value = false;
});

onBeforeMount(async () => {
  if (loggedIn.value) {
    // await navigateTo(parent_routes.web_app.dashboard.path);
  }
});
</script>

<template>
  <div class="flex flex-col w-full gap-[16px]">
    <div class="flex flex-col w-full items-start gap-[24px]">
      <div class="w-full flex items-center justify-between">
        <div>
          <h5 class="text-[24px] text-[#E5E7EB] mb-[8px]">Register</h5>
          <p class="text-[16px] text-[#c5c2c8cc]">
            Create an account to continue
          </p>
        </div>

        <NuxtLink
          class="underline underline-dashed underline-offset-2 text-[#E5E7EB]"
          :to="parent_routes.web_app.sign_in"
        >
          Log into your account
        </NuxtLink>
      </div>

      <button class="sign_in_with_google" disabled>
        <img src="/assets/images/google_logo.svg" alt="" />
        <span class="text-[15px] text-[#4B5563]"> Continue with Google </span>
      </button>
    </div>

    <div class="flex items-center justify-center gap-[12px]">
      <hr class="w-full h-px border-[#F1F6FA] bg-[#F1F6FA] rounded-full" />
      <span class="text-[14px] text-[#667085]">or</span>
      <hr class="w-full h-px border-[#F1F6FA] bg-[#F1F6FA] rounded-full" />
    </div>

    <div class="flex flex-col gap-[32px] w-full">
      <div class="flex flex-col gap-[8px] w-full">
        <div class="flex flex-col gap-[16px] w-full">
          <div class="w-full grid grid-cols-2 gap-4">
            <InputsTextInput name="company_name" label="Client Company Name" />
            <InputsTextInput name="contact_name" label="Company Contact Name" />
          </div>
          <InputsDropdownInput
            name="client_industry"
            label="Client Industry"
            :options="industries"
          />
          <div class="w-full grid grid-cols-2 gap-4">
            <InputsTextInput name="phone" label="Company Phone" />
            <InputsDropdownInput
              name="contact_role"
              label="Contact Role"
              :options="company_roles"
            />
          </div>
          <InputsEmailInput
            name="client_contact_work_email"
            label="Contact Work Email"
          />

          <div class="w-full grid grid-cols-2 gap-4">
            <InputsPasswordInput name="password" label="Password" />
            <InputsPasswordInput
              name="confirm_password"
              label="Confirm Password"
            />
          </div>
        </div>
        <span class="text-[10px] text-[#EDEFF5] opacity-[0.8]">
          By proceeding you agree to the Terms and Conditions and Privacy Policy
          of Benjamin Strategy Advisors
        </span>
      </div>

      <div class="w-full" v-if="registering_error !== ''">
        <p class="text-[15px] text-[#E10600] text-center opacity-[0.8]">
          {{ registering_error }}
        </p>
      </div>
      <button
        :disabled="registering"
        @click.prevent="register_client"
        class="w-full h-[50px] py-[6px] flex items-center justify-center bg-[#E10600] rounded-full"
      >
        <LoadersInButton v-if="registering" fill="#aaa" />
        <span class="text-[15px] text-[#ffffff]"> Register </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";
import { parent_routes } from "~/config/parent_routes";
const { clear } = useUserSession();

import { useCurrentUserStore } from "../../../store/current_user";

const current_client_store = useCurrentUserStore();
const clientCont = useClientController();

const current_client_data = ref(current_client_store.getCurrentUser);

const updating = ref(false);
const updating_error = ref("");

const { handleSubmit, meta } = useForm({
  validationSchema: yup.object({
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

const update_client_password = handleSubmit(async (values) => {
  try {
    if (updating.value) return;

    if (!meta.value.valid) return;

    if (!(current_client_data.value?.client_uid ?? false)) return;

    updating.value = true;
    updating_error.value = "";

    const updatedClientDetail = {
      password: values.password!,
    };

    console.log(updatedClientDetail);

    clientCont.update_client_password(
      updatedClientDetail,
      current_client_data.value?.client_uid!
    );

    await clear();
    useRouter().push(parent_routes.web_app.sign_in);
  } catch (error) {
    if (error instanceof Error) {
      updating_error.value = error.message;
    } else {
      updating_error.value = "An unexpected error occurred.";
    }
  }
  updating.value = false;
});
</script>

<template>
  <div class="w-full flex flex-col gap-[24px]">
    <!-- {{ current_client_data }} -->
    <div class="w-full flex flex-col gap-[4px] bg-[#ffffff]">
      <div class="w-full flex justify-end items-center">
        <div class="flex items-center gap-[8px]">
          <button
            @click="update_client_password"
            :disabled="updating || !meta.valid || !meta.dirty"
            class="flex items-center gap-[8px] p-[16px] h-[44px] bg-[#E10600] rounded-[200px]"
          >
            <IconsRefresh v-if="updating" class="animate-spin" />

            <span class="font-[500] text-[15px] text-[#FFFFFF]">
              Save Update
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="w-full flex flex-col gap-[40px] bg-[#ffffff]">
      <div class="w-full flex flex-col gap-[16px]">
        <div>
          <h4 class="font-[600] text-[16px] text-[#474D66]">Change Password</h4>
          <p class="font-[500] text-[13px] text-[#474D66]">
            Note that you will be required to sign in again after updating your
            password.
          </p>
        </div>

        <div class="w-full flex flex-col gap-[16px]">
          <div class="flex flex-col items-start gap-[4px]">
            <span class="font-[500] text-[12px]/[16px] text-red-800">
              <!-- {{ updating_error }} -->
            </span>
          </div>

          <div class="w-full grid gap-4 grid-cols-2 gap-[20px]">
            <div class="flex flex-col gap-[8px]">
              <InputsPasswordInput
                name="password"
                label="Password"
                in_used="settings"
                error_color_class="text-[#ffaa33]"
              />
            </div>
          </div>
          <div class="w-full grid gap-4 grid-cols-2 gap-[20px]">
            <div class="flex flex-col gap-[8px]">
              <InputsPasswordInput
                name="confirm_password"
                label="Confirm Password"
                in_used="settings"
                error_color_class="text-[#ffaa33]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

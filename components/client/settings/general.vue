<script setup lang="ts">
import { company_roles } from "~/config/company_roles";
import { industries } from "~/config/industry";
</script>

<template>
  <div class="w-full flex flex-col gap-[24px]">
    <div class="w-full flex flex-col gap-[4px] bg-[#ffffff]">
      <div class="w-full flex justify-end items-center">
        <div class="flex items-center gap-[8px]">
          <button
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
      <!-- {{ consultant }} -->
      <div class="w-full flex flex-col items-start gap-[30px]">
        <div class="w-full flex items-center justify-between gap-[20px]">
          <div class="flex items-center gap-[30px]">
            <IconsProfile height="80px" width="80px" />

            <div class="flex flex-col gap-[4px]">
              <span class="font-[500] text-[16px]/[24px] text-[#474D66]">
                Profile Picture
              </span>
              <span class="text-[12px]/[16px] text-[#696F8C]">
                Supports JPEG & PNG under 3MB (max. 800x400px)
              </span>
            </div>
          </div>

          <div class="flex gap-[16px]">
            <button
              disabled
              class="text-[#1A1A1D] underline font-[500] text-[14px]"
            >
              Change Picture
            </button>
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

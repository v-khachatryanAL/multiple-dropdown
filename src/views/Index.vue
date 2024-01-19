<script setup lang="ts">
import { ref } from 'vue'
import dropdown from '@/components/UIElements/Dropdown.vue'
import robotsImage from "@/components/shared/ImageRobotContainer.vue";
import { useDropdown } from '../stores/dropdown'
import { storeToRefs } from 'pinia'
import type { option } from '../types/option.ts'

const dropdownStore = useDropdown()
const { options, hoveredDropdownItem } = storeToRefs(dropdownStore)

const selectedData = ref<option[]>([])

function onChangeSelectedData (data:option[])  {
  dropdownStore.setSelectedData(data)
}
</script>

<template>
  <div
    class="bg-coverImg bg-no-repeat min-h-screen bg-cover flex items-center justify-end font-inter h-screen py-10 lg:py-5 px-4 gap-10 lg:gap-2 flex-col-reverse lg:justify-center lg:flex-row"
  >
    <dropdown
      v-model="selectedData" 
      :options="options"
      :maxSelectLength="5" 
      :filterable="true"
      :multiple="true"
      placeholder="Add up to 5 robots"
      @update:model-value="onChangeSelectedData"
    />
    <robotsImage v-if="hoveredDropdownItem" :hoveredRobotItem="hoveredDropdownItem.imgSrc"/>
  </div>
</template>

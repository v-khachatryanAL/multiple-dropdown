<script setup lang="ts">
import { ref } from 'vue'
import dropdown from '@/components/UIElements/Dropdown.vue'
import { useDropdown } from '../stores/dropdown'
import { storeToRefs } from 'pinia'
import type { option } from '../../types/option'

const dropdownStore = useDropdown()
const { options, selectedDropdownData } = storeToRefs(dropdownStore)

const selectedData = ref<option[]>([])

function onChangeSelectedData (data:option[])  {
  selectedData.value = data
  dropdownStore.setSelectedData(data)
}
</script>

<template>
  <main>
    <dropdown 
      :options="options" 
      :maxSelectLength="5" 
      :filterable="true"
      :multiple="true"
      placeholder="Add up to 5 robots"
      @change="onChangeSelectedData"
    />
  </main>
</template>

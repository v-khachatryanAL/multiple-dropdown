<template>
  <div v-click-outside="closeDropdown" class="min-w-[218px] relative bg-white border rounded border-gray-500" >   
    <div class="relative" >
      <input 
        v-if="filterable"
        v-model="filterQuery"
        @focus="isOpen=true" 
        @input="filter"
        class=" w-full h-9 px-2 outline-none rounded" 
        :placeholder="multiple ? placeholder : 'search'" 
      />   
      <p 
        v-if="!filterable && !multiple" 
        @click="isOpen=!isOpen" 
        :class="filterQuery ? 'text-gray-700': 'text-gray-400'" 
        class="ml-2 h-[38px] flex items-center"
      >
        {{filterQuery ? filterQuery : 'Select'  }}
      </p>        
      <p 
        v-if="!filterable && multiple && !selected.length" 
        @click="isOpen=!isOpen" 
        class="ml-2 h-[38px] text-gray-400 flex items-center"
      >
        {{placeholder}}
      </p>        
      <IconDropdownArrow 
        @click="isOpen=!isOpen" 
        :class="{'rotate-180': isOpen}" 
        class="transition w-5 h-5 absolute right-1.5 top-2"
      />
      <div 
        v-if="selected.length && multiple" 
        :class="{'pt-2':!filterable}" 
        class="flex flex-wrap gap-1 ml-1 mr-7 pb-2"
      >
        <Chip 
          v-for="chip in selected"
          :key="`chip_${chip.id}`" 
          :label="chip.value"
          @remove="onRemoveSelectedItem(chip.id)"
        />
      </div> 
      <div v-if="isOpen"  class="absolute top-[calc(100%+10px)]  overflow-hidden bg-white w-full">
        <div class="border rounded border-gray-500 py-1 px-2 bg-white">
          <template v-if="filteredData.length">
            <div
              v-for="option in filteredData" :key="option.id"
              @click="onSelectItem(option)"
              :class="{'font-bold flex justify-between items-center bg-indigo-50':checkSelected(option)}"
              class="px-1.5 py-1 my-1 hover:bg-indigo-500 rounded hover:text-white text-gray-600 text-base group"
            >
              <span>{{ option.label }}</span>
              <span v-if="checkSelected(option)">
                <IconCheck fill="group-hover:fill-white" class="w-4 h-4"/>
              </span>
            </div>
          </template>
          <div class="flex justify-center" v-else>
            <span class="text-gray-500 font-semibold py-3">No Searched Result</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconDropdownArrow from '../icons/IconDropdownArrow.vue' 
import IconCheck from '../icons/IconCheck.vue' 
import Chip from './Chip.vue' 

import type { option } from '../../types/option'

interface Props {
  options: option[]
  maxSelectLength?: number | null,
  filterable?: boolean,
  multiple?: boolean,
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  maxSelectLength: null,
  filterable: false,
  multiple: false,
  placeholder: 'Search'
})

const emit = defineEmits<{
    (e: 'change', data:option[] | [] ): void
}>()

const filterQuery = ref<string>('')
const isOpen = ref<boolean>(false)
const selected = ref<option[]>([])
const filteredData = ref<option[]>(props.options)

const onSelectItem = (option: option) => {
  if (props.multiple) {
    const index = selected.value.findIndex(elem => elem.id === option.id)
    if ((!selected.value.length || index === -1) && selected.value.length < (props.maxSelectLength || Infinity)) {
      selected.value.push(option)
    } else if(index !== -1) {
      selected.value.splice(index, 1)
    }
  }
  if (!props.multiple) {
    const index = selected.value.findIndex(elem => elem.id === option.id)
    if (index == -1) {
      selected.value[0] = option
      filterQuery.value = option.label
    } else if (index !== -1) {
      selected.value = []
      filterQuery.value = ''      
    }
    filteredData.value = props.options
  }
  emit('change', selected.value)
}

const checkSelected = (option: option) => {
    const index = selected.value.findIndex(elem => elem.id === option.id)
    return index !== -1 ? true : false 
}

const onRemoveSelectedItem = (id: number|string) => {
  const index = selected.value.findIndex(elem => elem.id === id)
  selected.value.splice(index, 1)
}

const filter = (e: Event) => {
  if (!filterQuery.value) {
    filteredData.value = props.options
  } else if(filterQuery.value) {
    filteredData.value = props.options.filter((elem: option) => elem.value.toLowerCase().includes(filterQuery.value))
  }
}
const closeDropdown = () => {
  isOpen.value = false
}
</script>

<style scoped>

</style>


<!-- Example -->

<!-- 
For import 
import dropdown from '@/components/UIElements/Dropdown.vue'

<dropdown 
  :options="options" 
  :maxSelectLength="5" 
  :filterable="true"
  :multiple="true"
  placeholder="Add up to 5 robots"
  @change="onChangeSelectedData"
/>

Props
1):options="options"------------------this props for send options in component.
2):maxSelectLength="5"----------------maximum count of selected options.
3):filterable="true" or false---------for search within the dropdown.
4):multiple="true" or false-----------possibility to choose several options.
5)placeholder="example"---------------what should be shown when the input is empty
6)@change="onChangeSelectedData"
This event 

-->
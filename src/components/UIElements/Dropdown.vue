<template>
  <div v-click-outside="closeDropdown" class="min-w-[218px] max-w-[600px] w-full relative bg-white border rounded border-gray-500" >
    <span v-if="showError" class="text-orange-400 font-semibold text-xs absolute -top-5" >Maximum selection length should be {{ maxSelectLength }}</span>
    <div class="relative" >
      <input 
        v-if="filterable"
        v-model="filterQuery"
        @focus="isOpen=true" 
        @input="filter"
        class=" w-full h-9 px-2 outline-none rounded"
        :class="{'absolute top-2 pb-1 -z-50':(!isOpen && filterable && multiple && selected.length)}"
        :placeholder="multiple ? placeholder : 'search'" 
      />
      <p 
        v-if="!filterable && !multiple" 
        @click="isOpen=!isOpen" 
        :class="filterQuery ? 'text-gray-700': 'text-gray-400'" 
        class="ml-2 h-[38px] flex items-center"
      >
        {{ filterQuery ? filterQuery : 'Select' }}
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
        :class="{'pt-2 pb-2':!filterable, 'pt-2': !isOpen}" 
        class="flex flex-wrap w-max pr-[100%] gap-2 ml-1 mr-7 pb-2"
        @click="isOpen = true"
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
              v-for="(option, index) in filteredData" :key="option.id"
              @click="onSelectItem(option)"
              @mouseenter="hoveredItem(option, index)"
              :class="{
                'font-bold flex justify-between items-center bg-indigo-50':checkSelected(option),
                ' bg-indigo-500 text-white group': option.id === hoveredDropdownItem.id
                
                }"
              class="px-1.5 py-1 my-1 hover:bg-indigo-500 rounded hover:text-white text-gray-600 text-base group"
            >
              <span>{{ option.label }}</span>
              <span v-if="checkSelected(option)">
                <IconCheck  :fill="option.id === hoveredDropdownItem.id ? 'fill-white' : 'group-hover:fill-white'" class="w-4 h-4"/>
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
import { ref, watch, onMounted } from 'vue'
import IconDropdownArrow from '../icons/IconDropdownArrow.vue' 
import IconCheck from '../icons/IconCheck.vue' 
import Chip from './Chip.vue' 
import type { option } from '../../types/option'
import { useDropdown } from '../../stores/dropdown'
import { storeToRefs } from 'pinia'


const dropdownStore = useDropdown()
const { hoveredDropdownItem } = storeToRefs(dropdownStore)

interface Props {
  options: option[]
  maxSelectLength?: number | null
  filterable?: boolean
  multiple?: boolean
  placeholder?: string
  modelValue: option[] | []
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  maxSelectLength: null,
  filterable: false,
  multiple: false,
  placeholder: 'Search'
})

const emit = defineEmits<{
    (e: 'update:modelValue', data:option[] | [] ): void,
    (e: 'search', data: string): void
}>()

const filterQuery = ref<string>('')
const isOpen = ref<boolean>(false)
const selected = ref<option[] | []>([])
const filteredData = ref<option[]>(props.options)
const hoveredItemIndex = ref<number>(0)
const showError = ref<boolean>(false)

const onSelectItem = (option: option) => {
  if (props.multiple) {
    showError.value = false;
    const index = selected.value.findIndex(elem => elem.id === option.id)
    if (index === -1 && selected.value.length < (props.maxSelectLength || Infinity)) {
      (selected.value as option[]).push(option)
    } else if(index !== -1) {
      selected.value.splice(index, 1)
    }else {
      showError.value = true;
    }
    filterQuery.value = ''  
    filteredData.value = props.options
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
  // emit to pass selected options to the parent component
  emit('update:modelValue', selected.value)
}

const checkSelected = (option: option) => {
    const index = selected.value.findIndex(elem => elem.id === option.id)
    return index !== -1 ? true : false 
}

const onRemoveSelectedItem = (id: number|string) => {
  const index = selected.value.findIndex(elem => elem.id === id)
  selected.value.splice(index, 1)
  showError.value = false;
}

const filter = (e: Event) => {
  hoveredItemIndex.value = 0 
  if (!filterQuery.value) {
    filteredData.value = props.options
  } else if(filterQuery.value) {
    filteredData.value = props.options.filter((elem: option) => elem.value.toLowerCase().includes(filterQuery.value))
  }
  emit('search', filterQuery.value)
}
const closeDropdown = () => {
  isOpen.value = false
}
const hoveredItem = (option: option, index: number) =>{
  dropdownStore.setHoveredItem(option)
  hoveredItemIndex.value = index
}

//functionality for selecting items using the keyboard

const keyDownFunctionality = (e: any) => {
  if (e.keyCode == '13') {
    onSelectItem(filteredData.value[hoveredItemIndex.value])
  }
  if (e.keyCode == '38') {
    if (hoveredItemIndex.value !== 0) {
      hoveredItemIndex.value--
      dropdownStore.setHoveredItem(filteredData.value[hoveredItemIndex.value])
    }
    // up arrow
  }
  if (e.keyCode == '40') {
    // down arrow
    if (filteredData.value.length-1 > hoveredItemIndex.value) {
      hoveredItemIndex.value++
      dropdownStore.setHoveredItem(filteredData.value[hoveredItemIndex.value])
    }
  }
}

onMounted(() => {
  selected.value = props.modelValue;
}),

watch(() => isOpen.value, () => {
  if (isOpen.value) {
    window.addEventListener("keydown", keyDownFunctionality)
  } else {
    window.removeEventListener("keydown", keyDownFunctionality)
  }
})

</script>


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
  @update:modelValue="onChangeSelectedData"
/>

Props
1):options="options"------------------for component options.
2):maxSelectLength="5"----------------maximum count of selected options.
3):filterable="true" or false---------search within the dropdown.
4):multiple="true" or false-----------possibility to choose several options.
5)placeholder="example"---------------in case the input is empty show placeholder value.
6)@update:modelValue="onChangeSelectedData"------event to receive selected options in the parent component.

-->
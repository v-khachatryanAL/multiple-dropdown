import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { option } from '../types/option'


export const useDropdown = defineStore('dropdown',  () =>  {
  const options = ref<option[]>([
    { id: 1, value: 'C-3PO', label: 'C-3PO', imgSrc: "c-3po.png"},
    { id: 2, value: 'R2-D2', label: 'R2-D2', imgSrc: "r2-d2.png"},
    { id: 3, value: 'RoboCop', label: 'RoboCop', imgSrc: "robo-cop.png"},
    { id: 4, value: 'Optimus Prime', label: 'Optimus Prime', imgSrc: "optimus.png" },
    { id: 5, value: 'Wall-E', label: 'Wall-E', imgSrc: "wall-e.png" },
    { id: 6, value: 'Terminator', label: 'Terminator', imgSrc: "terminator.png" }    
  ])
  const selectedDropdownData = ref<option[]>([])
  const hoveredDropdownItem = ref<option>(options.value[0])

  const setSelectedData = (data: option[]) => {
    selectedDropdownData.value = data
  }
  const setHoveredItem = (data: option) => {
    hoveredDropdownItem.value = data
  }  


  return { options, selectedDropdownData, setSelectedData, setHoveredItem, hoveredDropdownItem }
 
})
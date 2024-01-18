import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { option } from '../types/option'


export const useDropdown = defineStore('dropdown',  () =>  {
  const options = ref<option[]>([
    { id: 1, value: 'C-3PO', label: 'C-3PO'},
    { id: 2, value: 'R2-D2', label: 'R2-D2'},
    { id: 3, value: 'RoboCop', label: 'RoboCop'},
    { id: 4, value: 'Optimus Prime', label: 'Optimus Prime'},
    { id: 5, value: 'Wall-E', label: 'Wall-E'},
    { id: 6, value: 'Terminator', label: 'Terminator'}    
  ])
  const selectedDropdownData = ref<option[]>([])

  const setSelectedData = (data: option[]) => {
    selectedDropdownData.value = data
  }


  return { options, selectedDropdownData, setSelectedData }
 
})
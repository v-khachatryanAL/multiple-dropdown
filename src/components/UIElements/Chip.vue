<template>
    <div class="w-max bg-indigo-500 rounded-full px-2 flex gap-1 items-center">
        <span class= "text-white text-sm pb-0.5 leading-5 max-w-[150px] truncate">
            {{label}}
        </span>
        <button @click="$emit('remove')" class="text-white cursor-pointer leading-3 text-xs">&#x2715;</button>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        label: string
    }>()
    const emit = defineEmits<{
        (e: 'remove'): void
    }>()
</script>
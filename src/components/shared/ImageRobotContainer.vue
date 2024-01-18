<template>
  <div class="max-h-[35vh] lg:max-h-[70vh] h-full w-full lg:w-[40%]">
    <img :src="getDynamicImage()" alt="img" class="h-full object-contain w-full" />
  </div>
</template>
  
<script setup lang="ts">

  interface Props {
    hoveredRobotItem: string
  }

  const props = withDefaults(defineProps<Props>(), {
    hoveredRobotItem: ''
  })
  const getDynamicImage = () => {
      return new URL(`../../assets/images/${props.hoveredRobotItem}`, import.meta.url).href;
  };  
</script>
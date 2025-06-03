// App.vue
<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { provide, onMounted, onUnmounted } from 'vue'
import { useInactivity } from './config/useInActivity'

// Получаем тип возвращаемого значения из useInactivity
type InactivityComposable = ReturnType<typeof useInactivity>;

const inactivity = useInactivity()
provide<InactivityComposable>('inactivity', inactivity)

onMounted(() => inactivity.inactivityTime())
onUnmounted(() => inactivity.clearInactiveTime())
</script>

<style scoped>
</style>
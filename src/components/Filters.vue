<template>
    <div class="filters">
        <Button
            v-for="category in categories"
            :key="category.id"
            :class="{ active: activeFilters.includes(category.id) }"
            @click="toggleFilter(category.id)"
        >
            {{ category.title }}
        </Button>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits} from 'vue';
import Button from './Button.vue';
interface Category {
  id: number;
  title: string;
}

defineProps<{ categories: Category[] }>();
// Состояние активных фильтров
const activeFilters = ref<number[]>([]);

// Эмит события
const emit = defineEmits(['filtersSelected']);

// Добавление или удаление фильтра из активных
const toggleFilter = (filter: number) => {
    if (activeFilters.value.includes(filter)) {
        activeFilters.value = activeFilters.value.filter(f => f !== filter);
    } else {
        activeFilters.value.push(filter);
    }
    // Эмитим выбранные фильтры
    emit('filtersSelected', activeFilters.value);
};

</script>

<style scoped lang="scss">
@use '/src/root.scss' as *;
.filters {
    background-color: $white-color;
    border-radius: 48px;
    padding: 20px;
    display: flex;
    gap: 20px;
    pointer-events: all;

    button {
        max-width: 650px;
    }
}

.active {
    background-color: $title-color;
}
</style>
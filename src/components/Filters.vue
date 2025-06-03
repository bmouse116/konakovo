<template>
    <div class="filters">
        <div class="filters-container">
            <Button
                v-for="category in categories"
                :key="category.id"
                :class="{ active: activeFilters.includes(category.id) }"
                @click="toggleFilter(category.id)"
            >
                {{ category.title }}
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import Button from './Button.vue';

interface Category {
  id: number;
  title: string;
}

defineProps<{ categories: Category[] }>();

const activeFilters = ref<number[]>([]);

const emit = defineEmits(['filtersSelected']);

const toggleFilter = (filter: number) => {
    if (activeFilters.value.includes(filter)) {
        activeFilters.value = activeFilters.value.filter(f => f !== filter);
    } else {
        activeFilters.value.push(filter);
    }
    emit('filtersSelected', activeFilters.value);
};
</script>


<style scoped lang="scss">
@use '/src/root.scss' as *; // Убедитесь, что путь правильный
.filters {
    background-color: $white-color;
    border-radius: 48px;
    padding: 20px;
    pointer-events: all;

    .filters-container {
        display: flex;
        gap: 20px;
        overflow-x: auto;
        white-space: nowrap;

        &::-webkit-scrollbar {
            height: 8px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #F3C923;
            border-radius: 4px;
        }

        &::-webkit-scrollbar-track {
            background: #FDF5D3; 
        }
        padding-bottom: 10px; 
        margin-bottom: -10px; 
        button {
            width: var(--afisha-filter-button-width, 600px); 
            flex-shrink: 0;
        }
    }

    .active {
        background-color: $title-color;
    }
}
</style>

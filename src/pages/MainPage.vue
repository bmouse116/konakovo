<template>
    <div class="container">
        <div class="main-container">
            <div v-if="isLoading" class="loader">
                <div class="spinner"></div>
            </div>
            <div class="afisha-preview">
                <div
                    class="afisha-card"
                    v-for="(item) in visibleCards"
                    :key="item.id"
                    @click="openCard(item.id)"
                >
                    <Card :cards="item"></Card>
                </div>
            </div>
            <PreviewAll @click="toAfisha"></PreviewAll>
            <div class="map-container">
                <Map
                :categories="categoriesForFilters"
                :points="filteredPoints"
                :infoOpen="infoOpen"
                @pointClick="openPointInfo"
                @selected-filters="hanldeSelectedFilters"
                @search-update="handleSearchUpdate"
                ></Map>
            </div>
            <PointInfo
            v-if="isPointInfoVisible"
            :point="activePoint"
            @close="closePointInfo"
            ></PointInfo>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import type { useInactivity } from '../config/useInActivity'
import axios from 'axios'
import Card from '../components/MainPage/Card.vue'
import PreviewAll from '../components/MainPage/PreviewAll.vue'
import Map from '../components/MainPage/Map.vue'
import PointInfo from '../components/MainPage/PointInfo.vue'

const router = useRouter()

interface Card {
    id: number;
    title: string;
    date: string;
    image: string;
    categories: Category[];
}

interface Categories {
    id: number;
    title: string;
}

interface Category {
  id: number;
  title: string;
}

interface Points {
  id: number;
  title: string;
  icon: string;
  categories: Category[];
}

interface PointData {
  id: number;
  title: string;
  icon: string;
  category: Category[];
  address?: string;
  phone?: string | null;
  site?: string | null;
  description?: string;
  pointInterestMedia?: Array<{
    id: number;
    media: string;
  }>;
}

const categories = ref<Categories[]>([])
const cards = ref<Card[]>([])
const points = ref<Points[]>([])
const isPointInfoVisible = ref(false)
const activePoint = ref<PointData | null>(null)
const selectedFilters = ref<number[]>([])
const isLoading = ref(true)

const currentCardIndex = ref(0);
let sliderInterval: number | undefined;

const visibleCards = computed(() => {
    if (!cards.value || cards.value.length === 0) {
        return [];
    }
    return cards.value.slice(currentCardIndex.value, currentCardIndex.value + 2);
});

const slideNextCard = () => {
    if (!cards.value || cards.value.length <= 2) {
        return;
    }
    const nextStartIndex = currentCardIndex.value + 2;
    if (nextStartIndex < cards.value.length) {
        currentCardIndex.value = nextStartIndex;
    } else {
        currentCardIndex.value = 0;
    }
};

const fetchAfisha = async () => {
    try {
        const response = await axios.get('https://api-konakovo.test.itlabs.top/api/afisha')
        cards.value = response.data.map((item: any): Card => ({
            id: item.id,
            title: item.title,
            date: item.date,
            image: item.image,
            categories: item.categories.map((category: any) => ({
                id: category.id,
                title: category.title,
            })),
        }))
    } catch (error) {
        console.error('Ошибка при загрузке афиши:', error)
    }
}

const fetchCategories = async() => {
    try {
        const response = await axios.get('https://api-konakovo.test.itlabs.top/api/category')
        categories.value = response.data
    }
    catch(error) {
        console.log(error)
    }
}

const fetchPoints = async () => {
  try {
    const response = await axios.get('https://api-konakovo.test.itlabs.top/api/point');
    points.value = response.data.map((point: any) => ({
      id: point.id,
      title: point.title,
      icon: point.icon,
      categories: point.categories.map((category: any) => ({
        id: category.id,
        title: category.title,
      })),
    }));
  } catch (error) {
    console.log(error);
  }
};

const fetchData = async () => {
  try {
    await Promise.all([fetchAfisha(), fetchCategories(), fetchPoints()]);
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  } finally {
    isLoading.value = false;
  }
};
const searchQuery = ref('');

const categoriesForFilters = computed(() => {
    if (!points.value || points.value.length === 0 || !categories.value || categories.value.length === 0) {
        return [];
    }
    const usedCategoryIds = new Set<number>();
    points.value.forEach(point => {
        if (point.categories && Array.isArray(point.categories)) {
            point.categories.forEach(cat => {
                usedCategoryIds.add(cat.id);
            });
        }
    });
    if (usedCategoryIds.size === 0) {
        return [];
    }
    return categories.value.filter(category => usedCategoryIds.has(category.id));
});

const filteredPoints = computed(() => {
    let result = points.value;
    
    if (selectedFilters.value.length > 0) {
        result = result.filter(point => 
            point.categories.some(category => 
                selectedFilters.value.includes(category.id)
            )
        );
    }
    
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(point => 
            point.title.toLowerCase().includes(query)
        );
    }
    
    return result;
});

const handleSearchUpdate = (query: string) => {
    if(isPointInfoVisible.value === true){
        searchQuery.value = ''
    }else{
        searchQuery.value = query;
    }
};

const infoOpen = ref(false)

const openPointInfo = (pointDetails: PointData) => {
    activePoint.value = pointDetails;
    isPointInfoVisible.value = true;
    infoOpen.value = true
}

const closePointInfo = () => {
    isPointInfoVisible.value = false;
    infoOpen.value = false
    activePoint.value = null;
    handleSearchUpdate('')
}

const toAfisha = () => {
    router.push('/afisha')
}

const openCard = (id: number) => {
    router.push({
        name: 'AfishaInfo',
        params: {id}
    })
}

const hanldeSelectedFilters = (filters: number[], showFilters: Boolean) => {
    if(showFilters === false){
        selectedFilters.value = []
    }
    else {
        selectedFilters.value = filters
    }
}

const inactivity = inject<ReturnType<typeof useInactivity>>('inactivity');
let unregisterInactivityCallback: (() => void) | null = null;

onMounted(async () => {
    await fetchData();

    if (inactivity && inactivity.registerOnInactive) {
        unregisterInactivityCallback = inactivity.registerOnInactive(() => {
            if (isPointInfoVisible.value) {
                closePointInfo();
            }
        });
    }

    if (cards.value.length > 2) {
        sliderInterval = window.setInterval(slideNextCard, 30000); //миллисекунды
    }
});

onUnmounted(() => {
    if (unregisterInactivityCallback) {
        unregisterInactivityCallback();
    }
    if (sliderInterval) {
        clearInterval(sliderInterval);
    }
});
</script>

<style scoped lang="scss">
@use '../root.scss' as *;

.main-container {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .afisha-preview {
        display: flex;
        gap: 20px;
        overflow: hidden;

        .afisha-card {
            width: 100%;
            animation-name: slideInFromRightSmooth;
            animation-duration: 0.6s;
            animation-fill-mode: forwards;
            animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);

        }
    }
}
@keyframes slideInFromRightSmooth {
    from {
        opacity: 0;
        transform: translateX(30%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

</style>
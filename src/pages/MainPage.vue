<template>
    <div class="container">
        <div class="main-container">
            <div v-if="isLoading" class="loader">
                <div class="spinner"></div>
            </div>
            <div class="afisha-preview">
                <div
                    class="afisha-card"
                    v-for="(item) in cards.slice(0, 2)"
                    :key="item.id"
                    @click="openCard(item.id)"
                >
                    <Card :cards="item"></Card>
                </div>
            </div>
            <PreviewAll @click="toAfisha"></PreviewAll>
            <div class="map-container">
                <Map
                :categories="categories"
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

const fetchAfisha = async () => {
    try {
        const response = await axios.get('https://api-konakovo.test.itlabs.top/api/afisha')
        cards.value = response.data.map((item: any) => ({
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
    isLoading.value = false; // Отключаем загрузчик после завершения
  }
};
const searchQuery = ref('');

const filteredPoints = computed(() => {
    let result = points.value;
    
    // Фильтрация по категориям
    if (selectedFilters.value.length > 0) {
        result = result.filter(point => 
            point.categories.some(category => 
                selectedFilters.value.includes(category.id)
            )
        );
    }
    
    // Фильтрация по поисковому запросу
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

onMounted(() => {
    fetchData()
    if (inactivity && inactivity.registerOnInactive) {
        unregisterInactivityCallback = inactivity.registerOnInactive(() => {
            if (isPointInfoVisible.value) {
                closePointInfo();
                console.log('PointInfo closed due to inactivity.');
            }
        });
    }
})

onUnmounted(() => {
    if (unregisterInactivityCallback) {
        unregisterInactivityCallback();
    }
})
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
        .afisha-card {
            width: 100%;
        }
    }
}
</style>
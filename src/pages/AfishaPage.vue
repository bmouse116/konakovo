<template>
    <div class="afisha container">
        <div v-if="isLoading" class="loader">
            <div class="spinner"></div>
        </div>
        <div class="list-container" v-else>
            <div class="scrollable-area">
                <div class="afisha-list">
                    <div class="afisha-card" v-for="(item) in filteredAfisha" :key="item.id" @click="openCard(item.id)">
                        <Card :cards="item"></Card>
                    </div>
                </div>
            </div>
        </div>
        <Navigation :isMap="false" :isInfo="false" @selectedFilters="hanldeSelectedFilters" :categories="categories"></Navigation>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Navigation from '../components/MainPage/Navigation.vue';
import Card from '../components/MainPage/Card.vue';
import axios from 'axios';

const isLoading = ref(true)
const router = useRouter()

interface Afisha {
    id: number;
    title: string;
    date: string;
    image: string;
    categories: Category[]
}

interface Category {
    id: number;
    title: string;
}

const categories = ref<Category[]>([]);
const afisha = ref<Afisha[]>([])
const selectedFilters = ref<number[]>([])

// Вычисляемое свойство для отфильтрованных афиш
const filteredAfisha = computed(() => {
    if (selectedFilters.value.length === 0) {
        return afisha.value;
    }
    return afisha.value.filter(item => 
        item.categories.some(category => 
            selectedFilters.value.includes(category.id)
        )
    );
});

const fetchCategories = async () => {
    try {
        const response = await axios.get('https://api-konakovo.test.itlabs.top/api/category');
        categories.value = response.data;
    } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
    }
    finally {
        isLoading.value = false
    }
};

const fetchAfisha = async() => {
    try {
        const response = await axios.get('https://api-konakovo.test.itlabs.top/api/afisha')
        afisha.value = response.data
    }
    catch(error) {
        console.log(error)
    }
}

const openCard = (id: number) => {
    router.push({name: 'AfishaInfo', params: {id}})
}

const hanldeSelectedFilters = (filters: number[], showFilters: Boolean) => {
    selectedFilters.value = showFilters ? filters : [];
}

onMounted(() => {
    fetchAfisha()
    fetchCategories()
})
</script>

<style scoped lang="scss">
@use '/src/root.scss' as *;
.afisha {
    display: flex;
    flex-direction: column;
    gap: 40px;
    .navigation {
        max-width: 2040px;
        width: 100%;
    }
    .list-container {
        height: 3511px;
        background-color: $afisha-background;
        border-radius: 68px;
        margin: 0 auto;
        padding-right: 40px;
        box-sizing: border-box;
        .scrollable-area {
            height: 100%;
            overflow-y: auto; 
            scrollbar-width: thin;
            scrollbar-color: #F3C923 #FDF5D3;
            &::-webkit-scrollbar {
                width: 20px;
            }
            &::-webkit-scrollbar-track {
                background: #FDF5D3; 
                border-radius: 20px;
                margin-top: 40px;
                margin-bottom: 40px;
            }
            &::-webkit-scrollbar-thumb {
                background-color: #F3C923;
                border-radius: 10px;
            }
            &::-webkit-scrollbar-thumb:hover {
                background-color: #a50606;
            }

            .afisha-list {
                height: auto;
                width: 100%;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                padding: 40px;
                padding-right: 20px;

                .afisha-card {
                    max-width: 950px;
                    width: 100%;
                    height: 879px;
                     ::v-deep(.card) {
                        height: 879px;

                        .card-content {
                            
                            .card-img {
                                height: 682px;
                                img {
                                    height: 682px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
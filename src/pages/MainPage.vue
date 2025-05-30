<template>
    <div class="container">
        <div class="main-container">
            <div class="afisha-preview">
                <div 
                    class="afisha-card" 
                    v-for="(item, index) in cards.slice(0, 2)" 
                    :key="item.id"
                    @click="openCard(item.id)"
                >
                    <Card :cards="item"></Card>
                </div>
            </div>
            <PreviewAll @click="toAfisha"></PreviewAll>
            <div class="map-container">
                <Map :categories="categories" :points="points"></Map>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Card from '../components/MainPage/Card.vue'
import PreviewAll from '../components/MainPage/PreviewAll.vue'
import Map from '../components/MainPage/Map.vue'

const router = useRouter()

interface Card {
    id: number;
    title: string;
    date: string;
    image: string;
}

interface Categories {
    id: number;
    title: string;
}

interface Points {
    id: number,
    title: string,
    icon: string
}

const categories = ref<Categories[]>([])
const cards = ref<Card[]>([])
const points = ref<Points[]>([])

const fetchAfisha = async() => {
    try {
        const response = await axios.get('https://api-konakovo.test.itlabs.top/api/afisha')
        cards.value = response.data
        console.log(cards.value)
    }
    catch(error) {
        console.log(error)
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

const fetchPoints = async() => {
    try {
        const response = await axios.get('https://api-konakovo.test.itlabs.top/api/point')
        points.value = response.data
    }
    catch(error) {
        console.log(error)
    }
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



onMounted(() => {
    fetchAfisha()
    fetchCategories()
    fetchPoints()
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
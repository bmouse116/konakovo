<template>
    <div class="info container">
        <div class="info-container">
            <div class="info-padding">
                <div v-if="isLoading" class="loader">
                    <div class="spinner"></div>
                </div>
                <div class="info-main" v-else>
                    <div class="info-img">
                        <img :src="fullImageUrl" alt="" v-if="cardDetails?.image">
                        <p v-else>Изображение отсутствует</p>
                    </div>
                    <div class="info-body">
                        <div class="body-header">
                            <h2>{{ cardDetails?.title }}</h2>
                            <div class="header-date">
                                <span>{{ formattedDate }}</span>
                                <span>{{ formattedTime }}</span>
                            </div>
                        </div>
                        <div class="body-main">
                            <p>{{ cardDetails?.description }}</p>
                            <div class="main-description">
                                <h5>{{ cardDetails?.place }}</h5>
                                <div class="description-contacts">
                                    <h5>https://faience.konakovo.org</h5>
                                    <h5>{{ cardDetails?.contact }}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Navigation :isMap="false" :isInfo="true"></Navigation>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Navigation from '../components/MainPage/Navigation.vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

const route = useRoute()
const id = route.params.id
const isLoading = ref(true)
interface CardDetails {
    id: number,
    title: string,
    description: string,
    date: string,
    place: string,
    contact: string,
    image: string
}

const cardDetails = ref<CardDetails>()

const fetchDetails = async() => {
    try {
        const response = await axios.get(`https://api-konakovo.test.itlabs.top/api/afisha/${id}`)
        cardDetails.value = response.data
    }
    catch(error) {
        console.log(error)
    }
    finally {
        isLoading.value = false
    }
}

const BASE_URL = 'https://api-konakovo.test.itlabs.top'

// Полный путь к изображению
const fullImageUrl = computed(() => `${BASE_URL}${cardDetails.value?.image}`)


const formattedDate = computed(() => {
    if (!cardDetails.value?.date) return '';
    const date = new Date(cardDetails.value.date);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
    });
});

const formattedTime = computed(() => {
    if (!cardDetails.value?.date) return '';
    const date = new Date(cardDetails.value.date);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
});

onMounted(() => {
    fetchDetails()
})
</script>

<style scoped lang="scss">
@use '/src/root.scss' as *;
.info {
    height: 100vh;
}
.info-container {
    background-color: $second-background;
    height: 100%;
    border-radius: 48px;
    padding: 60px;
    .info-padding {
        position: relative;
        height: 100%;
        ::v-deep(.navigation) {
            max-width: 2040px;
            width: 100%;
            height: 129px;
            bottom: -20px;
            margin-left: -20px;
            .navigation-container {
                .search-bar {
                    background-color: transparent;
                    display: flex;
                    align-items: center;
                    height: 129px;
                    padding: 0;
                }
            }
        }
    }
    .info-main {
        display: flex;
        flex-direction: column;
        gap: 40px;
        .info-img {
            max-width: 1920px;
            width: 100%;
            height: 1439px;
            border-radius: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 100%;
                height: 100%;
            }
            p {
                font-size: 64px;
            }
        }
        .info-body {
            background-color: $white-color;
            max-width: 1920px;
            width: 100%;
            height: 1408px;
            border-radius: 48px;
            .body-header {
                width: 100%;
                height: 428px;
                background-color: $title-color;
                border: 8px solid $title-border;
                border-top-left-radius: 48px;
                border-top-right-radius: 48px;
                padding: 40px;
                display: flex;
                flex-direction: column;
                gap: 44px;
                h2 {
                    font-size: 80px;
                    line-height: 110%;
                    font-family: 'Inter';
                    font-weight: 700;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    min-height: 176px;
                }

                .header-date {
                    font-size: 80px;
                    width: 100%;
                    height: 128px;
                    display: flex;
                    justify-content: space-between;

                    span {
                        max-width: 368px;
                        width: 100%;
                        height: 128px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 68px;
                        background-color: $white-color;
                    }
                }
            }
            .body-main {
                display: flex;
                flex-direction: column;
                gap: 120px;
                padding: 40px;
                position: relative;
                height: 980px;
                p {
                    font-size: 64px;
                    font-family: 'Inter';
                    line-height: 110%;
                    -webkit-line-clamp: 9;
                    -webkit-box-orient: vertical;
                    overflow-y: auto;
                    overflow-x: hidden;
                    min-height: 635px;
                    max-height: 635px;
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
                }
                .main-description {
                    position: absolute;
                    bottom: 20px;
                    width: 100%;
                    h5 {
                        font-size: 64px;
                        font-weight: 700;
                        font-family: 'Inter';
                    }
                    .description-contacts {
                        display: flex;
                        justify-content: space-between;
                        padding-right: 4%;
                    }
                }
            }
        }
    }
}
</style>
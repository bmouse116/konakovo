<template>
    <div class="card">
        <div class="card-content">
            <div class="card-img">
                <img :src="fullImageUrl" alt="" v-if="cards.image" loading="lazy">
                <p v-else>Изображение отсутствует</p>
            </div>
            <div class="card-title">
                <h3>{{ cards.title }}</h3>
                <span>{{formattedDate}}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Card {
    id: number;
    title: string;
    date: string;
    image: string;
}

const props = defineProps<{
    cards: Card
}>()

const BASE_URL = 'https://api-konakovo.test.itlabs.top'

// Полный путь к изображению
const fullImageUrl = computed(() => `${BASE_URL}${props.cards.image}`)


const formattedDate = computed(() => {
    const date = new Date(props.cards.date)
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit'
    })
})
</script>

<style scoped lang="scss">
@use '/src/root.scss' as *;
.card {
    max-width: 1010px;
    width: 100%;
    height: 924px;
    background-color: $second-background;
    border-radius: 48px;
    padding: 20px;
    .card-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
        justify-content: center;
        .card-title {
            background-color: $title-color;
            border: 8px solid $title-border;
            max-width: 970px;
            width: 100%;
            height: 145px;
            border-radius: 28px;
            padding-left: 40px;
            h3 {
                font-size: 48px;
                max-height: 53px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            span {
                font-size: 40px;
            }
        }
        .card-img {
            border-radius: 28px;
            max-width: 970px;
            width: 100%;
            height: 727px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 100%;
                height: 100%;
            }
            p {
                font-size: 48px;
            }
        }
    }
}
</style>
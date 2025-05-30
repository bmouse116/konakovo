<template>
    <div class="navigation">
        <div class="navigation-container">
            <div class="scalling" v-if="isMap">
                <div class="control minus" @click="emit('zoomOut')">
                    <img src="/src/assets/img/svg/minus.svg" alt="Уменьшить">
                </div>
                <div class="control plus" @click="emit('zoomIn')">
                    <img src="/src/assets/img/svg/pluse.svg" alt="Увеличить">
                </div>
                <div class="control loop">
                    <img src="/src/assets/img/svg/loop.svg" alt="">
                </div>
            </div>
            <Filters v-if="showFilters" @filtersSelected="handleFilterSelected" :categories="categories"></Filters>
            <div class="search-bar">
                <Input 
                v-if="isMap" 
                @click="openKeyboard" 
                :handleVisible="handleVisible"
                :value="searchText"
                @input="updateSearchText"
                ></Input>
                <ButtonIcon v-else-if="!isMap" @click="toBack">
                    <template #icon>
                        <svg width="39" height="67" viewBox="0 0 39 67" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M37.5355 65.3195C38.4728 64.3819 38.9994 63.1103 38.9994 61.7845C38.9994 60.4587 38.4728 59.1871 37.5355 58.2495L12.7855 33.4995L37.5355 8.74949C38.4463 7.80648 38.9502 6.54347 38.9389 5.23248C38.9275 3.92149 38.4016 2.66743 37.4746 1.74039C36.5475 0.813351 35.2935 0.28751 33.9825 0.27612C32.6715 0.264729 31.4085 0.768696 30.4655 1.67949L2.18048 29.9645C1.24313 30.9021 0.716553 32.1737 0.716553 33.4995C0.716553 34.8253 1.24313 36.0968 2.18048 37.0345L30.4655 65.3195C31.4031 66.2568 32.6747 66.7834 34.0005 66.7834C35.3263 66.7834 36.5978 66.2568 37.5355 65.3195Z" fill="#DDB415"/>
                        </svg>
                    </template>
                    <template #label>
                        Назад
                    </template>
                </ButtonIcon>
                <ButtonIcon @click="openFilters" :showFilters="showFilters" v-if="!isInfo && !handleVisible">
                    <template #icon>
                        <svg width="62" height="66" viewBox="0 0 62 66" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="!showFilters">
                            <path d="M56 1.1875C57.409 1.1875 58.7605 1.74688 59.7568 2.74316L59.9385 2.93457C60.8207 3.90906 61.3125 5.17921 61.3125 6.5V13.4531L61.3037 13.7998C61.2234 15.4095 60.5879 16.9421 59.5059 18.1367L59.2676 18.3877L41.3125 36.3428V60.96L41.3047 61.2139C41.2724 61.7198 41.1439 62.2152 40.9258 62.6729L40.8086 62.8975C40.5196 63.416 40.119 63.8627 39.6367 64.2051L39.4258 64.3457C38.921 64.6577 38.3534 64.8518 37.7656 64.916L37.5117 64.9355C36.919 64.9621 36.3288 64.8561 35.7842 64.626L35.5537 64.5195L23.1641 58.3262C22.5131 58.0007 21.9522 57.5221 21.5293 56.9336L21.3564 56.6748C20.9192 55.9673 20.6876 55.152 20.6875 54.3203V36.3428L2.73242 18.3877C1.42348 17.0792 0.687895 15.304 0.6875 13.4531V6.5C0.6875 5.09104 1.24688 3.73945 2.24316 2.74316L2.43457 2.56152C3.40906 1.67926 4.67921 1.1875 6 1.1875H56ZM7.97949 13.3242L26.4209 31.7656L26.6016 31.9551C27.0109 32.4064 27.3403 32.9252 27.5742 33.4893L27.668 33.7334C27.8734 34.3071 27.9794 34.9127 27.9795 35.5234V52.5801L34.0205 55.6006V35.5234C34.0205 34.1141 34.5806 32.761 35.5801 31.7686L54.0205 13.3213V8.47949H7.97949V13.3242Z" fill="#DDB415" stroke="#DDB415" stroke-width="0.625"/>
                        </svg>
                        <svg width="62" height="66" viewBox="0 0 62 66" fill="none" xmlns="http://www.w3.org/2000/svg" v-else>
                            <path d="M56 1.1875C57.409 1.1875 58.7605 1.74688 59.7568 2.74316L59.9385 2.93457C60.8207 3.90906 61.3125 5.17921 61.3125 6.5V13.4531L61.3037 13.7998C61.2234 15.4095 60.5879 16.9421 59.5059 18.1367L59.2676 18.3877L41.3125 36.3428V60.96L41.3047 61.2139C41.2724 61.7198 41.1439 62.2152 40.9258 62.6729L40.8086 62.8975C40.5196 63.416 40.119 63.8627 39.6367 64.2051L39.4258 64.3457C38.921 64.6577 38.3534 64.8518 37.7656 64.916L37.5117 64.9355C36.919 64.9621 36.3288 64.8561 35.7842 64.626L35.5537 64.5195L23.1641 58.3262C22.5131 58.0007 21.9522 57.5221 21.5293 56.9336L21.3564 56.6748C20.9192 55.9673 20.6876 55.152 20.6875 54.3203V36.3428L2.73242 18.3877C1.42348 17.0792 0.687895 15.304 0.6875 13.4531V6.5C0.6875 5.09104 1.24688 3.73945 2.24316 2.74316L2.43457 2.56152C3.40906 1.67926 4.67921 1.1875 6 1.1875H56ZM7.97949 13.3242L26.4209 31.7656L26.6016 31.9551C27.0109 32.4064 27.3403 32.9252 27.5742 33.4893L27.668 33.7334C27.8734 34.3071 27.9794 34.9127 27.9795 35.5234V52.5801L34.0205 55.6006V35.5234C34.0205 34.1141 34.5806 32.761 35.5801 31.7686L54.0205 13.3213V8.47949H7.97949V13.3242Z" fill="#373737" stroke="#373737" stroke-width="0.625"/>
                        </svg>
                    </template>
                    <template #label>
                        Фильтр
                    </template>
                </ButtonIcon>
            </div>
            <Keyboard 
            v-if="handleVisible" 
            @close="closeKeyboard"
            @keypress="handleKeyPress"
            @backspace="handleBackspace"
            ></Keyboard>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Filters from '../Filters.vue'
import Input from '../Input.vue'
import ButtonIcon from '../ButtonIcon.vue'
import Keyboard from '../Keyboard.vue'
import { ref } from 'vue'

const router = useRouter()
const showFilters = ref(false)
const searchText = ref('')

interface Category {
    id: number;
    title: string;
}

const props = defineProps({
    isMap: {
        type: Boolean,
        default: true
    },
    isInfo: {
        type: Boolean,
        default: false
    },
    categories: {
        type: Array as () => Category[], // Properly type the categories prop
        required: false, // Делаем необязательным
        default: () => []
    },
    isVisible: {
        type: Boolean,
        default: false
    }
})


const handleVisible = ref(Boolean(props.isVisible))
const emit = defineEmits(['selectedFilters', 'zoomIn', 'zoomOut', 'search-update'])

const updateSearchText = (e: Event) => {
  searchText.value = (e.target as HTMLInputElement).value;
};

const openKeyboard = () => {
  handleVisible.value = true;
};

const closeKeyboard = () => {
  handleVisible.value = false;
};

const handleKeyPress = (key: string) => {
  searchText.value += key;
  emit('search-update', searchText.value);
};

const handleBackspace = () => {
  searchText.value = searchText.value.slice(0, -1);
  emit('search-update', searchText.value);
};

const toBack = () => {
    if(props.isInfo === true){
        router.push('/afisha')
    } else {
        router.push('/')
    }
}

const openFilters = () => {
    if(showFilters.value === true) {
        showFilters.value = false
    } else {
        showFilters.value = true
    }
}

const selectedFilters = ref<string[]>([]);

const handleFilterSelected = (filters: string[]) => {
    selectedFilters.value = filters;
    emit('selectedFilters', selectedFilters.value)
}

</script>

<style scoped lang="scss">
@use '/src/root.scss' as *;
.navigation {
    position: absolute;
    width: 1880px;
    bottom: 80px;
    left: 50%;
    transform: translate(-50%);
    .navigation-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        .scalling {
            height: 536px;
            width: 168px;
            background-color: $white-color;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 20px;
            border-radius: 68px;
            margin-left: auto;
            .control {
                background-color: $title-color;
                border: 8px solid $title-border;
                border-radius: 48px;
                display: flex;
                justify-content: center;
            }
            .minus, .plus {
                width: 128px;
                height: 128px;
                &:active {
                    background-color: $title-border;
                }
            }
            .loop {
                height: 200px;
                width: 128px;
                &:active {
                    background-color: $title-border;
                }
            }
        }
        .search-bar {
            background-color: $white-color;
            border-radius: 68px;
            display: flex;
            gap: 20px;
            padding: 20px;
            justify-content: space-between;
        }
    }
}

</style>
<template>
  <div 
    v-if="isVisible" 
    class="point-info-container" 
    @animationend="handleAnimationEnd" 
    :class="{ 'closing': isClosing }"
  >
    <div class="point-info-content">
      <div class="point-info-header">
        <div class="img">
          <button 
            v-if="hasMultipleMedia" 
            class="nav-button left" 
            @click="prevMedia"
          >
            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 40L0 20L20 0L23.8 3.8L7.6 20L23.8 36.2L20 40Z" fill="#DDB415"/>
            </svg>
          </button>
          
          <div class="media-container">
            <img 
              v-if="currentMediaType === 'image'"
              :src="getCurrentMediaUrl()" 
              alt="Point Image"
              
            >
            <video
              v-else-if="currentMediaType === 'video'"
            ref="videoPlayer"
            :src="getCurrentMediaUrl()"
            @click="toggleVideoPlay"
            controls
            class="video-player"
            >
            Ваш браузер не поддерживает данный плеер
            </video>
            <p v-else>Медиа отсутствует</p>
          </div>
          
          <button 
            v-if="hasMultipleMedia" 
            class="nav-button right" 
            @click="nextMedia"
          >
            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 0L24 20L4 40L0.2 36.2L16.4 20L0.2 3.8L4 0Z" fill="#DDB415"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="point-info-details">
        <div class="details-header">
          <h2>{{ point?.title }}</h2>
        </div>
        <div class="details-description">
            <p>{{ point?.description }}</p>
            <div class="details-contact">
                <span>{{ point?.address }}</span>
                <div class="contact-details">
                    <span>{{ point?.site }}</span>
                    <span>{{ point?.phone }}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
    <ButtonIcon @click="startClosing">
      <template #icon>
        <svg width="39" height="67" viewBox="0 0 39 67" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M37.5355 65.3195C38.4728 64.3819 38.9994 63.1103 38.9994 61.7845C38.9994 60.4587 38.4728 59.1871 37.5355 58.2495L12.7855 33.4995L37.5355 8.74949C38.4463 7.80648 38.9502 6.54347 38.9389 5.23248C38.9275 3.92149 38.4016 2.66743 37.4746 1.74039C36.5475 0.813351 35.2935 0.28751 33.9825 0.27612C32.6715 0.264729 31.4085 0.768696 30.4655 1.67949L2.18048 29.9645C1.24313 30.9021 0.716553 32.1737 0.716553 33.4995C0.716553 34.8253 1.24313 36.0968 2.18048 37.0345L30.4655 65.3195C31.4031 66.2568 32.6747 66.7834 34.0005 66.7834C35.3263 66.7834 36.5978 66.2568 37.5355 65.3195Z" 
            fill="#DDB415"
          />
        </svg>
      </template>
      <template #label>Назад</template>
    </ButtonIcon>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import ButtonIcon from '../ButtonIcon.vue';
interface Category {
  id: number;
  title: string;
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
    type?: 'image' | 'video'; // Добавляем тип медиа
  }>;
}

const props = defineProps({
  point: {
    type: Object as () => PointData | null,
    required: true
  },
});

const emit = defineEmits(['close'])

const BASE_URL = 'https://api-konakovo.test.itlabs.top';
const getFullImageUrl = (icon: string) => `${BASE_URL}${icon}`;


const isVisible = ref(true);
const isClosing = ref(false);
const currentMediaIndex = ref(0);

const toggleVideoPlay = (event: MouseEvent) => {
  const videoElement = event.target as HTMLVideoElement;
  if (videoElement.paused) {
    videoElement.play().catch(e => console.error("Ошибка воспроизведения:", e));
  } else {
    videoElement.pause();
  }
};

const hasMedia = computed(() => {
  return props.point?.pointInterestMedia && props.point.pointInterestMedia.length > 0;
});

const hasMultipleMedia = computed(() => {
  return hasMedia.value && props.point!.pointInterestMedia!.length > 1;
});

const currentMediaType = computed(() => {
  if (!hasMedia.value) return null;
  const media = props.point!.pointInterestMedia![currentMediaIndex.value];
  
  // Определяем тип медиа по расширению файла, если тип не указан явно
  if (media.type) return media.type;
  const extension = media.media.split('.').pop()?.toLowerCase();
  return extension && ['mp4', 'webm', 'ogg'].includes(extension) ? 'video' : 'image';
});

const getCurrentMediaUrl = () => {
  if (!hasMedia.value) return '';
  return getFullImageUrl(props.point!.pointInterestMedia![currentMediaIndex.value].media);
};

const nextMedia = () => {
  if (!hasMedia.value) return;
  currentMediaIndex.value = (currentMediaIndex.value + 1) % props.point!.pointInterestMedia!.length;
};

const prevMedia = () => {
  if (!hasMedia.value) return;
  currentMediaIndex.value = (currentMediaIndex.value - 1 + props.point!.pointInterestMedia!.length) % props.point!.pointInterestMedia!.length;
};

const startClosing = () => {
  isClosing.value = true;
};

const handleAnimationEnd = () => {
  if (isClosing.value) {
    isVisible.value = false;
    isClosing.value = false;
    emit('close');
  }
};
</script>

<style scoped lang="scss">
@use '/src/root.scss' as *;

.point-info-container {
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  background-color: $second-background;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  max-width: 2040px;
  margin: 0 auto;
  border-radius: 68px;
  height: 3150px;
  padding: 40px;
  animation: slide-up 0.3s ease-out;
}

.point-info-container.closing {
  animation: slide-down 0.3s ease-in;
}

.point-info-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.point-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .img {
    position: relative;
    max-width: 1960px;
    width: 100%;
    height: 1306px;
    border-radius: 48px;
    background-color: $white-color;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .media-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      img, video {
        width: 100%;
        height: 100%;
        border-radius: 48px;
        background-color: black;
      }
    }
    
    p {
      font-size: 64px;
    }
    
    .nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      border: none;
      background: transparent;
      border-radius: 50%;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      
      svg {
        width: 100%;
        height: 100%;
      }
      
      &.left {
        left: 2%;
      }
      
      &.right {
        left: 93%;
      }
    }
  }
}

.point-info-details {
  max-width: 1960px;
  width: 100%;
  .details-header {
    width: 100%;
    height: 292px;
    border-top-right-radius: 48px;
    border-top-left-radius: 48px;
    background-color: $title-color;
    border: 8px solid $title-border;
    padding: 40px;
    h2 {
        font-size: 92px;
        color: $text-color;
        line-height: 110%;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
  }
  .details-description {
    width: 100%;
    height: 1050px;
    border-bottom-left-radius: 48px;
    border-bottom-right-radius: 48px;
    background-color: $white-color;
    padding: 40px;
    position: relative;
    p {
        font-size: 64px;
        font-family: 'Inter';
        line-height: 110%;
        -webkit-line-clamp: 10;
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
    .details-contact {
        font-family: 'Inter';
        font-size: 64px;
        font-weight: 700;
        display: flex;
        flex-direction: column;
        position: absolute;
        bottom: 40px;
        width: 1840px;
        .contact-details {
            display: flex;
            justify-content: space-between;
        }
    }
  }
}

button {
  position: absolute;
  bottom: 40px;
  left: 40px;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}
</style>
<template>
    <div class="map" ref="mapContainerRef">
        <div 
            class="map-content"
            ref="mapContentRef"
            @pointerdown="onPointerDown"
            @wheel.prevent="onWheel" 
        >
            <img 
                ref="imgRef"
                src="/src/assets/img/map.png" 
                alt="Карта путеводителя"
                :style="imageStyle"
                @load="onImageLoad" 
            >
        </div>
        <Navigation 
            :isMap="true" 
            :isInfo="false" 
            :categories="categories"
            @zoomIn="handleZoomIn"
            @zoomOut="handleZoomOut"
        ></Navigation>
    </div>
    <div class="points">
        <div 
            v-for="point in points" 
            :key="point.id" 
            class="point"
        >
            <img :src="getFullImageUrl(point.icon)" :alt="point.title">
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import Navigation from './Navigation.vue'

interface Categories {
  id: number;
  title: string;
}

interface Points {
  id: number,
  title: string,
  icon: string
}

const props = defineProps({
  categories: {
    type: Array as () => Categories[],
    required: false,
    default: () => []
  },
  points: {
    type: Array as () => Points[],
    required: true,
  }
})


const BASE_URL = 'https://api-konakovo.test.itlabs.top';

// Функция для получения полного URL изображения
const getFullImageUrl = (icon: string) => `${BASE_URL}${icon}`;


const mapContainerRef = ref<HTMLDivElement | null>(null);
const mapContentRef = ref<HTMLDivElement | null>(null);
const imgRef = ref<HTMLImageElement | null>(null);

const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);

const isDragging = ref(false);
const lastPointerPosition = ref({ x: 0, y: 0 });

const imageNaturalDimensions = ref({ width: 3842, height: 4485 });
const containerDimensions = ref({ width: 0, height: 0 });

const MIN_SCALE = 0.6;
const MAX_SCALE = 2.5;
const ZOOM_SENSITIVITY_BUTTON = 1.2;
const ZOOM_SENSITIVITY_WHEEL = 0.001;

const imageStyle = computed(() => ({
  transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
  width: `${imageNaturalDimensions.value.width}px`,
  height: `${imageNaturalDimensions.value.height}px`,
  willChange: 'transform', // For performance
  userSelect: 'none',
  webkitUserDrag: 'none',
}));

function updateContainerDimensions() {
  if (mapContentRef.value) {
    containerDimensions.value = {
      width: mapContentRef.value.clientWidth,
      height: mapContentRef.value.clientHeight,
    };
  }
}

function onImageLoad() {
    if (imgRef.value) {
        imageNaturalDimensions.value = {
            width: imgRef.value.offsetWidth,
            height: imgRef.value.offsetHeight,
        };
    }
    initializeMapState();
}


function initializeMapState() {
  updateContainerDimensions();
  if (!containerDimensions.value.width || !imageNaturalDimensions.value.width) return;

  scale.value = 1;
  translateX.value = (containerDimensions.value.width - imageNaturalDimensions.value.width * scale.value) / 2;
  translateY.value = (containerDimensions.value.height - imageNaturalDimensions.value.height * scale.value) / 2;
  
  applyBoundaryConstraints();
}

function applyBoundaryConstraints() {
  if (!containerDimensions.value.width || !imageNaturalDimensions.value.width) return;

  const scaledWidth = imageNaturalDimensions.value.width * scale.value;
  const scaledHeight = imageNaturalDimensions.value.height * scale.value;

  let minX, maxX, minY, maxY;


  if (scaledWidth <= containerDimensions.value.width) {
    minX = maxX = (containerDimensions.value.width - scaledWidth) / 2;
  } else {
    minX = containerDimensions.value.width - scaledWidth;
    maxX = 0;
  }
  if (scaledHeight <= containerDimensions.value.height) {
    minY = maxY = (containerDimensions.value.height - scaledHeight) / 2;
  } else {
    minY = containerDimensions.value.height - scaledHeight;
    maxY = 0;
  }
  
  translateX.value = Math.max(minX, Math.min(maxX, translateX.value));
  translateY.value = Math.max(minY, Math.min(maxY, translateY.value));
}

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0) return;
  isDragging.value = true;
  lastPointerPosition.value = { x: event.clientX, y: event.clientY };
  (event.target as HTMLElement).setPointerCapture(event.pointerId);
  if (mapContentRef.value) mapContentRef.value.style.cursor = 'grabbing';
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value) return;

  const deltaX = event.clientX - lastPointerPosition.value.x;
  const deltaY = event.clientY - lastPointerPosition.value.y;

  translateX.value += deltaX;
  translateY.value += deltaY;

  lastPointerPosition.value = { x: event.clientX, y: event.clientY };
  applyBoundaryConstraints();
}

function onPointerUp(event: PointerEvent) {
  if (!isDragging.value) return;
  isDragging.value = false;
  (event.target as HTMLElement).releasePointerCapture(event.pointerId);
  if (mapContentRef.value) mapContentRef.value.style.cursor = 'grab';
}

function doZoom(zoomFactor: number, focalPointX: number, focalPointY: number) {
  if (!containerDimensions.value.width) return;

  const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale.value * zoomFactor));
  if (newScale === scale.value) return;
  const imageFocalX = (focalPointX - translateX.value) / scale.value;
  const imageFocalY = (focalPointY - translateY.value) / scale.value;
  
  scale.value = newScale;
  translateX.value = focalPointX - imageFocalX * scale.value;
  translateY.value = focalPointY - imageFocalY * scale.value;

  applyBoundaryConstraints();
}

function handleZoomIn() {
  if (!mapContentRef.value) return;
  const focalX = containerDimensions.value.width / 2;
  const focalY = containerDimensions.value.height / 2;
  doZoom(ZOOM_SENSITIVITY_BUTTON, focalX, focalY);
}

function handleZoomOut() {
  if (!mapContentRef.value) return;
  const focalX = containerDimensions.value.width / 2;
  const focalY = containerDimensions.value.height / 2;
  doZoom(1 / ZOOM_SENSITIVITY_BUTTON, focalX, focalY);
}

function onWheel(event: WheelEvent) {
  if (!mapContentRef.value || !imgRef.value) return;
  
  const rect = mapContentRef.value.getBoundingClientRect();
  const focalX = event.clientX - rect.left;
  const focalY = event.clientY - rect.top;

  const zoomFactor = 1 - event.deltaY * ZOOM_SENSITIVITY_WHEEL;
  doZoom(zoomFactor, focalX, focalY);
}


onMounted(() => {
  if (imgRef.value && imgRef.value.complete) {
    onImageLoad();
  }

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('resize', initializeMapState);
  nextTick(() => {
    initializeMapState();
  });
  console.log(props.points)
});

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);
  window.removeEventListener('resize', initializeMapState);
});

</script>

<style scoped lang="scss">
@use '/src/root.scss' as *;
.map {
  background-color: $second-background;
  padding: 20px;
  width: 100%;
  height: 2627px;
  border-radius: 68px;
  overflow: hidden;
  position: relative;
  touch-action: none;
  
  .map-content {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    cursor: grab;
    border-radius: 68px;
    
    img {
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: 0 0;
    }
  }
}
</style>
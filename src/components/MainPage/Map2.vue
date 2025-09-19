<template>
    <div class="map" ref="mapContainerRef">
        <div class="map-content" ref="mapContentRef" @pointerdown="onPointerDown" @wheel.prevent="onWheel">
            <img ref="imgRef" src="/src/assets/img/map2.png" alt="Карта путеводителя" :style="imageStyle"
                @load="onImageLoad">
            <div v-for="point in allPoints" :key="point.id" class="point" :class="`point-${point.id}`"
                :style="getPointStyle(point.id)" @click="handlePointClick(point.id)">
                <img :src="getIconPath(point)" :alt="point.title" class="point-icon">
            </div>
        </div>
        <Navigation :searchable-points="relevantPoints" :isMap="true" :isInfo="false" :categories="categories"
            :infoOpen="infoOpen" @zoomIn="handleZoomIn" @zoomOut="handleZoomOut"
            @selectedFilters="handleSelectedFilters" @search-update="handleSearchUpdate">
        </Navigation>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, type CSSProperties } from 'vue';
import Navigation from './Navigation.vue';
import axios from 'axios';
import konakovoIcon from '../../assets/img/konakovo.png'
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

const props = defineProps({
    categories: {
        type: Array as () => Categories[],
        required: false,
        default: () => []
    },
    points: {
        type: Array as () => Points[],
        required: true,
    },
    infoOpen: {
        type: Boolean
    },
    searchQuery: {
        type: String,
        required: true,
    }
});

const staticPoint = {
    id: -1,
    title: 'Перейти на другую карту',
    icon: konakovoIcon,
    categories: []
};

const relevantPoints = computed(() => {
    const apiPoints = props.points.filter(point => point.id < 2 || point.id > 17);
    return [...apiPoints, staticPoint];
});

const allPoints = computed(() => {
    let result = relevantPoints.value;

    if (props.searchQuery) {
        const query = props.searchQuery.toLowerCase();

        result = result.filter(point => {
            return point.title.toLowerCase().includes(query) || point.id === -1;
        });
    }

    if (selectedFilters.value.length > 0) {
        const filterIds = selectedFilters.value.map(id => parseInt(id, 10));
        result = result.filter(point => {
            if (point.id === -1) return true;
            return point.categories.some(category => filterIds.includes(category.id));
        });
    }

    return result;
});

const emit = defineEmits(['pointClick', 'selectedFilters', 'search-update', 'switchMap']);

const handleSearchUpdate = (query: string) => {
    emit('search-update', query);
};
console.log(props.points)
const pointPositions = ref<Record<number, { x: number; y: number }>>({
    18: { x: 4970, y: 1050 },
    19: { x: 1850, y: 800 },
    20: { x: 3800, y: 830 },
    21: { x: 4170, y: 1280 },
    22: { x: 4080, y: 1490 },
    23: { x: 5050, y: 1380 },
    24: { x: 2670, y: 2230 },
    25: { x: 3200, y: 2650 },
    26: { x: 2370, y: 2550 },
    27: { x: 2800, y: 2800 },
    28: { x: 200, y: 3650 },
    29: { x: 400, y: 3950 },
    30: { x: 1350, y: 3700 },
    31: { x: 2840, y: 2500 },
    32: { x: 2930, y: 2100 },
    33: { x: 3050, y: 2350 },
    34: { x: 3550, y: 2800 },
    [-1]: { x: 4600, y: 900 },
});

const BASE_URL = 'https://api-konakovo.test.itlabs.top';

const getIconPath = (point: Points) => {
    if (point.id === -1) {
        return point.icon;
    }
    return `${BASE_URL}${point.icon}`;
};

const handlePointClick = async (pointId: number) => {
    if (pointId === -1) {
        console.log('Switching map...');
        emit('switchMap');
        return;
    }

    try {
        const response = await axios.get(`https://api-konakovo.test.itlabs.top/api/point/${pointId}`);
        const pointDetails = response.data;
        emit('pointClick', pointDetails);
    } catch (error) {
        console.error('Failed to fetch point details:', error);
    }
};

const mapContainerRef = ref<HTMLDivElement | null>(null);
const mapContentRef = ref<HTMLDivElement | null>(null);
const imgRef = ref<HTMLImageElement | null>(null);

const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);

const isDragging = ref(false);
const lastPointerPosition = ref({ x: 0, y: 0 });

const imageNaturalDimensions = ref({ width: 5500, height: 5000 });
const containerDimensions = ref({ width: 0, height: 0 });

const MIN_SCALE = 0.6;
const MAX_SCALE = 2.5;
const ZOOM_SENSITIVITY_BUTTON = 1.2;
const ZOOM_SENSITIVITY_WHEEL = 0.001;

const isPinching = ref(false);
const lastPinchDistance = ref(0);

const getPointStyle = (pointId: number): CSSProperties => {
    const position = pointPositions.value[pointId];
    if (!position) return {};

    const scaledX = position.x * scale.value + translateX.value;
    const scaledY = position.y * scale.value + translateY.value;

    return {
        position: 'absolute',
        left: `${scaledX}px`,
        top: `${scaledY}px`,
        transform: `translate(-50%, -50%) scale(${scale.value})`,
        transformOrigin: 'center'
    };
};

const getDistanceBetweenTouches = (event: TouchEvent): number => {
    const [touch1, touch2] = event.touches;
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
};

const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 2) {
        isPinching.value = true;
        lastPinchDistance.value = getDistanceBetweenTouches(event);
    }
};

const onTouchMove = (event: TouchEvent) => {
    if (isPinching.value && event.touches.length === 2) {
        const currentDistance = getDistanceBetweenTouches(event);
        const zoomFactor = currentDistance / lastPinchDistance.value;

        const rect = mapContentRef.value?.getBoundingClientRect();
        if (!rect) return;

        const focalX =
            (event.touches[0].clientX + event.touches[1].clientX) / 2 - rect.left;
        const focalY =
            (event.touches[0].clientY + event.touches[1].clientY) / 2 - rect.top;

        doZoom(zoomFactor, focalX, focalY);

        lastPinchDistance.value = currentDistance;
    }
};

const onTouchEnd = (event: TouchEvent) => {
    if (event.touches.length < 2) {
        isPinching.value = false;
        lastPinchDistance.value = 0;
    }
};

const imageStyle = computed(() => ({
    transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
    width: `${imageNaturalDimensions.value.width}px`,
    height: `${imageNaturalDimensions.value.height}px`,
    willChange: 'transform',
    userSelect: 'none',
    webkitUserDrag: 'none',
}) as CSSProperties);

const updateContainerDimensions = () => {
    if (mapContentRef.value) {
        containerDimensions.value = {
            width: mapContentRef.value.clientWidth,
            height: mapContentRef.value.clientHeight,
        };
    }
};

const onImageLoad = () => {
    if (imgRef.value) {
        imageNaturalDimensions.value = {
            width: imgRef.value.offsetWidth,
            height: imgRef.value.offsetHeight,
        };
    }
    initializeMapState();
};

const initializeMapState = () => {
    updateContainerDimensions();
    if (!containerDimensions.value.width || !imageNaturalDimensions.value.width) return;

    scale.value = 1;
    translateX.value = (containerDimensions.value.width - imageNaturalDimensions.value.width * scale.value) / 2;
    translateY.value = (containerDimensions.value.height - imageNaturalDimensions.value.height * scale.value) / 2;

    applyBoundaryConstraints();
};

const applyBoundaryConstraints = () => {
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
};

const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    isDragging.value = true;
    lastPointerPosition.value = { x: event.clientX, y: event.clientY };
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    if (mapContentRef.value) mapContentRef.value.style.cursor = 'grabbing';
};

const onPointerMove = (event: PointerEvent) => {
    if (!isDragging.value) return;

    const deltaX = event.clientX - lastPointerPosition.value.x;
    const deltaY = event.clientY - lastPointerPosition.value.y;

    translateX.value += deltaX;
    translateY.value += deltaY;

    lastPointerPosition.value = { x: event.clientX, y: event.clientY };
    applyBoundaryConstraints();
};

const onPointerUp = (event: PointerEvent) => {
    if (!isDragging.value) return;
    isDragging.value = false;
    (event.target as HTMLElement).releasePointerCapture(event.pointerId);
    if (mapContentRef.value) mapContentRef.value.style.cursor = 'grab';
};

const doZoom = (zoomFactor: number, focalPointX: number, focalPointY: number) => {
    if (!containerDimensions.value.width) return;

    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale.value * zoomFactor));
    if (newScale === scale.value) return;
    const imageFocalX = (focalPointX - translateX.value) / scale.value;
    const imageFocalY = (focalPointY - translateY.value) / scale.value;

    scale.value = newScale;
    translateX.value = focalPointX - imageFocalX * scale.value;
    translateY.value = focalPointY - imageFocalY * scale.value;

    applyBoundaryConstraints();
};

const handleZoomIn = () => {
    if (!mapContentRef.value) return;
    const focalX = containerDimensions.value.width / 2;
    const focalY = containerDimensions.value.height / 2;
    doZoom(ZOOM_SENSITIVITY_BUTTON, focalX, focalY);
};

const handleZoomOut = () => {
    if (!mapContentRef.value) return;
    const focalX = containerDimensions.value.width / 2;
    const focalY = containerDimensions.value.height / 2;
    doZoom(1 / ZOOM_SENSITIVITY_BUTTON, focalX, focalY);
};

const onWheel = (event: WheelEvent) => {
    if (!mapContentRef.value || !imgRef.value) return;

    const rect = mapContentRef.value.getBoundingClientRect();
    const focalX = event.clientX - rect.left;
    const focalY = event.clientY - rect.top;

    const zoomFactor = 1 - event.deltaY * ZOOM_SENSITIVITY_WHEEL;
    doZoom(zoomFactor, focalX, focalY);
};

const selectedFilters = ref<string[]>([]);

const handleSelectedFilters = (filters: string[], showFilters: Boolean) => {
    if (showFilters === false) {
        selectedFilters.value = [];
    } else {
        selectedFilters.value = filters;
    }
};



onMounted(() => {
    if (imgRef.value && imgRef.value.complete) {
        onImageLoad();
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('resize', initializeMapState);
    const mapContent = mapContentRef.value;
    if (mapContent) {
        mapContent.addEventListener("touchstart", onTouchStart);
        mapContent.addEventListener("touchmove", onTouchMove);
        mapContent.addEventListener("touchend", onTouchEnd);
        mapContent.addEventListener("touchcancel", onTouchEnd);
    }
    nextTick(() => initializeMapState());
});

onUnmounted(() => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
    window.removeEventListener('resize', initializeMapState);
    const mapContent = mapContentRef.value;
    if (mapContent) {
        mapContent.removeEventListener("touchstart", onTouchStart);
        mapContent.removeEventListener("touchmove", onTouchMove);
        mapContent.removeEventListener("touchend", onTouchEnd);
        mapContent.removeEventListener("touchcancel", onTouchEnd);
    }
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

        .point {
            position: absolute;
            z-index: 0;
            width: 318px;
            height: 299px;

            .point-icon {
                width: 100%;
                height: 100%;
            }
        }

        .point-34,
        .point-32,
        .point-31 {
            width: 299px;
            height: 318px;
        }

        .point-8,
        .point-9,
        .point-12 {
            width: 85px;
            height: 85px;
        }

        .point-30 {
            width: 120px;
            height: 120px;
        }

        .point--1 {
            width: 450px;
            height: 450px;
        }

        img {
            position: absolute;
            top: 0;
            left: 0;
            transform-origin: 0 0;
        }
    }
}
</style>
<template>
  <div class="input-wrapper">
    <div class="input-container" :class="{ active: handleVisible }">
      <input 
        type="text" 
        placeholder="Поиск"
        :value="infoOpen ? '' : value"
        @input="$emit('input', $event)"
      >
      <div class="icon-container">
        <svg v-if="!handleVisible" width="70" height="69" viewBox="0 0 70 69" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M64.9998 64.5007L50.5232 50.024M50.5232 50.024C52.9995 47.5477 54.9638 44.6079 56.3039 41.3725C57.6441 38.1371 58.3339 34.6694 58.3339 31.1674C58.3339 27.6653 57.6441 24.1976 56.3039 20.9622C54.9638 17.7268 52.9995 14.787 50.5232 12.3107C48.0469 9.83439 45.1071 7.87009 41.8717 6.52993C38.6362 5.18977 35.1685 4.5 31.6665 4.5C28.1645 4.5 24.6968 5.18977 21.4613 6.52993C18.2259 7.87009 15.2861 9.83439 12.8098 12.3107C7.80873 17.3118 4.99915 24.0947 4.99915 31.1674C4.99915 38.24 7.80873 45.0229 12.8098 50.024C17.8109 55.0251 24.5939 57.8347 31.6665 57.8347C38.7391 57.8347 45.5221 55.0251 50.5232 50.024Z" stroke="#DDB30A" stroke-width="8.33333" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else width="70" height="69" viewBox="0 0 70 69" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M64.9998 64.5007L50.5232 50.024M50.5232 50.024C52.9995 47.5477 54.9638 44.6079 56.3039 41.3725C57.6441 38.1371 58.3339 34.6694 58.3339 31.1674C58.3339 27.6653 57.6441 24.1976 56.3039 20.9622C54.9638 17.7268 52.9995 14.787 50.5232 12.3107C48.0469 9.83439 45.1071 7.87009 41.8717 6.52993C38.6362 5.18977 35.1685 4.5 31.6665 4.5C28.1645 4.5 24.6968 5.18977 21.4613 6.52993C18.2259 7.87009 15.2861 9.83439 12.8098 12.3107C7.80873 17.3118 4.99915 24.0947 4.99915 31.1674C4.99915 38.24 7.80873 45.0229 12.8098 50.024C17.8109 55.0251 24.5939 57.8347 31.6665 57.8347C38.7391 57.8347 45.5221 55.0251 50.5232 50.024Z" stroke="#373737" stroke-width="8.33333" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
const props = defineProps({
  handleVisible: {
    type: Boolean,
    default: false
  },
  value: String,
  infoOpen: {
    type: Boolean
  }
})

const emit = defineEmits(['input'])

watch(() => props.infoOpen, (newVal) => {
  if (newVal) {
    emit('input', ''); // Очищаем значение родительского `value`
  }
});
</script>

<style scoped lang="scss">
@use '/src/root.scss' as *;

.input-wrapper {
  position: relative;
  width: 100%;

  .input-container {
    position: relative;
    width: 100%;

    &.active {
      input {
        background-color: $title-color;
      }
    }
  }

  input {
    font-family: 'Travels';
    color: $text-color;
    padding-left: 160px;
    width: 100%;
    height: 129px;
    outline: none;
    box-sizing: border-box;
    border-radius: 48px;
    border: 8px solid $title-border;
    font-size: 58px;
    transition: background-color 0.3s ease;

    &::placeholder {
      font-size: 58px;
      font-family: 'Travels';
    }
  }

  .icon-container {
    position: absolute;
    left: 40px;
    top: 50%;
    transform: translateY(-50%);
    width: 60px;
    height: 60px;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
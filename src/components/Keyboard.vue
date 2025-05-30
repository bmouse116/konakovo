<template>
  <div class="keyboard">
    <div class="keyboard-row">
      <button v-for="key in firstRow" :key="key" @click="emitKey(key)" class="key">
        {{ isCapsLock ? key.toUpperCase() : key.toLowerCase() }}
      </button>
    </div>
    
    <div class="keyboard-row">
      <div class="keyboard-spacer"></div>
      <button v-for="key in secondRow" :key="key" @click="emitKey(key)" class="key">
        {{ isCapsLock ? key.toUpperCase() : key.toLowerCase() }}
      </button>
      <div class="keyboard-spacer"></div>
    </div>
    
    <div class="keyboard-row">
      <button @click="toggleCapsLock" class="key key--capslock">
        <svg width="38" height="34" viewBox="0 0 38 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0724 18.485V30.4983H24.9261V18.485H32.7481L18.9999 4.28845L5.25186 18.485H13.0724ZM18.2822 1.00427C18.6751 0.598838 19.3249 0.598838 19.7176 1.00427L37.7161 19.5897C38.3308 20.2244 37.8815 21.2869 36.9984 21.2869H27.7249V32.2995C27.7249 32.8521 27.2773 33.3002 26.7253 33.3002H11.2732C10.7212 33.3002 10.2737 32.8521 10.2737 32.2995V21.2869H1.00137C0.118475 21.2869 -0.33078 20.2244 0.283926 19.5897L18.2822 1.00427Z" fill="white"/>
        </svg>
      </button>
      <button v-for="key in thirdRow" :key="key" @click="emitKey(key)" class="key">
        {{ isCapsLock ? key.toUpperCase() : key.toLowerCase() }}
      </button>
      <button @click="emitBackspace" class="key key--utility">
        <svg width="46" height="34" viewBox="0 0 46 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.4287 12.0503C20.843 11.4645 20.843 10.5148 21.4287 9.92896C22.0146 9.34314 22.9644 9.34314 23.55 9.92896L28.5 14.8788L33.4497 9.92896C34.0354 9.34314 34.9851 9.34314 35.571 9.92896C36.1567 10.5146 36.1567 11.4645 35.571 12.0503L30.6211 17L35.571 21.9498C36.1567 22.5355 36.1567 23.4854 35.571 24.071C34.9851 24.6569 34.0354 24.6569 33.4497 24.071L28.5 19.1213L23.55 24.071C22.9644 24.6569 22.0146 24.6569 21.429 24.071C20.843 23.4852 20.843 22.5355 21.429 21.9497L26.3787 17.0001L21.4287 12.0503Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.2427 1.75732L0 17L15.2427 32.2427C16.3679 33.3679 17.894 34 19.4854 34H40C43.3137 34 46 31.3137 46 28V6C46 2.68628 43.3137 0 40 0H19.4854C17.894 0 16.3679 0.632202 15.2427 1.75732ZM40 31.4H19.4854C18.5835 31.4 17.7188 31.0417 17.0811 30.4042L3.677 17L17.0811 3.59583C17.7188 2.95825 18.5835 2.59998 19.4854 2.59998H40C41.8777 2.59998 43.3999 4.12219 43.3999 6V28C43.3999 29.8778 41.8777 31.4 40 31.4Z" fill="white"/>
        </svg>
      </button>
    </div>
    <div class="keyboard-row">
        <button @click="emitSpace" class="key key--space">
        Пробел
      </button>
    </div>
</div>
<div class="cancel" @click="emit('close')">
<svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M53.6667 26.9997C53.6667 41.7273 41.7276 53.6663 27 53.6663C12.2724 53.6663 0.333374 41.7273 0.333374 26.9997C0.333374 12.2721 12.2724 0.333008 27 0.333008C41.7276 0.333008 53.6667 12.2721 53.6667 26.9997ZM18.919 18.9187C19.7001 18.1377 20.9664 18.1377 21.7475 18.9187L27 24.1712L32.2524 18.9188C33.0334 18.1377 34.2998 18.1377 35.0808 18.9188C35.8619 19.6998 35.8619 20.9662 35.0808 21.7472L29.8284 26.9996L35.0808 32.252C35.8618 33.0331 35.8618 34.2994 35.0808 35.0805C34.2997 35.8615 33.0334 35.8615 32.2523 35.0805L27 29.8281L21.7475 35.0805C20.9665 35.8615 19.7002 35.8615 18.9191 35.0805C18.1381 34.2995 18.1381 33.0331 18.9191 32.2521L24.1715 26.9996L18.919 21.7472C18.138 20.9661 18.138 19.6998 18.919 18.9187Z" fill="#F3C923"/>
</svg>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['keypress', 'backspace', 'capslock', 'close']);

const isCapsLock = ref(false);

const firstRow = ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'];
const secondRow = ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'];
const thirdRow = ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю'];

const emitKey = (key: string) => {
  const value = isCapsLock.value ? key.toUpperCase() : key.toLowerCase();
  emit('keypress', value);
};

const emitBackspace = () => {
  emit('backspace');
};

const emitSpace = () => {
  emit('keypress', ' ');
};

const toggleCapsLock = () => {
  isCapsLock.value = !isCapsLock.value;
  emit('capslock', isCapsLock.value);
};
</script>

<style scoped lang="scss">
@use '/src/root.scss' as *;
.keyboard {
  background-color: $white-color;
  padding: 8px;
  border-radius: 72px;
  width: 100%;
  max-width: 1876px;
  height: 528px;
  margin: 0 auto;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.keyboard-spacer {
  width: 28px;
}

.key {
  background-color: $key-color;
  border-radius: 16px;
  border: none;
  height: 96px;
  max-width: 130px;
  width: 100%;
  margin: 0 8px;
  font-size: 36px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s;
  color: $text-color;
  font-family: 'Montserrat';
  box-shadow: 0px 2px 0px 0px #0B461B4D;
  outline: none;
  &:active {
  transform: scale(0.95);
    }
  &:focus {
    outline: none;
    border-radius: 16px;
  }
}

.cancel {
    max-width: 192px;
    width: 100%;
    height: 128px;
    background-color: $white-color;
    margin: 0 auto;
    border-radius: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.key--utility {
  background-color: $title-border;
  max-width: 206px;
  width: 100%;
}

.key--capslock {
  background-color: $title-border;
  max-width: 206px;
  width: 100%;
}

.key--space {
  flex-grow: 1;
  max-width: 1300px;
}

</style>
<template>
    <button class="btn">
        <img src="/src/assets/img/svg/preview.svg" alt="">
        Все афиши
    </button>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
@use '/src/root.scss' as *;
.btn {
    width: 100%;
    height: 129px;
    border-radius: 48px;
    background-color: $white-color;
    font-size: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 8px solid $title-border;
    gap: 32px;
}
</style>
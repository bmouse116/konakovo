<template>
    <button class="btn"><slot></slot></button>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
@use '/src/root.scss' as *;
.btn {
    width: var(--afisha-filter-button-width, 600px); 
    width: 100%;
    height: 129px;
    border: 8px solid $title-border;
    background-color: $white-color;
    font-size: 58px;
    font-family: 'Travels';
    border-radius: 48px;
}
</style>
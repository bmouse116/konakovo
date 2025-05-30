<template>
<button :class="{active: showFilters}">
    <slot name="icon"></slot>
    <slot name="label"></slot>
</button>
</template>

<script setup lang="ts">
defineProps({
    showFilters: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped lang="scss">
@use '/src/root.scss' as *;
button {
    max-width: 475px;
    width: 100%;
    height: 129px;
    border-radius: 48px;
    display: flex;
    border: 8px solid $title-border;
    background-color: $white-color;
    align-items: center;
    font-size: 58px;
    color: $text-color;
    gap: 40px;
    padding-left: 40px;
}

.active {
    background-color: $title-color;
}
</style>
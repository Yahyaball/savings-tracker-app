<script setup lang="ts">
import LogoSmall from '../assets/images/logo-small.svg'
import LogoLarge from '../assets/images/logo-large.svg'
import Plus from '../assets/images/icon-plus.svg'
</script>

<template>
    <img :src="LogoSmall" alt="Savings Tracker">
    <BaseButton intent="primary">
        <template #icon>
            <img :src="Plus" alt="">
        </template>
        Button
    </BaseButton>
</template>
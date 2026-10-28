<script setup lang="ts">
import LogoSmall from '../assets/images/logo-small.svg'
import LogoLarge from '../assets/images/logo-large.svg'
import Plus from '../assets/images/icon-plus.svg'

const isTablet = useMediaQuery('(min-width: 48rem)')
</script>

<template>
    <header
        class="flex justify-between px-[clamp(1rem,0.523rem+2.036vw,1.5rem)] py-[clamp(0.75rem,0.511rem+1.018vw,1rem)] shadow-[0_1px_0_0_var(--color-neutral-800)] lg:px-10">
        <ClientOnly>
            <img :src="isTablet ? LogoLarge : LogoSmall" alt="Savings Tracker">
        </ClientOnly>
        <BaseButton intent="primary" type="button">
            <template #icon>
                <img :src="Plus" alt="">
            </template>
            New goal
        </BaseButton>
    </header>
</template>
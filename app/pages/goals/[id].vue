<script setup lang="ts">
import ChevronLeft from '../../assets/images/icon-chevron-left.svg'
</script>

<template>
    <div>
        <NavigationBar />
        <main
            class="px-[clamp(1rem,0.523rem+2.036vw,1.5rem)] py-[clamp(2rem,1.523rem+2.036vw,2.5rem)] flex flex-col gap-4">
            <div class="flex flex-col gap-1.25">
                <div>
                    <BaseButton intent="tertiary" base-class="px-0 text-neutral-400 hover:bg-transparent"
                        icon-class="hue-rotate-210 saturate-1 brightness-54">
                        <template #icon>
                            <img :src="ChevronLeft" alt="">
                        </template>Back
                    </BaseButton>
                </div>
            </div>
        </main>
    </div>
</template>
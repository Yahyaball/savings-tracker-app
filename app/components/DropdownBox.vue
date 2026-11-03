<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'
defineProps({
    show: Boolean
})
const isTablet = useMediaQuery('(min-width: 48rem)')
</script>

<template>
    <AnimatePresence>
        <motion.div v-if="show"
            class="absolute w-[calc(100vw-clamp(2rem,1.046rem+4.071vw,3rem))] md:w-35 bg-neutral-800 rounded-xl ring-1 ring-inset ring-neutral-700 p-1 z-10 mt-1 max-md:left-[50%] max-md:translate-x-[-50%] md:right-0"
            :initial="{ opacity: 0, scale: 0, transformOrigin: isTablet ? 'right top' : 'center top' }"
            :animate="{ opacity: 1, scale: 1 }" :exit="{ opacity: 0, scale: 0 }">
            <fieldset>
                <legend class="p-1 text-neutral-300 uppercase preset-6">
                    <slot name="legend" />
                </legend>
            </fieldset>
            <div class="flex flex-col gap-0.25">
                <slot />
            </div>
        </motion.div>
    </AnimatePresence>
</template>
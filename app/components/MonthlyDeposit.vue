<script setup lang="ts">
import { ref } from 'vue'
import { motion, useInView } from 'motion-v'
import { useCountUp } from '~/composables/useCountUp'

const props = defineProps<{
  month: string
  total: number
  height: string
}>()

const el = ref<HTMLElement | null>(null)
const inView = useInView(el, { once: true })

const { display } = useCountUp(() => props.total ?? 0, {
  duration: 0.8,
  ease: [0.25, 0.1, 0.25, 1],
  format: 'currency',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  trigger: inView
})

const barVariants = {
  hidden: { height: '0%' },
  visible: (h: string) => ({
    height: h,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  })
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})
</script>

<template>
  <div ref="el" class="flex flex-col-reverse items-center gap-1.25 max-lg:nth-[-n+6]:hidden">
    <span class="flex flex-col-reverse gap-0.5 items-center">
      <span class="preset-7 md:preset-5">{{ month }}</span>
      <span class="sr-only">{{ currency.format(total) }}</span>
      <span class="preset-7 text-neutral-300 md:preset-6" aria-hidden="true">{{ display }}</span>
    </span>
    <span class="relative h-18 w-full">
      <motion.span class="absolute bg-orange-400 w-full ring-1 ring-inset ring-white/30 rounded-lg bottom-0"
        :variants="barVariants" :custom="height" />
    </span>
  </div>
</template>

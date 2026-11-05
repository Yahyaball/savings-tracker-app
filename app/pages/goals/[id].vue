<script setup lang="ts">
import type { Goal } from '~/types/savings'
import { motion, useInView } from "motion-v"
import { goalSaved } from '~/utils/savings'
import ChevronLeft from '../../assets/images/icon-chevron-left.svg'
import Dollar from '../../assets/images/icon-dollar.svg'

const sectionRef = ref<HTMLElement | null>(null)
const cardInView = useInView(sectionRef, { once: true })
const route = useRoute()
const config = useRuntimeConfig()
const { data: goals } = await useFetch<Goal[]>(config.public.apiBaseUrl)

const goalId = route.params.id as string
const goal = computed(() => (goals.value ?? []).find((g) => g.id === goalId))

const percentageValue = computed(() => {
    if (!goal.value?.target || goal.value?.target <= 0) return 0
    const amount = goal.value ? (goalSaved(goal.value) ?? 0) : 0
    const target = goal.value?.target ?? 0
    const p = Math.round((amount / target) * 100)
    return Math.min(Math.max(p, 0), 100)
})

const { display: displayPercentage } = useCountUp(percentageValue, {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
    format: "percent",
    trigger: cardInView
})

const { display: displayRemaining } = useCountUp(computed(() => Math.max(0, (goal.value?.target ?? 0) - (goal.value ? (goalSaved(goal.value) ?? 0) : 0))), {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
    format: "currency",
    trigger: cardInView,
    start: () => goal.value?.target ?? 0
} as any)

const { display: displaySaved } = useCountUp(() => goal.value ? goalSaved(goal.value) : 0, {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
    format: "currency",
    trigger: cardInView
})

const containerVariants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
}

const progressVariants = {
    hidden: { width: '0%' },
    visible: (width: string) => ({
        width: width,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1]
        }
    })
}

const percentage = computed(() => `${percentageValue.value}%`)

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
})

console.log(goal.value)

</script>
<template>
    <div>
        <NavigationBar />
        <main
            class="px-[clamp(1rem,0.523rem+2.036vw,1.5rem)] py-[clamp(2rem,1.523rem+2.036vw,2.5rem)] flex flex-col gap-4">
            <div class="flex flex-col gap-1.25">
                <div class="flex justify-between">
                    <BaseButton to="/" intent="tertiary" base-class="px-0 text-neutral-400 hover:bg-transparent"
                        icon-class="hue-rotate-210 saturate-1 brightness-54" type="button">
                        <template #icon>
                            <img :src="ChevronLeft" alt="">
                        </template>Back
                    </BaseButton>
                    <div class="flex">
                        <BaseButton intent="tertiary" type="button" base-class="px-1.5">
                            Edit goal
                        </BaseButton>
                        <BaseButton intent="tertiary" type="button" base-class="text-red-500 px-1.5">
                            Delete goal
                        </BaseButton>
                    </div>
                </div>
                <h1 class="preset-1-mobile">{{ goal?.name }}</h1>
                <p class="preset-6 flex gap-1.5 text-neutral-300">
                    <span>{{ goal?.deadline ? `Due ${new Date(goal.deadline).toLocaleDateString('en-GB', {
                        day:
                            'numeric', month:
                            'short', year: 'numeric'
                    })}` : 'No deadline' }}</span>
                    <span aria-hidden="true">•</span>
                    <span>Created {{ goal?.createdAt ? new Date(goal.createdAt).toLocaleDateString('en-US', {
                        month:
                            'short', day:
                            'numeric', year: 'numeric'
                    }) : '' }}</span>
                </p>
            </div>
            <div class="flex flex-col gap-3">
                <motion.section ref="sectionRef" :variants="containerVariants" initial="hidden" while-in-view="visible"
                    :in-view-options="{ once: true }"
                    class="flex flex-col gap-3 p-2 rounded-xl bg-neutral-800 ring-1 ring-inset ring-neutral-600">
                    <div class="flex justify-between items-center">
                        <p class="preset-1-mobile text-orange-400">{{ displayPercentage }}</p>
                        <p class="preset-5-semibold text-neutral-300">{{ displayRemaining }} remaining</p>
                    </div>
                    <div class="relative h-1.5 w-full rounded-[2.5rem] bg-neutral-700">
                        <motion.div
                            class="absolute h-[inherit] rounded-[inherit] ring-1 ring-inset ring-white/30 bg-[repeating-linear-gradient(-60deg,rgba(0,0,6,0.1),rgba(0,0,0,0.1)_2px,rgba(0,0,0,0)_2px,rgba(0,0,0,0)_8.73px)] bg-orange-400"
                            :variants="progressVariants" :custom="percentage" />
                    </div>
                    <div class="flex justify-between">
                        <p class="flex flex-col gap-0.5 preset-6">
                            <span>{{ displaySaved }}</span>
                            <span class="text-neutral-300">Saved so far</span>
                        </p>
                        <p class="flex flex-col gap-0.5 preset-6 text-end">
                            <span>of {{ currency.format(goal?.target ?? 0) }}</span>
                            <span class="text-neutral-300">Target</span>
                        </p>
                    </div>
                </motion.section>
                <form
                    class="flex flex-col gap-2.5 p-2 rounded-xl bg-neutral-800 ring-1 ring-inset ring-neutral-600 preset-4">
                    <h2>Add deposit</h2>
                    <div class="flex flex-col gap-2.5">
                        <BaseInput name="amount" label="Amount" :icon="Dollar" placeholder="0.00" type="number" />
                        <BaseInput name="note" label="Note (optional)" placeholder="e.g. Monthly savings" type="name" />
                    </div>
                    <BaseButton type="submit">
                        Add funds
                    </BaseButton>
                </form>
            </div>
        </main>
    </div>
</template>
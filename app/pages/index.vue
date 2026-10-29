<script setup lang="ts">
import type { Goal } from '~/types/savings'
import { goalSaved } from '~/utils/savings'
import Filter from '../assets/images/icon-filter.svg'
import Sort from '../assets/images/icon-sort.svg'
import { getSlotIslandResponse } from 'nuxt/internal/renderer/islands'

const config = useRuntimeConfig()
const { data: goals } = await useFetch<Goal[]>(config.public.apiBaseUrl, {
    onResponseError({ response }) {
        console.error('Fetch failed with status:', response.status)
    }
})

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

const currencyFraction = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
})

const totalSavings = computed(() =>
    (goals.value ?? []).reduce((total, goal) => total + goalSaved(goal), 0),
)

const formattedTotalSavings = computed(() => currency.format(totalSavings.value))

const activeGoals = computed(() =>
    (goals.value ?? []).filter((goal) => goalSaved(goal) < goal.target),
)

const completedGoals = computed(() =>
    (goals.value ?? []).filter((goal) => goalSaved(goal) >= goal.target),
)

const now = new Date()
const boxes: { key: string, total: number, month: string }[] = []

for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = date.getFullYear() + '-' + (date.getMonth() + 1)
    const monthText = Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)
    boxes.push({ key: key, total: 0, month: monthText })
}
for (const goal of (goals.value ?? [])) {
    for (const deposit of goal.deposits) {
        const date = new Date(deposit.createdAt)
        const key = date.getFullYear() + '-' + (date.getMonth() + 1)
        const month = boxes.find(item => item.key === key)
        if (month) {
            month.total = month.total + deposit.amount
        }
    }
}
const maxTotal = Math.max(...boxes.map(box => box.total))
const heightPercentage = (value: number) => {
    return `${(value / maxTotal) * 100}%`
}

const getCardSize = (index: number): 'default' | 'wide' | 'tall' => {
    const mod = index % 4
    if (mod === 0) return 'wide'
    if (mod === 3) return 'tall'
    return 'default'
}
</script>

<template>
    <div>
        <NavigationBar />
        <main
            class="px-[clamp(1rem,0.523rem+2.036vw,1.5rem)] py-[clamp(2rem,1.046rem+4.071vw,3rem)] flex flex-col gap-4">
            <div class="grid gap-2 grid-cols-2">
                <section
                    class="flex flex-col gap-4 p-[clamp(1rem,0.761rem+1.018vw,1.25rem)] rounded-2xl bg-linear-to-l from-orange-400 to-orange-700 ring-1 ring-inset ring-white/30 md:col-span-2">
                    <h1 class="preset-5-semibold">Total savings</h1>
                    <p class="preset-1-mobile md:preset-1">{{ formattedTotalSavings }}</p>
                </section>
                <section
                    class="flex flex-col gap-4 p-[clamp(1rem,0.761rem+1.018vw,1.25rem)] rounded-2xl bg-neutral-800 ring-1 ring-inset ring-neutral-600 bg-[url('/assets/images/pattern-star.svg')] bg-no-repeat bg-position-[right_-39px_top_45px]">
                    <h2 class="preset-5-semibold">Active goals</h2>
                    <p class="preset-1-mobile text-orange-400 md:preset-1">{{ activeGoals.length }}</p>
                </section>
                <section
                    class="flex flex-col gap-4 p-[clamp(1rem,0.761rem+1.018vw,1.25rem)] rounded-2xl bg-neutral-800 ring-1 ring-inset ring-neutral-600 bg-[url('/assets/images/pattern-star.svg')] bg-no-repeat bg-position-[right_-39px_top_45px]">
                    <h2 class="preset-5-semibold">Goals completed</h2>
                    <p class="preset-1-mobile text-green-500 md:preset-1">{{ completedGoals.length }}</p>
                </section>
                <section
                    class="flex flex-col gap-2.5 p-[clamp(1rem,0.761rem+1.018vw,1.25rem)] rounded-2xl bg-neutral-800 ring-1 ring-inset ring-neutral-600 col-span-2">
                    <h2 class="preset-4">Monthly deposits</h2>
                    <div class="grid grid-cols-6 gap-[clamp(0.5rem,0.023rem+2.036vw,1rem)]">
                        <div v-for="box in boxes" :key="box.key" class="flex flex-col-reverse items-center gap-1.25">
                            <span class="flex flex-col-reverse gap-0.5 items-center">
                                <span class="preset-7 md:preset-5">{{ box.month }}</span>
                                <span class="preset-7 text-neutral-300 md:preset-6">{{
                                    currencyFraction.format(box.total) }}</span>
                            </span>
                            <span class="relative h-18 w-full">
                                <span
                                    class="absolute bg-orange-400 w-full ring-1 ring-inset ring-white/30 rounded-lg bottom-0"
                                    :style="{ height: heightPercentage(box.total) }"></span>
                            </span>
                        </div>
                    </div>
                </section>
            </div>
            <div class="flex flex-col mt-2.5 gap-3">
                <div class="flex flex-col gap-2.5 md:flex-row md:justify-between md:items-center">
                    <h2 class="preset-2">Your goals</h2>
                    <div class="flex gap-2">
                        <BaseButton intent="secondary" class="flex-1 md:flex-initial">
                            <template #icon>
                                <img :src="Filter" alt="">
                            </template>Filters
                        </BaseButton>
                        <BaseButton intent="secondary" class="flex-1 md:flex-initial">
                            <template #icon>
                                <img :src="Sort" alt="">
                            </template>Sort by
                        </BaseButton>
                    </div>
                </div>
                <div class="grid gap-3 md:grid-cols-2">
                    <GoalCard v-for="(goal, index) in goals" :key="goal.id" :name="goal.name" :amount="goalSaved(goal)"
                        :deadline="goal.deadline" :target="goal.target" :size="getCardSize(index)" />
                </div>
            </div>
        </main>
    </div>
</template>
<script setup lang="ts">
import type { Goal } from '~/types/savings'
import { goalSaved } from '~/utils/savings'

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
console.log(boxes)

//TODO: Resize all of the bar chart based on amount
</script>

<template>
    <div>
        <NavigationBar />
        <main class="px-2 py-4">
            <div class="flex flex-col gap-2">
                <section
                    class="flex flex-col gap-4 p-2 rounded-2xl bg-linear-to-l from-orange-400 to-orange-700 ring-1 ring-inset ring-white/30">
                    <h1 class="preset-5-semibold">Total savings</h1>
                    <p class="preset-1-mobile">{{ formattedTotalSavings }}</p>
                </section>
                <section
                    class="flex flex-col gap-4 p-2 rounded-2xl bg-neutral-800 ring-1 ring-inset ring-neutral-600 bg-[url('/assets/images/pattern-star.svg')] bg-no-repeat bg-position-[right_-39px_top_45px]">
                    <h2 class="preset-5-semibold">Active goals</h2>
                    <p class="preset-1-mobile text-orange-400">{{ activeGoals.length }}</p>
                </section>
                <section
                    class="flex flex-col gap-4 p-2 rounded-2xl bg-neutral-800 ring-1 ring-inset ring-neutral-600 bg-[url('/assets/images/pattern-star.svg')] bg-no-repeat bg-position-[right_-39px_top_45px]">
                    <h2 class="preset-5-semibold">Goals completed</h2>
                    <p class="preset-1-mobile text-green-500">{{ completedGoals.length }}</p>
                </section>
                <section
                    class="flex flex-col gap-2.5 p-2 rounded-2xl bg-neutral-800 ring-1 ring-inset ring-neutral-600">
                    <h2 class="preset-4">Monthly deposits</h2>
                    <div class="grid grid-cols-6 gap-1">
                        <div v-for="box in boxes" :key="box.key" class="flex flex-col-reverse items-center gap-1.25">
                            <span class="flex flex-col-reverse gap-0.5 items-center">
                                <span class="preset-7">{{ box.month }}</span>
                                <span class="preset-7 text-neutral-300">{{ currencyFraction.format(box.total) }}</span>
                            </span>
                            <span class="relative h-18 w-full">
                                <span
                                    class="absolute h-18 bg-orange-400 w-full ring-1 ring-inset ring-white/30 rounded-lg"></span>
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </div>
</template>
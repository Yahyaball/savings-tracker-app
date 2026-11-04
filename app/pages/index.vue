<script setup lang="ts">
import type { Goal } from '~/types/savings'
import { goalSaved } from '~/utils/savings'
import Filter from '../assets/images/icon-filter.svg'
import Sort from '../assets/images/icon-sort.svg'
import Target from '../assets/images/icon-target.svg'
import Plus from '../assets/images/icon-plus.svg'
import { motion, useInView } from 'motion-v'
import { ref } from 'vue'

const filter = ref('all-goals')
const sortBy = ref('recently-added')
const isFilterOpen = ref(false)
const isSortByOpen = ref(false)
const filterTarget = useTemplateRef('filterTarget')
onClickOutside(filterTarget, () => {
    isFilterOpen.value = false
}
)
const sortByTarget = useTemplateRef('sortByTarget')
onClickOutside(sortByTarget, () => {
    isSortByOpen.value = false
}
)
const savingsRef = ref<HTMLElement | null>(null)
const savingsInView = useInView(savingsRef, { once: true })
const activeRef = ref<HTMLElement | null>(null)
const activeInView = useInView(activeRef, { once: true })
const completedRef = ref<HTMLElement | null>(null)
const completedInView = useInView(completedRef, { once: true })
const config = useRuntimeConfig()
const { data: goals } = await useFetch<Goal[]>(config.public.apiBaseUrl, {
    onResponseError({ response }) {
        console.error('Fetch failed with status:', response.status)
    }
})

const totalSavings = computed(() =>
    (goals.value ?? []).reduce((total, goal) => total + goalSaved(goal), 0),
)

const activeGoals = computed(() =>
    (goals.value ?? []).filter((goal) => goalSaved(goal) < goal.target),
)

const completedGoals = computed(() =>
    (goals.value ?? []).filter((goal) => goalSaved(goal) >= goal.target),
)

const now = new Date()
const boxes: { key: string, total: number, month: string }[] = []

for (let i = 11; i >= 0; i--) {
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
const maxTotal = Math.max(...boxes.map(box => box.total), 1)
const heightPercentage = (value: number) => {
    return `${(value / maxTotal) * 100}%`
}

const getCardSize = (index: number): 'default' | 'wide' | 'tall' => {
    const mod = index % 4
    if (mod === 0) return 'wide'
    if (mod === 3) return 'tall'
    return 'default'
}

const containerVariants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0,
            delayChildren: 0
        }
    }
}

const { display: displaySavings } = useCountUp(() => totalSavings.value ?? 0, {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
    format: "currency",
    trigger: savingsInView,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})

const { display: displayActive } = useCountUp(() => activeGoals.value.length ?? 0, {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
    format: "number",
    trigger: activeInView,
})

const { display: displayCompleted } = useCountUp(() => completedGoals.value.length ?? 0, {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
    format: "number",
    trigger: completedInView,
})

const filteredGoals = computed(() => {
    const all = goals.value ?? []
    if (filter.value === 'completed') return all.filter((goal) => goalSaved(goal) >= goal.target)
    if (filter.value === 'in-progress') return all.filter((goal) => goalSaved(goal) > 0 && goalSaved(goal) < goal.target)
    if (filter.value === 'not-started') return all.filter((goal) => (goalSaved(goal) ?? 0) === 0)
    return all
})

const sortedGoals = computed(() => {
    const goalsToSort = [...filteredGoals.value]
    if (sortBy.value === 'deadline') {
        return goalsToSort.sort((a, b) => {
            if (!a.deadline && !b.deadline) return 0
            if (!a.deadline) return 1
            if (!b.deadline) return -1
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        })
    }
    if (sortBy.value === 'progress-highest') {
        return goalsToSort.sort((a, b) => {
            const pa = (goalSaved(a) / a.target) * 100
            const pb = (goalSaved(b) / b.target) * 100
            return pb - pa
        })
    }
    if (sortBy.value === 'progress-lowest') {
        return goalsToSort.sort((a, b) => {
            const pa = (goalSaved(a) / a.target) * 100
            const pb = (goalSaved(b) / b.target) * 100
            return pa - pb
        })
    }
    if (sortBy.value === 'amount-saved') {
        return goalsToSort.sort((a, b) => goalSaved(b) - goalSaved(a))
    }
    if (sortBy.value === 'alphabetical') {
        return goalsToSort.sort((a, b) => a.name.localeCompare(b.name))
    }
    return goalsToSort
})
</script>

<template>
    <div>
        <NavigationBar />
        <main
            class="px-[clamp(1rem,0.523rem+2.036vw,1.5rem)] py-[clamp(2rem,1.046rem+4.071vw,3rem)] flex flex-col gap-4 lg:px-10 lg:py-6">
            <div class="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                <motion.section ref="savingsRef"
                    class="flex flex-col gap-4 p-[clamp(1rem,0.761rem+1.018vw,1.25rem)] rounded-2xl bg-linear-to-l from-orange-400 to-orange-700 ring-1 ring-inset ring-white/30 md:col-span-2"
                    :variants="containerVariants" initial="hidden" while-in-view="visible"
                    :in-view-options="{ once: true }">
                    <h1 class="preset-5-semibold">Total savings</h1>
                    <p class="preset-1-mobile md:preset-1">
                        <span class="sr-only">{{ totalSavings }}</span>
                        <span aria-hidden="true">{{ displaySavings }}</span>
                    </p>
                </motion.section>
                <motion.section ref="activeRef"
                    class="flex flex-col gap-4 p-[clamp(1rem,0.761rem+1.018vw,1.25rem)] rounded-2xl bg-neutral-800 ring-1 ring-inset ring-neutral-600 bg-[url('/assets/images/pattern-star.svg')] bg-no-repeat bg-position-[right_-39px_top_45px]"
                    :variants="containerVariants" initial="hidden" while-in-view="visible"
                    :in-view-options="{ once: true }">
                    <h2 class="preset-5-semibold">Active goals</h2>
                    <p class="preset-1-mobile md:preset-1"
                        :class="((goals ?? []).length) === 0 ? 'text-neutral-400' : 'text-orange-400'">
                        <span class="sr-only">{{ activeGoals.length }}</span>
                        <span aria-hidden="true">{{ displayActive }}</span>
                    </p>
                </motion.section>
                <motion.section ref="completedRef"
                    class="flex flex-col gap-4 p-[clamp(1rem,0.761rem+1.018vw,1.25rem)] rounded-2xl bg-neutral-800 ring-1 ring-inset ring-neutral-600 bg-[url('/assets/images/pattern-star.svg')] bg-no-repeat bg-position-[right_-39px_top_45px]"
                    :variants="containerVariants" initial="hidden" while-in-view="visible"
                    :in-view-options="{ once: true }">
                    <h2 class="preset-5-semibold">Goals completed</h2>
                    <p class="preset-1-mobile md:preset-1"
                        :class="((goals ?? []).length) === 0 ? 'text-neutral-400' : 'text-green-500'">
                        <span class="sr-only">{{ completedGoals.length }}</span>
                        <span aria-hidden="true">{{ displayCompleted }}</span>
                    </p>
                </motion.section>
                <motion.section
                    class="flex flex-col gap-2.5 p-[clamp(1rem,0.761rem+1.018vw,1.25rem)] rounded-2xl bg-neutral-800 ring-1 ring-inset ring-neutral-600 md:col-span-2 lg:col-span-4"
                    :variants="containerVariants" initial="hidden" while-in-view="visible"
                    :in-view-options="{ once: true }">
                    <h2 class="preset-4">Monthly deposits</h2>
                    <span v-if="((goals ?? []).length === 0) || boxes.every(b => b.total === 0)"
                        class="h-12.5 flex items-center justify-center text-center text-neutral-300 preset-5">No
                        deposits yet</span>
                    <div v-else class="grid grid-cols-6 lg:grid-cols-12 gap-[clamp(0.5rem,0.023rem+2.036vw,1rem)]">
                        <MonthlyDeposit v-for="box in boxes" :key="box.key" :month="box.month" :total="box.total"
                            :height="heightPercentage(box.total)" />
                    </div>
                </motion.section>
            </div>
            <div class="flex flex-col mt-2.5 gap-3">
                <motion.div class="flex flex-col gap-2.5 md:flex-row md:justify-between md:items-center"
                    :variants="containerVariants" initial="hidden" while-in-view="visible"
                    :in-view-options="{ once: true }">
                    <h2 class="preset-2">Your goals</h2>
                    <div class="flex gap-2 w-full md:w-auto">
                        <div ref="filterTarget" class="md:relative flex-1 md:flex-initial">
                            <BaseButton intent="secondary" class="w-full" @click="isFilterOpen = !isFilterOpen"
                                :disabled="((goals ?? []).length === 0)">
                                <template #icon>
                                    <img :src="Filter" alt="">
                                </template>Filters
                            </BaseButton>
                            <DropdownBox :show="isFilterOpen">
                                <template v-slot:legend>Filter by status</template>
                                <BaseRadio v-model="filter" name="filter" value="all-goals">
                                    All goals
                                </BaseRadio>
                                <BaseRadio v-model="filter" name="filter" value="in-progress">
                                    In progress
                                </BaseRadio>
                                <BaseRadio v-model="filter" name="filter" value="completed">
                                    Completed
                                </BaseRadio>
                                <BaseRadio v-model="filter" name="filter" value="not-started">
                                    Not started
                                </BaseRadio>
                            </DropdownBox>
                        </div>
                        <div ref="sortByTarget" class="md:relative flex-1 md:flex-initial">
                            <BaseButton intent="secondary" class="w-full" @click="isSortByOpen = !isSortByOpen"
                                :disabled="((goals ?? []).length === 0)">
                                <template #icon>
                                    <img :src="Sort" alt="">
                                </template>Sort by
                            </BaseButton>
                            <DropdownBox :show="isSortByOpen">
                                <template v-slot:legend>Sort by</template>
                                <BaseRadio v-model="sortBy" name="sort-by" value="recently-added">
                                    Recently added
                                </BaseRadio>
                                <BaseRadio v-model="sortBy" name="sort-by" value="deadline">
                                    Deadline (soonest first)
                                </BaseRadio>
                                <BaseRadio v-model="sortBy" name="sort-by" value="progress-highest">
                                    Progress (highest first)
                                </BaseRadio>
                                <BaseRadio v-model="sortBy" name="sort-by" value="progress-lowest">
                                    Progress (lowest first)
                                </BaseRadio>
                                <BaseRadio v-model="sortBy" name="sort-by" value="amount-saved">
                                    Amount saved (highest first)
                                </BaseRadio>
                                <BaseRadio v-model="sortBy" name="sort-by" value="alphabetical">
                                    Alphabetical (A-Z)
                                </BaseRadio>
                            </DropdownBox>
                        </div>
                    </div>
                </motion.div>
                <motion.section v-if="((goals ?? []).length === 0)"
                    class="flex flex-col gap-4 px-2 py-5 text-center items-center border border-dashed border-neutral-600 rounded-2xl"
                    :variants="containerVariants" initial="hidden" while-in-view="visible"
                    :in-view-options="{ once: true }">
                    <div class="flex flex-col gap-2.5 items-center">
                        <img :src="Target" alt="">
                        <h3 class="preset-2">No goals yet</h3>
                        <p class="preset-5 text-neutral-300 max-w-64">Start saving for something that matters. Create
                            your first
                            goal and track
                            your progress.</p>
                    </div>
                    <div>
                        <BaseButton intent="primary" type="button">
                            <template #icon>
                                <img :src="Plus" alt="">
                            </template>
                            Create your first goal
                        </BaseButton>
                    </div>
                </motion.section>
                <div v-else v-auto-animate class="grid gap-3 md:grid-cols-2 lg:grid-cols-3 lg:grid-flow-row-dense">
                    <GoalCard v-for="(goal, index) in sortedGoals" :key="goal.id" :name="goal.name"
                        :amount="goalSaved(goal)" :deadline="goal.deadline" :target="goal.target"
                        :size="getCardSize(index)" />
                </div>
            </div>
        </main>
    </div>
</template>
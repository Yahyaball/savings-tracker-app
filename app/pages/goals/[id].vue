<script setup lang="ts">
import type { Goal } from '~/types/savings'
import { motion, useInView } from "motion-v"
import { goalSaved } from '~/utils/savings'
import ChevronLeft from '../../assets/images/icon-chevron-left.svg'
import Dollar from '../../assets/images/icon-dollar.svg'
import Calendar from '../../assets/images/icon-calendar.svg'
import ArrowDown from '../../assets/images/icon-arrow-down.svg'
import Checkmark from '../../assets/images/icon-checkmark.svg'
import Spinner from '../../assets/images/icon-spinner.svg'
import type ModalDialog from '~/components/ModalDialog.vue'
import { FetchError } from 'ofetch'

const sectionRef = ref<HTMLElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)
const cardInView = useInView(cardRef, { once: true })
const route = useRoute()
const { data: goals } = await useFetch<Goal[]>('/api/goals', { key: 'goals' })

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

const { display: displayDeposits } = useCountUp(() => goal.value?.deposits.length ?? 0, {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
    format: "number",
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

const createdAt = new Date(goal?.value?.deposits?.at(-1)?.createdAt ?? 0)
const createdAtDate = computed(() => createdAt.setHours(0, 0, 0, 0))
const deadline = new Date(goal?.value?.deadline ?? 0)
const deadlineDate = computed(() => deadline.setHours(0, 0, 0, 0))
const deadlineYyyyMmDd = new Intl.DateTimeFormat('sv-SE').format(deadline)
const dialogEditTarget = ref<InstanceType<typeof ModalDialog>>()
const showDialogEdit = () => dialogEditTarget.value?.show()
const closeDialogEdit = () => dialogEditTarget.value?.close()
const dialogDeleteTarget = ref<InstanceType<typeof ModalDialog>>()
const showDialogDelete = () => dialogDeleteTarget.value?.show()
const closeDialogDelete = () => dialogDeleteTarget.value?.close()
const depositAmount = ref('')
const depositNote = ref('')
const amountError = ref('')
const addLoading = ref(false)

const handleAddDeposit = async () => {
    amountError.value = ''
    addLoading.value = true
    try {
        await $fetch(`/api/goals/${goalId}/deposits`, {
            method: 'POST',
            body: { amount: Number(depositAmount.value), note: depositNote.value }
        })
    } catch (error) {
        if (!(error instanceof FetchError)) {
            console.error(error)
            return
        }
        const issues = JSON.parse(error.data.message)
        for (const issue of issues) {
            if (issue.path[0] === 'amount') amountError.value = issue.message
        }
    } finally {
        depositAmount.value = ''
        depositNote.value = ''
        refreshNuxtData('goals')
        addLoading.value = false
    }
}
</script>
<template>
    <div>
        <ModalDialog ref="dialogEditTarget">
            <template #title>
                Edit goal
            </template>
            <div class="flex flex-col gap-2.5">
                <BaseInput name="name" label="Goal name" type="text" placeholder="e.g. MacBook Pro M4"
                    :value="goal?.name" />
                <BaseInput name="target" label="Target amount" type="number" placeholder="0.00" :icon="Dollar"
                    :value="goal?.target" />
                <BaseInput name="deadline" label="Deadline (optional)" type="date" :icon="Calendar"
                    :value="deadlineYyyyMmDd" />
            </div>
            <template #button>
                <BaseButton intent="secondary" base-class="bg-neutral-700" @click="closeDialogEdit"
                    @keydown.enter="closeDialogEdit">
                    Cancel
                </BaseButton>
                <BaseButton intent="primary" @click="closeDialogEdit" @keydown.enter="closeDialogEdit">
                    Save Changes
                </BaseButton>
            </template>
        </ModalDialog>
        <ModalDialog ref="dialogDeleteTarget" bottom-line>
            <template #title>
                Delete {{ goal?.name }}?
            </template>
            This will permanently delete this goal and all its deposit history. This cannot be undone.
            <template #button>
                <BaseButton intent="secondary" base-class="bg-neutral-700" @click="closeDialogDelete"
                    @keydown.enter="closeDialogDelete">
                    Cancel
                </BaseButton>
                <BaseButton intent="primary" @click="closeDialogDelete" @keydown.enter="closeDialogDelete"
                    base-class="bg-red-500">
                    Delete goal
                </BaseButton>
            </template>
        </ModalDialog>
        <NavigationBar />
        <main
            class="px-[clamp(1rem,0.523rem+2.036vw,1.5rem)] py-[clamp(2rem,1.523rem+2.036vw,2.5rem)] flex flex-col gap-4 lg:px-10 lg:mx-auto lg:max-w-180 lg:py-6">
            <motion.div ref="sectionRef" :variants="containerVariants" initial="hidden" while-in-view="visible"
                :in-view-options="{ once: true }" class="flex flex-col gap-1.25">
                <div class="flex justify-between">
                    <BaseButton to="/" intent="tertiary" base-class="px-0 text-neutral-400 hover:bg-transparent"
                        icon-class="hue-rotate-210 saturate-1 brightness-54" type="button">
                        <template #icon>
                            <img :src="ChevronLeft" alt="">
                        </template>Back
                    </BaseButton>
                    <div class="flex">
                        <BaseButton intent="tertiary" type="button" base-class="px-1.5" @click="showDialogEdit()"
                            @keydown.enter="showDialogEdit()">
                            Edit goal
                        </BaseButton>
                        <BaseButton intent="tertiary" type="button" base-class="text-red-500 px-1.5"
                            @click="showDialogDelete()" @keydown.enter="showDialogDelete()">
                            Delete goal
                        </BaseButton>
                    </div>
                </div>
                <h1 class="preset-1-mobile md:preset-1">{{ goal?.name }}</h1>
                <p class="preset-6 md:preset-5 flex gap-1.5 text-neutral-300">
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
            </motion.div>
            <div class="flex flex-col gap-[clamp(2rem,1.046rem+4.071vw,3rem)] lg:flex-row">
                <motion.section ref="cardRef" :variants="containerVariants" initial="hidden" while-in-view="visible"
                    :in-view-options="{ once: true }" v-if="(goal ? goalSaved(goal) : 0) >= (goal?.target ?? 0)"
                    class="flex flex-col gap-5 px-[clamp(1rem,0.523rem+2.036vw,1.5rem)] py-5 rounded-2xl bg-linear-to-l from-orange-400 to-orange-700 ring-1 ring-inset ring-white/30 lg:flex-1">
                    <div
                        class="relative size-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-[17px] backdrop-saturate-125 flex items-center justify-center">
                        <div
                            class="absolute inset-0 rounded-full bg-linear-to-tr from-transparent via-white/5 to-white/10 pointer-events-none">
                        </div>
                        <img :src="Checkmark" alt="">
                    </div>
                    <div class="flex flex-col gap-3">
                        <p class="preset-1">100%</p>
                        <div class="flex flex-col gap-1.25">
                            <h2 class="preset-2">Goal Complete</h2>
                            <p class="preset-5">You saved {{ currency.format(goal ? goalSaved(goal) : 0) }} across {{
                                goal?.deposits.length ??
                                0 }}
                                {{ (goal?.deposits.length ?? 0) === 1 ? 'deposit' : 'deposits' }}. {{ goal?.deadline ?
                                    `Finished
                                ${createdAtDate <= deadlineDate ? 'before' : 'after'} your ${new
                                        Date(goal.deadline).toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'short',
                                            year: 'numeric'
                                        })} deadline.` : '' }}</p>
                        </div>
                        <div class="flex gap-2.5">
                            <p class="flex flex-col gap-1 uppercase">
                                <span class="preset-2">{{ displayDeposits }}</span>
                                <span class="preset-5">{{ (goal?.deposits.length ?? 0) === 1 ? 'deposit' : 'deposits'
                                    }}</span>
                            </p>
                            <div class="h-fill w-px bg-white/30" />
                            <p class="flex flex-col gap-1 uppercase">
                                <span class="preset-2">{{ displaySaved }}</span>
                                <span class="preset-5">total saved</span>
                            </p>
                        </div>
                    </div>
                </motion.section>
                <div v-else class="flex flex-col gap-3 lg:w-[52.4375rem]">
                    <motion.section ref="cardRef" :variants="containerVariants" initial="hidden" while-in-view="visible"
                        :in-view-options="{ once: true }"
                        class="flex flex-col gap-3 p-[clamp(1rem,0.523rem+2.036vw,1.5rem)] rounded-xl bg-neutral-800 ring-1 ring-inset ring-neutral-600">
                        <div class="flex justify-between items-center">
                            <p class="preset-1-mobile md:preset-1 text-orange-400">{{ displayPercentage }}</p>
                            <p class="preset-5-semibold md:preset-4 text-neutral-300">{{ displayRemaining }} remaining
                            </p>
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
                    <motion.form @submit.prevent="handleAddDeposit" ref="sectionRef" :variants="containerVariants"
                        initial="hidden" while-in-view="visible" :in-view-options="{ once: true }"
                        class="flex flex-col gap-2.5 p-[clamp(1rem,0.523rem+2.036vw,1.5rem)] rounded-xl bg-neutral-800 ring-1 ring-inset ring-neutral-600 preset-4">
                        <h2>Add deposit</h2>
                        <div class="flex flex-col gap-2.5">
                            <BaseInput name="amount" label="Amount" :icon="Dollar" placeholder="0.00" type="number"
                                v-model="depositAmount" :error-msg="amountError" />
                            <BaseInput name="note" label="Note (optional)" placeholder="e.g. Monthly savings"
                                type="name" v-model="depositNote" />
                        </div>
                        <BaseButton intent="primary" type="submit" :disabled="addLoading">
                            <template v-if="addLoading" #icon>
                                <motion.img :animate="{ rotate: 360 }"
                                    :transition="{ duration: 1, repeat: Infinity, ease: 'linear' }" :src="Spinner"
                                    alt="" />
                            </template>
                            Add funds
                        </BaseButton>
                    </motion.form>
                </div>
                <motion.div ref="sectionRef" :variants="containerVariants" initial="hidden" while-in-view="visible"
                    :in-view-options="{ once: true }" class="flex flex-col gap-2 lg:w-[24.5625rem]">
                    <div class="flex justify-between items-center">
                        <h2 class="preset-4">Deposit history</h2>
                        <p class="preset-6 text-neutral-300">{{ goal?.deposits.length ?? 0 }} {{ (goal?.deposits.length
                            ??
                            0) === 1 ?
                            'deposit' : 'deposits' }}</p>
                    </div>
                    <div>
                        <div class="w-full bg-neutral-800 h-px" />
                        <motion.div ref="sectionRef" :variants="containerVariants" initial="hidden"
                            while-in-view="visible" :in-view-options="{ once: true }"
                            v-for="g in (goal?.deposits ?? []).slice().reverse()"
                            class="flex items-center gap-1.25 py-2">
                            <div class="size-5 flex items-center justify-center rounded-full bg-neutral-800">
                                <img :src="ArrowDown" alt="">
                            </div>
                            <div class="flex-1 preset-6">
                                <h3>{{ g.note ? g.note : 'Deposit' }}</h3>
                                <p class="text-neutral-300">{{ g.createdAt ? new
                                    Date(g.createdAt).toLocaleDateString('en-US', {
                                        month:
                                            'short', day:
                                            'numeric', year: 'numeric'
                                    }) : '' }}</p>
                            </div>
                            <p class="preset-5-semibold text-green-500">+{{ currency.format(g.amount ?? 0) }}</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </main>
    </div>
</template>
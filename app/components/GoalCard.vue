<script setup lang="ts">
import { tv, type VariantProps } from 'tailwind-variants';


const goalCardStyle = tv({
    slots: {
        base: 'flex flex-col gap-2 rounded-2xl p-[clamp(1rem,0.523rem+2.036vw,1.5rem)] ring-1 ring-inset',
        percentage: 'preset-1-mobile md:preset-1',
        progress: 'relative h-1.5 w-full rounded-[2.5rem]',
        innerProgress: 'absolute h-[inherit] rounded-[inherit] ring-1 ring-inset ring-white/30 bg-[repeating-linear-gradient(-60deg,rgba(0,0,6,0.1),rgba(0,0,0,0.1)_2px,rgba(0,0,0,0)_2px,rgba(0,0,0,0)_8.73px)]',
        amount: 'preset-6',
        circle: 'inline-block size-0.5 rounded-full bg-white/30',
        due: 'preset-6',
        complete: 'font-inter semi-bold text-[0.6875rem] uppercase px-1.25 py-0.5 rounded-[2.75rem] ring-1 ring-inset h-fit leading-[120%]'
    },
    variants: {
        size: {
            default: {
                base: "min-h-25 bg-neutral-800 ring-neutral-600 bg-[url('/assets/images/pattern-grid.svg')] md:min-h-[15rem]",
                percentage: 'text-orange-400',
                progress: 'bg-neutral-700',
                innerProgress: 'bg-orange-400',
                due: 'opacity-70',
                complete: 'text-green-500 ring-green-500 bg-green-900'
            },
            wide: {
                base: 'min-h-30 bg-linear-to-l from-orange-400 to-orange-700 ring-white/30 md:min-h-[15rem] md:col-span-2',
                progress: 'bg-orange-800',
                innerProgress: 'bg-neutral-0'
            },
            tall: {
                base: "min-h-32.5 bg-neutral-800 ring-neutral-600 bg-[url('/assets/images/pattern-grid.svg')] md:min-h-[15rem] md:col-span-2",
                percentage: 'text-orange-400',
                progress: 'bg-neutral-700',
                innerProgress: 'bg-orange-400',
                circle: 'bg-white/30',
                due: 'opacity-70',
                complete: 'text-green-500 ring-green-500 bg-green-900'
            }
        },
        status: {
            empty: {
                percentage: 'text-neutral-400'
            },
            full: {
                percentage: 'text-green-500',
                innerProgress: 'bg-green-500',
            }
        }
    }
})

type CardVariants = VariantProps<typeof goalCardStyle>

const props = withDefaults(
    defineProps<{
        name: string
        amount: number
        deadline: string | null
        target: number
        size?: CardVariants['size']
    }>(),
    {
        name: undefined,
        amount: undefined,
        deadline: null,
        target: undefined,
        size: undefined,
    }
)

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
})

const deadlineDate = computed(() => {
    if (!props.deadline) return null
    return new Date(props.deadline)
})

const formattedDeadline = computed(() => {
    if (!deadlineDate.value) return 'No deadline'
    const deadlineFormatted = deadlineDate.value.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
    return `Due ${deadlineFormatted}`
})

const percentage = computed(() => {
    return `${Math.round((props.amount / props.target) * 100)}%`
})

const isEmpty = computed(() => props.amount <= 0)
const isFull = computed(() => props.target > 0 && props.amount >= props.target)

const status = computed(() => {
    if (props.size === 'wide') return undefined
    if (isFull.value) return 'full'
    if (isEmpty.value) return 'empty'
    return undefined
})

const styles = computed(() => goalCardStyle({ size: props.size, status: status.value }))
</script>

<template>
    <section :class="styles.base()">
        <h3 class="flex justify-between preset-4">{{ name }}
            <span v-if="isFull" :class="styles.complete()">Complete</span>
        </h3>
        <div class="flex flex-col gap-2 grow justify-end">
            <p :class="styles.percentage()">{{ percentage }}</p>
            <div :class="styles.progress()">
                <div :class="styles.innerProgress()" :style="{ width: percentage }"></div>
            </div>
        </div>
        <p class="flex items-center gap-1">
            <span :class="styles.amount()">{{ currency.format(amount) }} of {{ currency.format(target) }}</span>
            <span :class="styles.circle()"></span>
            <span :class="styles.due()">
                {{ formattedDeadline }}
            </span>
        </p>
    </section>
</template>
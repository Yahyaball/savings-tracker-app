<script setup lang="ts">
import { tv, type VariantProps } from 'tailwind-variants';
import { motion, useInView } from "motion-v"
import { useCountUp } from '~/composables/useCountUp'

const goalCardStyle = tv({
    slots: {
        base: 'flex flex-col gap-2 rounded-2xl p-[clamp(1rem,0.523rem+2.036vw,1.5rem)] ring-1 ring-inset lg:nth-[8n+2]:col-start-1 lg:nth-[8n+3]:col-start-2 lg:nth-[8n+4]:col-start-3 lg:nth-[8n+5]:col-start-2 lg:nth-[8n+6]:col-start-2 lg:nth-[8n+7]:col-start-3',
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
                innerProgress: 'bg-neutral-0',
                complete: 'text-green-500 ring-green-500 bg-green-900'
            },
            tall: {
                base: "min-h-32.5 bg-neutral-800 ring-neutral-600 bg-[url('/assets/images/pattern-grid.svg')] md:min-h-[15rem] md:col-span-2 lg:col-span-1 lg:row-span-2",
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

const props = defineProps<{
    name: string
    amount: number
    deadline: string | null
    target: number
    size?: CardVariants['size']
    slug: string
}>()

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
})

const deadlineDate = computed(() => {
    if (!props.deadline) return null
    const d = new Date(props.deadline)
    if (Number.isNaN(d.getTime())) return null
    return d
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

const percentageValue = computed(() => {
    if (!props.target || props.target <= 0) return 0
    const amount = props.amount ?? 0
    const target = props.target ?? 0
    const p = Math.round((amount / target) * 100)
    return Math.min(Math.max(p, 0), 100)
})

const percentage = computed(() => `${percentageValue.value}%`)

const isEmpty = computed(() => (props.amount ?? 0) <= 0)
const isFull = computed(() => (props.target ?? 0) > 0 && (props.amount ?? 0) >= (props.target ?? 0))

const status = computed(() => {
    if (props.size === 'wide') return undefined
    if (isFull.value) return 'full'
    if (isEmpty.value) return 'empty'
    return undefined
})

const styles = computed(() => goalCardStyle({ size: props.size, status: status.value }))

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

const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20, delay: 0.8 }
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

const sectionRef = ref<HTMLElement | null>(null)
const cardInView = useInView(sectionRef, { once: true })

const { display: displayPercentage } = useCountUp(percentageValue, {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
    format: "percent",
    trigger: cardInView
})

const { display: displayAmount } = useCountUp(() => props.amount ?? 0, {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1],
    format: "currency",
    trigger: cardInView,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
})
</script>

<template>
    <NuxtLink :to="`/goals/${slug}`">
        <motion.section ref="sectionRef" :class="styles.base()" :variants="containerVariants" initial="hidden"
            while-in-view="visible" :in-view-options="{ once: true }">
            <h3 class="flex justify-between preset-4">{{ name }}
                <motion.span v-if="isFull" :class="styles.complete()" :variants="badgeVariants">
                    Complete
                </motion.span>
            </h3>
            <div class="flex flex-col gap-2 grow justify-end">
                <motion.p role="progressbar" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="percentageValue"
                    :aria-valuetext="`${percentageValue}% of goal`" :class="styles.percentage()">
                    {{ displayPercentage }}
                </motion.p>
                <div :class="styles.progress()">
                    <motion.div :class="styles.innerProgress()" :variants="progressVariants" :custom="percentage" />
                </div>
            </div>
            <p class="flex items-center gap-1">
                <span class="sr-only">{{ currency.format(amount) }} of {{ currency.format(target) }}</span>
                <span :class="styles.amount()" aria-hidden="true">{{ displayAmount }} of {{ currency.format(target)
                    }}</span>
                <span :class="styles.circle()" aria-hidden="true" />
                <span :class="styles.due()">
                    {{ formattedDeadline }}
                </span>
            </p>
        </motion.section>
    </NuxtLink>
</template>
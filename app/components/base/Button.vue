<script setup lang="ts">
import { tv, type VariantProps } from 'tailwind-variants';

const buttonStyles = tv({
    slots: {
        base: 'flex items-center justify-center gap-1.25 px-2.5 py-1.5 rounded-full preset-5 cursor-pointer transition-colors outline-0 focus-visible:shadow-[0_0_0_2px_var(--color-neutral-900),0_0_0_4px_var(--color-orange-400)]',
        icon: ''
    },
    variants: {
        intent: {
            primary: {
                base: 'bg-orange-400 text-neutral-900 hover:bg-orange-500',
                icon: ''
            },
            secondary: {
                base: 'bg-neutral-800 ring-1 ring-inset ring-neutral-600 hover:bg-neutral-700',
                icon: 'invert brightness-0'
            },
            tertiary: {
                base: 'hover:bg-neutral-800',
                icon: 'invert brightness-0',
            },
        },
        disabled: {
            true: 'cursor-not-allowed',
            false: ''
        }
    },
    compoundSlots: [
        {
            intent: 'secondary',
            disabled: true,
            slots: ['base'],
            class: 'text-neutral-400 hover:bg-neutral-800'
        },
        {
            intent: 'secondary',
            disabled: true,
            slots: ['icon'],
            class: 'invert brightness-54 hue-rotate-210 saturate-1'
        },
    ],
    defaultVariants: {
        intent: 'primary',
        disabled: false
    }
}
)

type ButtonVariants = VariantProps<typeof buttonStyles>

const props = withDefaults(
    defineProps<{
        intent?: ButtonVariants['intent']
        disabled?: boolean,
        type?: 'button' | 'submit' | 'reset'
        baseClass?: string
        iconClass?: string
        to?: string | object
    }>(),
    {
        intent: undefined,
        disabled: undefined,
        type: 'button',
        baseClass: '',
        iconClass: '',
        to: undefined
    }
)

const styles = computed(() => buttonStyles({ intent: props.intent, disabled: props.disabled }))
</script>

<template>
    <NuxtLink :to="to" :type="to ? undefined : type" :disabled="disabled" :class="styles.base({ class: baseClass })"
        tabindex="0">
        <span v-if="$slots.icon" :class="styles.icon({ class: iconClass })">
            <slot name="icon" />
        </span>
        <slot />
    </NuxtLink>
</template>
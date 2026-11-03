<script setup lang="ts">
import { motion } from 'motion-v'

const props = defineProps<{
    name: string,
    value: string,
    modelValue?: string,
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const isChecked = computed(() => props.modelValue === props.value)
</script>

<template>
    <label class="p-1 cursor-pointer flex items-center gap-1 preset-5">
        <input type="radio" :name="name" :value="value" class="sr-only peer" v-model="isChecked" :checked="isChecked"
            @change="emit('update:modelValue', value)" />
        <div
            class="relative size-2 rounded-full ring-1 ring-inset ring-neutral-500 flex items-center justify-center peer-focus-within:shadow-[0_0_0_2px_var(--color-neutral-900),0_0_0_4px_var(--color-orange-400)]">
            <motion.span v-if="isChecked" class="size-1 rounded-full bg-orange-400" :initial="{ scale: 0 }"
                :animate="{ scale: 1 }" :transition="{ type: 'spring', stiffness: 500, damping: 30 }" />
        </div>
        <span :class="isChecked ? 'text-neutral-0' : 'text-neutral-300'">
            <slot />
        </span>
    </label>
</template>
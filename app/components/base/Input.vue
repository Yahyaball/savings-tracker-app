<script setup lang="ts">
import ErrorIcon from '../../assets/images/icon-error.svg'

withDefaults(defineProps<{
    name?: string
    errorMsg?: string
    type?: string
    label?: string
    icon?: string
    placeholder?: string
    modelValue?: string
}>(), {
    type: 'text'
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

defineOptions({ inheritAttrs: false })
</script>

<template>
    <div class="flex flex-col gap-1.25">
        <label :for="name" class="preset-5" v-if="label">{{ label }}</label>
        <div
            class="group flex gap-1.5 px-2 h-6.75 items-center rounded-lg bg-neutral-700 ring-1 ring-inset ring-neutral-500 focus-within:shadow-[0_0_0_2px_var(--color-neutral-800),0_0_0_4px_var(--color-orange-400)] has-aria-invalid:ring-red-500">
            <img v-if="icon" :src="icon" alt="">
            <input :type="type" :id="name" :name="name" :placeholder="placeholder"
                class="preset-5 placeholder-neutral-300 outline-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full"
                :aria-invalid="errorMsg ? true : false" :aria-describedby="errorMsg ? `${name}-error-msg` : undefined"
                :value="modelValue" @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
                v-bind="$attrs" />
        </div>
        <span v-if="errorMsg" :id="`${name}-error-msg`" class="flex items-center gap-1 text-red-500 preset-6">
            <img :src="ErrorIcon" alt="">
            {{ errorMsg }}
        </span>
    </div>
</template>
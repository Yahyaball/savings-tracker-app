<script setup lang="ts">
import LogoSmall from '../assets/images/logo-small.svg'
import LogoLarge from '../assets/images/logo-large.svg'
import Plus from '../assets/images/icon-plus.svg'
import type ModalDialog from './ModalDialog.vue'
import Dollar from '../assets/images/icon-dollar.svg'
import Calendar from '../assets/images/icon-calendar.svg'
import Spinner from '../assets/images/icon-spinner.svg'
import { FetchError } from 'ofetch'
import { motion, useReducedMotion } from 'motion-v'

const shouldReduceMotion = useReducedMotion()
const dialogTarget = ref<InstanceType<typeof ModalDialog>>()
const isTablet = useMediaQuery('(min-width: 48rem)')
const showDialog = () => dialogTarget.value?.show()
const closeDialog = () => dialogTarget.value?.close()
const goalName = ref('')
const goalTarget = ref('')
const goalDeadline = ref('')
const nameError = ref('')
const targetError = ref('')
const createLoading = ref(false)
const handleSubmit = async () => {
    nameError.value = ''
    targetError.value = ''
    createLoading.value = true
    try {
        await $fetch('/api/goals', { method: 'POST', body: { name: goalName.value, target: Number(goalTarget.value), deadline: goalDeadline.value || null } })
        refreshNuxtData('goals')
        closeDialog()
    } catch (error) {
        if (!(error instanceof FetchError)) {
            console.error(error)
            return
        }
        const issues = JSON.parse(error.data.message)
        for (const issue of issues) {
            if (issue.path[0] === 'name') nameError.value = issue.message
            if (issue.path[0] === 'target') targetError.value = issue.message
        }
    } finally {
        createLoading.value = false
    }
}
</script>

<template>
    <ModalDialog ref="dialogTarget" @submit="handleSubmit">
        <template #title>
            New goal
        </template>
        <div class="flex flex-col gap-2.5">
            <BaseInput name="name" label="Goal name" type="text" placeholder="e.g. MacBook Pro M4" v-model="goalName"
                :error-msg="nameError" />
            <BaseInput name="target" label="Target amount" type="number" placeholder="0.00" :icon="Dollar"
                v-model="goalTarget" :error-msg="targetError" />
            <BaseInput name="deadline" label="Deadline (optional)" type="date" :icon="Calendar"
                v-model="goalDeadline" />
        </div>
        <template #button>
            <BaseButton type="button" intent="secondary" base-class="bg-neutral-700" @click="closeDialog">
                Cancel
            </BaseButton>
            <BaseButton type="submit" intent="primary" :disabled="createLoading">
                <template v-if="createLoading" #icon>
                    <motion.img :animate="{ rotate: 360 }"
                        :transition="{ duration: shouldReduceMotion ? 0 : 1, repeat: Infinity, ease: 'linear' }"
                        :src="Spinner" alt="" />
                </template>
                Create goal
            </BaseButton>
        </template>
    </ModalDialog>
    <header class="min-w-screen shadow-[0_1px_0_0_var(--color-neutral-800)]">
        <div
            class="flex justify-between px-[clamp(1rem,0.523rem+2.036vw,1.5rem)] py-[clamp(0.75rem,0.511rem+1.018vw,1rem)] lg:px-10 lg:mx-auto lg:max-w-180">
            <ClientOnly>
                <img :src="isTablet ? LogoLarge : LogoSmall" alt="Savings Tracker">
            </ClientOnly>
            <BaseButton intent="primary" type="button" @click="showDialog()">
                <template #icon>
                    <img :src="Plus" alt="">
                </template>
                New goal
            </BaseButton>
        </div>
    </header>
</template>
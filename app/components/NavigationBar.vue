<script setup lang="ts">
import LogoSmall from '../assets/images/logo-small.svg'
import LogoLarge from '../assets/images/logo-large.svg'
import Plus from '../assets/images/icon-plus.svg'
import type ModalDialog from './ModalDialog.vue'
import Dollar from '../assets/images/icon-dollar.svg'
import Calendar from '../assets/images/icon-calendar.svg'
import Spinner from '../assets/images/icon-spinner.svg'
import { motion, useReducedMotion } from 'motion-v'

const dropdownRef = ref<HTMLElement | null>(null)
const { user, fetchUser } = useAuth()
const { createGoal } = useGoalActions()
const { announce } = useLiveAnnouncer()
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
const deadlineError = ref('')
const createLoading = ref(false)
const isDropdownOpen = ref(false)
const handleSubmit = async () => {
    nameError.value = ''
    targetError.value = ''
    deadlineError.value = ''
    createLoading.value = true
    try {
        const issues = await createGoal({ name: goalName.value, target: Number(goalTarget.value), deadline: goalDeadline.value || null })
        if (issues) {
            for (const issue of issues) {
                if (issue.path[0] === 'name') nameError.value = issue.message
                if (issue.path[0] === 'target') targetError.value = issue.message
                if (issue.path[0] === 'deadline') deadlineError.value = issue.message
            }
            return
        }
        announce(`Goal "${goalName.value.trim()}" created`)
        goalName.value = ''
        goalTarget.value = ''
        goalDeadline.value = ''
        closeDialog()
    } catch (error) {
        console.error(error)
    } finally {
        createLoading.value = false
    }
}
onMounted(() => {
    if (!user.value) fetchUser()
})

onClickOutside(dropdownRef, () => {
    isDropdownOpen.value = false
}
)

onKeyStroke('Escape', (e) => {
    if (isDropdownOpen.value === true) {
        e.preventDefault()
        isDropdownOpen.value = false
    }
})

</script>

<template>
    <ModalDialog ref="dialogTarget" @submit="handleSubmit">
        <template #title>
            New goal
        </template>
        <div class="flex flex-col gap-2.5">
            <BaseInput name="name" label="Goal name" type="text" placeholder="e.g. MacBook Pro M4" autofocus
                v-model="goalName" :error-msg="nameError" />
            <BaseInput name="target" label="Target amount" type="number" placeholder="0.00" :icon="Dollar"
                v-model="goalTarget" :error-msg="targetError" />
            <BaseInput name="deadline" label="Deadline (optional)" type="date" :icon="Calendar"
                v-model="goalDeadline" :error-msg="deadlineError" @update:model-value="deadlineError = ''" />
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
    <header class="w-full shadow-[0_1px_0_0_var(--color-neutral-800)]">
        <div
            class="flex justify-between px-[clamp(1rem,0.523rem+2.036vw,1.5rem)] py-[clamp(0.75rem,0.511rem+1.018vw,1rem)] lg:px-10 lg:mx-auto lg:max-w-180">
            <ClientOnly>
                <img :src="isTablet ? LogoLarge : LogoSmall" alt="Savings Tracker">
            </ClientOnly>
            <div class="flex gap-1 items-center">
                <BaseButton intent="primary" type="button" @click="showDialog()">
                    <template #icon>
                        <img :src="Plus" alt="">
                    </template>
                    New goal
                </BaseButton>
                <div class="relative" ref="dropdownRef">
                    <BaseAvatar id="account-menu" class="cursor-pointer" @click="isDropdownOpen = !isDropdownOpen"
                        aria-label="Account menu" :aria-expanded="isDropdownOpen" />
                    <AvatarDropdown :show="isDropdownOpen" @close="isDropdownOpen = false" />
                </div>
            </div>
        </div>
    </header>
</template>
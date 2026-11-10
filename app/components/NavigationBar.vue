<script setup lang="ts">
import LogoSmall from '../assets/images/logo-small.svg'
import LogoLarge from '../assets/images/logo-large.svg'
import Plus from '../assets/images/icon-plus.svg'
import type ModalDialog from './ModalDialog.vue'
import Dollar from '../assets/images/icon-dollar.svg'
import Calendar from '../assets/images/icon-calendar.svg'

const dialogTarget = ref<InstanceType<typeof ModalDialog>>()
const isTablet = useMediaQuery('(min-width: 48rem)')
const showDialog = () => dialogTarget.value?.show()
const closeDialog = () => dialogTarget.value?.close()
</script>

<template>
    <ModalDialog ref="dialogTarget">
        <template #title>
            New goal
        </template>
        <div class="flex flex-col gap-2.5">
            <BaseInput name="name" label="Goal name" type="text" placeholder="e.g. MacBook Pro M4" />
            <BaseInput name="target" label="Target amount" type="number" placeholder="0.00" :icon="Dollar" />
            <BaseInput name="deadline" label="Deadline (optional)" type="date" :icon="Calendar" />
        </div>
        <template #button>
            <BaseButton intent="secondary" base-class="bg-neutral-700" @click="closeDialog"
                @keydown.enter="closeDialog">
                Cancel
            </BaseButton>
            <BaseButton intent="primary" @click="closeDialog" @keydown.enter="closeDialog">
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
            <BaseButton intent="primary" type="button" @click="showDialog()" @keydown.enter="showDialog()">
                <template #icon>
                    <img :src="Plus" alt="">
                </template>
                New goal
            </BaseButton>
        </div>
    </header>
</template>
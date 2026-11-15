<script setup lang="ts">
import { motion, useReducedMotion } from 'motion-v';
import type { ComponentPublicInstance } from 'vue';
import Cross from '../assets/images/icon-cross.svg'

const props = defineProps<{
    bottomLine?: boolean
    returnFocus?: string
}>()
const emit = defineEmits(['submit'])
const isLocked = useScrollLock(import.meta.client ? document.body : null)
const shouldReduceMotion = useReducedMotion()
const open = ref(false)
const titleId = useId()
let previousFocus: HTMLElement | null = null
watch(open, (isOpen) => { isLocked.value = isOpen })
const dialogRef = ref<ComponentPublicInstance | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const dialogElement = () => dialogRef.value?.$el as HTMLDialogElement | null
const showDialog = () => {
    if (open.value) return
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    open.value = true
}
const closeDialog = () => {
    const dialog = dialogElement()
    if (dialog?.open) dialog.close()
    else open.value = false
}
watch(open, async (isOpen) => {
    if (isOpen) {
        await nextTick()
        const dialog = dialogElement()
        if (dialog && !dialog.open) dialog.showModal()
        return
    }
    await nextTick()
    const fallback = props.returnFocus
        ? document.querySelector<HTMLElement>(props.returnFocus)
        : null
    const target = previousFocus?.isConnected ? previousFocus : fallback
    target?.focus()
    previousFocus = null
})
defineExpose({
    show: showDialog,
    close: closeDialog
})
onClickOutside(dividerRef, () => {
    closeDialog()
}
)
</script>

<template>
    <AnimatePresence>
        <motion.dialog ref="dialogRef" @cancel.prevent="closeDialog()" v-if="open" @close="open = false"
            :aria-labelledby="titleId"
            class="fixed m-auto inset-0 rounded-2xl text-neutral-0 bg-neutral-800 ring-1 ring-inset ring-neutral-600 w-full md:w-85 backdrop:bg-neutral-900/90"
            :initial="{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.75, '--backdrop-opacity': 0 }"
            :animate="{ opacity: 1, scale: 1, '--backdrop-opacity': 1 }"
            :exit="{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.3, '--backdrop-opacity': 0, transition: { scale: { duration: 0.4, ease: 'easeIn' } } }">
            <button
                class="absolute cursor-pointer right-2.5 top-2.5 rounded outline-0 focus-visible:shadow-[0_0_0_2px_var(--color-neutral-800),0_0_0_4px_var(--color-orange-400)]"
                aria-label="Close" @click="closeDialog()">
                <img :src="Cross" alt="">
            </button>
            <div ref="dividerRef" class="flex flex-col gap-3 p-4">
                <p :id="titleId" class="preset-4">
                    <slot name="title">
                    </slot>
                </p>
                <div v-if="!bottomLine" class="h-px w-full bg-neutral-700" />
                <form novalidate method="dialog" @submit.prevent="emit('submit', $event)" class="flex flex-col gap-3">
                    <slot>
                    </slot>
                    <div v-if="bottomLine" class="h-px w-full bg-neutral-700" />
                    <div class="flex justify-end gap-2">
                        <slot name="button">
                        </slot>
                    </div>
                </form>
            </div>
        </motion.dialog>
    </AnimatePresence>
</template>

<style scoped>
dialog::backdrop {
    opacity: var(--backdrop-opacity, 1);
}
</style>
<script setup lang="ts">
import { motion, useReducedMotion } from 'motion-v';
import type { ComponentPublicInstance } from 'vue';

const isLocked = useScrollLock(import.meta.client ? document.body : null)
const shouldReduceMotion = useReducedMotion()
const open = ref(false)
watch(open, (isOpen) => { isLocked.value = isOpen })
const dialogRef = ref<ComponentPublicInstance | null>(null)
const dialogElement = () => dialogRef.value?.$el as HTMLDialogElement | null
const showDialog = () => {
    if (open.value) return
    open.value = true
    dialogElement()?.showModal()
}
const closeDialog = () => {
    open.value = false
}
watch(open, async (isOpen) => {
    if (isOpen) {
        await nextTick()
        dialogElement()?.showModal()
    }
})
defineExpose({
    show: showDialog,
    close: closeDialog
})
defineProps<{
    bottomLine?: boolean
}>()
const emit = defineEmits(['submit'])
</script>

<template>
    <AnimatePresence>
        <motion.dialog ref="dialogRef" @cancel.prevent="closeDialog()" v-if="open" @close="open = false"
            class="fixed m-auto inset-0 rounded-2xl text-neutral-0 bg-neutral-800 ring-1 ring-inset ring-neutral-600 w-full md:w-85 backdrop:bg-neutral-900/90"
            :initial="{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.75, '--backdrop-opacity': 0 }"
            :animate="{ opacity: 1, scale: 1, '--backdrop-opacity': 1 }"
            :exit="{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.75, '--backdrop-opacity': 0 }">
            <div class="flex flex-col gap-3 p-4">
                <p class="preset-4">
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
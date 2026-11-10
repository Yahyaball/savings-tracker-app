<script setup lang="ts">
const dialogRef = ref<HTMLDialogElement | null>(null)
const showDialog = () => dialogRef.value?.showModal()
const closeDialog = () => dialogRef.value?.close()
defineExpose({
    show: showDialog,
    close: closeDialog
})
defineProps<{
    bottomLine?: boolean
}>()
</script>

<template>
    <dialog ref="dialogRef"
        class="fixed m-auto inset-0 rounded-2xl text-neutral-0 bg-neutral-800 ring-1 ring-inset ring-neutral-600 w-full md:w-85 backdrop:bg-neutral-900/90">
        <div class="flex flex-col gap-3 p-4">
            <p class="preset-4">
                <slot name="title">
                </slot>
            </p>
            <div v-if="!bottomLine" class="h-px w-full bg-neutral-700" />
            <form method="dialog" class="flex flex-col gap-3">
                <slot>
                </slot>
                <div v-if="bottomLine" class="h-px w-full bg-neutral-700" />
                <div class="flex justify-end gap-2">
                    <slot name="button">
                    </slot>
                </div>
            </form>
        </div>
    </dialog>
</template>
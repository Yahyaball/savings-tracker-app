<script setup lang="ts">

const dropdownRef = ref<HTMLElement | null>(null)
const { user, fetchUser, logout } = useAuth()
const name = computed(() => {
    const name = user.value?.name?.trim()
    if (name) return name
    return ''
})
const email = computed(() => {
    const email = user.value?.email?.trim()
    if (email) return email
    return ''
})
onMounted(() => {
    if (!user.value) fetchUser()
})

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
onClickOutside(dropdownRef, () => {
    emit('update:modelValue', false)
}
)
</script>

<template>
    <div ref="dropdownRef"
        class="absolute right-0 mt-1 flex flex-col p-1 rounded-xl bg-neutral-800 ring-1 ring-inset ring-neutral-700 gap-1.5">
        <div class="flex gap-1 items-center">
            <BaseAvatar tabindex="-1" class="hover:bg-neutral-700 hover:ring-neutral-500" />
            <div clas="flex flex-col gap-0.25">
                <p class="preset-5">{{ name }}</p>
                <p class="preset-6 text-neutral-300">{{ email }}</p>
            </div>
        </div>
        <div class="bg-neutral-700 h-px w-full" />
        <div class="flex flex-col">
            <button class="p-1 text-neutral-300 preset-5 text-start cursor-pointer">Edit profile</button>
            <button class="p-1 text-neutral-300 preset-5 text-start cursor-pointer">Change password</button>
        </div>
        <div class="bg-neutral-700 h-px w-full" />
        <button class="p-1 text-red-500 preset-5 text-start cursor-pointer" @click="logout">Sign out</button>
    </div>
</template>
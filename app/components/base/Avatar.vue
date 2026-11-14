<script setup lang="ts">
const { user, displayName, fetchUser, initials } = useAuth()
onMounted(() => {
    if (!user.value) fetchUser()
})
</script>

<template>
    <ClientOnly>
        <button type="button"
            class="preset-5 text-neutral-300 size-6 rounded-full bg-neutral-700 ring-1 ring-inset outline-0 ring-neutral-500 hover:bg-neutral-600 transition-colors hover:ring-neutral-400 focus-visible:shadow-[0_0_0_2px_var(--color-neutral-900),0_0_0_4px_var(--color-orange-400)]"
            :aria-label="displayName">
            {{ initials }}
        </button>
    </ClientOnly>
</template>
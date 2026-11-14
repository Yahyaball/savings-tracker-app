<script setup lang="ts">
import { motion, AnimatePresence, useReducedMotion } from 'motion-v';

const { user, email, displayName, fetchUser, logout } = useAuth()
onMounted(() => {
    if (!user.value) fetchUser()
})

defineProps({ show: Boolean })

const shouldReduceMotion = useReducedMotion()
</script>

<template>
    <AnimatePresence>
        <motion.div v-if="show"
            class="absolute right-0 mt-1 flex flex-col p-1 rounded-xl bg-neutral-800 ring-1 ring-inset ring-neutral-700 gap-1.5 origin-top-right"
            :initial="{ opacity: 0, scale: shouldReduceMotion ? 1 : 0, transformOrigin: 'right top' }"
            :animate="{ opacity: 1, scale: 1 }" :exit="{ opacity: 0, scale: shouldReduceMotion ? 1 : 0 }">
            <div class="flex gap-1 items-center">
                <BaseAvatar tabindex="-1" class="hover:bg-neutral-700 hover:ring-neutral-500" aria-hidden="true" />
                <div class="flex flex-col gap-0.25">
                    <p class="preset-5">{{ displayName }}</p>
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
        </motion.div>
    </AnimatePresence>
</template>
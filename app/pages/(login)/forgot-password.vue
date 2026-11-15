<script setup lang="ts">
import LogoLarge from '../../assets/images/logo-large.svg'
import Star from '../../assets/images/pattern-star.svg'
import { AppwriteException } from 'appwrite'
import Spinner from '../../assets/images/icon-spinner.svg'
import { motion, useReducedMotion } from 'motion-v'

definePageMeta({ middleware: 'guest' })

const shouldReduceMotion = useReducedMotion()
const { $account } = useNuxtApp()
const email = ref('')
const emailError = ref('')
const loading = ref(false)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const sendReset = async () => {
    emailError.value = ''
    const trimmed = email.value.trim()
    if (!trimmed) return void (emailError.value = 'Email address is required')
    if (!emailPattern.test(trimmed)) return void (emailError.value = 'Enter a valid email address')
    loading.value = true
    try {
        await $account.createRecovery({
            email: trimmed,
            url: `${window.location.origin}/new-password`,
        })
        await navigateTo({ path: '/email-sent', query: { email: trimmed } })
    } catch (error) {
        if (error instanceof AppwriteException && error.type === 'user_not_found') {
            await navigateTo({ path: '/email-sent', query: { email: trimmed } })
        } else if (error instanceof AppwriteException) {
            emailError.value = error.message
        } else {
            emailError.value = 'Could not send the reset link. Please try again.'
        }
    } finally {
        loading.value = false
    }
}

useHead({
    title: 'Forgot Password - Savings Tracker'
})
</script>

<template>
    <main class="flex py-5 px-2 min-h-dvh lg:p-5">
        <div class="flex gap-10 w-full max-w-170 mx-auto">
            <ClientOnly>
                <figure
                    class="max-lg:hidden relative box-border bg-red-500 w-fit flex-1 flex flex-col p-5 bg-linear-to-l from-orange-400 to-orange-700 ring-1 ring-inset ring-white/30 rounded-2xl overflow-hidden">
                    <img :src="Star" alt="" class="absolute size-58 -right-12.25 bottom-[-7.5625rem] select-none"
                        draggable="false">
                    <blockquote class="flex items-center preset-1 flex-1">
                        <p>"A budget is telling your
                            money where to go instead of wondering where it went."</p>
                    </blockquote>
                    <figcaption class="preset-4">
                        — Dave Ramsey
                    </figcaption>
                </figure>
            </ClientOnly>
            <div class="m-auto w-full lg:flex-1 max-w-80 lg:max-w-none">
                <div class="flex flex-col w-full h-fit gap-4 lg:pr-5">
                    <div class="flex flex-col gap-5">
                        <div>
                            <img :src="LogoLarge" alt="Savings Tracker">
                        </div>
                        <div class="flex flex-col gap-2">
                            <h1 class="preset-2">Forgot your password?</h1>
                            <p class="preset-5 text-neutral-300 w-[clamp(16rem,13.257rem+11.705vw,18.875rem)]">Enter
                                your email address and we'll send you a link to
                                reset it.</p>
                        </div>
                    </div>
                    <form novalidate class="flex flex-col gap-2.5" @submit.prevent="sendReset">
                        <BaseInput name="email" type="email" label="Email address" autocomplete="email"
                            v-model="email" :error-msg="emailError" @update:model-value="emailError = ''" />
                        <BaseButton type="submit" intent="primary" base-class="font-semibold mt-1.5"
                            :disabled="loading">
                            <template v-if="loading" #icon>
                                <motion.img :animate="{ rotate: 360 }"
                                    :transition="{ duration: shouldReduceMotion ? 0 : 1, repeat: Infinity, ease: 'linear' }"
                                    :src="Spinner" alt="" />
                            </template>
                            Send reset link
                        </BaseButton>
                        <NuxtLink to="/login" class="preset-5 text-center underline text-neutral-0">
                            Back to sign in
                        </NuxtLink>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>
<script setup lang="ts">
import LogoLarge from '../../assets/images/logo-large.svg'
import Star from '../../assets/images/pattern-star.svg'
import Spinner from '../../assets/images/icon-spinner.svg'
import { AppwriteException } from 'appwrite'
import { motion, useReducedMotion } from 'motion-v'

definePageMeta({ middleware: 'guest' })

const route = useRoute()
const { fetchUser } = useAuth()
const shouldReduceMotion = useReducedMotion()
const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const formError = ref('')
const isLoading = ref(false)
const { $account } = useNuxtApp()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validate = () => {
    emailError.value = ''
    passwordError.value = ''
    formError.value = ''
    if (!email.value.trim()) emailError.value = 'Email address is required'
    else if (!emailPattern.test(email.value.trim())) emailError.value = 'Enter a valid email address'
    if (!password.value) passwordError.value = 'Password is required'
    return !emailError.value && !passwordError.value
}

const redirectTo = computed(() => {
    const target = route.query.redirect
    return typeof target === 'string' && target.startsWith('/') && !target.startsWith('//') ? target : '/'
})

const login = async () => {
    if (!validate()) return
    isLoading.value = true
    try {
        await $account.createEmailPasswordSession({ email: email.value.trim(), password: password.value })
        await fetchUser()
        await navigateTo(redirectTo.value)
    } catch (error) {
        if (error instanceof AppwriteException) {
            if (error.type === 'user_invalid_credentials') {
                emailError.value = 'Incorrect email or password'
                passwordError.value = 'Incorrect email or password'
            } else if (error.type === 'user_blocked') {
                formError.value = 'This account has been blocked. Please contact support.'
            } else if (error.type === 'user_password_reset_required') {
                formError.value = 'Your password must be reset before you can sign in. Use "Forgot password?" to choose a new one.'
            } else if (error.type === 'general_rate_limit_exceeded') {
                formError.value = 'Too many attempts. Please wait a moment and try again.'
            } else {
                formError.value = 'Could not sign in. Please try again.'
            }
        } else {
            formError.value = 'Could not sign in. Please try again.'
        }
    } finally {
        isLoading.value = false
    }
}

useHead({
    title: 'Login - Savings Tracker'
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
                        <p>"The goal isn't to be rich. It's to have enough."</p>
                    </blockquote>
                    <figcaption class="preset-4">
                        — Morgan Housel
                    </figcaption>
                </figure>
            </ClientOnly>
            <div class="m-auto w-full lg:flex-1 max-w-80 lg:max-w-none">
                <div class="flex flex-col w-full h-fit gap-4 lg:pr-5">
                    <div class="flex flex-col gap-5">
                        <div>
                            <img :src="LogoLarge" alt="Savings Tracker">
                        </div>
                        <div class="flex flex-col gap-1">
                            <h1 class="preset-2">Welcome back</h1>
                            <p class="preset-5 text-neutral-300">Sign in to your account</p>
                        </div>
                    </div>
                    <div class="h-px w-full bg-neutral-700" />
                    <form novalidate class="flex flex-col gap-2.5" @submit.prevent="login">
                        <BaseInput name="email" type="email" label="Email address" autocomplete="email"
                            v-model="email" :error-msg="emailError" @update:model-value="emailError = ''" />
                        <div class="flex flex-col gap-1.25">
                            <BaseInput name="password" type="password" label="Password"
                                autocomplete="current-password" v-model="password" :error-msg="passwordError"
                                @update:model-value="passwordError = ''" />
                            <NuxtLink to="/forgot-password" class="preset-5 text-end text-neutral-300">Forgot password?
                            </NuxtLink>
                        </div>
                        <p v-if="formError" class="text-red-500 preset-6">{{ formError }}</p>
                        <BaseButton type="submit" intent="primary" base-class="font-semibold mt-1.5"
                            :disabled="isLoading">
                            <template v-if="isLoading" #icon>
                                <motion.img :animate="{ rotate: 360 }"
                                    :transition="{ duration: shouldReduceMotion ? 0 : 1, repeat: Infinity, ease: 'linear' }"
                                    :src="Spinner" alt="" />
                            </template>
                            Sign in
                        </BaseButton>
                        <p class="text-center preset-5 text-neutral-300">
                            Don't have an account?
                            <NuxtLink to="/sign-up" class="underline text-neutral-0">
                                Create one
                            </NuxtLink>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>
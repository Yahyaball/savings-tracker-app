<script setup lang="ts">
import LogoLarge from '../../assets/images/logo-large.svg'
import Star from '../../assets/images/pattern-star.svg'
import Spinner from '../../assets/images/icon-spinner.svg'
import { ID, AppwriteException } from 'appwrite'
import { motion, useReducedMotion } from 'motion-v'

definePageMeta({ middleware: 'guest' })

const shouldReduceMotion = useReducedMotion()
const { $account } = useNuxtApp()
const { fetchUser } = useAuth()
const name = ref('')
const email = ref('')
const password = ref('')
const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const formError = ref('')
const isLoading = ref(false)

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validate = () => {
    nameError.value = ''
    emailError.value = ''
    passwordError.value = ''
    formError.value = ''
    if (!name.value.trim()) nameError.value = 'Full name is required'
    if (!email.value.trim()) emailError.value = 'Email address is required'
    else if (!emailPattern.test(email.value.trim())) emailError.value = 'Enter a valid email address'
    if (!password.value) passwordError.value = 'Password is required'
    else if (password.value.length < 8) passwordError.value = 'Password must be at least 8 characters'
    return !nameError.value && !emailError.value && !passwordError.value
}

const register = async () => {
    if (!validate()) return
    isLoading.value = true
    try {
        await $account.create({
            userId: ID.unique(),
            email: email.value.trim(),
            password: password.value,
            name: name.value.trim()
        })
    } catch (error) {
        if (error instanceof AppwriteException) {
            if (error.type === 'user_already_exists') {
                emailError.value = 'An account with this email already exists'
            } else if (error.type === 'user_password_too_short') {
                passwordError.value = 'Password must be at least 8 characters'
            } else if (error.type === 'password_pwned') {
                passwordError.value = 'This password has appeared in a data breach. Choose a different one.'
            } else if (error.type === 'password_personal_data') {
                passwordError.value = 'Your password must not contain your name or email address.'
            } else if (error.type === 'general_rate_limit_exceeded') {
                formError.value = 'Too many attempts. Please wait a moment and try again.'
            } else {
                formError.value = 'Could not create your account. Please try again.'
            }
        } else {
            formError.value = 'Could not create your account. Please try again.'
        }
        isLoading.value = false
        return
    }
    try {
        await $account.createEmailPasswordSession({ email: email.value.trim(), password: password.value })
        await fetchUser()
        await navigateTo('/')
    } catch {
        await navigateTo({ path: '/login', query: { email: email.value.trim() } })
    } finally {
        isLoading.value = false
    }
}

useHead({
    title: 'Sign Up - Savings Tracker'
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
                        <p>"Do not save what is left
                            after spending, but spend what
                            is left after saving."</p>
                    </blockquote>
                    <figcaption class="preset-4">
                        &ndash; Warren Buffett
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
                            <h1 class="preset-2">Create your account</h1>
                            <p class="preset-5 text-neutral-300">Start tracking your savings goals</p>
                        </div>
                    </div>
                    <form novalidate class="flex flex-col gap-2.5" @submit.prevent="register">
                        <BaseInput name="name" type="text" label="Full name" autocomplete="name" v-model="name"
                            :error-msg="nameError" @update:model-value="nameError = ''" />
                        <BaseInput name="email" type="email" label="Email address" autocomplete="email"
                            v-model="email" :error-msg="emailError" @update:model-value="emailError = ''" />
                        <BaseInput name="password" type="password" label="Password" autocomplete="new-password"
                            v-model="password" :error-msg="passwordError"
                            @update:model-value="passwordError = ''" />
                        <p v-if="formError" class="text-red-500 preset-6">{{ formError }}</p>
                        <BaseButton type="submit" intent="primary" base-class="font-semibold mt-1.5"
                            :disabled="isLoading">
                            <template v-if="isLoading" #icon>
                                <motion.img :animate="{ rotate: 360 }"
                                    :transition="{ duration: shouldReduceMotion ? 0 : 1, repeat: Infinity, ease: 'linear' }"
                                    :src="Spinner" alt="" />
                            </template>
                            Create account
                        </BaseButton>
                        <p class="text-center preset-5 text-neutral-300">
                            Already have an account?
                            <NuxtLink to="/login" class="underline text-neutral-0">
                                Sign in
                            </NuxtLink>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>
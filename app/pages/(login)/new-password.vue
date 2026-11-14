<script setup lang="ts">
import LogoLarge from '../../assets/images/logo-large.svg'
import Star from '../../assets/images/pattern-star.svg'
import { AppwriteException } from 'appwrite'

const route = useRoute()
const { $account } = useNuxtApp()
const password = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const confirmError = ref('')
const linkError = ref('')
const formError = ref('')
const loading = ref(false)

const userId = computed(() => (typeof route.query.userId === 'string' ? route.query.userId : ''))
const secret = computed(() => (typeof route.query.secret === 'string' ? route.query.secret : ''))
const linkValid = computed(() => Boolean(userId.value && secret.value))

const resetPassword = async () => {
    passwordError.value = ''
    confirmError.value = ''
    formError.value = ''
    if (!password.value) passwordError.value = 'Password is required'
    else if (password.value.length < 8) passwordError.value = 'Password must be at least 8 characters'
    if (!confirmPassword.value) confirmError.value = 'Please confirm your new password'
    else if (password.value !== confirmPassword.value) confirmError.value = 'Passwords do not match'
    if (passwordError.value || confirmError.value) return

    loading.value = true
    try {
        await $account.updateRecovery({
            userId: userId.value,
            secret: secret.value,
            password: password.value
        })
        await navigateTo('/success')
    } catch (error) {
        if (error instanceof AppwriteException && error.type === 'password_recently_used') {
            passwordError.value = 'Your new password must be different from your previous password.'
        } else if (error instanceof AppwriteException && error.type === 'user_password_too_short') {
            passwordError.value = 'Password must be at least 8 characters'
        } else if (error instanceof AppwriteException && (error.type === 'password_pwned' || error.type === 'password_personal_data')) {
            passwordError.value = 'Choose a password without personal information and not found in a data breach.'
        } else if (error instanceof AppwriteException && (error.code === 401 || error.type === 'user_invalid_token')) {
            linkError.value = 'This reset link is invalid or has expired.'
        } else if (error instanceof AppwriteException) {
            passwordError.value = error.message
        } else {
            formError.value = 'Could not reset your password. Please try again.'
        }
    } finally {
        loading.value = false
    }
}

useHead({
    title: 'New Password - Savings Tracker'
})
</script>

<template>
    <main class="flex py-5 px-2 min-h-dvh lg:p-5">
        <div class="flex gap-10 w-full max-w-170 mx-auto">
            <ClientOnly>
                <figure
                    class="max-lg:hidden relative box-border bg-red-500 w-fit flex-1 bg-linear-to-l from-orange-400 to-orange-700 ring-1 ring-inset ring-white/30 rounded-2xl overflow-hidden">
                    <img :src="Star" alt="" class="absolute size-58 -right-12.25 bottom-[-7.5625rem] select-none"
                        draggable="false">
                    <div class="h-full flex flex-col p-5">
                        <blockquote class="flex items-center preset-1 flex-1">
                            <p>"A budget is telling your
                                money where to go instead of wondering where it went."</p>
                        </blockquote>
                        <figcaption class="preset-4">
                            — Dave Ramsey
                        </figcaption>
                    </div>
                </figure>
            </ClientOnly>
            <div class="m-auto w-full lg:flex-1 max-w-80 lg:max-w-none">
                <div v-if="linkValid && !linkError" class="flex flex-col w-full h-fit gap-4 lg:pr-5">
                    <div class="flex flex-col gap-5">
                        <div>
                            <img :src="LogoLarge" alt="Savings Tracker">
                        </div>
                        <div class="flex flex-col gap-2">
                            <h1 class="preset-2">Create new password</h1>
                            <p class="preset-5 text-neutral-300">Your new
                                password must be different from your previous password.</p>
                        </div>
                    </div>
                    <form novalidate class="flex flex-col gap-2.5" @submit.prevent="resetPassword">
                        <div class="flex flex-col gap-1.25">
                            <BaseInput v-model="password" name="password" type="password" label="New password"
                                autocomplete="new-password" :error-msg="passwordError"
                                @update:model-value="passwordError = ''" />
                            <p class="preset-6 text-neutral-300">At least 8 characters</p>
                        </div>
                        <BaseInput v-model="confirmPassword" name="confirm-password" type="password"
                            label="Confirm new password" autocomplete="new-password" :error-msg="confirmError"
                            @update:model-value="confirmError = ''" />
                        <p v-if="formError" class="text-red-500 preset-6">{{ formError }}</p>
                        <BaseButton type="submit" intent="primary" base-class="font-semibold mt-1.5"
                            :disabled="loading">
                            Reset password
                        </BaseButton>
                        <NuxtLink to="/login" class="preset-5 text-center underline text-neutral-0">
                            Back to sign in
                        </NuxtLink>
                    </form>
                </div>
                <div v-else class="flex flex-col gap-5 lg:pr-5">
                    <div>
                        <img :src="LogoLarge" alt="Savings Tracker">
                    </div>
                    <div class="flex flex-col gap-2">
                        <h1 class="preset-2">Link expired</h1>
                        <p class="preset-5 text-neutral-300">
                            {{ linkError || 'This reset link is invalid or has expired.' }}
                        </p>
                    </div>
                    <BaseButton type="button" intent="primary" to="/forgot-password">
                        Request a new link
                    </BaseButton>
                </div>
            </div>
        </div>
    </main>
</template>
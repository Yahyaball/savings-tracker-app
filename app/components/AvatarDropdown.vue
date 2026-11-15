<script setup lang="ts">
import { AppwriteException } from 'appwrite';
import { motion, AnimatePresence, useReducedMotion } from 'motion-v';
import type ModalDialog from './ModalDialog.vue'
import Spinner from '../assets/images/icon-spinner.svg'

const dialogTarget = ref<InstanceType<typeof ModalDialog>>()
const dialogPassword = ref<InstanceType<typeof ModalDialog>>()
const { user, email, displayName, fetchUser, logout, updateName, updateEmail, updatePassword } = useAuth()
onMounted(() => {
    if (!user.value) fetchUser()
})

defineProps({ show: Boolean })
const emit = defineEmits<{ close: [] }>()

const name = ref('')
const newEmail = ref('')
const password = ref('')
const nameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const formError = ref('')
const success = ref('')
const saveLoading = ref(false)

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const currentEmail = computed(() => (user.value?.email ?? '').trim().toLowerCase())
const emailChanged = computed(() => newEmail.value.trim().toLowerCase() !== currentEmail.value)
const isDirty = computed(() =>
    name.value.trim() !== (user.value?.name ?? '').trim() || emailChanged.value
)

const showDialog = () => {
    name.value = user.value?.name ?? ''
    newEmail.value = user.value?.email ?? ''
    password.value = ''
    nameError.value = ''
    emailError.value = ''
    passwordError.value = ''
    formError.value = ''
    success.value = ''
    emit('close')
    dialogTarget.value?.show()
}
const closeDialog = () => dialogTarget.value?.close()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const currentPasswordError = ref('')
const newPasswordError = ref('')
const confirmPasswordError = ref('')
const passwordFormError = ref('')
const passwordSuccess = ref('')
const passwordLoading = ref(false)

const passwordDirty = computed(() =>
    Boolean(currentPassword.value || newPassword.value || confirmPassword.value)
)

const showPassword = () => {
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    currentPasswordError.value = ''
    newPasswordError.value = ''
    confirmPasswordError.value = ''
    passwordFormError.value = ''
    passwordSuccess.value = ''
    emit('close')
    dialogPassword.value?.show()
}

const closePassword = () => dialogPassword.value?.close()

const handleSubmit = async () => {
    nameError.value = ''
    emailError.value = ''
    passwordError.value = ''
    formError.value = ''
    success.value = ''

    const nextName = name.value.trim()
    const nextEmail = newEmail.value.trim()
    const emailChanging = emailChanged.value

    let valid = true
    if (!nextName) {
        nameError.value = 'Display name is required'
        valid = false
    } else if (nextName.length > 128) {
        nameError.value = 'Display name must be 128 characters or fewer'
        valid = false
    }
    if (!nextEmail) {
        emailError.value = 'Email is required'
        valid = false
    } else if (!EMAIL_PATTERN.test(nextEmail)) {
        emailError.value = 'Enter a valid email address'
        valid = false
    }
    if (emailChanging && !password.value) {
        passwordError.value = 'Enter your current password to change your email'
        valid = false
    }
    if (!valid) return

    saveLoading.value = true
    let nameSaved = false
    try {
        if (nextName !== (user.value?.name ?? '').trim()) {
            await updateName(nextName)
            nameSaved = true
        }
        if (emailChanging) {
            await updateEmail(nextEmail, password.value)
            password.value = ''
            newEmail.value = nextEmail
        }
        success.value = emailChanging
            ? 'Email updated. Your new address is unverified until you verify it.'
            : 'Profile updated.'
    } catch (error) {
        console.error(error)
        if (error instanceof AppwriteException && error.type === 'user_invalid_credentials') {
            passwordError.value = 'That password is incorrect'
        } else if (error instanceof AppwriteException && error.type === 'user_email_already_exists') {
            emailError.value = 'An account with this email already exists'
        } else if (error instanceof AppwriteException && error.type === 'general_rate_limit_exceeded') {
            formError.value = 'Too many attempts. Try again in a few minutes.'
        } else {
            formError.value = nameSaved
                ? 'Display name saved, but the email could not be changed. Please try again.'
                : 'We could not update your profile. Please try again.'
        }
    } finally {
        saveLoading.value = false
    }
}

const handlePasswordSubmit = async () => {
    currentPasswordError.value = ''
    newPasswordError.value = ''
    confirmPasswordError.value = ''
    passwordFormError.value = ''
    passwordSuccess.value = ''

    let valid = true
    if (!currentPassword.value) {
        currentPasswordError.value = 'Enter your current password'
        valid = false
    }
    if (!newPassword.value) {
        newPasswordError.value = 'Enter a new password'
        valid = false
    } else if (newPassword.value.length < 8) {
        newPasswordError.value = 'Password must be at least 8 characters'
        valid = false
    }
    if (!confirmPassword.value) {
        confirmPasswordError.value = 'Confirm your new password'
        valid = false
    } else if (newPassword.value !== confirmPassword.value) {
        confirmPasswordError.value = 'Passwords do not match'
        valid = false
    }
    if (!valid) return

    passwordLoading.value = true
    try {
        await updatePassword(newPassword.value, currentPassword.value)
        currentPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''
        passwordSuccess.value = 'Password updated.'
    } catch (error) {
        console.error(error)
        if (error instanceof AppwriteException && error.type === 'user_invalid_credentials') {
            currentPasswordError.value = 'That password is incorrect'
        } else if (error instanceof AppwriteException && error.type === 'password_recently_used') {
            newPasswordError.value = 'Choose a password you have not used recently'
        } else if (error instanceof AppwriteException && (error.type === 'password_pwned' || error.type === 'password_personal_data')) {
            newPasswordError.value = 'Choose a password without personal information and not found in a data breach'
        } else if (error instanceof AppwriteException && error.type === 'user_password_too_short') {
            newPasswordError.value = 'Password must be at least 8 characters'
        } else if (error instanceof AppwriteException && error.type === 'general_rate_limit_exceeded') {
            passwordFormError.value = 'Too many attempts. Try again in a few minutes.'
        } else {
            passwordFormError.value = 'We could not update your password. Please try again.'
        }
    } finally {
        passwordLoading.value = false
    }
}

const shouldReduceMotion = useReducedMotion()
</script>

<template>
    <ModalDialog ref="dialogTarget" return-focus="#account-menu" @submit="handleSubmit">
        <template #title>
            Edit profile
        </template>
        <div class="flex flex-col gap-3">
            <div class="flex gap-1 items-center">
                <BaseAvatar tabindex="-1" class="hover:bg-neutral-700 hover:ring-neutral-500" aria-hidden="true" />
                <div class="flex flex-col gap-0.25">
                    <p class="preset-5">{{ displayName }}</p>
                    <p class="preset-6 text-neutral-300">{{ email }}</p>
                </div>
            </div>
            <div class="h-px w-full bg-neutral-700" />
            <div class="flex flex-col gap-1.5">
                <p class="preset-5-semibold">Profile</p>
                <BaseInput name="name" type="text" label="Display name" autocomplete="name" autofocus v-model="name"
                    :error-msg="nameError" @update:model-value="nameError = ''" />
            </div>
            <div class="h-px w-full bg-neutral-700" />
            <div class="flex flex-col gap-1.5">
                <p class="preset-5-semibold">Sign-in email</p>
                <div class="flex flex-col gap-1">
                    <BaseInput name="email" type="email" label="Email" autocomplete="email" v-model="newEmail"
                        :error-msg="emailError" @update:model-value="emailError = ''" />
                    <div v-if="emailChanged" class="flex flex-col gap-1">
                        <BaseInput name="password" type="password" label="Current password"
                            autocomplete="current-password" v-model="password" :error-msg="passwordError"
                            @update:model-value="passwordError = ''" />
                        <p v-if="!passwordError" class="preset-6 text-neutral-300">
                            Required to change your email.
                        </p>
                    </div>
                </div>
            </div>
            <p v-if="formError" role="alert" class="preset-6 text-red-500">{{ formError }}</p>
            <p v-if="success" role="status" class="preset-6 text-green-500">{{ success }}</p>
        </div>
        <template #button>
            <BaseButton type="button" intent="secondary" base-class="bg-neutral-700" :disabled="saveLoading"
                @click="closeDialog">
                Cancel
            </BaseButton>
            <BaseButton type="submit" intent="primary" :disabled="saveLoading || !isDirty">
                <template v-if="saveLoading" #icon>
                    <motion.img :animate="{ rotate: 360 }"
                        :transition="{ duration: shouldReduceMotion ? 0 : 1, repeat: Infinity, ease: 'linear' }"
                        :src="Spinner" alt="" />
                </template>
                Save changes
            </BaseButton>
        </template>
    </ModalDialog>
    <ModalDialog ref="dialogPassword" return-focus="#account-menu" @submit="handlePasswordSubmit">
        <template #title>
            Change password
        </template>
        <div class="flex flex-col gap-2.5">
            <BaseInput name="current-password" label="Current password" type="password"
                autocomplete="current-password" autofocus v-model="currentPassword"
                :error-msg="currentPasswordError" @update:model-value="currentPasswordError = ''" />
            <div class="flex flex-col gap-1">
                <BaseInput name="new-password" label="New password" type="password" autocomplete="new-password"
                    v-model="newPassword" :error-msg="newPasswordError"
                    @update:model-value="newPasswordError = ''" />
                <p v-if="!newPasswordError" class="preset-6 text-neutral-300">
                    At least 8 characters.
                </p>
            </div>
            <BaseInput name="confirm-password" label="Confirm new password" type="password" autocomplete="new-password"
                v-model="confirmPassword" :error-msg="confirmPasswordError"
                @update:model-value="confirmPasswordError = ''" />
            <p v-if="passwordFormError" role="alert" class="preset-6 text-red-500">{{ passwordFormError }}</p>
            <p v-if="passwordSuccess" role="status" class="preset-6 text-green-500">{{ passwordSuccess }}</p>
        </div>
        <template #button>
            <BaseButton type="button" intent="secondary" base-class="bg-neutral-700" :disabled="passwordLoading"
                @click="closePassword">
                Cancel
            </BaseButton>
            <BaseButton type="submit" intent="primary" :disabled="passwordLoading || !passwordDirty">
                <template v-if="passwordLoading" #icon>
                    <motion.img :animate="{ rotate: 360 }"
                        :transition="{ duration: shouldReduceMotion ? 0 : 1, repeat: Infinity, ease: 'linear' }"
                        :src="Spinner" alt="" />
                </template>
                Update password
            </BaseButton>
        </template>
    </ModalDialog>
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
                <button
                    class="p-1 rounded-md text-neutral-300 preset-5 text-start cursor-pointer outline-0 focus-visible:shadow-[0_0_0_2px_var(--color-neutral-800),0_0_0_4px_var(--color-orange-400)]"
                    @click="showDialog">Edit profile</button>
                <button
                    class="p-1 rounded-md text-neutral-300 preset-5 text-start cursor-pointer outline-0 focus-visible:shadow-[0_0_0_2px_var(--color-neutral-800),0_0_0_4px_var(--color-orange-400)]"
                    @click="showPassword">Change password</button>
            </div>
            <div class="bg-neutral-700 h-px w-full" />
            <button
                class="p-1 rounded-md text-red-500 preset-5 text-start cursor-pointer outline-0 focus-visible:shadow-[0_0_0_2px_var(--color-neutral-800),0_0_0_4px_var(--color-orange-400)]"
                @click="logout">Sign out</button>
        </motion.div>
    </AnimatePresence>
</template>
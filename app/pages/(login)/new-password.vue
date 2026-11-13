<script setup lang="ts">
import LogoLarge from '../../assets/images/logo-large.svg'
import Star from '../../assets/images/pattern-star.svg'

useHead({
    title: 'New Password - Savings Tracker'
})
</script>

<template>
    <main class="flex py-5 px-2 min-h-dvh lg:p-5">
        <div class="flex gap-10 w-full max-w-170 mx-auto">
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
            <div class="m-auto w-full lg:flex-1 max-w-80 lg:max-w-none">
                <div class="flex flex-col w-full h-fit gap-4 lg:pr-5">
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
                    <form novalidate class="flex flex-col gap-2.5">
                        <div class="flex flex-col gap-1.25">
                            <BaseInput name="password" type="password" label="New password" />
                            <p class="preset-6 text-neutral-300">At least 8 characters</p>
                        </div>
                        <BaseInput name="confirm-password" type="password" label="Confirm new password" />
                        <BaseButton type="submit" intent="primary" base-class="font-semibold mt-1.5">
                            Reset password
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
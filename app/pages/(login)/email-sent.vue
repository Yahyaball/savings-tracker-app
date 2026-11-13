<script setup lang="ts">
import LogoLarge from '../../assets/images/logo-large.svg'
import Star from '../../assets/images/pattern-star.svg'
import ChevronLeft from '../../assets/images/icon-chevron-left.svg'

useHead({
    title: 'Email Sent - Savings Tracker'
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
                        <div class="flex flex-col gap-1">
                            <h1 class="preset-2">Check your inbox</h1>
                            <p class="preset-5 text-neutral-300 w-full">We've sent a reset link to <strong
                                    class="preset-5 text-neutral-0">jane@email.com</strong></p>
                        </div>
                    </div>
                    <p class="preset-5">The link expires in 30 minutes.</p>
                    <BaseButton intent="secondary">
                        Open email app
                    </BaseButton>
                    <div class="flex flex-col gap-2">
                        <p class="preset-5 text-neutral-300">Didn't receive it? <a
                                class="text-neutral-0 underline">Resend email</a></p>
                        <NuxtLink to="/login" class="preset-5 flex items-center gap-0.75 text-neutral-300">
                            <img :src="ChevronLeft" alt="">
                            Back to sign in
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
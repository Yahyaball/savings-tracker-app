<script setup lang="ts">
import LogoLarge from '../../assets/images/logo-large.svg'
import Star from '../../assets/images/pattern-star.svg'

useHead({
    title: 'Success - Savings Tracker'
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
                            <h1 class="preset-2">Password reset</h1>
                            <p class="preset-5 text-neutral-300">Your password has been reset successfully.</p>
                        </div>
                    </div>
                    <BaseButton type="button" intent="primary" to="/login">
                        Sign in to your account
                    </BaseButton>
                </div>
            </div>
        </div>
    </main>
</template>
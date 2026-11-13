<script setup lang="ts">
import LogoLarge from '../../assets/images/logo-large.svg'
import Star from '../../assets/images/pattern-star.svg'

useHead({
    title: 'Login - Savings Tracker'
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
                        <p>"The goal isn't to be rich. It's to have enough."</p>
                    </blockquote>
                    <figcaption class="preset-4">
                        — Morgan Housel
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
                            <h1 class="preset-2">Welcome back</h1>
                            <p class="preset-5 text-neutral-300">Sign in to your acccount</p>
                        </div>
                    </div>
                    <div class="h-px w-full bg-neutral-700" />
                    <form novalidate class="flex flex-col gap-2.5">
                        <BaseInput name="email" type="email" label="Email address" />
                        <div class="flex flex-col gap-1.25">
                            <BaseInput name="password" type="password" label="Password" />
                            <NuxtLink to="/forgot-password" class="preset-5 text-end text-neutral-300">Forgot password?
                            </NuxtLink>
                        </div>
                        <BaseButton type="submit" intent="primary" base-class="font-semibold mt-1.5">
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
<script setup lang="ts">
import LogoLarge from '../../assets/images/logo-large.svg'
import Star from '../../assets/images/pattern-star.svg'

useHead({
    title: 'Sign Up - Savings Tracker'
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
                        <p>"Do not save what is left
                            after spending, but spend what
                            is left after saving."</p>
                    </blockquote>
                    <figcaption class="preset-4">
                        &ndash; Warren Buffett
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
                            <h1 class="preset-2">Create your account</h1>
                            <p class="preset-5 text-neutral-300">Start tracking your savings goals</p>
                        </div>
                    </div>
                    <form novalidate class="flex flex-col gap-2.5">
                        <BaseInput name="name" type="text" label="Full name" />
                        <BaseInput name="email" type="email" label="Email address" />
                        <BaseInput name="password" type="password" label="Password" />
                        <BaseButton type="submit" intent="primary" base-class="font-semibold mt-1.5">
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
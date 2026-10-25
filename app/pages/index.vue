<script setup lang="ts">
const config = useRuntimeConfig()
const { data: goals } = await useFetch(config.public.apiBaseUrl, {
    onResponseError({ response }) {
        console.error('Fetch failed with status:', response.status)
    }
})
console.log(goals.value)
</script>

<template>
    <p class="preset-7 bg-red-500">The quick brown fox jumps over the lazy dog</p>
</template>
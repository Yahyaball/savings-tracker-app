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
    <NavigationBar />
</template>
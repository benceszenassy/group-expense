<script setup lang="ts"></script>

<template>
  <RouterView />

  <RouterLink :to="{ name: 'events' }" custom v-slot="{ navigate }">
    <button class="full-width" @click="navigate" @keypress.enter="() => navigate()" role="link">
      Back
    </button>
  </RouterLink>
</template>

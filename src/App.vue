<script setup lang="ts">
import ModalHost from './components/ModalHost.vue'
import MainLayout from './layouts/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <router-view />
    <ModalHost />
  </MainLayout>
</template>

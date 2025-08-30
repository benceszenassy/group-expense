<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'success' | 'info' | 'warn' | 'error'
    title: string
  }>(),
  {
    type: 'success',
  },
)
</script>

<template>
  <div :class="['callout', type]">
    <div class="icon">
      <svg
        v-if="type === 'info' || type === 'success'"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"
        ></path>
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"
        ></path>
      </svg>
    </div>
    <div class="content">
      <h3>{{ title }}</h3>
      <div v-if="$slots.default" class="description">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.callout {
  --pico-background-color: var(--pico-form-element-background-color);
  --pico-color: var(--pico-form-element-color);
  --pico-box-shadow: none;

  display: flex;
  align-items: flex-start;

  border: var(--pico-border-width) solid var(--border-color);
  margin-bottom: var(--pico-spacing);
  padding: var(--pico-form-element-spacing-vertical) var(--pico-form-element-spacing-horizontal);
  width: 100%;
  border-radius: var(--pico-border-radius);
  outline: none;
  background-color: var(--pico-background-color);
  box-shadow: var(--pico-box-shadow);
  color: var(--pico-color);
  font-weight: var(--pico-font-weight);
  transition:
    background-color var(--pico-transition),
    border-color var(--pico-transition),
    color var(--pico-transition),
    box-shadow var(--pico-transition);
}

h3 {
  margin-bottom: 0;
}

.icon {
  padding-top: 1px;
  padding-right: var(--pico-form-element-spacing-vertical);
}

.icon > svg {
  color: var(--border-color);
}

.success {
  --border-color: var(--pico-form-element-valid-border-color);
}

.info {
  --border-color: var(--pico-h3-color);
}

.warn {
  --border-color: #f7931a;
}

.error {
  --border-color: var(--pico-form-element-invalid-border-color);
}
</style>

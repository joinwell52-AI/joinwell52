<script setup lang="ts">
withDefaults(defineProps<{
  tag?: 'h1' | 'h2' | 'h3'
  label: string
  wide: string[]
  compact: string[]
  mobile: string[]
  accentFrom?: number
}>(), {
  tag: 'h2',
  accentFrom: -1
})
</script>

<template>
  <component :is="tag" class="responsive-title" :aria-label="label">
    <span class="responsive-title__set responsive-title__set--wide" aria-hidden="true">
      <span
        v-for="(line, index) in wide"
        :key="`wide-${line}`"
        class="responsive-title__line"
        :class="{ 'is-accent': accentFrom >= 0 && index >= accentFrom }"
      >{{ line }}</span>
    </span>
    <span class="responsive-title__set responsive-title__set--compact" aria-hidden="true">
      <span
        v-for="(line, index) in compact"
        :key="`compact-${line}`"
        class="responsive-title__line"
        :class="{ 'is-accent': accentFrom >= 0 && index >= accentFrom }"
      >{{ line }}</span>
    </span>
    <span class="responsive-title__set responsive-title__set--mobile" aria-hidden="true">
      <span
        v-for="(line, index) in mobile"
        :key="`mobile-${line}`"
        class="responsive-title__line"
        :class="{ 'is-accent': accentFrom >= 0 && index >= accentFrom }"
      >{{ line }}</span>
    </span>
  </component>
</template>

<style scoped>
.responsive-title__set,
.responsive-title__line {
  display: block;
}

.responsive-title__line {
  white-space: nowrap;
}

.responsive-title__set--compact,
.responsive-title__set--mobile {
  display: none;
}

.is-accent {
  color: var(--rc-signal, #c84b2f);
}

@media (max-width: 1199px) and (min-width: 700px) {
  .responsive-title__set--wide { display: none; }
  .responsive-title__set--compact { display: block; }
}

@media (max-width: 699px) {
  .responsive-title__set--wide { display: none; }
  .responsive-title__set--mobile { display: block; }
}
</style>

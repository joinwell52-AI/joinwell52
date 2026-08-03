<script setup lang="ts">
defineProps<{ step: number; active: boolean; label: string }>()
</script>

<template>
  <svg
    class="office-mark"
    :class="{ 'is-active': active }"
    viewBox="0 0 56 40"
    role="img"
    :aria-label="label"
  >
    <g v-if="step === 0">
      <circle cx="11" cy="10" r="2.5" />
      <circle cx="11" cy="20" r="2.5" />
      <circle cx="11" cy="30" r="2.5" />
      <path d="M14 10c9 0 8 8 16 8M14 20h16M14 30c9 0 8-8 16-8" />
      <path class="solid" d="M30 14h10l6 6-6 6H30Z" />
    </g>
    <g v-else-if="step === 1">
      <path d="M8 9h17M8 20h17M8 31h17" />
      <circle cx="13" cy="9" r="2" />
      <circle cx="19" cy="20" r="2" />
      <circle cx="11" cy="31" r="2" />
      <path class="solid" d="M29 6h5v10l12 4-12 4v10h-5V6Z" />
    </g>
    <g v-else-if="step === 2">
      <path class="sheet" d="M10 5h27l8 8v22H10Z" />
      <path d="M37 5v9h9M17 16h20M17 22h20M17 28h13" />
      <path class="focus" d="M14 25h27" />
    </g>
    <g v-else-if="step === 3">
      <circle cx="12" cy="10" r="3" />
      <circle cx="12" cy="30" r="3" />
      <rect x="25" y="16" width="8" height="8" rx="1" transform="rotate(45 29 20)" />
      <path d="m15 11 10 6M15 29l10-6M34 20h10" />
      <path class="solid" d="M40 12h5v16h-5Z" />
    </g>
    <g v-else-if="step === 4">
      <path class="sheet" d="M10 5h28l8 8v22H10Z" />
      <path d="M38 5v9h9M17 16h20M17 22h16M17 28h21" />
      <path class="focus" d="M35 25v8" />
    </g>
    <g v-else-if="step === 5">
      <rect x="8" y="6" width="40" height="28" rx="1" />
      <circle cx="20" cy="18" r="6" />
      <rect class="solid" x="31" y="12" width="9" height="9" rx="1" />
      <path d="m13 30 10-8 7 5 13-12" />
    </g>
    <g v-else-if="step === 6">
      <path class="sheet" d="M9 6h31v28H9Z" />
      <path d="M15 14h18M15 20h14M15 26h18" />
      <path class="solid" d="M38 11h7v18h-7z" />
      <path class="cutout" d="m39.5 20 2 2 3-4" />
    </g>
    <g v-else>
      <path class="sheet" d="M9 7h25v26H9Z" />
      <path d="M15 14h13M15 20h13M15 26h9" />
      <path class="solid" d="M36 11h10v18H36Z" />
      <path class="cutout" d="M39 20h4M41 18v4" />
    </g>
  </svg>
</template>

<style scoped>
.office-mark { width: 100%; height: 100%; overflow: visible; fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
.office-mark .solid { fill: currentColor; stroke: currentColor; }
.office-mark .cutout { fill: none; stroke: var(--office-sign-cutout, #f5f7fa); }
.office-mark .sheet { fill: color-mix(in srgb, currentColor 8%, transparent); }
.office-mark .focus { stroke-width: 3; }
.office-mark.is-active .focus { animation: office-scan 1.45s ease-in-out infinite; }
@keyframes office-scan { 0%, 100% { opacity: .35; transform: translateY(-3px); } 50% { opacity: 1; transform: translateY(3px); } }
@media (prefers-reduced-motion: reduce) { .office-mark.is-active .focus { animation: none; } }
</style>

<script setup lang="ts">
import runtimeData from '../../generated/runtime-records.json'

type RuntimeData = {
  today?: string
  todayDaily?: { date?: string }
}

const runtime = runtimeData as RuntimeData

// This component intentionally renders nothing. Its only job is to prevent a stale
// historical ?date= value from making the current Runtime page look like yesterday.
// Historical navigation still works after the page has loaded because the operations
// center owns subsequent pushState changes from the date picker.
if (typeof window !== 'undefined') {
  const today = runtime.todayDaily?.date || runtime.today || ''
  if (today) {
    const url = new URL(window.location.href)
    if (url.searchParams.get('date') !== today) {
      url.searchParams.set('date', today)
      window.history.replaceState({ ...(window.history.state || {}), runtimeDate: today }, '', url)
    }
  }
}
</script>

<template></template>

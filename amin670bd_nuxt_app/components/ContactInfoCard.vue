<template>
  <div class="card-glass p-6 contact-info">
    <h3 v-if="title" class="text-lg font-bold mb-4 flex items-center gap-2" style="color:var(--text-heading)">
      <i class="material-icons" :style="{ color: 'var(--primary)', fontSize: '18px' }">{{ titleIcon || 'contact_phone' }}</i>
      {{ title }}
    </h3>
    <div class="space-y-3 text-lg">
      <div v-for="(item,i) in items" :key="i" class="flex items-center gap-3">
        <i v-if="item.icon" class="material-icons" :style="{ color: 'var(--primary)', fontSize: item.iconSize || '18px' }">{{ item.icon }}</i>
        <svg v-else-if="item.svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="color:var(--primary)">
          <path :d="item.svg" />
        </svg>
        <div v-if="item.lines" v-for="(line,li) in item.lines" :key="li">
          <div v-if="line.href" class="font-medium" style="color:var(--text-heading)"><a :href="line.href" target="_blank" class="hover:underline" :style="{ color: line.color || 'var(--text-heading)' }">{{ line.text }}</a></div>
          <div v-else class="font-medium" :style="{ color: line.color || 'var(--text-heading)' }">{{ line.text }}</div>
        </div>
        <div v-else>
          <div v-if="item.href" class="font-medium" style="color:var(--text-heading)"><a :href="item.href" target="_blank" class="hover:underline">{{ item.text }}</a></div>
          <div v-else class="font-medium" style="color:var(--text-heading)">{{ item.text }}</div>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ContactInfoCard',
  props: {
    items: { type: Array, default: () => [] },
    title: { type: String, default: '' },
    titleIcon: { type: String, default: '' }
  }
}
</script>

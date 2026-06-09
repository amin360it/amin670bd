<template>
  <div class="relative inline-block" @mouseleave="open = false">
    <div @click="open = !open" @mouseenter="hover && (open = true)" class="cursor-pointer">
      <slot name="trigger">
        <BaseButton :variant="triggerVariant" :size="triggerSize" :icon="open ? arrowUp : arrowDown">
          {{ triggerText }}
        </BaseButton>
      </slot>
    </div>
    <transition name="fade">
      <div v-if="open" class="absolute z-50 mt-1 min-w-[200px] rounded-xl overflow-hidden"
        :class="positionClass"
        style="background:var(--glass-bg);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid var(--border);box-shadow:var(--shadow-lg)">
        <div class="py-1">
          <template v-for="(item,i) in items" :key="i">
            <div v-if="item.divider" class="my-1" style="border-top:1px solid var(--border)"></div>
            <button v-else-if="item.click" @click="item.click(); open = false"
              class="w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-150 flex items-center gap-3"
              :class="item.danger ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600' : 'hover:bg-black/5 dark:hover:bg-white/5'"
              :style="{ color: item.danger ? '' : 'var(--text)' }">
              <i v-if="item.icon" class="material-icons" style="font-size:18px;width:20px"> {{ item.icon }}</i>
              <span>{{ item.label }}</span>
            </button>
            <NuxtLink v-else-if="item.to" :to="item.to" @click="open = false"
              class="block px-4 py-2.5 text-sm font-medium transition-all duration-150 flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5"
              :style="{ color: 'var(--text)' }">
              <i v-if="item.icon" class="material-icons" style="font-size:18px;width:20px">{{ item.icon }}</i>
              <span>{{ item.label }}</span>
            </NuxtLink>
            <a v-else-if="item.href" :href="item.href" target="_blank" @click="open = false"
              class="block px-4 py-2.5 text-sm font-medium transition-all duration-150 flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5"
              :style="{ color: 'var(--text)' }">
              <i v-if="item.icon" class="material-icons" style="font-size:18px;width:20px">{{ item.icon }}</i>
              <span>{{ item.label }}</span>
            </a>
          </template>
          <slot name="items" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    items: { type: Array, default: () => [] },
    triggerText: { type: String, default: 'Menu' },
    triggerVariant: { type: String, default: 'outline' },
    triggerSize: { type: String, default: 'sm' },
    position: { type: String, default: 'left' },
    hover: Boolean,
    arrowDown: { type: String, default: 'expand_more' },
    arrowUp: { type: String, default: 'expand_less' }
  },
  data() {
    return { open: false }
  },
  computed: {
    positionClass() {
      return this.position === 'right' ? 'right-0' : 'left-0'
    }
  },
  watch: {
    open(val) {
      if (val) {
        const close = (e) => {
          if (!this.$el.contains(e.target)) {
            this.open = false
            document.removeEventListener('click', close)
          }
        }
        this.$nextTick(() => document.addEventListener('click', close))
      }
    }
  }
}
</script>

<template>
  <component :is="tag" :class="btnClass" :style="btnStyle" v-bind="$attrs" @click="$emit('click', $event)">
    <i v-if="icon && iconPos === 'left'" class="material-icons" :style="{ fontSize: iconSize }">{{ icon }}</i>
    <slot />
    <i v-if="icon && iconPos === 'right'" class="material-icons" :style="{ fontSize: iconSize }">{{ icon }}</i>
  </component>
</template>

<script>
export default {
  name: 'BaseButton',
  inheritAttrs: false,
  emits: ['click'],
  props: {
    variant: { type: String, default: 'gradient' },
    size: { type: String, default: 'md' },
    icon: { type: String, default: '' },
    iconPos: { type: String, default: 'left' },
    iconSize: { type: String, default: '18px' },
    disabled: Boolean,
    fullWidth: Boolean,
    loading: Boolean,
    tag: { type: String, default: 'button' },
    customClass: [String, Array, Object]
  },
  computed: {
    btnClass() {
      return [
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300',
        this.sizeClass,
        this.variantClass,
        { 'w-full': this.fullWidth, 'opacity-60 cursor-not-allowed': this.disabled || this.loading },
        this.customClass
      ]
    },
    btnStyle() {
      const s = { cursor: (this.disabled || this.loading) ? 'not-allowed' : 'pointer' }
      return s
    },
    sizeClass() {
      return {
        xs: 'px-3 py-1.5 text-xs',
        sm: 'px-4 py-2 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
      }[this.size] || 'px-5 py-2.5 text-sm'
    },
    variantClass() {
      const map = {
        gradient: 'gradient-bg text-white btn-shimmer',
        primary: 'text-white font-semibold',
        outline: 'border font-semibold',
        ghost: 'font-semibold hover:bg-black/5 dark:hover:bg-white/5',
        shimmer: 'gradient-bg text-white btn-shimmer'
      }
      const base = map[this.variant] || map.gradient
      if (this.variant === 'primary') {
        return base + ' ' + 'shadow-lg'
      }
      if (this.variant === 'outline') {
        return base + ' ' + 'border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
      }
      return base
    }
  }
}
</script>

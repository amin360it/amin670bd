<template>
  <div class="space-y-1 relative" ref="container">
    <label v-if="label" class="text-md font-medium mb-1 block" style="color:var(--text-label)">
      {{ label }} <span v-if="required" style="color:#ef4444">*</span>
    </label>
    <div class="relative">
      <i v-if="leftIcon" class="material-icons absolute left-3 top-1/2 -translate-y-1/2" style="color:var(--text-muted);font-size:18px;z-index:1">{{ leftIcon }}</i>
      <input ref="input" :value="searchText" @input="onInput" @focus="open = true" @keydown.escape="open = false" @keydown.enter="selectHighlighted" @keydown.down.prevent="highlightNext" @keydown.up.prevent="highlightPrev"
        :placeholder="placeholder || 'Type to search...'"
        class="w-full rounded-xl text-sm"
        :class="['contact-input', { 'pl-10': leftIcon }]"
        :style="{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }">
      <button v-if="modelValue" @click="clear" type="button" class="absolute right-3 top-1/2 -translate-y-1/2" style="color:var(--text-muted);cursor:pointer;background:none;border:none">
        <i class="material-icons" style="font-size:16px">close</i>
      </button>
    </div>
    <transition name="fade">
      <div v-if="open && filteredOptions.length" class="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl" style="background:var(--glass-bg);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid var(--border);box-shadow:var(--shadow-lg)">
        <div v-for="(opt,i) in filteredOptions" :key="i" @click="select(opt)" @mouseenter="highlightIndex = i"
          class="px-4 py-2.5 text-sm font-medium cursor-pointer flex items-center gap-3 transition-all"
          :class="{ 'bg-black/5 dark:bg-white/5': highlightIndex === i }"
          :style="{ color: 'var(--text)' }">
          <i v-if="opt.icon" class="material-icons" style="font-size:18px;width:20px;color:var(--primary)">{{ opt.icon }}</i>
          <div class="flex-1">
            <div>{{ opt.label || opt }}</div>
            <div v-if="opt.description" class="text-xs mt-0.5" style="color:var(--text-muted)">{{ opt.description }}</div>
          </div>
          <i v-if="modelValue === (opt.value ?? opt)" class="material-icons" style="font-size:16px;color:var(--primary)">check</i>
        </div>
      </div>
      <div v-else-if="open && searchText && !filteredOptions.length" class="absolute z-50 left-0 right-0 mt-1 rounded-xl p-4 text-center text-sm" :style="{ background: 'var(--glass-bg)', backdropFilter: 'blur(24px)', border: '1px solid var(--border)', color: 'var(--text-muted)' }">
        No results found
      </div>
    </transition>
    <p v-if="error" class="text-xs mt-1" style="color:#ef4444">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'Combobox',
  props: {
    modelValue: [String, Number],
    options: { type: Array, required: true },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    required: Boolean,
    leftIcon: { type: String, default: '' },
    error: { type: [String, Boolean], default: false },
    searchFields: { type: Array, default: () => ['label'] }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      open: false,
      searchText: '',
      highlightIndex: -1
    }
  },
  computed: {
    filteredOptions() {
      if (!this.searchText) return this.options
      const q = this.searchText.toLowerCase()
      return this.options.filter(opt => {
        const label = (opt.label || String(opt)).toLowerCase()
        return label.includes(q)
      })
    }
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(v) {
        if (v) {
          const match = this.options.find(o => (o.value ?? o) === v)
          this.searchText = match ? (match.label || String(match)) : String(v)
        } else {
          this.searchText = ''
        }
      }
    },
    open(v) {
      if (v) {
        this.highlightIndex = -1
        const close = (e) => {
          if (this.$refs.container && !this.$refs.container.contains(e.target)) {
            this.open = false
            document.removeEventListener('click', close)
          }
        }
        this.$nextTick(() => document.addEventListener('click', close))
      } else if (!this.modelValue) {
        this.searchText = ''
      }
    }
  },
  methods: {
    onInput(e) {
      this.searchText = e.target.value
      this.open = true
      if (!this.searchText) this.$emit('update:modelValue', '')
    },
    select(opt) {
      const val = opt.value ?? opt
      this.$emit('update:modelValue', val)
      this.searchText = opt.label || String(opt)
      this.open = false
    },
    clear() {
      this.$emit('update:modelValue', '')
      this.searchText = ''
      this.$refs.input?.focus()
    },
    selectHighlighted() {
      if (this.highlightIndex >= 0 && this.filteredOptions[this.highlightIndex]) {
        this.select(this.filteredOptions[this.highlightIndex])
      }
    },
    highlightNext() {
      if (this.highlightIndex < this.filteredOptions.length - 1) this.highlightIndex++
    },
    highlightPrev() {
      if (this.highlightIndex > 0) this.highlightIndex--
    }
  }
}
</script>

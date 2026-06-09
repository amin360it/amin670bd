<template>
  <div class="rounded-xl overflow-hidden" :style="{ background: 'var(--bg-card)', border: '1px solid var(--border)' }">
    <div v-if="title || $slots.header" class="flex items-center justify-between px-5 py-4" style="border-bottom:1px solid var(--border)">
      <h3 v-if="title" class="text-lg font-bold" style="color:var(--text-heading)">{{ title }}</h3>
      <slot name="header" />
    </div>
    <div v-if="filterable && columns.length" class="px-5 py-3" style="border-bottom:1px solid var(--border)">
      <BaseInput v-model="filterText" placeholder="Search..." left-icon="search" left-icon-size="18px" />
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr style="border-bottom:1px solid var(--border);background:rgba(0,0,0,0.02)">
            <th v-for="col in columns" :key="col.key" @click="col.sortable !== false && sort(col.key)"
              class="px-5 py-3 text-left font-semibold text-xs uppercase tracking-wider whitespace-nowrap"
              :class="{ 'cursor-pointer select-none': col.sortable !== false }"
              :style="{ color: 'var(--text-label)', width: col.width || 'auto' }">
              <span class="inline-flex items-center gap-1">
                {{ col.label || col.key }}
                <i v-if="sortKey === col.key" class="material-icons" style="font-size:14px">{{ sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</i>
              </span>
            </th>
            <th v-if="$slots['cell-actions']" class="px-5 py-3 text-right whitespace-nowrap">
              <span class="text-xs font-semibold uppercase tracking-wider" style="color:var(--text-label)">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row,ri) in processedRows" :key="ri" class="transition-all duration-150" style="border-bottom:1px solid var(--border)" :class="{ 'hover:bg-black/5 dark:hover:bg-white/5': true }">
            <td v-for="col in columns" :key="col.key" class="px-5 py-3.5" :style="{ color: 'var(--text)' }">
              <slot :name="'cell-' + col.key" :row="row" :value="row[col.key]">
                <div v-if="col.type === 'badge'">
                  <Badge :variant="row[col.key]">{{ row[col.key] }}</Badge>
                </div>
                <div v-else-if="col.type === 'avatar'" class="flex items-center gap-3">
                  <Avatar :src="row[col.key + 'Src']" :name="row[col.key]" :size="32" />
                  <span>{{ row[col.key] }}</span>
                </div>
                <div v-else-if="col.type === 'boolean'">
                  <i v-if="row[col.key]" class="material-icons" style="font-size:18px;color:var(--accent-emerald)">check_circle</i>
                  <i v-else class="material-icons" style="font-size:18px;color:var(--text-muted)">cancel</i>
                </div>
                <div v-else-if="col.type === 'date'" class="whitespace-nowrap">
                  {{ formatDate(row[col.key]) }}
                </div>
                <template v-else>{{ row[col.key] }}</template>
              </slot>
            </td>
            <td v-if="$slots['cell-actions']" class="px-5 py-3.5 text-right">
              <slot name="cell-actions" :row="row" :index="ri" />
            </td>
          </tr>
          <tr v-if="!processedRows.length">
            <td :colspan="columns.length + (!!$slots['cell-actions'] ? 1 : 0)" class="px-5 py-12 text-center" style="color:var(--text-muted)">
              <i class="material-icons" style="font-size:36px;display:block;margin-bottom:8px;opacity:0.4">inbox</i>
              {{ emptyText || 'No data available' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="pageable && pages > 1" class="flex items-center justify-between px-5 py-3" style="border-top:1px solid var(--border)">
      <span class="text-xs" style="color:var(--text-muted)">Page {{ page }} of {{ pages }} ({{ rows.length }} items)</span>
      <div class="flex items-center gap-1">
        <button @click="page = Math.max(1, page - 1)" :disabled="page <= 1" class="theme-toggle flex items-center justify-center" style="width:32px;height:32px">
          <i class="material-icons" style="font-size:16px">chevron_left</i>
        </button>
        <button v-for="p in pageNumbers" :key="p" @click="page = p"
          class="flex items-center justify-center rounded-lg text-xs font-semibold transition-all"
          :style="{ width: '32px', height: '32px', background: p === page ? 'var(--primary)' : 'transparent', color: p === page ? 'white' : 'var(--text)' }">
          {{ p }}
        </button>
        <button @click="page = Math.min(pages, page + 1)" :disabled="page >= pages" class="theme-toggle flex items-center justify-center" style="width:32px;height:32px">
          <i class="material-icons" style="font-size:16px">chevron_right</i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    rows: { type: Array, required: true },
    columns: { type: Array, required: true },
    title: { type: String, default: '' },
    emptyText: { type: String, default: '' },
    pageSize: { type: Number, default: 15 },
    pageable: { type: Boolean, default: true },
    filterable: { type: Boolean, default: false },
    filterFields: { type: Array, default: null }
  },
  data() {
    return {
      sortKey: '',
      sortDir: 'asc',
      page: 1,
      filterText: ''
    }
  },
  computed: {
    filteredRows() {
      if (!this.filterText) return this.rows
      const q = this.filterText.toLowerCase()
      const fields = this.filterFields || this.columns.map(c => c.key)
      return this.rows.filter(row => fields.some(f => String(row[f] || '').toLowerCase().includes(q)))
    },
    sortedRows() {
      if (!this.sortKey) return this.filteredRows
      return [...this.filteredRows].sort((a, b) => {
        const va = a[this.sortKey], vb = b[this.sortKey]
        if (va == null) return 1
        if (vb == null) return -1
        const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb))
        return this.sortDir === 'asc' ? cmp : -cmp
      })
    },
    processedRows() {
      if (!this.pageable) return this.sortedRows
      const start = (this.page - 1) * this.pageSize
      return this.sortedRows.slice(start, start + this.pageSize)
    },
    pages() { return Math.ceil(this.sortedRows.length / this.pageSize) },
    pageNumbers() {
      const p = [], start = Math.max(1, this.page - 2), end = Math.min(this.pages, start + 4)
      for (let i = start; i <= end; i++) p.push(i)
      return p
    }
  },
  watch: {
    filterText() { this.page = 1 },
    rows() { this.page = 1 }
  },
  methods: {
    sort(key) {
      if (this.sortKey === key) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
      else { this.sortKey = key; this.sortDir = 'asc' }
    },
    formatDate(d) {
      if (!d) return ''
      const date = new Date(d)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }
  }
}
</script>

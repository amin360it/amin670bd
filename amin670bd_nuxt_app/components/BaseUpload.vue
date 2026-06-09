<template>
  <div class="space-y-1">
    <label v-if="label" class="text-md font-medium mb-1 block" style="color:var(--text-label)">
      {{ label }} <span v-if="required" style="color:#ef4444">*</span>
    </label>
    <div @click="$refs.input.click()" @dragover.prevent @drop.prevent="onDrop"
      class="relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300"
      :class="{ 'dragover': dragOver }"
      :style="{ borderColor: dragOver ? 'var(--primary)' : 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-muted)' }">
      <input ref="input" type="file" :accept="accept" :multiple="multiple" class="hidden" @change="onChange">
      <i class="material-icons" style="font-size:36px;color:var(--primary)">{{ icon }}</i>
      <p class="mt-2 text-sm font-medium" style="color:var(--text)">{{ dragOver ? dropText : promptText }}</p>
      <p v-if="hint" class="text-xs mt-1">{{ hint }}</p>
    </div>
    <div v-if="fileNames.length" class="mt-2 space-y-1">
      <div v-for="(f,i) in fileNames" :key="i" class="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg" :style="{ background: 'var(--bg-card)', border: '1px solid var(--border)' }">
        <i class="material-icons" style="font-size:14px;color:var(--primary)">insert_drive_file</i>
        <span class="flex-1 truncate" style="color:var(--text)">{{ f }}</span>
        <button @click.stop="$emit('remove', i)" class="theme-toggle flex items-center justify-center" style="width:20px;height:20px;border:none;background:none;color:var(--text-muted);cursor:pointer">
          <i class="material-icons" style="font-size:14px">close</i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseUpload',
  props: {
    label: { type: String, default: '' },
    required: Boolean,
    accept: { type: String, default: '*' },
    multiple: Boolean,
    hint: { type: String, default: '' },
    promptText: { type: String, default: 'Click or drag files here' },
    dropText: { type: String, default: 'Release to upload' },
    icon: { type: String, default: 'cloud_upload' }
  },
  emits: ['files', 'remove'],
  data() {
    return { dragOver: false, fileNames: [] }
  },
  methods: {
    onChange(e) {
      const files = Array.from(e.target.files)
      this.fileNames = files.map(f => f.name)
      this.$emit('files', files)
    },
    onDrop(e) {
      this.dragOver = false
      const files = Array.from(e.dataTransfer.files)
      this.fileNames = files.map(f => f.name)
      this.$emit('files', files)
    }
  }
}
</script>

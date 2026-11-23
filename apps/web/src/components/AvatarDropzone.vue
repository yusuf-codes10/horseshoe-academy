<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import UserAvatar from "./UserAvatar.vue";

const props = withDefaults(
  defineProps<{
    currentUrl?: string | null; // already saved avatar (profile page)
    name?: string | null; // for the initials fallback
    size?: number;
    maxSizeMB?: number;
  }>(),
  { size: 96, maxSizeMB: 2 },
);

const file = defineModel<File | null>({ default: null }); // v-model = the picked file
const emit = defineEmits<{ error: [message: string] }>();

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

const inputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const previewUrl = ref<string | null>(null);

const clearPreview = () => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
};

const setFile = (f?: File) => {
  if (!f) return;
  if (!ALLOWED.includes(f.type)) return emit("error", "Only JPG, PNG or WebP images");
  if (f.size > props.maxSizeMB * 1024 * 1024)
    return emit("error", `Image must be under ${props.maxSizeMB}MB`);

  clearPreview();
  previewUrl.value = URL.createObjectURL(f);
  file.value = f;
};

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  setFile(input.files?.[0]);
  input.value = ""; // lets the user re-pick the same file later
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  setFile(e.dataTransfer?.files?.[0]);
};

// parent reset (e.g. after saving) → drop the preview
watch(file, (f) => {
  if (!f) clearPreview();
});

onBeforeUnmount(clearPreview);
</script>

<template>
  <div
    role="button"
    tabindex="0"
    class="group relative inline-block cursor-pointer rounded-full transition"
    :class="isDragging ? 'ring-2 ring-primary' : 'ring-0'"
    @click="inputRef?.click()"
    @keydown.enter.prevent="inputRef?.click()"
    @dragover.prevent="isDragging = true"
    @dragleave="isDragging = false"
    @drop.prevent="onDrop"
  >
    <UserAvatar :src="previewUrl ?? currentUrl" :name="name" :size="size" />

    <!-- hover overlay -->
    <div
      class="absolute inset-0 rounded-full bg-black/50 text-white text-xs flex items-center justify-center text-center opacity-0 group-hover:opacity-100 transition"
    >
      {{ isDragging ? "Drop it" : "Change photo" }}
    </div>

    <input
      ref="inputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="hidden"
      @change="onFileChange"
    />
  </div>
</template>

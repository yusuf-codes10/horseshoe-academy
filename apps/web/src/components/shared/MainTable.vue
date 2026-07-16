<script setup lang="ts">
type Column = {
  key: string;
  label: string;
};

const props = withDefaults(defineProps<{
  columns: Column[];
  data: Record<string, unknown>[];
  loading?: boolean;
  limit?: number;
  clickable: boolean;
}>(), {
  clickable: false
});
</script>

<template>
  <div class="mx-4">
    <!-- Table -->
    <table class="w-full text-sm my-2">
      <thead>
        <tr class="text-text-muted text-left border-b border-white/10">
          <th v-for="col in props.columns" :key="col.key" class="py-3 font-medium px-4">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in props.data"
          :key="index"
          class="text-text-primary border-b border-white/5 hover:bg-white/5 transition-colors"
        >
          <td v-for="col in props.columns" :key="col.key" class="py-3 px-4">
            {{ row[col.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

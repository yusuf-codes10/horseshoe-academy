<script setup lang="ts">
type Column = {
  key: string;
  label: string;
};

const props = defineProps<{
  columns: Column[];
  data: Record<string, unknown>[];
  loading?: boolean;
  limit?: number;
}>();
</script>

<template>
  <div>
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm my-2">
        <thead>
          <tr class="text-text-muted text-left">
            <th v-for="col in props.columns" :key="col.key" class="py-3 font-medium">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="(row, index) in props.data" :key="index" class="text-text-primary">
            <td v-for="col in props.columns" :key="col.key" class="py-3">
              {{ row[col.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

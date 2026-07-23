<script setup lang="ts">
type Column = {
  key: string;
  label: string;
};

// probably need a prop for empty state

const props = defineProps<{
  columns: Column[];
  data: Record<string, unknown>[];
  loading?: boolean;
  limit?: number;
  clickable?: boolean;
}>();
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
        <template v-if="props.data.length > 0">
          <!-- <RouterLink :to="{path: `/classes/${}`}"></RouterLink> -->
          <tr
            v-for="(row, index) in props.data"
            :key="index"
            class="text-text-primary border-b border-white/5 hover:bg-white/5 transition-colors"
          >
            <slot name="row" :row="row" :index="index">
              <!-- using a slot -->
              <td v-for="col in props.columns" :key="col.key" class="py-3 px-4">
                {{ row[col.key] }}
              </td>
            </slot>
          </tr>
        </template>
        <!-- Empty state row -->
        <tr v-else>
          <td :colspan="props.columns.length" class="py-10 text-center text-text-muted">
            {{ "No data yet" }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

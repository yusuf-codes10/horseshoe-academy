<script setup lang="ts">
type Column = {
  key: string
  label: string
}

defineProps<{
  columns: Column[]
  data: Record<string, unknown>[]
  loading?: boolean
  limit?: number
}>()
</script>

<template>
  <div>
          <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm my-2">
          <thead>
            <tr class="text-text-muted text-left">
              <th class="py-3 font-medium hidden md:table-cell">Code</th>
              <th class="py-3 font-medium hidden md:table-cell">Name</th>
              <th class="py-3 font-medium">Subjects</th>
              <th class="py-3 font-medium hidden sm:table-cell">Description</th>
              <th class="py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-for="tx in displayedTransactions" :key="tx.id" class="text-text-primary">
              <td class="py-3 hidden md:table-cell">{{ tx.from_wallet }}</td>
              <td class="py-3 hidden md:table-cell">{{ tx.to_wallet }}</td>
              <td class="py-3">{{ tx.amount }} USDT</td>
              <td class="py-3 hidden sm:table-cell">{{ formatDate(tx.time_at, showTime) }}</td>
              <td class="py-3">
                <span :class="['text-xs px-2 py-0.5 rounded-full font-medium', statusStyles[tx.risk]]">
                  {{ tx.risk }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
</template>

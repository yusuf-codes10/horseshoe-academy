<script setup lang="ts">
// import type { PropType } from 'vue';
import { ref } from 'vue';

const props = defineProps({
  count: {
    type: Number,
    default: 1
  }
});

console.log('count from child', props.count);

const currentPage = ref(1)

const definePages = () => {
  if (props.count) {
    const percentage = props.count * 0.33;
    console.log('the percentage is: ', percentage);
    return Math.round(percentage);
  }
}

const next = () => {
  currentPage.value ++;
}

const previous = () => {
  currentPage.value --;
}

const first = () => {

}

const last = () => {

}

definePages();

// const selectedRow = ref(10)
// TODO: complete the pagination functionality
</script>

<template>
  <div class="flex justify-end items-center my-4 gap-1.5">
    <div v-for="p in definePages()" :key="p" class="w-10 h-10 border-2 p-2 cursor-pointer hover:bg-primary">
      {{ p }}
    </div>
    ...
    <div class="w-10 h-10 border-2 p-2 cursor-pointer hover:bg-primary">
      {{ props.count }}
    </div>

    <button @click="next" class="border-2 p-2 cursor-pointer hover:bg-primary">Next ></button>
    <button @click="previous" class="border-2 p-2 cursor-pointer hover:bg-primary">Previous >></button>
    <!-- rows per page -->
    <!-- <label for="rows">Rows per page:</label>
    <select id="rows" name="rows"  v-model="props.rows">
      <option v-for="e in props.elements" :key="e.value" :value="e.value">{{e.title}}</option>
    </select> -->
  </div>
</template>

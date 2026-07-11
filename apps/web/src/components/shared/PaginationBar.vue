<script setup lang="ts">
// import type { PropType } from 'vue';
import { ref, computed } from "vue";

const props = defineProps({
  count: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["sendPage"]);

console.log("count from child", props.count);

const currentPage = ref(1);

// const definePages = () => {
//   // we shoud use this as pages not limits
//   if (props.count) {
//     const percentage = props.count * 0.33;
//     console.log('the percentage is: ', percentage);
//     return Math.round(percentage);
//   }
// }

const definePages = computed(() => Math.ceil(props.count / 5));

const next = () => {
  currentPage.value++;
  emit('sendPage', currentPage.value);
};

const previous = () => {
  currentPage.value--;
  emit('sendPage', currentPage.value);
};

// const first = () => {

// }

// const last = () => {

// }


// const selectedRow = ref(10)
// TODO: complete the pagination functionality
</script>

<template>
  <div class="flex justify-end items-center my-4 gap-1.5">
    <div
      @click="((currentPage = p), emit('sendPage', p))"
      v-for="p in definePages"
      :key="p"
      class="w-10 h-10 border-2 p-2 cursor-pointer hover:bg-primary"
      :class="p === currentPage ? 'bg-primary' : ''"
    >
      {{ p }}
    </div>
    <!-- ...
    <div class="w-10 h-10 border-2 p-2 cursor-pointer hover:bg-primary">
      {{ props.count }}
    </div> -->

    <button @click="next" class="border-2 p-2 cursor-pointer hover:bg-primary">Next ></button>
    <button @click="previous" class="border-2 p-2 cursor-pointer hover:bg-primary">
      Previous >>
    </button>
    <!-- rows per page -->
    <!-- <label for="rows">Rows per page:</label>
    <select id="rows" name="rows"  v-model="props.rows">
      <option v-for="e in props.elements" :key="e.value" :value="e.value">{{e.title}}</option>
    </select> -->
  </div>
</template>

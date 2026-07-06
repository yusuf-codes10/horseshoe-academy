<script setup lang="ts">
import { useSideStore } from '@/stores/sideStore';
import {  LayoutDashboard, Building2, BookOpen, School, PanelLeft, X } from "lucide-vue-next"
import { ref } from 'vue';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const selectedElement = ref(null)
const sideBarItem = [
  {
    name: 'Home',
    icon: LayoutDashboard
  },
  {
    name: 'Departments',
    icon: Building2
  },
  {
    name: 'Subjects',
    icon: BookOpen
  },
  {
    name: 'Classes',
    icon: School
  }
 ]

const sideStore = useSideStore();
</script>

<template>
  <aside
        :class="[
      // base styles
      'h-screen flex flex-col bg-bg-surface text-text-primary border-r border-bg-border',
      // width phase (desktop only)
      sideStore.isOpen ? 'w-60' : 'w-17.5',
      // width transition (desktop only)
      'transition-[width] duration-300 ease-in-out',
      // positioning
      'fixed md:relative z-40',
    ]"
  >
  <!-- Toggle -->
    <div class="border-b border-bg-border px-3 py-4 flex items-center justify-center">
      <PanelLeft v-if="!sideStore.isOpen" @click="emit('toggle')" class="cursor-pointer shrink-0" :size="22" />
      <div v-if="sideStore.isOpen" class="flex  gap-4">
        <span >Classroom</span>
        <X @click="emit('toggle')" :size="22" class="justify-self-end cursor-pointer"/>
      </div>
    </div>

    <!-- Nav Links -->
    <nav class="flex-1 flex flex-col gap-1 px-2 py-3">
      <RouterLink
        to="/dashboard"
        class="flex items-center gap-3 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-primary transition-colors group"
        @click="selectedElement"
      >
        <LayoutDashboard :size="18" class="shrink-0" />
        <span v-if="sideStore.isOpen" class="text-sm whitespace-nowrap">Home</span>
      </RouterLink>

      <RouterLink
        to="/departments"
        class="flex items-center gap-3 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary  hover:bg-primary transition-colors group"
      >
        <Building2 :size="18" class="shrink-0" />
        <span v-if="sideStore.isOpen" class="text-sm whitespace-nowrap">Departments</span>
      </RouterLink>

      <RouterLink
        to="/subjects"
        class="flex items-center gap-3 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-primary transition-colors group"
      >
        <BookOpen :size="18" class="shrink-0" />
        <span v-if="sideStore.isOpen" class="text-sm whitespace-nowrap">Subjects</span>
      </RouterLink>

      <RouterLink
        to="/classes"
        class="flex items-center gap-3 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary  hover:bg-primary transition-colors group"
      >
        <School :size="18" class="shrink-0" />
        <span v-if="sideStore.isOpen" class="text-sm whitespace-nowrap">Classes</span>
      </RouterLink>
      </nav>
  </aside>
</template>

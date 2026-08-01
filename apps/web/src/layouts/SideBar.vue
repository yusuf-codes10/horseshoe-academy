<script setup lang="ts">
import { useSideStore } from "@/stores/sideStore";
import { useUserStore } from "@/stores/userStore";
import { Home, Building2, BookOpen, School, PanelLeft, X, CalendarDays, ClipboardList } from "lucide-vue-next";
import { ref } from "vue";
import type { Component } from "vue";
import type { Permession } from "@/libs/permessions";
import { hasPermession } from "@/libs/permessions";
import { useRouter } from "vue-router";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle"]);

const userStore = useUserStore();
const router = useRouter();

type Item = {
  name: string;
  icon: Component;
  path: string;
  permission?: Permession;
};

const selectedItem = ref<Item | null>(null);
const sideBarItem: Item[] = [
  {
    name: "Home",
    icon: Home,
    path: "/",
  },
  {
    name: "Departments",
    icon: Building2,
    path: "/departments",
    permission: "view:departments",
  },
  {
    name: "Subjects",
    icon: BookOpen,
    path: "/subjects",
    permission: "view:subjects",
  },
  {
    name: "Classes",
    icon: School,
    path: "/classes",
    permission: "view:classes",
  },
  {
    name: 'Sessions',
    icon: CalendarDays,
    path: '/sessions',
    permission: 'view:sessions'
  },
  {
    name: 'Applications',
    icon: ClipboardList,
    path: '/applications',
    permission: 'view:applications'
  }
] as Item[];

const sideStore = useSideStore();

const chooseItem = (item: Item) => {
  console.log("clicked", item);
  selectedItem.value = item;
  console.log("selected", selectedItem.value);
};

const handleLogout = async () => {
  await userStore.logout();
  router.push('/login');
}

// two ways to fix this
// 1- either use a computed array
// 2- a template (not div) to act as a wrapper
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
      <PanelLeft
        v-if="!sideStore.isOpen"
        @click="emit('toggle')"
        class="cursor-pointer shrink-0"
        :size="22"
      />
      <div v-if="sideStore.isOpen" class="flex gap-4">
        <span>Classroom</span>
        <X @click="emit('toggle')" :size="22" class="justify-self-end cursor-pointer" />
      </div>
    </div>

    <!-- Nav Links -->
    <nav class="flex-1 flex flex-col gap-1 px-2 py-3">
      <template v-for="(item, index) in sideBarItem">

        <RouterLink
          class="flex items-center gap-3 px-2.5 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-primary transition-colors group"
          :class="{ 'bg-primary': selectedItem?.name === item.name }"
          :key="index"
          @click="chooseItem(item)"
          :to="item?.path"
          v-if="userStore.user && hasPermession(userStore.user, item.permission!)"
        >
          <!-- <LayoutDashboard :size="18" class="shrink-0" />
            -->
          <component :is="item.icon" :size="18" class="shrink-0" />
          <span v-if="sideStore.isOpen" class="text-sm whitespace-nowrap">{{ item.name }}</span>
        </RouterLink>
      </template>
    </nav>
    <!-- need profile section and logout here -->

      <div class="mt-auto border-t border-bg-border px-2 py-2 flex flex-col gap-0.5">
      <!-- User row -->
      <div class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg">
        <div class="w-7 h-7 rounded-full overflow-hidden shrink-0 flex-none">
          <!-- <img
            :src="userStore.user"
            :alt="userStore.user"
            class="w-full h-full object-cover block"
            referrerpolicy="no-referrer"
          /> -->
        {{ userStore.user?.fullName?.charAt(0) ?? "?" }}

        </div>
        <transition
          enter-active-class="transition-opacity duration-150 ease-in"
          leave-active-class="transition-opacity duration-150 ease-in"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div v-if="sideStore?.isOpen" class="flex flex-col min-w-0">
            <span class="text-xs font-medium text-text-primary truncate">{{
              userStore.user?.username
            }}</span>
            <span class="text-[11px] text-text-muted">Pro plan</span>
          </div>
        </transition>
      </div>

      <!-- Logout -->
      <div
        @click="handleLogout"
        class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer w-full hover:bg-red-500/10 text-text-muted hover:text-danger transition-colors"
      >
        <span class="text-sm min-w-5 flex items-center justify-center">
          <i class=" fa-solid"></i>
        </span>
        <transition
          enter-active-class="transition-opacity duration-150 ease-in"
          leave-active-class="transition-opacity duration-150 ease-in"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <span v-if="sideStore?.isOpen" class="whitespace-nowrap text-sm">Logout</span>
        </transition>
      </div>
    </div>
  </aside>
</template>

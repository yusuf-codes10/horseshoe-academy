<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";

/* ---------- Hero: weekly timetable board ---------- */
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const hours = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00"];

type Block = { d: number; s: number; n: number; t: string; r: string; v: "solid" | "soft" | "pending" };
const blocks: Block[] = [
  { d: 0, s: 0, n: 2, t: "Algorithms", r: "Class 8", v: "solid" },
  { d: 1, s: 1, n: 1, t: "Databases", r: "Class 11", v: "soft" },
  { d: 1, s: 3, n: 2, t: "Networks", r: "Class 13", v: "solid" },
  { d: 2, s: 0, n: 1, t: "Networks", r: "Class 13", v: "soft" },
  { d: 2, s: 2, n: 2, t: "Algorithms lab", r: "Class 8", v: "solid" },
  { d: 3, s: 1, n: 2, t: "Web dev", r: "Class 9 · pending", v: "pending" },
  { d: 4, s: 3, n: 1, t: "Databases", r: "Class 11", v: "soft" },
];
const blockStyle: Record<Block["v"], string> = {
  solid: "bg-primary text-primary-foreground",
  soft: "bg-primary/15 border border-primary/40 text-text-primary",
  pending: "bg-amber-500/15 border border-dashed border-amber-500/70 text-text-primary",
};

/* ---------- Roles: switchable preview ---------- */
type Tone = "accepted" | "pending" | "rejected" | "live";
type Row = { main: string; sub: string; tag: string; tone: Tone };
const roles = {
  admin: {
    label: "Admin",
    text: "Set up departments, subjects, classes and sessions, then review every application from one list.",
    title: "Applications waiting for review",
    rows: [
      { main: "John Marston", sub: "Class 9", tag: "pending", tone: "pending" },
      { main: "Sadie Adler", sub: "Class 4", tag: "pending", tone: "pending" },
      { main: "Arthur Morgan", sub: "Class 12", tag: "accepted", tone: "accepted" },
      { main: "Dutch van der Linde", sub: "Class 10", tag: "rejected", tone: "rejected" },
    ] as Row[],
  },
  teacher: {
    label: "Teacher",
    text: "See the classes you teach, who is enrolled in them, and when each session runs.",
    title: "Your sessions today",
    rows: [
      { main: "Algorithms", sub: "8:00 · 24 enrolled", tag: "in progress", tone: "live" },
      { main: "Algorithms lab", sub: "10:00 · 12 enrolled", tag: "next", tone: "pending" },
      { main: "Web dev", sub: "11:00 · 18 enrolled", tag: "later", tone: "live" },
    ] as Row[],
  },
  student: {
    label: "Student",
    text: "Browse open classes, apply in one click, and see whether you got in.",
    title: "Your applications",
    rows: [
      { main: "Class 8", sub: "Algorithms", tag: "accepted", tone: "accepted" },
      { main: "Class 9", sub: "Web dev", tag: "pending", tone: "pending" },
      { main: "Class 10", sub: "Compilers", tag: "rejected", tone: "rejected" },
      { main: "Class 11", sub: "Databases", tag: "accepted", tone: "accepted" },
    ] as Row[],
  },
};
type RoleKey = keyof typeof roles;
const roleKeys = Object.keys(roles) as RoleKey[];
const active = ref<RoleKey>("admin");
const panel = computed(() => roles[active.value]);

const tones: Record<Tone, string> = {
  accepted: "bg-emerald-500/20 text-text-primary",
  pending: "bg-amber-500/20 text-text-primary",
  rejected: "bg-red-500/20 text-text-primary",
  live: "bg-primary/20 text-text-primary",
};

/* ---------- Flow ---------- */
const stages: { tag: string; tone: Tone; text: string }[] = [
  { tag: "pending", tone: "pending", text: "A student picks a class and sends an application." },
  { tag: "accepted", tone: "accepted", text: "An admin reviews it. Rejected ones stop here." },
  { tag: "enrolled", tone: "live", text: "Accepted applications turn into enrollments." },
  { tag: "scheduled", tone: "live", text: "The class runs on its session calendar." },
];
</script>

<template>
  <div class="text-text-primary">
    <!-- Hero -->
    <section class="grid items-center gap-14 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:px-10 lg:py-24">
      <div>
        <!-- Staircase headline: each line steps across like blocks on a timetable -->
        <h1 class="text-5xl font-semibold leading-[0.95] tracking-tighter sm:text-6xl xl:text-7xl">
          <span class="block">Every class.</span>
          <span class="ml-5 block sm:ml-10 xl:ml-16">Every seat.</span>
          <span class="ml-10 block sm:ml-20 xl:ml-32">Every session.</span>
        </h1>

        <p class="mt-8 max-w-md text-lg leading-relaxed text-text-muted">
          Horseshoe Academy keeps departments, subjects, applications and schedules in one place, so admins,
          teachers and students always see the same picture.
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink
            to="/classes"
            class="inline-flex h-11 items-center rounded-md bg-primary px-6 text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Browse classes
          </RouterLink>
          <a
            href="#roles"
            class="inline-flex h-11 items-center rounded-md border border-text-muted/40 px-6 transition-colors hover:border-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            See what each role gets
          </a>
        </div>
      </div>

      <!-- Right-hand visual. Replace this whole wrapper with an <img> if you prefer. -->
      <div class="relative">
        <div class="rounded-xl border border-text-muted/25 bg-text-primary/[0.03] p-4">
          <div
            class="grid text-sm"
            :style="{ gridTemplateColumns: '3rem repeat(5, minmax(0, 1fr))', gridTemplateRows: 'auto repeat(6, 3.5rem)' }"
          >
            <!-- day headers -->
            <div />
            <div
              v-for="(day, i) in days"
              :key="day"
              class="pb-2 text-center text-text-muted"
              :style="{ gridColumn: i + 2, gridRow: 1 }"
            >
              {{ day }}
            </div>

            <!-- hour rules + labels -->
            <template v-for="(h, i) in hours" :key="h">
              <div
                class="border-t border-text-muted/20"
                :style="{ gridColumn: '1 / -1', gridRow: i + 2 }"
              />
              <div
                class="pt-1 text-xs tabular-nums text-text-muted"
                :style="{ gridColumn: 1, gridRow: i + 2 }"
              >
                {{ h }}
              </div>
            </template>

            <!-- sessions -->
            <div
              v-for="(b, i) in blocks"
              :key="i"
              class="session m-1 overflow-hidden rounded-md px-2 py-1.5 leading-tight"
              :class="blockStyle[b.v]"
              :style="{
                gridColumn: b.d + 2,
                gridRow: `${b.s + 2} / span ${b.n}`,
                '--i': i,
              }"
            >
              <div class="truncate font-medium">{{ b.t }}</div>
              <div class="truncate text-xs opacity-75">{{ b.r }}</div>
            </div>
          </div>
        </div>

        <div
          class="absolute -bottom-5 left-4 flex items-center gap-2 rounded-full border border-text-muted/25 bg-background px-4 py-2 text-sm text-text-primary lg:-left-6"
        >
          <span class="h-2 w-2 rounded-full bg-emerald-400" />
          Application accepted for Class 8
        </div>
      </div>
    </section>

    <!-- Roles -->
    <section
      id="roles"
      class="scroll-mt-6 border-t border-text-muted/20 px-6 py-16 lg:px-10 lg:py-24"
    >
      <div class="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div>
          <h2 class="text-3xl font-semibold tracking-tight md:text-4xl">
            One app, three views of it
          </h2>

          <div
            role="tablist"
            aria-label="Choose a role"
            class="mt-8 inline-flex rounded-lg border border-text-muted/25 p-1"
          >
            <button
              v-for="key in roleKeys"
              :key="key"
              role="tab"
              :aria-selected="active === key"
              class="cursor-pointer rounded-md px-4 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-primary"
              :class="active === key ? 'bg-primary text-primary-foreground' : 'text-text-muted hover:text-text-primary'"
              @click="active = key"
            >
              {{ roles[key].label }}
            </button>
          </div>

          <p class="mt-6 max-w-md leading-relaxed text-text-muted">
            {{ panel.text }}
          </p>
        </div>

        <div class="min-h-72 rounded-xl border border-text-muted/25 p-5">
          <Transition name="swap" mode="out-in">
            <div :key="active" role="tabpanel">
              <h3 class="mb-3 font-medium">{{ panel.title }}</h3>
              <ul>
                <li
                  v-for="row in panel.rows"
                  :key="row.main"
                  class="flex items-center justify-between gap-4 border-t border-text-muted/20 py-3"
                >
                  <div class="min-w-0">
                    <div class="truncate">{{ row.main }}</div>
                    <div class="text-sm text-text-muted">{{ row.sub }}</div>
                  </div>
                  <span class="shrink-0 rounded-full px-3 py-1 text-sm" :class="tones[row.tone]">
                    {{ row.tag }}
                  </span>
                </li>
              </ul>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Flow -->
    <section class="border-t border-text-muted/20 px-6 py-16 lg:px-10 lg:py-24">
      <h2 class="text-3xl font-semibold tracking-tight md:text-4xl">
        From application to first session
      </h2>

      <ol class="relative mt-12 grid gap-8 lg:grid-cols-4">
        <div class="absolute left-0 right-0 top-3 hidden h-px bg-text-muted/25 lg:block" />
        <li v-for="s in stages" :key="s.tag" class="relative lg:pt-10">
          <span class="bg-background lg:absolute lg:left-0 lg:top-0 lg:pr-3">
            <span class="inline-block rounded-full px-3 py-1 text-sm" :class="tones[s.tone]">
              {{ s.tag }}
            </span>
          </span>
          <p class="mt-3 max-w-56 leading-relaxed text-text-muted lg:mt-0">
            {{ s.text }}
          </p>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
/* One orchestrated moment: the timetable fills in once on load. */
@keyframes block-in {
  from {
    opacity: 0;
    transform: scaleY(0.6) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.session {
  transform-origin: top;
  animation: block-in 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  animation-delay: calc(var(--i) * 70ms + 150ms);
}

/* Role switch answers the user's click */
.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}
.swap-enter-from,
.swap-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (prefers-reduced-motion: reduce) {
  .session {
    animation: none;
  }
  .swap-enter-active,
  .swap-leave-active {
    transition: none;
  }
}
</style>

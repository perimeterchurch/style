export const dynamic = "force-static";

import { buildPreviewHtml } from '@/lib/preview-html';

const showcaseHtml = `
<div class="space-y-8 max-w-4xl mx-auto">
  <h1 class="text-2xl font-bold">Component Showcase</h1>

  <!-- Buttons -->
  <section class="space-y-3">
    <h2 class="text-lg font-semibold">Buttons</h2>
    <div class="flex flex-wrap gap-2">
      <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-8 px-2.5 bg-primary text-primary-foreground">Default</button>
      <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-8 px-2.5 bg-secondary text-secondary-foreground">Secondary</button>
      <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-8 px-2.5 bg-destructive/10 text-destructive">Destructive</button>
      <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-8 px-2.5 border border-border bg-background">Outline</button>
      <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-8 px-2.5">Ghost</button>
      <button class="inline-flex shrink-0 items-center justify-center text-sm font-medium text-primary underline-offset-4 hover:underline">Link</button>
    </div>
    <div class="flex flex-wrap gap-2 items-center">
      <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-xs font-medium h-6 px-2 bg-primary text-primary-foreground">Extra Small</button>
      <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-7 px-2.5 bg-primary text-primary-foreground">Small</button>
      <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-8 px-2.5 bg-primary text-primary-foreground">Default</button>
      <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-9 px-2.5 bg-primary text-primary-foreground">Large</button>
      <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-8 px-2.5 bg-primary text-primary-foreground opacity-50" disabled>Disabled</button>
    </div>
  </section>

  <hr class="border-t border-border" />

  <!-- Badges -->
  <section class="space-y-3">
    <h2 class="text-lg font-semibold">Badges</h2>
    <div class="flex flex-wrap gap-2">
      <span class="inline-flex h-5 items-center rounded-full px-2 text-xs font-medium bg-primary text-primary-foreground">Default</span>
      <span class="inline-flex h-5 items-center rounded-full px-2 text-xs font-medium bg-secondary text-secondary-foreground">Secondary</span>
      <span class="inline-flex h-5 items-center rounded-full px-2 text-xs font-medium bg-destructive/10 text-destructive">Destructive</span>
      <span class="inline-flex h-5 items-center rounded-full px-2 text-xs font-medium border border-border text-foreground">Outline</span>
    </div>
  </section>

  <hr class="border-t border-border" />

  <!-- Cards -->
  <section class="space-y-3">
    <h2 class="text-lg font-semibold">Cards</h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10">
        <div class="grid auto-rows-min items-start gap-1 px-4">
          <div class="text-base leading-snug font-medium">Card Title</div>
          <div class="text-sm text-muted-foreground">This is a description of the card content.</div>
        </div>
        <div class="px-4">
          <p class="text-sm text-muted-foreground">Card body content goes here. This demonstrates the card component with standard sections.</p>
        </div>
        <div class="flex items-center border-t bg-muted/50 p-4">
          <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-7 px-2.5 bg-primary text-primary-foreground">Action</button>
        </div>
      </div>
      <div class="flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10">
        <div class="grid auto-rows-min items-start gap-1 px-4">
          <div class="text-base leading-snug font-medium">Another Card</div>
          <div class="text-sm text-muted-foreground">With different content.</div>
        </div>
        <div class="px-4">
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Status</span>
              <span class="inline-flex h-5 items-center rounded-full px-2 text-xs font-medium bg-primary text-primary-foreground">Active</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Priority</span>
              <span class="inline-flex h-5 items-center rounded-full px-2 text-xs font-medium bg-destructive/10 text-destructive">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <hr class="border-t border-border" />

  <!-- Inputs -->
  <section class="space-y-3">
    <h2 class="text-lg font-semibold">Inputs</h2>
    <div class="grid grid-cols-2 gap-4 max-w-lg">
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Email</label>
        <input type="email" placeholder="you@example.com" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Password</label>
        <input type="password" placeholder="Enter password" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
      </div>
    </div>
    <div class="max-w-lg space-y-1.5">
      <label class="text-sm font-medium">Message</label>
      <textarea placeholder="Type your message here..." class="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"></textarea>
    </div>
  </section>

  <hr class="border-t border-border" />

  <!-- Checkbox & Switch -->
  <section class="space-y-3">
    <h2 class="text-lg font-semibold">Checkbox &amp; Switch</h2>
    <div class="flex gap-8 items-start">
      <div class="flex items-center gap-2">
        <div class="size-4 rounded border border-primary bg-primary text-primary-foreground flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <label class="text-sm font-medium">Accept terms</label>
      </div>
      <div class="flex items-center gap-2">
        <div class="size-4 rounded border border-input bg-background"></div>
        <label class="text-sm font-medium">Subscribe to newsletter</label>
      </div>
      <div class="flex items-center gap-2">
        <div class="inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent bg-primary px-0.5">
          <div class="size-4 rounded-full bg-primary-foreground translate-x-3.5 transition-transform"></div>
        </div>
        <label class="text-sm font-medium">Dark mode</label>
      </div>
      <div class="flex items-center gap-2">
        <div class="inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent bg-input px-0.5">
          <div class="size-4 rounded-full bg-background transition-transform"></div>
        </div>
        <label class="text-sm font-medium">Notifications</label>
      </div>
    </div>
  </section>

  <hr class="border-t border-border" />

  <!-- Alerts -->
  <section class="space-y-3">
    <h2 class="text-lg font-semibold">Alerts</h2>
    <div class="relative w-full rounded-lg border border-border p-4">
      <h5 class="mb-1 font-medium leading-none tracking-tight">Information</h5>
      <div class="text-sm text-muted-foreground">This is a default alert with helpful information.</div>
    </div>
    <div class="relative w-full rounded-lg border border-destructive/50 p-4 text-destructive">
      <h5 class="mb-1 font-medium leading-none tracking-tight">Error</h5>
      <div class="text-sm opacity-80">Something went wrong. Please try again later.</div>
    </div>
  </section>

  <hr class="border-t border-border" />

  <!-- Tabs -->
  <section class="space-y-3">
    <h2 class="text-lg font-semibold">Tabs</h2>
    <div>
      <div class="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
        <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium bg-background text-foreground shadow">Account</button>
        <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium">Settings</button>
        <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium">Billing</button>
      </div>
      <div class="mt-2">
        <div class="flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10">
          <div class="grid auto-rows-min items-start gap-1 px-4">
            <div class="text-base leading-snug font-medium">Account</div>
            <div class="text-sm text-muted-foreground">Manage your account settings and preferences.</div>
          </div>
          <div class="px-4 space-y-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium">Name</label>
              <input value="John Doe" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
`;

export async function GET() {
  const html = buildPreviewHtml(showcaseHtml);
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

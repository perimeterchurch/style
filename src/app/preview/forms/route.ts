export const dynamic = "force-static";

import { buildPreviewHtml } from '@/lib/preview-html';

const formsHtml = `
<div class="space-y-8 max-w-2xl mx-auto">
  <h1 class="text-2xl font-bold">Form Examples</h1>

  <!-- Login Form -->
  <div class="flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10">
    <div class="grid auto-rows-min items-start gap-1 px-4">
      <div class="text-base leading-snug font-medium">Login</div>
      <div class="text-sm text-muted-foreground">Enter your credentials to access your account.</div>
    </div>
    <div class="px-4 space-y-4">
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Email</label>
        <input type="email" placeholder="you@example.com" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Password</label>
        <input type="password" placeholder="Enter your password" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
      </div>
      <div class="flex items-center gap-2">
        <div class="size-4 rounded border border-input bg-background"></div>
        <label class="text-sm">Remember me</label>
      </div>
    </div>
    <div class="flex items-center justify-between border-t bg-muted/50 p-4">
      <button class="inline-flex items-center justify-center text-sm font-medium text-primary underline-offset-4 hover:underline h-7 px-2.5">Forgot password?</button>
      <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-8 px-2.5 bg-primary text-primary-foreground">Sign In</button>
    </div>
  </div>

  <hr class="border-t border-border" />

  <!-- Sign Up Form -->
  <div class="flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10">
    <div class="grid auto-rows-min items-start gap-1 px-4">
      <div class="text-base leading-snug font-medium">Create Account</div>
      <div class="text-sm text-muted-foreground">Fill in the details below to create your account.</div>
    </div>
    <div class="px-4 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-sm font-medium">First Name</label>
          <input placeholder="John" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground" />
        </div>
        <div class="space-y-1.5">
          <label class="text-sm font-medium">Last Name</label>
          <input placeholder="Doe" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground" />
        </div>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Email</label>
        <input type="email" placeholder="john@example.com" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Password</label>
        <input type="password" placeholder="Create a password" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-medium">Confirm Password</label>
        <input type="password" placeholder="Confirm your password" class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground" />
      </div>
      <div class="flex items-center gap-2">
        <div class="size-4 rounded border border-input bg-background"></div>
        <label class="text-sm">I agree to the terms and conditions</label>
      </div>
    </div>
    <div class="flex items-center border-t bg-muted/50 p-4">
      <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-8 px-2.5 bg-primary text-primary-foreground w-full">Create Account</button>
    </div>
  </div>

  <hr class="border-t border-border" />

  <!-- Settings Form -->
  <div class="flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10">
    <div class="grid auto-rows-min items-start gap-1 px-4">
      <div class="text-base leading-snug font-medium">Settings</div>
      <div class="text-sm text-muted-foreground">Manage your notification and privacy preferences.</div>
    </div>
    <div class="px-4 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">Email Notifications</p>
          <p class="text-xs text-muted-foreground">Receive email about activity on your account.</p>
        </div>
        <div class="inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent bg-primary px-0.5">
          <div class="size-4 rounded-full bg-primary-foreground translate-x-3.5 transition-transform"></div>
        </div>
      </div>
      <hr class="border-t border-border" />
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">Push Notifications</p>
          <p class="text-xs text-muted-foreground">Get push notifications on your device.</p>
        </div>
        <div class="inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent bg-input px-0.5">
          <div class="size-4 rounded-full bg-background transition-transform"></div>
        </div>
      </div>
      <hr class="border-t border-border" />
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">Marketing Emails</p>
          <p class="text-xs text-muted-foreground">Receive emails about new features and updates.</p>
        </div>
        <div class="inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent bg-input px-0.5">
          <div class="size-4 rounded-full bg-background transition-transform"></div>
        </div>
      </div>
    </div>
    <div class="flex items-center border-t bg-muted/50 p-4">
      <button class="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium h-8 px-2.5 bg-primary text-primary-foreground">Save Preferences</button>
    </div>
  </div>
</div>
`;

export async function GET() {
  const html = buildPreviewHtml(formsHtml);
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

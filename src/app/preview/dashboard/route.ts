export const dynamic = "force-static";

import { buildPreviewHtml } from '@/lib/preview-html';

const dashboardHtml = `
<div class="flex min-h-screen">
  <!-- Sidebar -->
  <aside class="w-56 border-r bg-card p-4 space-y-1">
    <h2 class="text-sm font-semibold mb-3 px-2">Navigation</h2>
    <button class="w-full flex items-center justify-start gap-2 rounded-lg text-sm font-medium h-8 px-2.5">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      Dashboard
    </button>
    <button class="w-full flex items-center justify-start gap-2 rounded-lg text-sm font-medium h-8 px-2.5">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      Users
    </button>
    <button class="w-full flex items-center justify-start gap-2 rounded-lg text-sm font-medium h-8 px-2.5">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
      Analytics
    </button>
    <button class="w-full flex items-center justify-start gap-2 rounded-lg text-sm font-medium h-8 px-2.5">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
      Settings
    </button>
  </aside>

  <!-- Main Content -->
  <div class="flex-1 p-6 space-y-6">
    <h1 class="text-2xl font-bold">Dashboard</h1>

    <!-- Stats Grid -->
    <div class="grid grid-cols-4 gap-4">
      <div class="flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10">
        <div class="grid auto-rows-min items-start gap-1 px-4 pb-1">
          <div class="text-sm text-muted-foreground">Total Users</div>
          <div class="text-2xl font-medium">2,847</div>
        </div>
        <div class="px-4">
          <span class="text-xs font-medium text-success">+12.5% from last month</span>
        </div>
      </div>
      <div class="flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10">
        <div class="grid auto-rows-min items-start gap-1 px-4 pb-1">
          <div class="text-sm text-muted-foreground">Active Sessions</div>
          <div class="text-2xl font-medium">1,234</div>
        </div>
        <div class="px-4">
          <span class="text-xs font-medium text-success">+5.2% from last month</span>
        </div>
      </div>
      <div class="flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10">
        <div class="grid auto-rows-min items-start gap-1 px-4 pb-1">
          <div class="text-sm text-muted-foreground">Revenue</div>
          <div class="text-2xl font-medium">$45,231</div>
        </div>
        <div class="px-4">
          <span class="text-xs font-medium text-destructive">-2.1% from last month</span>
        </div>
      </div>
      <div class="flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10">
        <div class="grid auto-rows-min items-start gap-1 px-4 pb-1">
          <div class="text-sm text-muted-foreground">Growth Rate</div>
          <div class="text-2xl font-medium">18.2%</div>
        </div>
        <div class="px-4">
          <span class="text-xs font-medium text-success">+4.1% from last month</span>
        </div>
      </div>
    </div>

    <hr class="border-t border-border" />

    <!-- Table -->
    <div class="flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10">
      <div class="grid auto-rows-min items-start gap-1 px-4">
        <div class="text-base leading-snug font-medium">Recent Transactions</div>
        <div class="text-sm text-muted-foreground">A list of recent transactions and their status.</div>
      </div>
      <div class="px-4">
        <table class="w-full caption-bottom text-sm">
          <thead>
            <tr class="border-b">
              <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Invoice</th>
              <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Customer</th>
              <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th class="h-10 px-2 text-right align-middle font-medium text-muted-foreground">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b transition-colors hover:bg-muted/50">
              <td class="p-2 align-middle font-medium">INV-001</td>
              <td class="p-2 align-middle">John Doe</td>
              <td class="p-2 align-middle"><span class="inline-flex h-5 items-center rounded-full px-2 text-xs font-medium bg-primary text-primary-foreground">Active</span></td>
              <td class="p-2 align-middle text-right">$250.00</td>
            </tr>
            <tr class="border-b transition-colors hover:bg-muted/50">
              <td class="p-2 align-middle font-medium">INV-002</td>
              <td class="p-2 align-middle">Jane Smith</td>
              <td class="p-2 align-middle"><span class="inline-flex h-5 items-center rounded-full px-2 text-xs font-medium bg-secondary text-secondary-foreground">Pending</span></td>
              <td class="p-2 align-middle text-right">$150.00</td>
            </tr>
            <tr class="border-b transition-colors hover:bg-muted/50">
              <td class="p-2 align-middle font-medium">INV-003</td>
              <td class="p-2 align-middle">Bob Wilson</td>
              <td class="p-2 align-middle"><span class="inline-flex h-5 items-center rounded-full px-2 text-xs font-medium bg-primary text-primary-foreground">Active</span></td>
              <td class="p-2 align-middle text-right">$350.00</td>
            </tr>
            <tr class="border-b transition-colors hover:bg-muted/50">
              <td class="p-2 align-middle font-medium">INV-004</td>
              <td class="p-2 align-middle">Alice Brown</td>
              <td class="p-2 align-middle"><span class="inline-flex h-5 items-center rounded-full px-2 text-xs font-medium bg-destructive/10 text-destructive">Inactive</span></td>
              <td class="p-2 align-middle text-right">$450.00</td>
            </tr>
            <tr class="border-b transition-colors hover:bg-muted/50">
              <td class="p-2 align-middle font-medium">INV-005</td>
              <td class="p-2 align-middle">Charlie Davis</td>
              <td class="p-2 align-middle"><span class="inline-flex h-5 items-center rounded-full px-2 text-xs font-medium bg-primary text-primary-foreground">Active</span></td>
              <td class="p-2 align-middle text-right">$200.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
`;

export async function GET() {
  const html = buildPreviewHtml(dashboardHtml);
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

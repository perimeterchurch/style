"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const NAV_ITEMS = [
  { label: "Dashboard", icon: DashboardIcon },
  { label: "Users", icon: UsersIcon },
  { label: "Analytics", icon: AnalyticsIcon },
  { label: "Settings", icon: SettingsIcon },
];

const STATS = [
  { label: "Total Users", value: "2,847", change: "+12.5%", positive: true },
  {
    label: "Active Sessions",
    value: "1,234",
    change: "+5.2%",
    positive: true,
  },
  { label: "Revenue", value: "$45,231", change: "-2.1%", positive: false },
  { label: "Growth Rate", value: "18.2%", change: "+4.1%", positive: true },
];

const TRANSACTIONS = [
  {
    id: "INV-001",
    customer: "John Doe",
    status: "Active",
    variant: "default" as const,
    amount: "$250.00",
  },
  {
    id: "INV-002",
    customer: "Jane Smith",
    status: "Pending",
    variant: "secondary" as const,
    amount: "$150.00",
  },
  {
    id: "INV-003",
    customer: "Bob Wilson",
    status: "Active",
    variant: "default" as const,
    amount: "$350.00",
  },
  {
    id: "INV-004",
    customer: "Alice Brown",
    status: "Inactive",
    variant: "destructive" as const,
    amount: "$450.00",
  },
  {
    id: "INV-005",
    customer: "Charlie Davis",
    status: "Active",
    variant: "default" as const,
    amount: "$200.00",
  },
];

export function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="flex min-h-screen -m-6">
      {/* Sidebar */}
      <aside className="w-56 border-r bg-card p-4 space-y-1">
        <h2 className="text-sm font-semibold mb-3 px-2">Navigation</h2>
        {NAV_ITEMS.map(({ label, icon: Icon }) => (
          <Button
            key={label}
            variant={activeNav === label ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
            onClick={() => setActiveNav(label)}
          >
            <Icon />
            {label}
          </Button>
        ))}
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-1">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={`text-xs font-medium ${stat.positive ? "text-success" : "text-destructive"}`}
                >
                  {stat.change} from last month
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              A list of recent transactions and their status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TRANSACTIONS.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{tx.id}</TableCell>
                    <TableCell>{tx.customer}</TableCell>
                    <TableCell>
                      <Badge variant={tx.variant}>{tx.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{tx.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

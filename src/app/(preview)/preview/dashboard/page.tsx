"use client";

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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LayoutDashboard, Users, Settings, BarChart3 } from "lucide-react";

const STATS = [
  { label: "Total Users", value: "2,847", change: "+12.5%", positive: true },
  { label: "Active Sessions", value: "1,234", change: "+5.2%", positive: true },
  { label: "Revenue", value: "$45,231", change: "-2.1%", positive: false },
  { label: "Growth Rate", value: "18.2%", change: "+4.1%", positive: true },
];

const RECENT_ITEMS = [
  { id: "INV-001", name: "John Doe", status: "Active", amount: "$250.00" },
  { id: "INV-002", name: "Jane Smith", status: "Pending", amount: "$150.00" },
  { id: "INV-003", name: "Bob Wilson", status: "Active", amount: "$350.00" },
  { id: "INV-004", name: "Alice Brown", status: "Inactive", amount: "$450.00" },
  { id: "INV-005", name: "Charlie Davis", status: "Active", amount: "$200.00" },
];

function statusBadgeVariant(status: string) {
  switch (status) {
    case "Active":
      return "default" as const;
    case "Pending":
      return "secondary" as const;
    case "Inactive":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 border-r bg-card p-4 space-y-1">
        <h2 className="text-sm font-semibold mb-3 px-2">Navigation</h2>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <LayoutDashboard className="size-4" />
          Dashboard
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Users className="size-4" />
          Users
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <BarChart3 className="size-4" />
          Analytics
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Settings className="size-4" />
          Settings
        </Button>
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

        {/* Table */}
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
                {RECENT_ITEMS.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.amount}</TableCell>
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

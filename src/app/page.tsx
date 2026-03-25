import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CheckIcon,
  PaletteIcon,
  BlocksIcon,
  TerminalIcon,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <span className="text-sm font-semibold tracking-tight">
            Perimeter Church
          </span>
          <nav className="flex items-center gap-4">
            <Link
              href="/editor"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Theme Editor
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="flex flex-col gap-4">
            <Badge variant="secondary" className="w-fit">
              shadcn-compatible registry
            </Badge>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
              Perimeter Church
              <br />
              Design System
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              A shared component registry built on shadcn/ui. Install components
              directly into any project with a single CLI command.
            </p>
            <div className="flex gap-3 pt-2">
              <Link href="/editor">
                <Button>Open Theme Editor</Button>
              </Link>
              <Button variant="outline" disabled>
                Docs (coming soon)
              </Button>
            </div>
          </div>
        </section>

        <Separator className="mx-auto max-w-5xl" />

        {/* Install */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-heading mb-6 text-2xl font-semibold tracking-tight">
            Quick Start
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TerminalIcon className="size-4" />
                Install a component
              </CardTitle>
              <CardDescription>
                Point the shadcn CLI at this registry to pull components into
                your project.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="rounded-lg bg-muted p-4 text-sm font-mono">
                <code>pnpm dlx shadcn@latest add @perimeter/button</code>
              </pre>
            </CardContent>
          </Card>
        </section>

        <Separator className="mx-auto max-w-5xl" />

        {/* Component Showcase */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-heading mb-8 text-2xl font-semibold tracking-tight">
            Component Showcase
          </h2>

          <Tabs defaultValue="buttons">
            <TabsList>
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="inputs">Inputs</TabsTrigger>
            </TabsList>

            <TabsContent value="buttons" className="pt-6">
              <Card>
                <CardContent className="flex flex-wrap gap-3 pt-6">
                  <Button variant="default">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="pt-6">
              <Card>
                <CardContent className="flex flex-wrap gap-3 pt-6">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inputs" className="pt-6">
              <Card>
                <CardContent className="flex max-w-sm flex-col gap-4 pt-6">
                  <div className="flex flex-col gap-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="name@perimeter.org" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Password</Label>
                    <Input type="password" placeholder="Enter password" />
                  </div>
                  <Button className="w-fit">Sign In</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <Separator className="mx-auto max-w-5xl" />

        {/* Features */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-heading mb-8 text-2xl font-semibold tracking-tight">
            What&apos;s Included
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BlocksIcon className="size-4" />
                  55+ Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All shadcn/ui base-nova components with Perimeter warm stone
                  tokens applied.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PaletteIcon className="size-4" />
                  Theme System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Per-project theme overrides for API, Metrics, and Widgets with
                  light and dark mode support.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckIcon className="size-4" />
                  CLI Compatible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Works with the standard shadcn CLI. No custom tooling
                  required.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        Perimeter Church Design System
      </footer>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ShowcasePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Component Showcase</h1>

      {/* Buttons */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <Separator />

      {/* Badges */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="ghost">Ghost</Badge>
        </div>
      </section>

      <Separator />

      {/* Cards */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Cards</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>
                This is a description of the card content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Card body content goes here. This demonstrates the card
                component with standard sections.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>With different content.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge>Active</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Priority</span>
                  <Badge variant="destructive">High</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Form Controls */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Inputs</h2>
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="showcase-email">Email</Label>
            <Input
              id="showcase-email"
              type="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="showcase-password">Password</Label>
            <Input
              id="showcase-password"
              type="password"
              placeholder="Enter password"
            />
          </div>
        </div>
        <div className="max-w-lg space-y-2">
          <Label htmlFor="showcase-message">Message</Label>
          <Textarea
            id="showcase-message"
            placeholder="Type your message here..."
          />
        </div>
      </section>

      <Separator />

      {/* Checkbox & Switch */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Checkbox & Switch</h2>
        <div className="flex gap-8 items-start">
          <div className="flex items-center gap-2">
            <Checkbox id="showcase-terms" defaultChecked />
            <Label htmlFor="showcase-terms">Accept terms</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="showcase-newsletter" />
            <Label htmlFor="showcase-newsletter">Subscribe to newsletter</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="showcase-dark" defaultChecked />
            <Label htmlFor="showcase-dark">Dark mode</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="showcase-notifications" />
            <Label htmlFor="showcase-notifications">Notifications</Label>
          </div>
        </div>
      </section>

      <Separator />

      {/* Alerts */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Alerts</h2>
        <Alert>
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            This is a default alert with helpful information.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      </section>

      <Separator />

      {/* Tabs */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Tabs</h2>
        <Tabs defaultValue="account" className="max-w-md">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="tab-name">Name</Label>
                  <Input id="tab-name" defaultValue="John Doe" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Configure your application preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch id="tab-dark" />
                  <Label htmlFor="tab-dark">Dark mode</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>
                  Manage your billing and payment details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No billing information available.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

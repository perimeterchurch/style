"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function Forms() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Form Examples</h1>

      {/* Login Form */}
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="login-remember" />
            <Label htmlFor="login-remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button variant="link">Forgot password?</Button>
          <Button>Sign In</Button>
        </CardFooter>
      </Card>

      <Separator />

      {/* Sign Up Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Fill in the details below to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signup-first">First Name</Label>
              <Input id="signup-first" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-last">Last Name</Label>
              <Input id="signup-last" placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="Create a password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-confirm">Confirm Password</Label>
            <Input
              id="signup-confirm"
              type="password"
              placeholder="Confirm your password"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="signup-terms" />
            <Label htmlFor="signup-terms" className="text-sm font-normal">
              I agree to the terms and conditions
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Create Account</Button>
        </CardFooter>
      </Card>

      <Separator />

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your notification and privacy preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive email about activity on your account.
              </p>
            </div>
            <Switch id="settings-email" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-muted-foreground">
                Get push notifications on your device.
              </p>
            </div>
            <Switch id="settings-push" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Marketing Emails</p>
              <p className="text-xs text-muted-foreground">
                Receive emails about new features and updates.
              </p>
            </div>
            <Switch id="settings-marketing" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

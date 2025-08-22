"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comingSoonStatus, setComingSoonStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkComingSoonStatus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsLoggedIn(true);
        setPassword("");
        checkComingSoonStatus();
      } else {
        alert("Invalid password");
      }
    } catch (error) {
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const checkComingSoonStatus = async () => {
    try {
      const res = await fetch("/api/toggle-coming-soon");
      if (res.ok) {
        const data = await res.json();
        setComingSoonStatus(data);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log("Not logged in or error checking status");
    }
  };

  const toggleComingSoon = async (on: boolean) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/toggle-coming-soon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ on }),
      });

      if (res.ok) {
        checkComingSoonStatus();
        alert(`Coming Soon ${on ? "enabled" : "disabled"} successfully!`);
      } else {
        alert("Failed to toggle Coming Soon");
      }
    } catch (error) {
      alert("Error toggling Coming Soon");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin-login", { method: "DELETE" });
      setIsLoggedIn(false);
      setComingSoonStatus(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="text-center text-white">
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#d1a954] hover:bg-[#d1a954]/90 text-black font-bold"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">PromptForge Admin</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-white/20 text-white"
          >
            Logout
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Coming Soon Control */}
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Coming Soon Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comingSoonStatus && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Environment Variable:</span>
                    <span
                      className={
                        comingSoonStatus.coming_soon_env
                          ? "text-green-400"
                          : "text-gray-400"
                      }
                    >
                      {comingSoonStatus.coming_soon_env ? "ON" : "OFF"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Runtime Cookie:</span>
                    <span
                      className={
                        comingSoonStatus.coming_soon_cookie
                          ? "text-green-400"
                          : "text-gray-400"
                      }
                    >
                      {comingSoonStatus.coming_soon_cookie ? "ON" : "OFF"}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Active Status:</span>
                    <span
                      className={
                        comingSoonStatus.active
                          ? "text-red-400"
                          : "text-green-400"
                      }
                    >
                      {comingSoonStatus.active
                        ? "COMING SOON ACTIVE"
                        : "SITE LIVE"}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={() => toggleComingSoon(true)}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Enable Coming Soon
                </Button>
                <Button
                  onClick={() => toggleComingSoon(false)}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Disable Coming Soon
                </Button>
              </div>

              <p className="text-xs text-white/60">
                When enabled, public users see /coming-soon page. Admins can
                still access all pages.
              </p>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/"
                className="block text-[#d1a954] hover:text-[#d1a954]/80 underline"
              >
                → Homepage (Admin View)
              </a>
              <a
                href="/coming-soon"
                className="block text-[#d1a954] hover:text-[#d1a954]/80 underline"
              >
                → Coming Soon Page (Public View)
              </a>
              <a
                href="/dashboard"
                className="block text-[#d1a954] hover:text-[#d1a954]/80 underline"
              >
                → Dashboard
              </a>
              <a
                href="/generator"
                className="block text-[#d1a954] hover:text-[#d1a954]/80 underline"
              >
                → Generator
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

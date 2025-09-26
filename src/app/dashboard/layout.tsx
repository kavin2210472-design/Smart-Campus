"use client";

import Link from 'next/link';
import { Bell, Home, LineChart, Settings, Users, AlertTriangle, Shield } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CampusGuardLogo } from '@/components/icons';
import Header from '@/components/dashboard/header';
import NavLink from '@/components/dashboard/nav-link';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/analytics', icon: LineChart, label: 'Analytics' },
    { href: '#', icon: AlertTriangle, label: 'Alerts Log', badge: '3' },
    { href: '#', icon: Users, label: 'User Management' },
    { href: '#', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <CampusGuardLogo className="h-6 w-6 text-primary" />
              <span className="font-headline">CampusGuard</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <NavLink key={item.label} {...item} />
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card>
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <Shield className="h-5 w-5 fill-green-500 text-primary-foreground" />
                  <span>All Systems Normal</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Header navItems={navItems} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

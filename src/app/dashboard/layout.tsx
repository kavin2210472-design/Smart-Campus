
'use client';

import { useContext, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  Siren,
  Settings,
  BarChart2,
  LogOut,
  CircleUserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EcoWatchLogo } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AuthContext } from '@/context/auth-context';

const allNavItems = [
  { href: '/dashboard/overview', icon: LayoutGrid, label: 'Dashboard', role: ['admin', 'student'] },
  { href: '/dashboard/analysis', icon: BarChart2, label: 'Zone Analysis', role: ['admin', 'student'] },
  { href: '/dashboard/alerts', icon: Siren, label: 'Alert Management', role: ['admin'] },
  { href: '/dashboard/admin', icon: Settings, label: 'System Admin', role: ['admin'] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole } = useContext(AuthContext);

  useEffect(() => {
    if (!role) {
      router.replace('/');
    }
  }, [role, router]);

  const navItems = useMemo(() => {
    if (!role) return [];
    return allNavItems.filter(item => item.role.includes(role));
  }, [role]);

  // If the student tries to access a restricted page, redirect them
  useEffect(() => {
      if (role === 'student') {
          const currentItem = allNavItems.find(item => item.href === pathname);
          if (currentItem && !currentItem.role.includes('student')) {
              router.replace('/dashboard/overview');
          }
      }
  }, [pathname, role, router]);


  const handleLogout = () => {
    setRole(null);
    router.push('/');
  };

  if (!role) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Loading...</p>
        </div>
      );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-14 items-center gap-2 border-b px-4 lg:h-[60px] lg:px-6">
            <EcoWatchLogo className="h-6 w-6 text-primary" />
            <div>
              <p className="text-lg font-semibold">EcoWatch</p>
              <p className="text-xs text-muted-foreground">
                Environmental Monitoring
              </p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    icon={item.icon}
                    tooltip={item.label}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="flex md:hidden" />
          <div className="w-full flex-1">
            {/* Can add a global search here if needed */}
          </div>
           <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-2 py-1.5 px-3 border-green-500 bg-green-50 text-green-700 hidden sm:flex">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              System Online
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <CircleUserRound className="h-4 w-4" />
                  <span className="hidden sm:inline capitalize">{role} User</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="capitalize">{role} User</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                 </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

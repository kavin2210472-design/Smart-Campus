
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Siren,
  Settings,
  BarChart2,
  LogOut,
  PanelLeft,
  CircleUserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { EcoWatchLogo } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';


const navItems = [
  { href: '/dashboard/overview', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/dashboard/analysis', icon: BarChart2, label: 'Zone Analysis' },
  { href: '/dashboard/alerts', icon: Siren, label: 'Alert Management' },
  { href: '/dashboard/admin', icon: Settings, label: 'System Admin' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const NavLink = ({ href, icon: Icon, label }) => {
    const isActive = pathname.startsWith(href);
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const MobileNavLink = ({ href, icon: Icon, label }) => {
     const isActive = pathname.startsWith(href);
     return (
        <Link href={href}>
        <Button
            variant={isActive ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-2 text-base"
        >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
        </Button>
        </Link>
     )
  };

  const Header = () => (
     <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-4 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <EcoWatchLogo className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">EcoWatch Campus</span>
                </Link>
                {navItems.map(item => <MobileNavLink key={item.label} {...item} />)}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="hidden sm:flex items-center gap-4">
              {navItems.map(item => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                      <Link key={item.label} href={item.href}>
                         <Button variant={isActive ? 'default' : 'ghost'} size="sm" className={cn("gap-2", isActive && "text-white")}>
                            <item.icon className="h-4 w-4" />
                            {item.label}
                         </Button>
                      </Link>
                  )
              })}
          </div>
          
          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-2 py-1.5 px-3 border-green-500 bg-green-50 text-green-700">
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
                  Admin User
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin User</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                 <Link href="/">
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
  );


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <EcoWatchLogo className="h-7 w-7 text-primary" />
          <div>
            <p className="text-lg font-semibold">EcoWatch</p>
            <p className="text-xs text-muted-foreground">Environmental Monitoring</p>
          </div>
        </div>
        <div className='p-4'>
            <p className='text-xs font-semibold text-muted-foreground px-2 py-2'>MENU</p>
            <nav className="flex flex-col gap-1">
                {navItems.map(item => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                         <Link key={item.label} href={item.href}>
                            <Button variant={isActive ? 'secondary' : 'ghost'} className="w-full justify-start gap-2">
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                         </Link>
                    );
                })}
            </nav>
        </div>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <Header />
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}


'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertTriangle,
  LayoutGrid,
  LogOut,
  Settings,
  Siren,
  Thermometer,
  User,
  PanelLeft,
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
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { href: '/dashboard/overview', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/dashboard', icon: Thermometer, label: 'Zone Analysis' },
  { href: '/dashboard/alerts', icon: Siren, label: 'Alert Management' },
  { href: '/dashboard/admin', icon: Settings, label: 'System Admin' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const NavLink = ({ href, icon: Icon, label }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href}>
            <Button
              variant={pathname === href ? 'default' : 'ghost'}
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

  const MobileNavLink = ({ href, icon: Icon, label }) => (
     <Link href={href}>
      <Button
        variant={pathname === href ? 'secondary' : 'ghost'}
        className="w-full justify-start gap-2"
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Button>
    </Link>
  );

  const Header = () => (
     <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
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
          
          <div className='flex-1'>
            <p className='text-sm text-muted-foreground'>Dashboard &gt; Zone Details</p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              System Warning
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/admin/40/40" alt="Admin User" />
                    <AvatarFallback>AU</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
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
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <EcoWatchLogo />
          <div>
            <p className="font-semibold">EcoWatch</p>
            <p className="text-xs text-muted-foreground">Environmental Monitoring</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2 p-4">
            {navItems.map(item => <NavLink key={item.label} {...item} />)}
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <Header />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}

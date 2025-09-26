"use client";

import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUsers } from '@/lib/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function UserManagementPage() {
    const { users, isLoading } = useUsers();

    const roleBadgeVariant: Record<User['role'], 'default' | 'secondary' | 'outline'> = {
        'Admin': 'default',
        'Manager': 'secondary',
        'Operator': 'outline',
    }
    
    const renderSkeleton = () => (
        Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={`skeleton-user-${i}`}>
            <TableCell>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
          </TableRow>
        ))
      );


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
          User Management
        </h1>
        <p className="text-muted-foreground">
          Manage users and their permissions.
        </p>
      </div>

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>
                        A list of all the users in the system.
                    </CardDescription>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && renderSkeleton()}
                    {!isLoading && users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={roleBadgeVariant[user.role]}>{user.role}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
             {!isLoading && users.length === 0 && (
                <div className="text-center text-muted-foreground py-16">
                    <p>No users found.</p>
                </div>
             )}
        </CardContent>
      </Card>
    </div>
  );
}

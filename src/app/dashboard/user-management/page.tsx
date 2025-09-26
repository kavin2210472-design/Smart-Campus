
"use client";

import { useState } from 'react';
import { MoreHorizontal, PlusCircle, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUsers } from '@/lib/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@/lib/types';
import UserForm from '@/components/dashboard/user-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UserManagementPage() {
    const { users, isLoading, addUser, updateUser, deleteUser } = useUsers();
    const { toast } = useToast();
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const handleAddUser = () => {
        setEditingUser(null);
        setFormOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setFormOpen(true);
    };

    const handleDeleteConfirm = (user: User) => {
        setDeletingUser(user);
    };
    
    const handleDeleteUser = () => {
        if (deletingUser) {
            deleteUser(deletingUser.id);
            toast({ title: 'User Deleted', description: `${deletingUser.name} has been removed.` });
            setDeletingUser(null);
        }
    };

    const handleFormSubmit = (values: Omit<User, 'id'>) => {
        if (editingUser) {
            updateUser(editingUser.id, values);
            toast({ title: 'User Updated', description: `Details for ${values.name} have been updated.` });
        } else {
            addUser(values);
            toast({ title: 'User Added', description: `${values.name} has been added to the system.` });
        }
        setFormOpen(false);
    };
    
    const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text !== 'string') {
                toast({ variant: 'destructive', title: 'Error reading file', description: 'Could not read the file content.' });
                return;
            }
            try {
                const lines = text.split('\n').filter(line => line.trim() !== '');
                if (lines.length < 2) {
                    toast({ variant: 'destructive', title: 'Invalid CSV file', description: 'File must contain a header and at least one data row.' });
                    return;
                }
                const header = lines[0].split(',').map(h => h.trim());
                const nameIndex = header.indexOf('name');
                const emailIndex = header.indexOf('email');
                const roleIndex = header.indexOf('role');

                if (nameIndex === -1 || emailIndex === -1 || roleIndex === -1) {
                    toast({ variant: 'destructive', title: 'Invalid CSV format', description: 'CSV must include "name", "email", and "role" columns.' });
                    return;
                }

                let usersAdded = 0;
                for (let i = 1; i < lines.length; i++) {
                    const data = lines[i].split(',');
                    if (data.length < header.length) continue;

                    let role = data[roleIndex]?.trim() as User['role'];
                    if (!['Admin', 'Manager', 'Operator'].includes(role)) {
                        role = 'Operator'; // Default role if invalid one is provided
                    }
                    
                    const name = data[nameIndex]?.trim();
                    const email = data[emailIndex]?.trim();

                    if (name && email && role) {
                        addUser({
                            name,
                            email,
                            role,
                        });
                        usersAdded++;
                    }
                }
                toast({ title: 'CSV Processed', description: `${usersAdded} users were successfully added.` });

            } catch (error) {
                toast({ variant: 'destructive', title: 'CSV Parsing Error', description: 'Failed to parse the CSV file. Please check its format.' });
            }
        };
        reader.readAsText(file);
        // Reset file input
        event.target.value = '';
    };


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
    <>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage users and their permissions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                            A list of all the users in the system.
                        </CardDescription>
                    </div>
                    <Button onClick={handleAddUser}>
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
                                        <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteConfirm(user)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">Delete</DropdownMenuItem>
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
            <Card>
                <CardHeader>
                    <CardTitle>Bulk Import</CardTitle>
                    <CardDescription>
                        Add multiple users at once by uploading a CSV file. The file must contain 'name', 'email', and 'role' columns.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="csv-upload" className="sr-only">Upload CSV</Label>
                        <Input id="csv-upload" type="file" accept=".csv" onChange={handleCsvUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Example CSV format:<br/>
                        <code className="bg-muted p-1 rounded">name,email,role</code><br/>
                        <code className="bg-muted p-1 rounded">John Doe,john@example.com,Operator</code>
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>

      <UserForm 
        open={isFormOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        defaultValues={editingUser || undefined}
      />
      
      <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user account for {deletingUser?.name}.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeletingUser(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    

    
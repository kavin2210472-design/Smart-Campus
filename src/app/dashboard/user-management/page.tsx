
"use client";

import { useState } from 'react';
import { Download, PlusCircle, AlertCircle as AlertCircleIcon, Upload, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import UserForm from '@/components/dashboard/user-form';
import { useUsers, addUser, addUsers, updateUser, deleteUser } from '@/lib/hooks';

export default function UserManagementPage() {
    const { users, isLoading } = useUsers();
    const { toast } = useToast();
    const [csvError, setCsvError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleOpenForm = (user: User | null = null) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingUser(null);
    };

    const handleFormSubmit = (userData: Omit<User, 'id' | 'avatarUrl'>) => {
        if (editingUser) {
            updateUser(editingUser.id, userData);
            toast({ title: 'User Updated', description: 'The user\'s details have been successfully updated.' });
        } else {
            addUser(userData);
            toast({ title: 'User Added', description: 'The new user has been successfully added.' });
        }
        handleCloseForm();
    };

    const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCsvError(null);
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
                    setCsvError('Invalid CSV file. File must contain a header and at least one data row.');
                    return;
                }
                const header = lines[0].split(',').map(h => h.trim());
                const nameIndex = header.indexOf('name');
                const emailIndex = header.indexOf('email');
                const roleIndex = header.indexOf('role');

                if (nameIndex === -1 || emailIndex === -1 || roleIndex === -1) {
                    setCsvError('Invalid CSV format. CSV must include "name", "email", and "role" columns.');
                    return;
                }

                const newUsers: Omit<User, 'id' | 'avatarUrl'>[] = [];
                for (let i = 1; i < lines.length; i++) {
                    const data = lines[i].split(',');
                    if (data.length < header.length) continue;
                    
                    const name = data[nameIndex]?.trim();
                    const email = data[emailIndex]?.trim();
                    let role = data[roleIndex]?.trim() as User['role'];
                    
                    if (!['Admin', 'Manager', 'Operator', 'Student', 'Staff'].includes(role)) {
                        role = 'Student'; // Default role
                    }

                    if (name && email) {
                        newUsers.push({ name, email, role });
                    }
                }
                
                if (newUsers.length > 0) {
                    addUsers(newUsers);
                    toast({ title: 'CSV Processed', description: `${newUsers.length} users were successfully added.` });
                } else {
                    setCsvError('No valid user records found in the CSV to add.');
                }

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
                setCsvError(`Failed to parse the CSV file. Please check its format. Error: ${errorMessage}`);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handleDownloadSample = () => {
        const csvContent = "data:text/csv;charset=utf-8,name,email,role\nJohn Doe,john.doe@university.edu,Student\nJane Smith,jane.smith@university.edu,Staff";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sample_users.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderSkeleton = () => (
        Array.from({ length: 3 }).map((_, i) => (
          <TableRow key={`skeleton-user-${i}`}>
            <TableCell className='py-4'>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
          </TableRow>
        ))
      );


  return (
    <div className="grid gap-4">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <CardTitle>Registered Users ({users.length})</CardTitle>
                        <CardDescription>
                            All students and staff registered for emergency alerts
                        </CardDescription>
                    </div>
                    <Button onClick={() => handleOpenForm()}>
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
                                <TableCell className="py-4">
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
                                <TableCell className='capitalize'>
                                    {user.role}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleOpenForm(user)}>Edit</DropdownMenuItem>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the user account.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteUser(user.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {!isLoading && users.length === 0 && (
                    <div className="text-center text-muted-foreground py-16">
                        <p>No registered users found.</p>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Upload Users</CardTitle>
                <CardDescription>
                    Upload a CSV file with student and staff email addresses. Format: name, email, role (Student/Staff)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <label htmlFor="csv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">CSV (up to 1MB)</p>
                            </div>
                            <Input id="csv-upload" type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
                        </label>
                        <Button variant="outline" onClick={handleDownloadSample}>
                            <Download className="mr-2 h-4 w-4" />
                            Sample CSV
                        </Button>
                    </div>
                    {csvError && (
                         <Alert variant="destructive">
                            <AlertCircleIcon className="h-4 w-4" />
                            <AlertTitle>Upload Error</AlertTitle>
                            <AlertDescription>
                                {csvError}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>
        </Card>
        
        <UserForm 
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
            defaultValues={editingUser}
        />
    </div>
  );
}

    

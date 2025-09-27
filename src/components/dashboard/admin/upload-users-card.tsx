
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useUsers } from '@/lib/hooks';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';

export default function UploadUsersCard() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { addUsers } = useUsers();
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) return;

        setIsUploading(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                
                // CSV Parsing Logic
                const lines = text.split('\n').filter(line => line.trim() !== '');
                const headers = lines.shift()?.trim().split(',').map(h => h.trim()) || [];
                
                if (headers[0] !== 'name' || headers[1] !== 'email' || headers[2] !== 'role') {
                    throw new Error("Invalid CSV format. Headers must be 'name,email,role'.");
                }

                const parsedUsers: Omit<User, 'id'|'avatarUrl'>[] = lines.map(line => {
                    const values = line.split(',');
                    const user = {
                        name: values[0]?.trim(),
                        email: values[1]?.trim(),
                        role: values[2]?.trim() as User['role'],
                    };

                    // Basic validation
                    if (!user.name || !user.email || !user.role) {
                        throw new Error(`Invalid data in line: "${line}". All fields are required.`);
                    }
                    if (!['Admin', 'Manager', 'Operator', 'Student', 'Staff'].includes(user.role)) {
                         throw new Error(`Invalid role "${user.role}" in line: "${line}".`);
                    }

                    return user;
                });
                
                addUsers(parsedUsers);
                
                toast({
                    title: "Upload Successful",
                    description: `Successfully processed and added ${parsedUsers.length} new users.`,
                });

            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Upload Failed",
                    description: error instanceof Error ? error.message : "Could not parse the file. Please check the format.",
                });
            } finally {
                setIsUploading(false);
                setFile(null);
            }
        };

        reader.onerror = () => {
            toast({
                variant: "destructive",
                title: "File Error",
                description: "There was an error reading the file.",
            });
            setIsUploading(false);
        };
        
        reader.readAsText(file);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bulk User Upload</CardTitle>
                <CardDescription>Upload a CSV file to add multiple users at once. The format must be: name,email,role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="relative">
                    <Input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                        {file ? (
                             <div className="flex items-center gap-2 text-sm text-foreground">
                                <FileText className="h-5 w-5" />
                                <span>{file.name}</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">CSV file (up to 1MB)</p>
                            </div>
                        )}
                    </label>
                </div>
                <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    Upload and Add Users
                </Button>
            </CardContent>
        </Card>
    );
}


'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { EcoWatchLogo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AuthContext } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShieldCheck, User } from 'lucide-react';

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(p => p.id === 'login-bg-2');
  const { setRole } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = (role: 'admin' | 'student') => {
    setRole(role);
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen w-full">
        {loginBg && (
          <Image
            src={loginBg.imageUrl}
            alt={loginBg.description}
            fill
            className="object-cover -z-10"
            data-ai-hint={loginBg.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60 -z-10" />
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="grid gap-2 text-center text-white mb-8">
                <div className="flex justify-center items-center gap-2 mb-2">
                    <EcoWatchLogo className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">EcoWatch Campus</h1>
                </div>
                <p className="text-balance text-muted-foreground text-gray-300">
                    Smart environmental monitoring and alert system. Select a role to begin the demonstration.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Admin Card */}
                <Card className="bg-white/90 backdrop-blur-sm">
                    <CardHeader className="items-center text-center">
                        <ShieldCheck className="h-10 w-10 text-primary mb-2" />
                        <CardTitle>Admin Login</CardTitle>
                        <CardDescription>Full access to all dashboards and system controls.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">User: <span className="font-mono text-foreground">admin@ecowatch.com</span></p>
                        <p className="text-sm text-muted-foreground">Pass: <span className="font-mono text-foreground">●●●●●●●●</span></p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleLogin('admin')} className="w-full">
                          Login as Admin
                        </Button>
                    </CardFooter>
                </Card>

                {/* Student Card */}
                <Card className="bg-white/90 backdrop-blur-sm">
                    <CardHeader className="items-center text-center">
                        <User className="h-10 w-10 text-primary mb-2" />
                        <CardTitle>Student Login</CardTitle>
                        <CardDescription>View-only access to public campus dashboards.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">User: <span className="font-mono text-foreground">student@university.edu</span></p>
                        <p className="text-sm text-muted-foreground">Pass: <span className="font-mono text-foreground">●●●●●●●●</span></p>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={() => handleLogin('student')} className="w-full">
                          Login as Student
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
  );
}

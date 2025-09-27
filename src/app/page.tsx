
'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { EcoWatchLogo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AuthContext } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(p => p.id === 'login-bg-2');
  const { setRole } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = (role: 'admin' | 'student') => {
    setRole(role);
    router.push('/dashboard');
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[450px] gap-8">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <EcoWatchLogo className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">EcoWatch Campus</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Smart environmental monitoring and alert system.
            </p>
          </div>

          <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Demonstration Login</CardTitle>
                    <CardDescription>Select a role to access the dashboard.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Admin Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Admin User</h3>
                            <p className="text-sm text-muted-foreground">Full access to all dashboards and system controls.</p>
                        </div>
                        <div className="space-y-2">
                             <p className="text-sm text-muted-foreground">User: <span className="font-mono text-foreground">admin</span></p>
                             <p className="text-sm text-muted-foreground">Pass: <span className="font-mono text-foreground">admin123</span></p>
                        </div>
                        <Button onClick={() => handleLogin('admin')} className="w-full">
                          Login as Admin
                        </Button>
                    </div>

                    <Separator />

                    {/* Student Section */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold">Student User</h3>
                            <p className="text-sm text-muted-foreground">View-only access to public dashboards.</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">User: <span className="font-mono text-foreground">student</span></p>
                            <p className="text-sm text-muted-foreground">Pass: <span className="font-mono text-foreground">student123</span></p>
                        </div>
                        <Button onClick={() => handleLogin('student')} className="w-full">
                          Login as Student
                        </Button>
                    </div>
                </CardContent>
            </Card>

        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {loginBg && (
          <Image
            src={loginBg.imageUrl}
            alt={loginBg.description}
            width="1920"
            height="1080"
            className="h-full w-full object-cover"
            data-ai-hint={loginBg.imageHint}
          />
        )}
      </div>
    </div>
  );
}

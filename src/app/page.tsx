import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CampusGuardLogo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function LoginPage() {
  const loginBg = PlaceHolderImages.find(p => p.id === 'login-bg-2');

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="relative hidden h-full bg-muted lg:block">
        {loginBg && (
            <Image
                src={loginBg.imageUrl}
                alt={loginBg.description}
                fill
                className="object-cover"
                data-ai-hint={loginBg.imageHint}
            />
        )}
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
            <div className="flex items-center text-lg font-medium">
                <CampusGuardLogo className="mr-2 h-6 w-6" />
                CampusGuard
            </div>
            <div className="max-w-md">
                <p className="text-lg">
                    &ldquo;This platform has revolutionized how we manage campus safety. The real-time data and predictive alerts are game-changers.&rdquo;
                </p>
                <footer className="mt-4 text-sm font-medium">Sofia Davis, Head of Security</footer>
            </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                defaultValue="admin@example.com"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                defaultValue="password"
              />
            </div>
            <Button type="submit" className="w-full" asChild>
                <Link href="/dashboard">Login</Link>
            </Button>
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

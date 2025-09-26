
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserManagementPage() {
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
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            This feature is currently under development.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">User management functionality will be available here.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

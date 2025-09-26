
'use client';

import AddUserForm from './add-user-form';
import UploadUsersCard from './upload-users-card';
import UserList from './user-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function UserManagementTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-6">
        <UserList />
      </div>
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Add New User</CardTitle>
                <CardDescription>Manually add a single user to the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <AddUserForm />
            </CardContent>
        </Card>
        <UploadUsersCard />
      </div>
    </div>
  );
}

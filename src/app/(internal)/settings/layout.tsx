import { PageHeader } from '@/components/page/header';
import { SettingsSidebar } from '@/app/(internal)/settings/_components/sidebar';
import { Card } from '@/components/ui/card';
export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account and preferences" />
      <div className="flex gap-4">
        <div className="w-52 flex-none">
          <SettingsSidebar />
        </div>
        <div className="grow">
          <Card>{children}</Card>
        </div>
      </div>
    </div>
  );
}

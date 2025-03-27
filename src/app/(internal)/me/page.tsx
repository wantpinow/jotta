import { PageHeader } from '@/components/page/header';

export default async function MyPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Your Biography" description="Tell us about yourself" />
    </div>
  );
}

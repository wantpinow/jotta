import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default async function SettingsBillingPage() {
  return (
    <>
      <CardHeader>
        <CardTitle>Billing Settings</CardTitle>
        <CardDescription>Manage your billing and subscription</CardDescription>
      </CardHeader>
      <CardContent className="divide-y"></CardContent>
    </>
  );
}

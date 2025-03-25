import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default async function SettingsIntegrationsPage() {
  return (
    <>
      <CardHeader>
        <CardTitle>Integration Settings</CardTitle>
        <CardDescription>Manage your third-party integrations</CardDescription>
      </CardHeader>
      <CardContent className="divide-y"></CardContent>
    </>
  );
}

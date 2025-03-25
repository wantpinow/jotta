import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default async function SettingsPrivacyPage() {
  return (
    <>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Manage your privacy settings</CardDescription>
      </CardHeader>
      <CardContent className="divide-y"></CardContent>
    </>
  );
}

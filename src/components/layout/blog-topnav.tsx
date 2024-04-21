import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "~/components/ui/button";
import { SITE_CONFIG } from "~/lib/config";

export function BlogTopnav() {
  return (
    <header className="container flex items-center justify-between py-6">
      <Link href="/blog">
        <Logo blog />
      </Link>
      <div className="flex items-center gap-4">
        <Button variant="link" asChild>
          <Link href={SITE_CONFIG.repo} target="_blank">
            GitHub
          </Link>
        </Button>
        <Button variant="default" asChild>
          <Link href="/">Back to Jotta</Link>
        </Button>
      </div>
    </header>
  );
}

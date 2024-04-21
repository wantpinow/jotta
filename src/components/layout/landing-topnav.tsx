import Link from "next/link";
import { Logo } from "./logo";
import { Button } from "~/components/ui/button";
import { SITE_CONFIG } from "~/lib/config";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export function LandingTopnav() {
  return (
    <header className="container flex items-center justify-between py-6">
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex items-center gap-4">
        <Button variant="link" asChild>
          <Link href="/blog">Blog</Link>
        </Button>
        <Button variant="link" asChild>
          <Link href={SITE_CONFIG.repo} target="_blank">
            GitHub
          </Link>
        </Button>
        <SignedOut>
          <Button variant="default" asChild>
            <Link href="/sign-in">Get Started</Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <Button variant="default" asChild>
            <Link href="/home">Dashboard</Link>
          </Button>
        </SignedIn>
      </div>
    </header>
  );
}

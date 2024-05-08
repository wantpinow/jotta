import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { env } from "~/env";
import { SITE_CONFIG } from "~/lib/config";

import { Logo } from "./logo";

export function LandingTopnav() {
  return (
    <header className="from-primary/[0.07] bg-gradient-to-b to-transparent">
      <div className="container flex items-center justify-between py-6">
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
          {env.NODE_ENV === "development" && (
            <>
              {" "}
              <SignedOut>
                <Button variant="secondary" asChild>
                  <Link href="/sign-in">Get Started</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button variant="secondary" asChild>
                  <Link href="/home">Dashboard</Link>
                </Button>
              </SignedIn>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

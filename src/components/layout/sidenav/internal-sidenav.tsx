import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { TimerIcon } from "lucide-react";
import { Logo } from "~/components/layout/logo";
import { UserDropdown } from "./user-dropdown";
import { Suspense } from "react";
import {
  SidenavSection,
  SidenavSectionTitle,
  SidenavSkeleton,
} from "./section";
import { DecksLinks } from "./decks-links";
import { SidenavButtonLink } from "./section-link";

export async function InternalSidenav({ className }: { className?: string }) {
  return (
    <nav className={cn("border-r bg-light", className)}>
      <div className="flex h-full flex-col justify-between px-3 py-4">
        <div className="space-y-8 py-2">
          <div className="space-y-4">
            <Link href="/home">
              <Logo className="px-2" />
            </Link>
            <Button
              className="flex w-full items-center justify-start gap-2 px-2"
              variant="secondary"
            >
              <TimerIcon size={24} className="stroke-[1.5px]" />
              Start Session
            </Button>
          </div>
          <SidenavSection>
            <SidenavSectionTitle title="Flashcards" />
            <Suspense
              fallback={
                <>
                  <SidenavSkeleton />
                  <SidenavSkeleton />
                  <SidenavSkeleton />
                </>
              }
            >
              <DecksLinks />
            </Suspense>
          </SidenavSection>
          <SidenavSection>
            <SidenavSectionTitle title="Tools" />
            <SidenavButtonLink href="/" iconName="Bot" label="Phrase Builder" />
            <SidenavButtonLink
              href="/"
              iconName="AudioLines"
              label="Smart Transcription"
            />
            <SidenavButtonLink
              href="/chat"
              iconName="MessageSquareText"
              label="JottaGPT"
              isNew
            />
          </SidenavSection>
        </div>
        <div className="space-y-2">
          <Suspense fallback={<SidenavSkeleton />}>
            <UserDropdown />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}

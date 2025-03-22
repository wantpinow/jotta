import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, Brain } from 'lucide-react';
import Link from 'next/link';

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-primary/15 bg-background fixed w-full z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/home">
              <button className="flex items-center gap-2 cursor-pointer">
                <Brain className="text-primary text-2xl" />
                <span className="text-xl font-semibold text-primary">Jotta</span>
              </button>
            </Link>
            <nav className="flex items-center space-x-6">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Button>
              <Avatar asChild>
                <Link href="/profile">
                  <AvatarImage
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
                    alt="Profile"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Link>
              </Avatar>
            </nav>
          </div>
        </div>
      </header>
      <main className="pt-22 pb-12 min-h-screen bg-muted">
        <div className="container px-4 mx-auto">{children}</div>
      </main>
    </>
  );
}

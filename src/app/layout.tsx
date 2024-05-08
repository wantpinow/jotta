import { Inter } from "next/font/google";
import { ThemeProvider } from "~/components/theme/provider";
import { Toaster } from "~/components/ui/sonner";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";

import { ClerkProvider } from "./_components/clerk-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Jotta",
  description: "The AI language learning platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased")}>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkProvider>
              <Toaster />
              {children}
            </ClerkProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

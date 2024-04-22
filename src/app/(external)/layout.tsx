import { SiteFooter } from "~/components/layout/footer";
import { LandingTopnav } from "~/components/layout/landing-topnav";

export default function ExternalLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <LandingTopnav />
      <main className="container min-h-screen">{children}</main>
      <SiteFooter />
    </>
  );
}

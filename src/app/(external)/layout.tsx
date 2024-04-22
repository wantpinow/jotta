import { LandingTopnav } from "~/components/layout/landing-topnav";

export default function ExternalLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <>
      <LandingTopnav />
      <main className="container">{children}</main>
    </>
  );
}

import { InternalSidenav } from "~/components/layout/internal-sidenav";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <InternalSidenav className="fixed left-0 top-0 h-screen w-[260px]" />
      <div className="grow pl-[260px]">
        <main className="container py-6">{children}</main>
      </div>
    </div>
  );
}

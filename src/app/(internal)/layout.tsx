import { InternalSidenav } from "~/components/layout/sidenav/internal-sidenav";
import { Foo } from "./_components/foo";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Foo />
      <InternalSidenav className="fixed left-0 top-0 h-screen w-[260px]" />
      <div className="grow pl-[260px]">
        <main className="mx-8 max-w-4xl py-6">{children}</main>
      </div>
    </div>
  );
}

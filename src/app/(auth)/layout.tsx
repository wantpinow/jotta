export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mx-auto my-12 w-fit">{children}</div>;
}

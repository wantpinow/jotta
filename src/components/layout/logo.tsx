import { ShapesIcon } from "lucide-react";
import { cn } from "~/lib/utils";

export function Logo({
  blog = false,
  className,
}: {
  blog?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("text-xl font-light tracking-widest", className)}>
      <ShapesIcon className="mr-2.5 inline-block stroke-[1.5px]" />
      jotta{blog ? " blog" : ".ai"}
    </div>
  );
}

import dynamic from "next/dynamic";
import type Lucide from "lucide-react";

export type IconNames = keyof typeof Lucide.icons;
interface IconProps extends Lucide.LucideProps {
  name: IconNames;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = dynamic(() =>
    import(`lucide-react`).then((mod) => mod[name]),
  );

  return <LucideIcon {...props} />;
};

export default Icon;
export type { IconProps };

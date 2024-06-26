import { ArrowBigRightIcon, ShapesIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

export default async function Home() {
  return (
    <div className="relative mx-auto max-w-xl">
      <ShapesIcon className="absolute left-0 top-0 size-64 stroke-[1.5px] text-primary opacity-10" />
      <div className="min-h-[300px] backdrop-blur-sm">
        <h1 className="mt-16 text-center text-5xl font-bold">
          {/* <span className="opacity-50">Let&apos;s Learn</span>{" "}
          <span className="inline-block border-b-[3px] border-red-700/70 bg-gradient-to-b from-red-600 via-yellow-500 to-red-600 bg-clip-text pb-1.5 text-transparent">
            Spanish
          </span> */}
          <span className="opacity-50">Welcome to </span>{" "}
          <span className="text-primary">Jotta</span>
        </h1>
        <p className="mt-4 text-center">
          How much AI can we fit into a language app?
        </p>
        {/* <Button
          className="group ml-auto mt-8 flex -translate-x-1 gap-0.5 px-5 transition-all duration-300 hover:translate-x-0"
          size="lg"
        >
          <span className="">Showcase</span>
          <ArrowBigRightIcon
            size={24}
            className="translate-x-0 stroke-[1.5px] delay-300 duration-300 group-hover:translate-x-1 group-hover:scale-105"
          />
        </Button> */}
      </div>
    </div>
  );
}

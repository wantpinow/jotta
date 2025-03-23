import React, { FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
/**
 * Simple hash + seeded random approach
 */
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function sfc32(a: number, b: number, c: number, d: number) {
  return () => {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    d = (d + 1) | 0;
    t = (t + d) | 0;
    return (t >>> 0) / 4294967296;
  };
}

function createSeededRandom(seed: string): () => number {
  const seedHash = xmur3(seed);
  const a = seedHash();
  const b = seedHash();
  const c = seedHash();
  const d = seedHash();
  return sfc32(a, b, c, d);
}

/**
 * Generate a pastel HSLA color with a bit of transparency
 */
function randomPastelHSLA(rand: () => number): string {
  const hue = Math.floor(rand() * 360);
  const saturation = 60 + Math.floor(rand() * 25); // 60-85% (increased)
  const lightness = 55 + Math.floor(rand() * 15); // 55-70% (lowered to avoid whites)
  const alpha = 0.85; // slightly higher opacity
  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}

/**
 * Build a multi-layer radial gradient string.
 *
 * Each layer:
 *   - random center position (x%, y%)
 *   - single color fading to transparent
 *   - partial overlap to produce a "soft" swirling look
 */
function generateGradient(seed: string, layersCount = 3): string {
  const rand = createSeededRandom(seed);
  const layers: string[] = [];

  // Add a subtle base color
  const baseHue = Math.floor(rand() * 360);
  const baseColor = `hsla(${baseHue}, 40%, 60%, 0.2)`;
  layers.push(`linear-gradient(${baseColor}, ${baseColor})`);

  for (let i = 0; i < layersCount; i++) {
    const x = Math.floor(rand() * 100);
    const y = Math.floor(rand() * 100);
    const color = randomPastelHSLA(rand);

    // Slightly smaller coverage to make colors more concentrated
    layers.push(`radial-gradient(circle at ${x}% ${y}%, ${color}, transparent 55%)`);
  }

  // Combine the gradient layers with commas
  return layers.join(', ');
}

interface GradientBubbleProps {
  seed: string;
  size?: number; // optional, in Tailwind "w-64 h-64" etc.
  layersCount?: number; // how many overlapping radial gradients
  className?: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

export const GradientBubble: FC<GradientBubbleProps> = ({
  seed,
  size = 64,
  layersCount = 3,
  className,
  asChild = false,
  children,
}) => {
  const Comp = asChild ? Slot : 'div';
  const gradient = useMemo(
    () => generateGradient(seed, layersCount),
    [seed, layersCount],
  );
  return (
    <Comp
      className={cn('rounded-full', className)}
      style={{
        background: gradient,
        width: size,
        height: size,
      }}
    >
      {children}
    </Comp>
  );
};

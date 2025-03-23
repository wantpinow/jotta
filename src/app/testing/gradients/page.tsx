import { GradientBubble } from '@/components/misc/gradient-bubble';

export default function TestingGradientsPage() {
  const seeds = Array.from({ length: 64 }, (_, i) => i);
  return (
    <div className="grid grid-cols-8 gap-4">
      {seeds.map((seed) => (
        <GradientBubble key={seed} seed={seed.toString()} className="mx-auto" />
      ))}
    </div>
  );
}

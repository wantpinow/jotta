import { LandingTopnav } from "~/components/layout/landing-topnav";

export default async function Home() {
  return (
    <>
      <LandingTopnav />
      <main className="container">
        <div className="mx-auto max-w-lg">
          <h1 className="mt-12 text-center text-4xl font-bold">
            Welcome to Jotta!
          </h1>
          <p className="mt-4 text-center">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus, id. Molestiae dolore accusamus commodi error odio.
            Similique ex fuga numquam enim quo illum, esse est quia natus
            nostrum, maxime dignissimos!
          </p>
        </div>
      </main>
    </>
  );
}

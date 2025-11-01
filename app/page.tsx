import CountdownTimer from "@/components/home/footer";
import HeroSection from "@/components/home/hero-section";
import { RegistrationForm } from "@/components/registration-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <section
        className=" py-20 sm:py-32 bg-gradient-to-tr from-secondary/10 via-background to-primary/10 px-5 relative overflow-hidden"
        id="register"
        // style={{
        //   background:
        //     "linear-gradient(135deg, #fef3c7 0%, #fce7f3 25%, #dbeafe 50%, #ffffff 75%, #fce7f3 100%)",
        // }}
      >
        <Image
          className="opacity-40 absolute -right-40 w-3xl -top-5 -z-10 rotate-180"
          src="/dotted-bg.png"
          alt="dotted background"
          width={1808}
          height={746}
        />
        <Image
          className="opacity-50 absolute -left-72 w-3xl bottom-20 -z-10 rotate-90"
          src="/dotted-bg.png"
          alt="dotted background"
          width={1808}
          height={746}
        />
        <Image
          className="opacity-50 absolute -left-24 blur-xs  -botttom-32 -z-10 w-96 rotate-45"
          src="/ticket-demo.jpg"
          alt="dotted background"
          width={1688}
          height={3000}
        />
        <Image
          className="opacity-50 absolute -right-24 blur-xs  -top-32 -z-10 w-96 -rotate-45"
          src="/ticket-demo.jpg"
          alt="dotted background"
          width={1688}
          height={3000}
        />
        <RegistrationForm />
      </section>
      <CountdownTimer />
    </main>
  );
}

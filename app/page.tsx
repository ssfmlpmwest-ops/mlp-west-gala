import CountdownTimer from "@/components/home/footer";
import HeroSection from "@/components/home/hero-section";
import { RegistrationForm } from "@/components/registration-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen ">
      <HeroSection />
      <section
        className=" py-20 sm:py-32 px-5 relative overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-secondary/30"
        id="register"
        // style={{
        //   background:
        //     "linear-gradient(135deg, #fef3c7 0%, #fce7f3 25%, #dbeafe 50%, #ffffff 75%, #fce7f3 100%)",
        // }}
      >
        {/* <Image
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
        /> */}
        {/* <Image
          className="opacity-50 absolute -left-10 top-1/2  -translate-y-1/2 blur-xs  -z-10 w-96 rotate-45"
          src="/ticket-demo.png"
          alt="dotted background"
          width={900}
          height={1600}
        />
        <Image
          className="opacity-50 absolute -right-24 blur-xs  -top-32 -z-10 w-96 -rotate-45"
          src="/ticket-demo.png"
          alt="dotted background"
          width={1688}
          height={1}
        /> */}
        <Image
          className="absolute -right-28 top-[-12rem] -z-10 drop-shadow-2xl drop-shadow-secondary/70 w-72 "
          src="/bluestarbigblur.png"
          alt="dotted background"
          width={208}
          height={219}
        />
        <RegistrationForm />
      </section>
      <CountdownTimer />
    </main>
  );
}

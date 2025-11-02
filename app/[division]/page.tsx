import { DIVISIONS } from "@/lib/conts";
import Registeration from "@/models/registeration";
import { notFound } from "next/navigation";
import DivisionDashboard from "@/components/division-dashboard";

async function DivisionPage({
  params,
}: {
  params: Promise<{ division: string }>;
}) {
  const { division } = await params;
  if (!DIVISIONS.includes(division)) {
    return notFound();
  }
  const registerations = await Registeration.getRegisterations({ division });
  return (
    <main className="min-h-screen bg-background">
      <DivisionDashboard attendees={registerations} />
    </main>
  );
}

export default DivisionPage;

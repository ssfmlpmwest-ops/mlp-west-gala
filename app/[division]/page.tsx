import { DIVISIONS } from "@/lib/conts";
import Registeration from "@/models/registeration";
import { notFound } from "next/navigation";
import DivisionDashboard from "@/components/division-dashboard";
const divisions = DIVISIONS.map((div) => {
  return {
    name: div,
    slug: div.toLowerCase().replace(/\s+/g, "_"),
  };
});

async function DivisionPage({
  params,
}: {
  params: Promise<{ division: string }>;
}) {
  const { division } = await params;
  if (!divisions.find((div) => div.slug === division)) {
    return notFound();
  }
  const name = divisions.find((div) => div.slug === division)?.name || "";
  const registerations = await Registeration.getRegisterations({ division:name });
  return (
    <main className="min-h-screen bg-background">
      
      <DivisionDashboard attendees={registerations} division={name}/>
    </main>
  );
}

export default DivisionPage;

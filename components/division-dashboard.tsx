"use client";
import { Checkin, Registration } from "@/lib/generated/prisma/client";
import { useParams } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  CheckCircle,
  Clock,
  Download,
  Search,
  Share2,
  Users,
} from "lucide-react";
import { Input } from "./ui/input";
import { createNPId } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SECTORS } from "@/lib/conts";

interface Attendee extends Registration {
  Checkin: Checkin | null;
}

function DivisionDashboard({
  attendees,
  division,
}: {
  attendees: Attendee[];
  division: string;
}) {
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sector, setSector] = useState("all");

  useEffect(() => {
    const filtered = attendees.filter(
      (attendee) =>
        (attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attendee.mobile.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (sector !== "all" ? attendee.sector === sector : true)
    );
    setFilteredAttendees(filtered);
  }, [searchTerm, attendees, sector]);
  const handleExportCSV = () => {
    const headers = [
      "Ticket ID",
      "Name",
      "Class",
      "School",
      "Division",
      "Sector",
      "Mobile",
      "DOB",
      "Registered At",
      "Checked In",
      "Checked In At",
    ];
    const rows = attendees.map((a) => [
      createNPId(a.id),
      a.name,
      a.class,
      a.school,
      a.division,
      a.sector || "-",
      a.mobile,
      a.dob,
      new Date(a.createdAt).toLocaleString(),
      a.Checkin ? "Yes" : "No",
      a.Checkin ? new Date(a.Checkin.createdAt).toLocaleString() : "-",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gala-attendees-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };
  const stats = useMemo(() => {
    const totalRegistrations = attendees.length;
    const checkedIn = attendees.filter((a) => a.Checkin).length;
    const pending = totalRegistrations - checkedIn;
    return { totalRegistrations, checkedIn, pending };
  }, []);
  const sectorBreakdown = useMemo(() => {
    const sectors = SECTORS[division as keyof typeof SECTORS] || [];
    const breakdown: {
      sector: string;
      registerations: number;
      checkins: number;
    }[] = sectors.map((sector) => {
      const sectorAttendees = attendees.filter((a) => a.sector === sector);
      const registerations = sectorAttendees.length;
      const checkins = sectorAttendees.filter((a) => a.Checkin).length;
      return { sector, registerations, checkins };
    });

    return breakdown;
  }, []);

  const shareSectorReport = () => {
    let message = sectorBreakdown
      .map((d, i) => `${i + 1}. ${d.sector} - ${d.registerations}`)
      .join("\n");
    message = `HSS Student's Gala\n${division} Division Report\n\nTotal Registrations: ${stats.totalRegistrations}\n\n${message}`;
    const time = new Date().toLocaleString();
    message += `\n\nGenerated at: ${time}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{division} Division</h1>
        <p className="text-foreground/70">
          Event analytics and attendee management
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60 mb-1">
                Total Registrations
              </p>
              <p className="text-4xl font-bold">{stats.totalRegistrations}</p>
            </div>
            <Users className="w-12 h-12 text-primary/20" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60 mb-1">Checked In</p>
              <p className="text-4xl font-bold text-green-600">
                {stats.checkedIn}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600/20" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-secondary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60 mb-1">
                Pending Check-in
              </p>
              <p className="text-4xl font-bold text-secondary">
                {stats.pending}
              </p>
            </div>
            <Clock className="w-12 h-12 text-secondary/20" />
          </div>
        </Card>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Division Breakdown */}
        {/* <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Registrations by Division</h3>
          <ResponsiveContainer width="100%" height={600}>
            <PieChart>
              <Pie
                data={stats.divisionBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ division, registerations }) => `${division}: ${registerations}`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="registerations"
              >
                {stats.divisionBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card> */}

        {/* School Breakdown */}

        <Card className="p-6 ">
          <div className="flex gap-2 flex-wrap justify-between">
            <h3 className="text-lg font-bold mb-4">Registrations by Sectors</h3>
            <Button
              onClick={shareSectorReport}
              className="bg-green-600 hover:bg-green-600/90"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share report
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Sector</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Regsiterations
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Checkins
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Pending</th>
                </tr>
              </thead>
              <tbody>
                {sectorBreakdown.map((div, index) => (
                  <tr
                    key={index}
                    className="border-b border-border hover:bg-muted/50 transition"
                  >
                    <td className="py-3 px-4">{div.sector}</td>
                    <td className="py-3 px-4 text-foreground/70">
                      {div.registerations}
                    </td>
                    <td className="py-3 px-4">{div.checkins}</td>
                    <td className="py-3 px-4">
                      {div.registerations - div.checkins}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap">
          <h3 className="text-lg font-bold w-max  flex-1">
            Attendee List ({filteredAttendees.length})
          </h3>
          <div className="flex gap-2 flex-wrap">
            <div className="max-w-60">
              <Select
                value={sector}
                onValueChange={(value) => setSector(value)}
                disabled={division === "all"}
              >
                <SelectTrigger id="sector">
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={"all"}>All Sectors</SelectItem>
                  {division !== "all" &&
                    SECTORS[division as keyof typeof SECTORS].map((div) => (
                      <SelectItem key={div} value={div}>
                        {div}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleExportCSV}
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
          <Input
            placeholder="Search by name or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Ticket ID</th>
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Class</th>
                <th className="text-left py-3 px-4 font-semibold">Division</th>
                <th className="text-left py-3 px-4 font-semibold">Sector</th>
                <th className="text-left py-3 px-4 font-semibold">School</th>
                <th className="text-left py-3 px-4 font-semibold">Mobile</th>
                <th className="text-left py-3 px-4 font-semibold">DOB</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee) => (
                <tr
                  key={attendee.id}
                  className="border-b border-border hover:bg-muted/50 transition"
                >
                  <td className="py-3 px-4">{createNPId(attendee.id)}</td>
                  <td className="py-3 px-4">{attendee.name}</td>
                  <td className="py-3 px-4 text-foreground/70">
                    {attendee.class}
                  </td>
                  <td className="py-3 px-4">{attendee.division}</td>
                  <td className="py-3 px-4">{attendee.sector || "-"}</td>
                  <td className="py-3 px-4">{attendee.school}</td>
                  <td className="py-3 px-4">{attendee.mobile}</td>
                  <td className="py-3 px-4">{attendee.dob}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        attendee.Checkin
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {attendee.Checkin ? "Checked In" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAttendees.length === 0 && (
          <div className="text-center py-8 text-foreground/60">
            <p>No attendees found matching your search.</p>
          </div>
        )}

        <div className="mt-4 text-sm text-foreground/60">
          Showing {filteredAttendees.length} of {attendees.length} attendees
        </div>
      </Card>
    </div>
  );
}

export default DivisionDashboard;

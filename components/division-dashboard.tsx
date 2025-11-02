"use client";
import { Checkin, Registration } from "@/lib/generated/prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Download, Search } from "lucide-react";
import { Input } from "./ui/input";

interface Attendee extends Registration {
  Checkin: Checkin | null;
}

function DivisionDashboard({ attendees }: { attendees: Attendee[] }) {
  const params = useParams();
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filtered = attendees.filter(
      (attendee) =>
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.mobile.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAttendees(filtered);
  }, [searchTerm, attendees]);
  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Place",
      "School",
      "Division",
      "Mobile",
      "DOB",
      "Registered At",
      "Checked In",
      "Checked In At",
    ];
    const rows = attendees.map((a) => [
      a.name,
      a.place,
      a.school,
      a.division,
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
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{params.division} Division</h1>
        <p className="text-foreground/70">
          Event analytics and attendee management
        </p>
      </div>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap">
          <h3 className="text-lg font-bold w-max  flex-1">Attendee List ({filteredAttendees.length})</h3>
          <div className="flex gap-2 flex-wrap">
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
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Place</th>
                <th className="text-left py-3 px-4 font-semibold">Division</th>
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
                  <td className="py-3 px-4">{attendee.name}</td>
                  <td className="py-3 px-4 text-foreground/70">
                    {attendee.place}
                  </td>
                  <td className="py-3 px-4">{attendee.division}</td>
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

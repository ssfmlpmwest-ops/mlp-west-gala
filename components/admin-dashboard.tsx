"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Search,
  Users,
  CheckCircle,
  Clock,
  Share2,
  Delete,
  Trash,
} from "lucide-react";
import { Checkin, Registration } from "@/lib/generated/prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DIVISIONS, SECTORS } from "@/lib/conts";
import { createNPId } from "@/lib/utils";

interface Attendee extends Registration {
  Checkin: Checkin | null;
}

interface Stats {
  totalRegistrations: number;
  checkedIn: number;
  pending: number;
  divisionBreakdown: Array<{
    division: string;
    registerations: number;
    checkins: number;
  }>;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalRegistrations: 0,
    checkedIn: 0,
    pending: 0,
    divisionBreakdown: [],
  });
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [division, setDivision] = useState("all");
  const [sector, setSector] = useState("all");
  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setAttendees(data.attendees);
        setFilteredAttendees(data.attendees);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Fetch dashboard data

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = attendees.filter(
      (attendee) =>
        (attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attendee.mobile.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (division !== "all" ? attendee.division === division : true) &&
        (sector !== "all" ? attendee.sector === sector : true)
    );
    setFilteredAttendees(filtered);
  }, [searchTerm, attendees, division, sector]);

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
  const shareDivisionReport = () => {
    let message = stats.divisionBreakdown
      .map((d, i) => `${i + 1}. ${d.division} - ${d.registerations}`)
      .join("\n");
    message = `HSS Student's Gala\nMalappuram West District Report\n\nTotal Registrations: ${stats.totalRegistrations}\n\n${message}`;
    const time = new Date().toLocaleString();
    message += `\n\nGenerated at: ${time}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };
  const handleDelete = async (attendee: Attendee) => {
    if (window.confirm("Are you sure you want to delete this attendee?")) {
      try {
        await fetch("/api/admin/stats", {
          method: "DELETE",
          body: JSON.stringify({ id: attendee.id }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        fetchData();
      } catch (error) {
        console.error("Error deleting attendee:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-foreground/70">
          Event analytics and attendee management
        </p>
      </div>

      {/* Stats Cards */}
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
            <h3 className="text-lg font-bold mb-4">
              Registrations by Divisons
            </h3>
            <Button
              onClick={shareDivisionReport}
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
                  <th className="text-left py-3 px-4 font-semibold">
                    Division
                  </th>
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
                {stats.divisionBreakdown.map((div, index) => (
                  <tr
                    key={index}
                    className="border-b border-border hover:bg-muted/50 transition"
                  >
                    <td className="py-3 px-4">{div.division}</td>
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

      {/* Attendee List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap">
          <h3 className="text-lg font-bold w-max  flex-1">Attendee List</h3>
          <div className="flex gap-2 flex-wrap">
            <div className="max-w-60">
              <Select
                value={division}
                onValueChange={(value) => {
                  setDivision(value);
                  setSector("all");
                }}
              >
                <SelectTrigger id="division">
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={"all"}>All Divisions</SelectItem>
                  {DIVISIONS.map((div) => (
                    <SelectItem key={div} value={div}>
                      {div}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
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
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(attendee)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
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

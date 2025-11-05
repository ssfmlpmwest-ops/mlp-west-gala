import Registeration from "@/models/registeration";
import { type NextRequest, NextResponse } from "next/server";

// Mock data - in production, fetch from database

export async function GET(request: NextRequest) {
  try {
    const counts = await Registeration.getCount();
    const totalRegistrations = counts?.registerations || 0;
    const checkedIn = counts?.checkins || 0;
    const pending = totalRegistrations - checkedIn;
    const divisionBreakdown = await Registeration.getCountByDivisions();
    const registerations = await Registeration.getRegisterations();

    return NextResponse.json({
      stats: {
        totalRegistrations,
        checkedIn,
        pending,
        divisionBreakdown,
      },
      attendees: registerations,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Param missing" },
        { status: 400 }
      );
    }
    if(isNaN(id)){
      return NextResponse.json(
        { error: "Invalid id" },
        { status: 400 }
      );
    }
    const res = await Registeration.delete(id);
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

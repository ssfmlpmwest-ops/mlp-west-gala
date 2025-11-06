import { extractNumberFromNPId } from "@/lib/utils";
import Registeration from "@/models/registeration";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId } = body;

    if (!ticketId) {
      return NextResponse.json(
        { success: false, message: "Ticket ID is required" },
        { status: 400 }
      );
    }
    if (!ticketId.startsWith("GALA")) {
      return NextResponse.json(
        { success: false, message: "Invalid ticket ID" },
        { status: 400 }
      );
    }
    const id = extractNumberFromNPId(ticketId);
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid ticket ID" },
        { status: 400 }
      );
    }

    const registration = await Registeration.getRegistration(id);
    if (!registration) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }
    if (registration.Checkin) {
      return NextResponse.json(
        {
          success: false,
          message: "Already checked in",
          attendee: {
            id: registration.id,
            name: registration.name,
            division: registration.division,
            school: registration.school,
            class: registration.class,
            mobile: registration.mobile,
            dob: registration.dob,
          },
        },
        { status: 409 }
      );
    }

    await Registeration.checkIn(id);
    const attendee = await Registeration.getRegistration(id);

    return NextResponse.json({
      success: true,
      message: "Check-in successful",
      attendee: {
        id: attendee?.id,
        name: attendee?.name,
        division: attendee?.division,
        school: attendee?.school,
        class: registration.class,
        mobile: attendee?.mobile,
        dob: attendee?.dob,
      },
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

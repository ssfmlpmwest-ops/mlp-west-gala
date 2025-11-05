import { DIVISIONS } from "@/lib/conts";
import { prisma } from "@/lib/prisma";
import { log } from "console";

export default class Registeration {
  static async getRegistration(
    id?: number,
    unique?: { mobile: string; dob: string }
  ) {
    const where = id
      ? { id }
      : unique
      ? {
          mobile_dob: {
            mobile: unique.mobile,
            dob: unique.dob,
          },
        }
      : undefined;

    if (!where) {
      return null;
    }

    try {
      const registration = await prisma.registration.findUnique({
        where,
        include: {
          Checkin: true,
        },
      });
      return registration;
    } catch (error) {
      return null;
    }
  }
  static async getRegisterations(filters?: {
    division?: string;
    school?: string;
    search?: string;
  }) {
    const where = filters
      ? {
          OR: [
            {
              division: filters.division,
            },
            {
              school: filters.school,
            },
          ],
          AND: filters.search
            ? {
                OR: [
                  {
                    name: {
                      contains: filters.search,
                    },
                  },
                  {
                    place: {
                      contains: filters.search,
                    },
                  },
                ],
              }
            : undefined,
        }
      : {};

    try {
      const registrations = await prisma.registration.findMany({
        where,
        include: {
          Checkin: true,
        },
      });
      return registrations;
    } catch (error) {
      return [];
    }
  }
  static async create(data: {
    name: string;
    mobile: string;
    dob: string;
    class: "PLUS_ONE" | "PLUS_TWO";
    course: "SCIENCE" | "COMMERCE" | "HUMANITIES" | "VHSE";
    division: string;
    school: string;
  }) {
    try {
      const registration = await prisma.registration.create({
        data,
      });
      return registration;
    } catch (error) {
      log(error);
      return false;
    }
  }
  static async delete(id: number) {
    try {
      const registration = await prisma.registration.delete({
        where: {
          id,
        },
      });
      return !!registration;
    } catch (error) {
      return false;
    }
  }
  static async getCount() {
    try {
      const regCount = await prisma.registration.count();
      const checkinCount = await prisma.checkin.count();
      return { registerations: regCount, checkins: checkinCount };
    } catch (error) {
      return null;
    }
  }
  static async getCountByDivisions() {
    try {
      const counts = await Promise.all(
        DIVISIONS.map(async (division) => {
          const regCount = await prisma.registration.count({
            where: {
              division,
            },
          });
          const checkinCount = await prisma.checkin.count({
            where: {
              registration: {
                division,
              },
            },
          });
          return {
            division,
            registerations: regCount,
            checkins: checkinCount,
          };
        })
      );
      return counts;
    } catch (error) {
      return [];
    }
  }
  static async getCountBySchools() {
    try {
      const schools = await prisma.registration.findMany({
        select: {
          school: true,
        },
        distinct: "school",
      });
      const schoolCounts = await Promise.all(
        schools.map(async ({ school }) => {
          const regCount = await prisma.registration.count({
            where: {
              school,
            },
          });
          const checkinCount = await prisma.checkin.count({
            where: {
              registration: {
                school,
              },
            },
          });
          return {
            school,
            registerations: regCount,
            checkins: checkinCount,
          };
        })
      );
      return schoolCounts;
    } catch (error) {
      return [];
    }
  }
  static async getCheckins() {
    try {
      const checkins = await prisma.checkin.findMany({
        include: {
          registration: true,
        },
      });
      return checkins;
    } catch (error) {
      return [];
    }
  }
  static async checkIn(id: number) {
    try {
      const checkin = await prisma.checkin.create({
        data: {
          checkedInAt: new Date(),
          registration: {
            connect: {
              id,
            },
          },
        },
      });
      return checkin;
    } catch (error) {
      return false;
    }
  }
}

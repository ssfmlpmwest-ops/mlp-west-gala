"use server";

import Registeration from "@/models/registeration";

export async function register(data: {
  name: string;
  mobile: string;
  dob: string;
  division: string;
  class: "PLUS_ONE" | "PLUS_TWO";
  course: "SCIENCE" | "COMMERCE" | "HUMANITIES" | "VHSE";
  school: string;
}) {
  // TODO: implement registration logic
  try {
    const res = await Registeration.create(data);
    return res;
  } catch (error) {
    return null;
  }
}
export async function getRegistration(
  id?: number,
  unique?: { mobile: string; dob: string }
) {
  try {
    const res = await Registeration.getRegistration(id, unique);
    return res;
  } catch (error) {
    return null;
  }
}
export async function getRegisterations(filters?: {
  division?: string;
  school?: string;
  search?: string;
}) {
  try {
    const res = await Registeration.getRegisterations(filters);
    return res;
  } catch (error) {
    return null;
  }
}
export async function deleteRegistration(id: number) {
  try {
    const res = await Registeration.delete(id);
    return res;
  } catch (error) {
    return [];
  }
}

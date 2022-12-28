import { SchoolUpdateRequest, SchoolUpdateResponse } from "@greenboard/shared";
import { callEndpoint } from "./callEndpoint";

export async function updateSchool(name: string, email: string, phone: string) {
  await callEndpoint<SchoolUpdateRequest, SchoolUpdateResponse>(
    `/school/update`,
    "PUT",
    false,
    {
      name,
      email,
      phone,
    }
  );
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export interface WaitlistEntry {
  email: string;
  device_info?: Record<string, string>;
}

export interface WaitlistResult {
  success: boolean;
  message: string;
}

async function resolveCountry(
  ip: string | null,
  vercelCountry: string | null,
): Promise<string | null> {
  if (vercelCountry) return vercelCountry;
  if (!ip) return null;

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.countryCode ?? null;
  } catch {
    return null;
  }
}

export async function joinWaitlist(data: WaitlistEntry): Promise<WaitlistResult> {
  const supabase = await createClient();
  const headersList = await headers();

  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const country = await resolveCountry(
    ip,
    headersList.get("x-vercel-ip-country"),
  );

  const { error } = await supabase.from("waitlist").insert({
    email: data.email.toLowerCase().trim(),
    user_agent: headersList.get("user-agent"),
    device_info: data.device_info ?? null,
    ip_address: ip,
    country,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: false, message: "This email is already on the waitlist." };
    }
    return { success: false, message: "Something went wrong. Please try again." };
  }

  return { success: true, message: "You're on the list!" };
}

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

function countryFromTimezone(tz: string | undefined): string | null {
  if (!tz) return null;
  const code = tz.split("/")[0];
  if (code === "Africa") {
    const mapping: Record<string, string> = {
      Casablanca: "MA", Cairo: "EG", Lagos: "NG", Nairobi: "KE",
      Johannesburg: "ZA", Algiers: "DZ", Tunis: "TN", Accra: "GH",
      Addis_Ababa: "ET", Dar_es_Salaam: "TZ", Kampala: "UG",
      Khartoum: "SD", Kigali: "RW", Dakar: "SN", Abidjan: "CI",
      Maputo: "MZ", Luanda: "AO", Lusaka: "ZM", Harare: "ZW",
      Bamako: "ML", Ouagadougou: "BF", Niamey: "NE", Nouakchott: "MR",
      Conakry: "GN", Freetown: "SL", Monrovia: "LR", Lome: "TG",
      Cotonou: "BJ", Libreville: "GA", Brazzaville: "CG",
      Kinshasa: "CD", Bujumbura: "BI", Djibouti: "DJ",
      Mogadishu: "SO", Tripoli: "LY", Ndjamena: "TD",
      Bangui: "CF", Malabo: "GQ", Sao_Tome: "ST",
      Gaborone: "BW", Mbabane: "SZ", Maseru: "LS",
      Antananarivo: "MG", Port_Louis: "MU", Victoria: "SC",
      Moroni: "KM", Lilongwe: "MW", Windhoek: "NA",
      Asmara: "ER", Juba: "SS", Bissau: "GW", Banjul: "GM",
      Praia: "CV",
    };
    return mapping[tz.split("/")[1]] ?? null;
  }
  if (code === "America") return "US";
  if (code === "Europe") {
    const mapping: Record<string, string> = {
      London: "GB", Paris: "FR", Berlin: "DE", Madrid: "ES",
      Rome: "IT", Amsterdam: "NL", Brussels: "BE", Vienna: "AT",
      Zurich: "CH", Stockholm: "SE", Oslo: "NO", Copenhagen: "DK",
      Helsinki: "FI", Dublin: "IE", Lisbon: "PT", Warsaw: "PL",
      Prague: "CZ", Budapest: "HU", Bucharest: "RO", Sofia: "BG",
      Athens: "GR", Moscow: "RU", Istanbul: "TR", Kyiv: "UA",
      Minsk: "BY", Belgrade: "RS", Zagreb: "HR", Ljubljana: "SI",
      Sarajevo: "BA", Skopje: "MK", Tirana: "AL",
      Bratislava: "SK", Vilnius: "LT", Riga: "LV", Tallinn: "EE",
      Chisinau: "MD", Luxembourg: "LU", Monte_Carlo: "MC",
      Andorra: "AD", Valletta: "MT", Reykjavik: "IS",
    };
    return mapping[tz.split("/")[1]] ?? null;
  }
  if (code === "Asia") {
    const mapping: Record<string, string> = {
      Tokyo: "JP", Shanghai: "CN", Seoul: "KR", Kolkata: "IN",
      Singapore: "SG", Hong_Kong: "HK", Bangkok: "TH", Dubai: "AE",
      Jakarta: "ID", Kuala_Lumpur: "MY", Manila: "PH", Taipei: "TW",
      Ho_Chi_Minh: "VN", Yangon: "MM", Dhaka: "BD", Karachi: "PK",
      Tehran: "IR", Baghdad: "IQ", Riyadh: "SA", Jerusalem: "IL",
      Amman: "JO", Beirut: "LB", Damascus: "SY", Kuwait: "KW",
      Doha: "QA", Muscat: "OM", Baku: "AZ", Tbilisi: "GE",
      Yerevan: "AM", Tashkent: "UZ", Almaty: "KZ", Bishkek: "KG",
      Ashgabat: "TM", Dushanbe: "TJ", Kathmandu: "NP",
      Colombo: "LK", Ulaanbaatar: "MN",
    };
    return mapping[tz.split("/")[1]] ?? null;
  }
  if (code === "Pacific") return "AU";
  return null;
}

export async function joinWaitlist(data: WaitlistEntry): Promise<WaitlistResult> {
  const headersList = await headers();

  try {
    const supabase = await createClient();

    const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const country =
      headersList.get("x-vercel-ip-country") ??
      countryFromTimezone(data.device_info?.timezone);

    const { error } = await supabase.from("waitlist").insert({
      email: data.email.toLowerCase().trim(),
      user_agent: headersList.get("user-agent"),
      device_info: data.device_info ?? null,
      ip_address: ip,
      country,
    });

    if (error) {
      console.error("Supabase insert error:", JSON.stringify(error));
      if (error.code === "23505") {
        return { success: false, message: "This email is already on the waitlist." };
      }
      return { success: false, message: "Something went wrong. Please try again." };
    }

    return { success: true, message: "You're on the list!" };
  } catch (err) {
    console.error("Waitlist action error:", err);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

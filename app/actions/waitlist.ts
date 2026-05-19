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

const TIMEZONE_COUNTRY: Record<string, string> = {
  "Africa/Abidjan": "CI", "Africa/Accra": "GH", "Africa/Addis_Ababa": "ET",
  "Africa/Algiers": "DZ", "Africa/Asmara": "ER", "Africa/Bamako": "ML",
  "Africa/Bangui": "CF", "Africa/Banjul": "GM", "Africa/Bissau": "GW",
  "Africa/Blantyre": "MW", "Africa/Brazzaville": "CG", "Africa/Bujumbura": "BI",
  "Africa/Cairo": "EG", "Africa/Casablanca": "MA", "Africa/Ceuta": "ES",
  "Africa/Conakry": "GN", "Africa/Dakar": "SN", "Africa/Dar_es_Salaam": "TZ",
  "Africa/Djibouti": "DJ", "Africa/Douala": "CM", "Africa/El_Aaiun": "EH",
  "Africa/Freetown": "SL", "Africa/Gaborone": "BW", "Africa/Harare": "ZW",
  "Africa/Johannesburg": "ZA", "Africa/Juba": "SS", "Africa/Kampala": "UG",
  "Africa/Khartoum": "SD", "Africa/Kigali": "RW", "Africa/Kinshasa": "CD",
  "Africa/Lagos": "NG", "Africa/Libreville": "GA", "Africa/Lome": "TG",
  "Africa/Luanda": "AO", "Africa/Lubumbashi": "CD", "Africa/Lusaka": "ZM",
  "Africa/Malabo": "GQ", "Africa/Maputo": "MZ", "Africa/Maseru": "LS",
  "Africa/Mbabane": "SZ", "Africa/Mogadishu": "SO", "Africa/Monrovia": "LR",
  "Africa/Nairobi": "KE", "Africa/Ndjamena": "TD", "Africa/Niamey": "NE",
  "Africa/Nouakchott": "MR", "Africa/Ouagadougou": "BF", "Africa/Porto-Novo": "BJ",
  "Africa/Sao_Tome": "ST", "Africa/Tripoli": "LY", "Africa/Tunis": "TN",
  "Africa/Windhoek": "NA",
  "America/Anchorage": "US", "America/Argentina/Buenos_Aires": "AR",
  "America/Argentina/Cordoba": "AR", "America/Asuncion": "PY",
  "America/Bahia": "BR", "America/Barbados": "BB", "America/Belem": "BR",
  "America/Belize": "BZ", "America/Bogota": "CO", "America/Boise": "US",
  "America/Campo_Grande": "BR", "America/Cancun": "MX", "America/Caracas": "VE",
  "America/Cayenne": "GF", "America/Chicago": "US", "America/Chihuahua": "MX",
  "America/Costa_Rica": "CR", "America/Cuiaba": "BR", "America/Dawson": "CA",
  "America/Denver": "US", "America/Detroit": "US", "America/Edmonton": "CA",
  "America/El_Salvador": "SV", "America/Fortaleza": "BR", "America/Godthab": "GL",
  "America/Guatemala": "GT", "America/Guayaquil": "EC", "America/Guyana": "GY",
  "America/Halifax": "CA", "America/Havana": "CU", "America/Hermosillo": "MX",
  "America/Indiana/Indianapolis": "US", "America/Indiana/Knox": "US",
  "America/Indiana/Marengo": "US", "America/Indiana/Vevay": "US",
  "America/Indiana/Vincennes": "US", "America/Jamaica": "JM", "America/Juneau": "US",
  "America/Kentucky/Louisville": "US", "America/Kentucky/Monticello": "US",
  "America/La_Paz": "BO", "America/Lima": "PE", "America/Los_Angeles": "US",
  "America/Managua": "NI", "America/Manaus": "BR", "America/Mazatlan": "MX",
  "America/Menominee": "US", "America/Merida": "MX", "America/Mexico_City": "MX",
  "America/Miquelon": "PM", "America/Moncton": "CA", "America/Monterrey": "MX",
  "America/Montevideo": "UY", "America/Montreal": "CA", "America/Nassau": "BS",
  "America/New_York": "US", "America/Nome": "US", "America/Noronha": "BR",
  "America/North_Dakota/Center": "US", "America/North_Dakota/New_Salem": "US",
  "America/Panama": "PA", "America/Paramaribo": "SR", "America/Phoenix": "US",
  "America/Port-au-Prince": "HT", "America/Port_of_Spain": "TT",
  "America/Recife": "BR", "America/Regina": "CA", "America/Rio_Branco": "BR",
  "America/Santiago": "CL", "America/Santo_Domingo": "DO",
  "America/Sao_Paulo": "BR", "America/Scoresbysund": "GL", "America/St_Johns": "CA",
  "America/Tegucigalpa": "HN", "America/Thule": "GL", "America/Tijuana": "MX",
  "America/Toronto": "CA", "America/Vancouver": "CA", "America/Winnipeg": "CA",
  "America/Yakutat": "US",
  "Asia/Almaty": "KZ", "Asia/Amman": "JO", "Asia/Anadyr": "RU",
  "Asia/Aqtau": "KZ", "Asia/Aqtobe": "KZ", "Asia/Ashgabat": "TM",
  "Asia/Baghdad": "IQ", "Asia/Bahrain": "BH", "Asia/Baku": "AZ",
  "Asia/Bangkok": "TH", "Asia/Beirut": "LB", "Asia/Bishkek": "KG",
  "Asia/Brunei": "BN", "Asia/Chita": "RU", "Asia/Choibalsan": "MN",
  "Asia/Colombo": "LK", "Asia/Damascus": "SY", "Asia/Dhaka": "BD",
  "Asia/Dili": "TL", "Asia/Dubai": "AE", "Asia/Dushanbe": "TJ",
  "Asia/Gaza": "PS", "Asia/Hebron": "PS", "Asia/Ho_Chi_Minh": "VN",
  "Asia/Hong_Kong": "HK", "Asia/Hovd": "MN", "Asia/Irkutsk": "RU",
  "Asia/Jakarta": "ID", "Asia/Jayapura": "ID", "Asia/Jerusalem": "IL",
  "Asia/Kabul": "AF", "Asia/Kamchatka": "RU", "Asia/Karachi": "PK",
  "Asia/Kathmandu": "NP", "Asia/Kolkata": "IN", "Asia/Krasnoyarsk": "RU",
  "Asia/Kuala_Lumpur": "MY", "Asia/Kuching": "MY", "Asia/Kuwait": "KW",
  "Asia/Macau": "MO", "Asia/Magadan": "RU", "Asia/Makassar": "ID",
  "Asia/Manila": "PH", "Asia/Muscat": "OM", "Asia/Nicosia": "CY",
  "Asia/Novokuznetsk": "RU", "Asia/Novosibirsk": "RU", "Asia/Omsk": "RU",
  "Asia/Oral": "KZ", "Asia/Phnom_Penh": "KH", "Asia/Pontianak": "ID",
  "Asia/Pyongyang": "KP", "Asia/Qatar": "QA", "Asia/Qyzylorda": "KZ",
  "Asia/Riyadh": "SA", "Asia/Sakhalin": "RU", "Asia/Samarkand": "UZ",
  "Asia/Seoul": "KR", "Asia/Shanghai": "CN", "Asia/Singapore": "SG",
  "Asia/Taipei": "TW", "Asia/Tashkent": "UZ", "Asia/Tbilisi": "GE",
  "Asia/Tehran": "IR", "Asia/Thimphu": "BT", "Asia/Tokyo": "JP",
  "Asia/Ulaanbaatar": "MN", "Asia/Urumqi": "CN", "Asia/Vientiane": "LA",
  "Asia/Vladivostok": "RU", "Asia/Yakutsk": "RU", "Asia/Yangon": "MM",
  "Asia/Yekaterinburg": "RU", "Asia/Yerevan": "AM",
  "Australia/Adelaide": "AU", "Australia/Brisbane": "AU", "Australia/Broken_Hill": "AU",
  "Australia/Darwin": "AU", "Australia/Eucla": "AU", "Australia/Hobart": "AU",
  "Australia/Lord_Howe": "AU", "Australia/Melbourne": "AU", "Australia/Perth": "AU",
  "Australia/Sydney": "AU",
  "Europe/Amsterdam": "NL", "Europe/Andorra": "AD", "Europe/Athens": "GR",
  "Europe/Belgrade": "RS", "Europe/Berlin": "DE", "Europe/Bratislava": "SK",
  "Europe/Brussels": "BE", "Europe/Bucharest": "RO", "Europe/Budapest": "HU",
  "Europe/Chisinau": "MD", "Europe/Copenhagen": "DK", "Europe/Dublin": "IE",
  "Europe/Gibraltar": "GI", "Europe/Helsinki": "FI", "Europe/Istanbul": "TR",
  "Europe/Kaliningrad": "RU", "Europe/Kyiv": "UA", "Europe/Lisbon": "PT",
  "Europe/Ljubljana": "SI", "Europe/London": "GB", "Europe/Luxembourg": "LU",
  "Europe/Madrid": "ES", "Europe/Malta": "MT", "Europe/Minsk": "BY",
  "Europe/Monaco": "MC", "Europe/Moscow": "RU", "Europe/Oslo": "NO",
  "Europe/Paris": "FR", "Europe/Prague": "CZ", "Europe/Riga": "LV",
  "Europe/Rome": "IT", "Europe/Samara": "RU", "Europe/Sarajevo": "BA",
  "Europe/Simferopol": "UA", "Europe/Skopje": "MK", "Europe/Sofia": "BG",
  "Europe/Stockholm": "SE", "Europe/Tallinn": "EE", "Europe/Tirane": "AL",
  "Europe/Vaduz": "LI", "Europe/Vienna": "AT", "Europe/Vilnius": "LT",
  "Europe/Volgograd": "RU", "Europe/Warsaw": "PL", "Europe/Zagreb": "HR",
  "Europe/Zurich": "CH",
  "Indian/Antananarivo": "MG", "Indian/Chagos": "IO", "Indian/Christmas": "CX",
  "Indian/Cocos": "CC", "Indian/Comoro": "KM", "Indian/Kerguelen": "TF",
  "Indian/Mahe": "SC", "Indian/Maldives": "MV", "Indian/Mauritius": "MU",
  "Indian/Mayotte": "YT", "Indian/Reunion": "RE",
  "Pacific/Apia": "WS", "Pacific/Auckland": "NZ", "Pacific/Chatham": "NZ",
  "Pacific/Easter": "CL", "Pacific/Efate": "VU", "Pacific/Fakaofo": "TK",
  "Pacific/Fiji": "FJ", "Pacific/Funafuti": "TV", "Pacific/Galapagos": "EC",
  "Pacific/Gambier": "PF", "Pacific/Guadalcanal": "SB", "Pacific/Guam": "GU",
  "Pacific/Honolulu": "US", "Pacific/Kiritimati": "KI", "Pacific/Kosrae": "FM",
  "Pacific/Kwajalein": "MH", "Pacific/Majuro": "MH", "Pacific/Marquesas": "PF",
  "Pacific/Nauru": "NR", "Pacific/Niue": "NU", "Pacific/Norfolk": "NF",
  "Pacific/Noumea": "NC", "Pacific/Pago_Pago": "AS", "Pacific/Palau": "PW",
  "Pacific/Pitcairn": "PN", "Pacific/Pohnpei": "FM", "Pacific/Port_Moresby": "PG",
  "Pacific/Rarotonga": "CK", "Pacific/Saipan": "MP", "Pacific/Tahiti": "PF",
  "Pacific/Tarawa": "KI", "Pacific/Tongatapu": "TO", "Pacific/Wake": "UM",
  "Pacific/Wallis": "WF",
  "Antarctica/Casey": "AQ", "Antarctica/Davis": "AQ",
  "Antarctica/McMurdo": "AQ", "Antarctica/Palmer": "AQ",
  "Antarctica/Rothera": "AQ", "Antarctica/Syowa": "AQ", "Antarctica/Troll": "AQ",
  "Antarctica/Vostok": "AQ",
  "Arctic/Longyearbyen": "SJ",
  "Atlantic/Azores": "PT", "Atlantic/Bermuda": "BM", "Atlantic/Canary": "ES",
  "Atlantic/Cape_Verde": "CV", "Atlantic/Faroe": "FO", "Atlantic/Madeira": "PT",
  "Atlantic/Reykjavik": "IS", "Atlantic/South_Georgia": "GS",
  "Atlantic/Stanley": "FK", "Atlantic/St_Helena": "SH",
};

function countryFromTimezone(tz: string | undefined): string | null {
  if (!tz) return null;
  return TIMEZONE_COUNTRY[tz] ?? null;
}

async function resolveCountry(
  ip: string | null,
  vercelCountry: string | null,
): Promise<string | null> {
  if (vercelCountry) return vercelCountry;
  if (!ip) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`https://ipapi.co/${ip}/country/`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const text = await res.text();
    return text.trim() || null;
  } catch {
    return null;
  }
}

export async function joinWaitlist(data: WaitlistEntry): Promise<WaitlistResult> {
  try {
    const supabase = await createClient();
    const headersList = await headers();

    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const country =
      (await resolveCountry(ip, headersList.get("x-vercel-ip-country"))) ??
      countryFromTimezone(data.device_info?.timezone);

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
  } catch {
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

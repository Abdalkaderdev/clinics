import { useQuery } from "@tanstack/react-query";

export type SupportedLang = "en" | "ar" | "ku";

async function fetchClinics(lang: SupportedLang, signal?: AbortSignal) {
  const allowed: SupportedLang[] = ["en", "ar", "ku"];
  const safe = allowed.includes(lang) ? lang : "en";
  const res = await fetch(`/clinics_${safe}.json`, { cache: "no-cache", signal });
  if (!res.ok) throw new Error(`Failed to load clinics: ${res.status}`);
  return res.json();
}

export function useClinics(lang: SupportedLang) {
  return useQuery({
    queryKey: ["clinics", lang],
    queryFn: ({ signal }) => fetchClinics(lang, signal),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}



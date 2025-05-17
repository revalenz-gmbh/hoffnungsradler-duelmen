export async function fetchUebergabeSummen(apiUrl?: string) {
  const url = apiUrl || import.meta.env.VITE_APPS_SCRIPT_SPENDEN_URL;
  if (!url) throw new Error("API-URL nicht definiert");
  const res = await fetch(`${url}?action=getUebergabeSummen`);
  if (!res.ok) throw new Error("Fehler beim Laden der Spendensummen");
  return await res.json();
} 
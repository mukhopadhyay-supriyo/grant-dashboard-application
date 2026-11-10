const BASE = import.meta.env.VITE_API_URL ?? "/api";
async function getJson(path) {
  const url = new URL(`${BASE}${path}`, window.location.origin);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`${path} returned ${res.status}`);

  // alert(res.json());
  return res.json();
}

export function fetchHealth() {
  return getJson("/health");
}

export function fetchHealthDB() {
  // alert("called");
  return getJson("/health/db");
}

export function fetchSeries(start, end, names) {
  return getJson("/series");
}
// getJson("/api/series", {
//   start: start.toISOString(),
//   end: end.toISOString(),
//   names,
// });

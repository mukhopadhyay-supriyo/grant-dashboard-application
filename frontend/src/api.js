const BASE = import.meta.env.VITE_API_URL || "/api";
async function getJson(path, params = {}) {
  const url = new URL(`${BASE}${path}`, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return;
    // FastAPI reads list params as repeated keys: ?names=a&names=b
    if (Array.isArray(value))
      value.forEach((v) => url.searchParams.append(key, v));
    else url.searchParams.set(key, value);
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${path} returned ${res.status}`);

  // alert(url);
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
  return getJson("/series", {
    start: start.toISOString(),
    end: end.toISOString(),
    names,
  });
}

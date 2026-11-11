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

// export function login({ email, password }) {
//   const reqBody = {
//     email: email,
//     password: password,
//   };
//   const res = fetch("/login", {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//     body: reqBody,
//   });
//   alert(reqBody);
//   if (res.status === 401) throw new Error("Invalid email or password");
//   if (!res.ok) throw new Error(`Login failed (${res.status})`);
//   return res.json();
// }

async function validate({ email, password }) {
  const path = "/login";
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (res.status === 401) throw new Error("Invalid email or password");
  if (!res.ok) throw new Error(`Login failed (${res.status})`);
  return res.json();
}

export function login(email, pass) {
  return validate(email, pass);
}

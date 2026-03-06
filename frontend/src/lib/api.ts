// src/lib/api.ts
const API_URL = "http://localhost:5000/api";

// ================= GENERIC FETCH =================
function getAdminToken() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("adminAuth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string };
    return parsed.token ?? null;
  } catch {
    return null;
  }
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const res = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur API: ${endpoint} — Status: ${res.status} — ${text}`);
  }

  return res.json();
}

// ================= SERVICES =================
export function getServices() {
  return fetchAPI<Array<{ id: number; title: string; description: string }>>("services");
}

export function createService(data: { title: string; description: string }) {
  return fetchAPI<{ id: number; title: string; description: string }>("services", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateService(
  id: number,
  data: { title: string; description: string }
) {
  return fetchAPI<{ id: number; title: string; description: string }>(`services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteService(id: number) {
  return fetchAPI<{ message: string }>(`services/${id}`, {
    method: "DELETE",
  });
}

// ================= ACTIVITIES =================
export function getActivitiesWithImages() {
  return fetchAPI<
    Array<{
      id: number;
      title: string;
      description: string;
      activity_date: string;
      images: string[];
    }>
  >("activities/with-images");
}

export function createActivity(data: {
  title: string;
  description: string;
  activity_date: string;
}) {
  return fetchAPI<{ id: number; title: string; description: string; activity_date: string }>("activities", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateActivity(
  id: number,
  data: { title: string; description: string; activity_date: string }
) {
  return fetchAPI<{ id: number; title: string; description: string; activity_date: string }>(`activities/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteActivity(id: number) {
  return fetchAPI<{ message: string }>(`activities/${id}`, {
    method: "DELETE",
  });
}

// ================= IMAGES =================
export function addActivityImage(data: { activity_id: number; image_url: string }) {
  return fetchAPI<{ id: number; activity_id: number; image_url: string }>("images", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ================= CONTACT =================
// Public : formulaire contact
export function createContact(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  return fetchAPI<{
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    created_at: string;
  }>("contacts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Admin : voir tous les messages (plus de token requis)
export function getContactsAdmin() {
  return fetchAPI<
    Array<{
      id: number;
      name: string;
      email: string;
      subject: string;
      message: string;
      created_at: string;
    }>
  >("contacts/all");
}

export function updateContact(
  id: number,
  data: { name: string; email: string; subject?: string; message: string }
) {
  return fetchAPI<{
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    created_at: string;
  }>(`contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteContact(id: number) {
  return fetchAPI<{ message: string }>(`contacts/${id}`, {
    method: "DELETE",
  });
}

// ================= ADMIN =================
// Login admin (retourne token + infos)
export function loginAdmin(data: { email: string; password: string }) {
  return fetchAPI<{ token: string; admin: { id: number; name: string; email: string } }>("admins/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Récupérer tous les admins
export function getAdmins() {
  return fetchAPI<Array<{ id: number; name: string; email: string }>>("admins");
}
// src/lib/api.ts
const API_URL = "http://localhost:5000/api";

// ================= GENERIC FETCH =================
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
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
  return fetchAPI("services", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteService(id: number) {
  return fetchAPI(`services/${id}`, {
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
  return fetchAPI("activities", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteActivity(id: number) {
  return fetchAPI(`activities/${id}`, {
    method: "DELETE",
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
  return fetchAPI("contacts", {
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

// ================= ADMIN =================
// Login admin sans token
export function loginAdmin(data: { email: string; password: string }) {
  return fetchAPI<{ id: number; name: string; email: string }>("admins/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Récupérer tous les admins
export function getAdmins() {
  return fetchAPI<Array<{ id: number; name: string; email: string }>>("admins");
}
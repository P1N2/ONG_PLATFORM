const API_URL = "http://localhost:5000/api";

// Typage pour fetch générique
type Endpoint = "services" | "activities" | "contacts" | "admins";

async function fetchAPI<T>(endpoint: Endpoint | string): Promise<T> {
  const res = await fetch(`${API_URL}/${endpoint}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Erreur récupération ${endpoint}`);
  }

  return res.json();
}

// Services
export function getServices() {
  return fetchAPI<Array<{ id: number; title: string; description: string }>>("services");
}

// Activités + images
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

// Contacts
export function getContacts() {
  return fetchAPI<Array<{ id: number; name: string; email: string; subject: string; message: string }>>("contacts");
}

// Admins
export function getAdmins() {
  return fetchAPI<Array<{ id: number; name: string; email: string }>>("admins");
}
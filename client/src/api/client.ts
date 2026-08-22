export type ApiEnvelope<T> = { success: boolean; data: T; message: string; errors?: unknown };
export class ApiClientError extends Error { constructor(message: string, public status: number, public details?: unknown) { super(message); } }

const API_BASE = import.meta.env.VITE_API_URL ?? "";
const tokenKey = "world-trotter-access-token";
export const getAccessToken = () => localStorage.getItem(tokenKey);
export const setAccessToken = (token: string) => localStorage.setItem(tokenKey, token);
export const clearAccessToken = () => localStorage.removeItem(tokenKey);

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type") && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!response.ok || !payload?.success) {
    if (response.status === 401) clearAccessToken();
    throw new ApiClientError(payload?.message ?? "The request could not be completed", response.status, payload?.errors);
  }
  return payload.data;
}

export const authApi = {
  login: (body: { email: string; password: string }) => api<{ token: string; user: ApiUser }>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body: { firstName: string; lastName: string; email: string; password: string }) => api<{ token: string; user: ApiUser }>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  demoLogin: () => api<{ token: string; user: ApiUser }>("/api/auth/demo-login", { method: "POST", body: "{}" }),
  me: () => api<ApiUser>("/api/auth/me"),
  logout: () => api<{ loggedOut: true }>("/api/auth/logout", { method: "POST" }),
};
export type ApiUser = { _id: string; id?: string; name?: string; firstName?: string; lastName?: string; email: string; role: "user" | "admin"; city?: string; country?: string; bio?: string; avatarUrl?: string; currencyPreference?: string; notificationPreferences?: { email?: boolean; product?: boolean } };
export type ApiTrip = { _id: string; id?: string; title: string; description?: string; destinations: { city: string; country?: string; image?: string }[]; startDate?: string; endDate?: string; status: string; coverImageUrl?: string; budget: number; currency: string };
export const tripApi = {
  list: () => api<{ items: ApiTrip[] }>("/api/trips?sortBy=startDate&sortOrder=asc"),
  get: (id: string) => api<{ trip: ApiTrip; sections: ApiSection[] }>(`/api/trips/${id}`),
  create: (body: Partial<ApiTrip>) => api<ApiTrip>("/api/trips", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: Partial<ApiTrip>) => api<ApiTrip>(`/api/trips/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id: string) => api<{ deleted: true }>(`/api/trips/${id}`, { method: "DELETE" }),
  budget: (id: string) => api<ApiBudget>(`/api/trips/${id}/budget`),
  calendar: (month: number, year: number) => api<ApiCalendarEvent[]>(`/api/calendar?month=${month}&year=${year}`),
  createSection: (tripId: string, body: Partial<ApiSection>) => api<ApiSection>(`/api/trips/${tripId}/sections`, { method: "POST", body: JSON.stringify(body) }),
  updateSection: (tripId: string, sectionId: string, body: Partial<ApiSection>) => api<ApiSection>(`/api/trips/${tripId}/sections/${sectionId}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteSection: (tripId: string, sectionId: string) => api<{ deleted: true }>(`/api/trips/${tripId}/sections/${sectionId}`, { method: "DELETE" }),
  reorderSections: (tripId: string, sectionIds: string[]) => api<{ sectionIds: string[] }>(`/api/trips/${tripId}/sections/reorder`, { method: "PUT", body: JSON.stringify({ sectionIds }) }),
  uploadCover: (tripId: string, file: File) => { const fd = new FormData(); fd.append("image", file); return api<ApiTrip>(`/api/trips/${tripId}/cover`, { method: "POST", body: fd }); },
};
export type ApiSection = { _id: string; id?: string; city: string; title?: string; startDate?: string; endDate?: string; budget?: number; orderIndex: number; type?: string; latitude?: number; longitude?: number; activities?: ApiItineraryActivity[] };
export type ApiItineraryActivity = { _id: string; title: string; category?: string; cost: number; time?: string; duration?: string; orderIndex: number };
export type ApiBudget = { totalBudget: number; estimatedSpend: number; remaining: number; categoryBreakdown: Record<string, number>; status: "under_budget" | "near_limit" | "over_budget" };
export type ApiCalendarEvent = { id: string; title: string; startDate?: string; endDate?: string; status: string; type: string; coverImageUrl?: string };
export const discoveryApi = { cities: () => api<{ items: ApiCity[] }>("/api/cities?limit=30&sortBy=popularityScore"), activities: () => api<{ items: ApiActivity[] }>("/api/activities?limit=30&sortBy=popularityScore") };
export type ApiCity = { _id: string; name: string; country: string; region?: string; tag?: string; imageUrl?: string; costIndex: number };
export type ApiActivity = { _id: string; name: string; category?: string; cost: number; duration?: string; description?: string; images?: string[]; city: ApiCity };
export const communityApi = { list: () => api<{ items: ApiPost[] }>("/api/community?limit=20&sortBy=createdAt"), get: (id: string) => api<ApiPost>(`/api/community/${id}`), like: (id: string) => api<{ liked: boolean; likesCount: number }>(`/api/community/${id}/like`, { method: "POST" }) };
export const publicApi = { getTrip: (shareToken: string) => api<{ trip: ApiTrip; sections: ApiSection[]; viewCount: number }>(`/api/public/${shareToken}`), copyTrip: (shareToken: string) => api<ApiTrip>(`/api/public/${shareToken}/copy`, { method: "POST" }) };
export type ApiPost = { _id: string; title: string; content: string; destination?: string; country?: string; images?: string[]; tags?: string[]; likesCount: number; commentsCount: number; author?: { firstName?: string; lastName?: string; avatarUrl?: string } };
export const adminApi = { analytics: () => api<{ totalUsers: number; activeUsers: number; totalTrips: number; averageBudget: number; popularDestinations: { _id: string; count: number }[] }>("/api/admin/analytics") };
export type ApiImage = { _id: string; filename: string; originalName: string; mimeType: string; sizeBytes: number; category: string; entityId?: string; url: string; createdAt: string };
export const imageApi = {
  upload: (file: File, category: string, entityId?: string) => { const fd = new FormData(); fd.append("file", file); fd.append("category", category); if (entityId) fd.append("entityId", entityId); return api<ApiImage>("/api/images/upload", { method: "POST", body: fd }); },
  list: (category?: string, entityId?: string) => { const params = new URLSearchParams(); if (category) params.set("category", category); if (entityId) params.set("entityId", entityId); return api<{ items: ApiImage[] }>(`/api/images?${params}`); },
  remove: (id: string) => api<{ deleted: true }>(`/api/images/${id}`, { method: "DELETE" }),
  setCoverImage: (entityType: string, entityId: string, imageId: string) => api<any>(`/api/${entityType}/${entityId}/cover-image`, { method: "PATCH", body: JSON.stringify({ imageId }) }),
};


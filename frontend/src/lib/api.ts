const API_BASE =  "http://localhost:3001";

async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  incidents: {
    list: (type?: string) =>
      fetchApi<IncidentApi[]>(type ? `/incidents?type=${type}` : "/incidents"),
    create: (data: CreateIncidentApi) =>
      fetchApi<IncidentApi>("/incidents", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    vouch: (id: string) =>
      fetchApi<IncidentApi>(`/incidents/${id}/vouch`, { method: "POST" }),
  },
  buddyGroups: {
    list: () => fetchApi<BuddyGroupApi[]>("/buddy-groups"),
    create: (data: CreateBuddyGroupApi) =>
      fetchApi<BuddyGroupApi>("/buddy-groups", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    join: (id: string, data?: { memberName?: string; sessionId?: string }) =>
      fetchApi<BuddyGroupApi>(`/buddy-groups/${id}/join`, {
        method: "POST",
        body: JSON.stringify(data || {}),
      }),
  },
};

export interface IncidentApi {
  id: string;
  type: string;
  map_type: "safe" | "warning" | "danger";
  location: string;
  description: string | null;
  lat: number | null;
  lng: number | null;
  title: string;
  vouches_count: number;
  created_at: string;
}

export interface CreateIncidentApi {
  type: "theft" | "suspicious" | "road" | "safe";
  location: string;
  description?: string;
  lat?: number;
  lng?: number;
}

export interface BuddyGroupApi {
  id: string;
  route: string;
  time: string;
  max_members: number;
  start_point: string;
  end_point: string;
  verified: boolean;
  created_at: string;
  members?: { id: string }[];
}

export interface CreateBuddyGroupApi {
  route: string;
  time: string;
  maxMembers: number;
  startPoint: string;
  endPoint: string;
}

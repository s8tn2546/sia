import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const getAuthHeaders = async () => {
  const user = auth.currentUser;

  if (!user) {
    return {};
  }

  const token = await user.getIdToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (path, options = {}) => {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...authHeaders
    },
    ...options
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Request failed with ${response.status}`);
  }

  return response.json();
};

export const api = {
  getInventory: () => request("/inventory"),
  createInventory: (payload) =>
    request("/inventory", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  createSupply: (payload) =>
    request("/supply", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getTracking: (trackingId) => request(`/track/${encodeURIComponent(trackingId)}`),
  getDemand: () => request("/demand"),
  getInsights: (payload) =>
    request("/insights", {
      method: "POST",
      body: JSON.stringify(payload || {})
    }),
  getChat: (payload) =>
    request("/chat", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getRoutes: (payload) =>
    request("/routes", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getNotifications: () => request("/notifications"),
  markNotificationRead: (id) =>
    request(`/notifications/${encodeURIComponent(id)}/read`, {
      method: "PATCH"
    }),
  markAllNotificationsRead: () =>
    request("/notifications/read-all", {
      method: "PATCH"
    })
};

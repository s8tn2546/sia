import { auth } from '../config/firebase';

const API_BASE_URL = (process.env.BACKEND_URL || '').replace(/\/$/, '');

// Validate BACKEND_URL at runtime
if (!API_BASE_URL) {
  console.warn('[API] BACKEND_URL not configured. API calls will fail. Check .env file.');
}

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
  const fullUrl = buildUrl(path);

  if (!API_BASE_URL) {
    throw new Error('BACKEND_URL not configured. Cannot make API calls.');
  }

  try {
    console.debug(`[API] ${options.method || 'GET'} ${fullUrl}`);
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...authHeaders
      },
      ...options,
      signal: options.signal || AbortSignal.timeout(30000) // 30s timeout
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMsg = errorBody || `Request failed with ${response.status}`;
      console.error(`[API] Error: ${response.status} ${response.statusText}`);
      throw new Error(errorMsg);
    }

    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`[API] Request timeout: ${fullUrl}`);
      throw new Error('Request timeout. Server may be unavailable.');
    }
    console.error(`[API] Request failed: ${error.message}`);
    throw error;
  }
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

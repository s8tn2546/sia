const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
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
  createSupply: (payload) =>
    request("/supply", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getTracking: (trackingId) => request(`/track/${encodeURIComponent(trackingId)}`),
  getDemand: () => request("/demand"),
  getInsights: () => request("/insights"),
  getChat: (payload) =>
    request("/chat", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getRoutes: (payload) =>
    request("/routes", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};

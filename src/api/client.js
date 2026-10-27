import { getApiPrefix } from "../config/api";

/**
 * A wrapper around fetch that automatically applies the API prefix,
 * JSON headers, and authorization tokens.
 */
export async function apiClient(endpoint, options = {}) {
  // 1. Get the current prefix (e.g., "/api/qalm")
  const prefix = getApiPrefix();

  // 2. Format the endpoint so we don't get double slashes (e.g., "/api/qalm//users")
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${prefix}${cleanEndpoint}`;

  // 3. Setup default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // 4. Attach Auth Token if it exists
  const token = localStorage.getItem("auth_token"); // Change this to wherever you store your token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 5. Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 6. Handle errors (optional, but highly recommended)
  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Response wasn't JSON
    }
    throw new Error(errorMessage);
  }

  // 7. Return the JSON response (or null if 204 No Content)
  if (response.status === 204) return null;
  return response.json();
}
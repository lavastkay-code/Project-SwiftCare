// Shared authenticated-fetch helper for every dashboard.
// Depends on SWIFTCARE_API_BASE_URL from config.js being loaded first.

const SWIFTCARE_AUTH_TOKEN_KEY = "authToken";

function swiftcareGetToken() {
  return localStorage.getItem(SWIFTCARE_AUTH_TOKEN_KEY);
}

function swiftcareLogout(loginPage) {
  localStorage.removeItem(SWIFTCARE_AUTH_TOKEN_KEY);
  window.location.href = loginPage || "login.html";
}

function swiftcareErrorMessage(data, fallback) {
  if (data && data.error && typeof data.error.message === "string") {
    return data.error.message;
  }
  return fallback;
}

// path: e.g. "/patients". options: { method, body, loginPage }
// Resolves to response.data on success; throws Error (with .status/.code/.payload) otherwise.
// On 401 it clears the token and redirects to loginPage ("login.html" by default,
// which resolves relative to the calling page).
async function swiftcareApiRequest(path, { method = "GET", body, loginPage = "login.html" } = {}) {
  const token = swiftcareGetToken();

  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${SWIFTCARE_API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    throw new Error("Unable to reach the server. Please check your connection and try again.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401) {
    swiftcareLogout(loginPage);
    const err = new Error("Your session has expired. Please log in again.");
    err.status = 401;
    throw err;
  }

  if (!response.ok || !data || data.success === false) {
    const err = new Error(swiftcareErrorMessage(data, "Something went wrong. Please try again."));
    err.status = response.status;
    err.code = data?.error?.code;
    err.payload = data;
    throw err;
  }

  return data.data;
}

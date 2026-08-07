const API_BASE_URL = "https://swiftcare-backend-production-2ea4.up.railway.app/api";

const loginForm = document.getElementById("loginForm");
const continueBtn = loginForm.querySelector(".continue-btn");

function getErrorMessage(data, fallback) {
  if (!data) return fallback;

  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors
      .map((item) => (typeof item === "string" ? item : item.message || JSON.stringify(item)))
      .join("\n");
  }

  return fallback;
}

function setLoading(isLoading) {
  continueBtn.disabled = isLoading;
  continueBtn.textContent = isLoading ? "Signing in..." : "Continue";
}

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email and Password are required.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      alert(getErrorMessage(data, "Incorrect email or password."));
      return;
    }

    const result = data?.data || data;

    if (result?.token) {
      localStorage.setItem("authToken", result.token);
    }

    if (result?.clinic?.id) {
      localStorage.setItem("clinicId", result.clinic.id);
    } else if (result?.user?.clinicId) {
      localStorage.setItem("clinicId", result.user.clinicId);
    }

    if (result?.user?.email || email) {
      localStorage.setItem("signupEmail", result?.user?.email || email);
    }

    if (result?.clinic?.name) {
      localStorage.setItem("clinicName", result.clinic.name);
    }

    window.location.href = "ADMIN-dashboard.html";
  } catch (error) {
    console.error("Login error:", error);
    alert("Unable to reach the server. Please check your connection and try again.");
  } finally {
    setLoading(false);
  }
});

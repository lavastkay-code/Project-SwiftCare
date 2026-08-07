const API_BASE_URL = "https://swiftcare-backend-production-2ea4.up.railway.app/api";

const inviteForm = document.getElementById("inviteForm");
const sendInviteBtn = document.getElementById("sendInviteBtn");
const cancelInviteBtn = document.getElementById("cancelInviteBtn");
const inviteStatus = document.getElementById("inviteStatus");

function showStatus(message, type) {
  inviteStatus.hidden = false;
  inviteStatus.className = `form-status ${type}`;
  inviteStatus.textContent = message;
}

function clearStatus() {
  inviteStatus.hidden = true;
  inviteStatus.className = "form-status";
  inviteStatus.textContent = "";
}

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
  sendInviteBtn.disabled = isLoading;
  sendInviteBtn.textContent = isLoading ? "Sending..." : "Send Invitation";
}

cancelInviteBtn.addEventListener("click", () => {
  window.location.href = "ADMIN-dashboard.html";
});

inviteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearStatus();

  const token = localStorage.getItem("authToken");

  if (!token) {
    showStatus("Please log in again to send invitations.", "error");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
    return;
  }

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const role = document.getElementById("role").value.trim();

  if (!firstName || !lastName || !email || !role) {
    showStatus("Please fill in first name, last name, email, and role.", "error");
    return;
  }

  const payload = {
    name: `${firstName} ${lastName}`.trim(),
    email,
    role,
  };

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (response.status === 401) {
      showStatus("Your session has expired. Please log in again.", "error");
      setLoading(false);
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
      return;
    }

    if (!response.ok) {
      showStatus(getErrorMessage(data, "Failed to send invitation. Please try again."), "error");
      setLoading(false);
      return;
    }

    showStatus("Invitation sent successfully! Redirecting...", "success");
    sendInviteBtn.disabled = true;
    sendInviteBtn.textContent = "Sent";

    setTimeout(() => {
      window.location.href = "Access-granted.html";
    }, 2000);
  } catch (error) {
    console.error("Invite error:", error);
    showStatus("Unable to reach the server. Please check your connection and try again.", "error");
    setLoading(false);
  }
});

const loginForm = document.getElementById("loginForm");
const continueBtn = loginForm.querySelector(".continue-btn");

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
    const result = await swiftcareApiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    if (result?.token) {
      localStorage.setItem("authToken", result.token);
    }
    if (result?.user) {
      localStorage.setItem("swiftcareUser", JSON.stringify(result.user));
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
    alert(error.message || "Incorrect email or password.");
  } finally {
    setLoading(false);
  }
});

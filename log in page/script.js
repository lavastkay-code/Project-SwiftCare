// SwiftCare — Log in page behaviour

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("authForm");
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("emailError");
  const passwordInput = document.getElementById("password");
  const passwordError = document.getElementById("passwordError");
  const continueBtn = document.getElementById("continueBtn");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ---------- Show / hide password ----------
  document.querySelectorAll(".toggle-pw").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "👁" : "🙈";
    });
  });

  function validateEmail() {
    const value = emailInput.value.trim();
    if (value === "") {
      showError(emailInput, emailError, "Enter your email to continue.");
      return false;
    }
    if (!emailPattern.test(value)) {
      showError(emailInput, emailError, "That email doesn't look right.");
      return false;
    }
    clearError(emailInput, emailError);
    return true;
  }

  function validatePassword() {
    if (passwordInput.value === "") {
      showError(passwordInput, passwordError, "Enter your password.");
      return false;
    }
    clearError(passwordInput, passwordError);
    return true;
  }

  function showError(input, errorEl, message) {
    input.classList.add("invalid");
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    input.classList.remove("invalid");
    errorEl.textContent = "";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailOk = validateEmail();
    const passwordOk = validatePassword();
    if (!emailOk || !passwordOk) return;

    // Placeholder for the real request. Swap this for a call to your
    // backend's login endpoint, e.g.:
    // fetch("/api/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     countryCode: document.getElementById("countryCode").value,
    //     phone: document.getElementById("phone").value,
    //     email: emailInput.value.trim(),
    //     password: passwordInput.value,
    //   }),
    // });

    continueBtn.disabled = true;
    continueBtn.textContent = "Please wait…";

    setTimeout(() => {
      continueBtn.disabled = false;
      continueBtn.textContent = "Continue";
      console.log("Log in submitted for:", emailInput.value.trim());
      // e.g. window.location.href = "/dashboard";
    }, 800);
  });
});